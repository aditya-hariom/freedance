# Feedants Classical Dance — Full-Stack Competition Module

> Production-grade full-stack module for a mobile technical assignment.  
> Architecture: **React Native (Expo + JavaScript / JSX)** | **Node.js + Express** | **MongoDB (Mongoose)**.

---

## 📸 Overview & Architecture

This repository delivers an end-to-end full-stack solution implementing the **Feedants Classical Dance Competition Details Screen** with atomic concurrency control, real-time live countdown timer, and dynamic state transitions ("Register Now" $\rightarrow$ "Upload Submission").

```
full/
├── backend/                  # Node.js + Express + Mongoose (Pure JavaScript)
│   ├── src/
│   │   ├── config/db.js      # Resilient DB connection (External Mongo or Zero-Config In-Memory)
│   │   ├── models/
│   │   │   ├── Competition.js # Full schema: slots, judge, dates, rewards, tabs
│   │   │   └── Registration.js# Unique compound index { competitionId: 1, userId: 1 }
│   │   ├── controllers/
│   │   │   └── competitionController.js # Atomic $inc query, spots calculation, rollback
│   │   ├── routes/
│   │   │   └── competitionRoutes.js # REST endpoints
│   │   ├── seed.js           # Wipe & seed script with exact Feedants dance details
│   │   └── server.js         # Express app entrypoint with CORS, JSON body, logging
│   ├── tests/
│   │   └── concurrency.test.js # Parallel load stress test (50 concurrent requests for 3 slots)
│   ├── .env.example
│   └── package.json
│
├── mobile/                   # React Native Expo (Pure JavaScript / JSX)
│   ├── src/
│   │   ├── api/competitionApi.js # API client with dynamic host resolution
│   │   ├── components/           # Modular JSX components:
│   │   │   ├── Header.jsx            # Back, language toggle (EN/HI), "Registered" pill
│   │   │   ├── TitleAndBadges.jsx    # Title + tags ("Dance", "Multi-Win", etc.)
│   │   │   ├── PricingGrid.jsx       # Prize Pool (₹1,500) and Entry Fee (₹99)
│   │   │   ├── SlotsRemainingCard.jsx # "Only 19 spots left / 1/20 Booked" + progress bar
│   │   │   ├── JudgeCard.jsx         # Manju Dubey, title, exp, video play trigger
│   │   │   ├── CountdownTimer.jsx    # Live countdown: 01d : 06h : 28m : 32s + "Hurry up!"
│   │   │   ├── ImportantDatesGrid.jsx # 4-card date grid with custom glyphs
│   │   │   ├── PreviousWinners.jsx   # Horizontal scroll carousel with rank medals
│   │   │   ├── TabbedContent.jsx     # [About | Judging Parameters | Rules & Eligibility]
│   │   │   ├── RewardsBreakdown.jsx  # 1st (₹500) down to 6th (₹80) itemized list
│   │   │   ├── FloatingBottomCTA.jsx # Dynamic CTA: "Register Now" vs "Upload Submission"
│   │   │   ├── SubmissionModal.jsx   # Video performance upload modal
│   │   │   └── UserSwitcher.jsx      # Interactive persona switcher for testing multi-user flows
│   │   ├── hooks/
│   │   │   └── useCountdown.js       # Second-by-second live countdown hook
│   │   └── constants/
│   │       └── theme.js              # Vibrant midnight palette, typography & shadows
│   ├── App.jsx                       # Main screen container with pull-to-refresh
│   ├── index.js                      # Root Expo registration entry point
│   ├── app.json                      # Expo config
│   └── package.json
└── README.md
```

---

## 🚀 Quickstart Guide

### Prerequisites

- **Node.js**: v18.0.0 or later (v24 recommended)
- **npm** or **yarn**

> **Zero Friction Note**: The backend includes an automated embedded MongoDB fallback via `mongodb-memory-server`. If you do not have a local MongoDB daemon running, the backend seamlessly launches an in-memory instance automatically. If you have MongoDB installed, simply supply your connection string in `backend/.env`.

---

### Step 1: Start the Backend

1. Navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Copy the environment configuration:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database with the reference Feedants Classical Dance data:
   ```bash
   npm run seed
   ```
5. Run the automated Concurrency & Overbooking Stress Test:
   ```bash
   npm test
   ```
6. Start the API server:
   ```bash
   npm start
   # Server will start on http://localhost:5000
   ```

#### Backend REST API Endpoints:

| Method | Endpoint                         | Description                                                     |
| ------ | -------------------------------- | --------------------------------------------------------------- |
| `GET`  | `/health`                        | Service health status                                           |
| `GET`  | `/api/competitions`              | List competitions (supports `?userId=...` for registered state) |
| `GET`  | `/api/competitions/:id`          | Get details with computed `spotsLeft` & `isRegistrationOpen`    |
| `POST` | `/api/competitions/:id/register` | Atomic slot registration (`{ userId }`)                         |
| `POST` | `/api/competitions/:id/submit`   | Upload video performance link (`{ userId, submissionUrl }`)     |

---

### Step 2: Start the Mobile App (React Native Expo)

1. Navigate to `/mobile`:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:

   ```bash
   # Run in Web browser (instant preview)
   npm run web

   # Or run via Expo Go on physical device / emulator
   npm start
   ```

---

## ⚡ Concurrency Control & Race Condition Prevention

### The Problem: The Overbooking Race Condition

In high-demand competition drops or flash registration events, multiple users simultaneously click "Register Now" when only 1 spot remains.

A naive implementation typically performs two separate operations:

```javascript
// ❌ NAIVE IMPLEMENTATION (VULNERABLE TO RACE CONDITIONS)
const comp = await Competition.findById(id);
if (comp.bookedSlots < comp.totalSlots) {
  // Concurrency window: Another request can increment bookedSlots between read and write!
  await Competition.updateOne({ _id: id }, { $inc: { bookedSlots: 1 } });
  await Registration.create({ competitionId: id, userId });
}
```

If 100 requests arrive concurrently when `bookedSlots === 19` and `totalSlots === 20`, all 100 requests read `19 < 20`, and all 100 write `$inc: { bookedSlots: 1 }`, resulting in `bookedSlots: 119`—a catastrophic **99-slot overbooking**.

---

### The Solution: Atomic Conditional Compare-and-Swap in MongoDB

MongoDB executes single-document operations atomically at the storage engine layer (WiredTiger) with document-level locking.

Our controller executes registration in an atomic `findOneAndUpdate` pipeline:

```javascript
// ✅ ATOMIC RACE-CONDITION SAFE IMPLEMENTATION
const competition = await Competition.findOneAndUpdate(
  {
    _id: competitionId,
    bookedSlots: { $lt: totalSlots },
    $expr: { $lt: ["$bookedSlots", "$totalSlots"] },
    "dates.registrationEnd": { $gt: new Date() },
  },
  { $inc: { bookedSlots: 1 } },
  { new: true },
);

if (!competition) {
  // Either all slots were occupied or registration deadline expired
  return res.status(409).json({
    success: false,
    message: "Registration closed or slots full.",
  });
}
```

#### How it works:

1. **Atomic Predicate Evaluation**: The criteria `{ bookedSlots: { $lt: totalSlots }, 'dates.registrationEnd': { $gt: new Date() } }` is evaluated inside the atomic write lock.
2. **Deterministic Rejection**: If `bookedSlots` has reached `totalSlots`, the query matches **zero** documents and returns `null`. The operation fails without mutating state.
3. **Idempotency via Unique Compound Index**: In `Registration.js`, the compound index `{ competitionId: 1, userId: 1 }` with `unique: true` prevents a user from double-registering.
4. **Compensating Rollback**: If inserting the `Registration` record throws an exception (such as duplicate key race), a compensating decrement `{ $inc: { bookedSlots: -1 } }` immediately returns the slot to the pool.

---

### Concurrency Stress Test Validation

The test suite in [`backend/tests/concurrency.test.js`](backend/tests/concurrency.test.js) verifies this behavior under simulated real-world parallel conditions:

- **Setup**: Competition initialized with `totalSlots: 5` and `bookedSlots: 2` (exactly **3 spots available**).
- **Execution**: 50 concurrent requests fired via `Promise.all`.
- **Result**:
  - Exactly **3** requests succeed (`HTTP 201 Created`).
  - Exactly **47** requests are rejected (`HTTP 409 Conflict`).
  - Final database `bookedSlots` is strictly **5** (zero overbooking).

---

## 🏗️ Production Scalability Recommendations

For scaling this service to hundreds of thousands of simultaneous registrants:

### 1. Distributed Locking with Redis (Redlock)

At extreme scales across multi-region server clusters:

- Use Redis-based distributed mutex locks (e.g., Redlock or `ioredis` with Lua scripts) keyed by `lock:competition:<competition_id>`.
- Or maintain slot counters in Redis with `DECR` / `DECRBY`:
  ```lua
  -- Atomic Lua script in Redis
  local remaining = redis.call('DECR', KEYS[1])
  if remaining < 0 then
    redis.call('INCR', KEYS[1])
    return 0 -- Rejected
  end
  return 1 -- Accepted
  ```

### 2. Asynchronous Queue Processing (BullMQ + Redis)

For viral flash drops:

1. The user's registration request is pushed into a BullMQ priority queue.
2. The user receives an instant `202 Accepted` response with a tracking job ID.
3. Background workers consume the queue sequentially or in worker pools, preventing database thread exhaustion.
4. The client polls or listens via WebSockets/SSE for the confirmation event.

### 3. Read-Through Caching & CDN Layer

- Competition details (judge info, rules, prizes) are largely static. Cache `GET /api/competitions/:id` responses in Redis or Cloudflare CDN with a short TTL (e.g., 5 seconds) and tag-based cache invalidation when slots change.
- Dynamic fields (`spotsLeft`, `isRegistrationOpen`) can be fetched via a lightweight heartbeat or computed client-side.

### 4. Database Optimization & Connection Pooling

- Maintain MongoDB connection pool sizes (`maxPoolSize: 50`) aligned with container memory.
- Index keys: `{ competitionId: 1, userId: 1 }` (unique) and `{ 'dates.registrationEnd': 1 }`.

---

## 🎨 UI/UX Features & Match to Design Reference

1. **Top Header**: Back button, interactive EN/HI language switcher, and real-time `"✓ Registered"` green pill indicator.
2. **Dev Persona Switcher**: In-app dropdown allowing evaluators to switch between `dancer_ananya`, `dancer_priya`, `dancer_rohan`, or custom IDs to test multi-user concurrency and dynamic CTA states.
3. **Slots Progress Bar**: Visual progress bar showing `bookedSlots / totalSlots` with dynamic warnings when spots are low.
4. **Judge Spotlight**: Manju Dubey's profile with verified avatar, title, experience badge, and circular video intro play button.
5. **Real-Time Countdown**: Live countdown hook updating every second (`01d : 06h : 28m : 32s`) with "Hurry up!" alert badge.
6. **Important Dates 4-Card Grid**: Registration Ends, Submission Starts, Submission Ends, Result Date with distinct calendar glyphs.
7. **Previous Winners Carousel**: Horizontal scrolling list with rank medals (Gold, Silver, Bronze) and avatars.
8. **Tabbed Content Section**: Smooth tab switcher between `About`, `Judging Parameters`, and `Rules & Eligibility`.
9. **Rewards Breakdown**: Itemized list from 1st Winner (₹500) to 6th Winner (₹80) with trophy icons.
10. **Dynamic Floating Bottom CTA**:
    - **Unregistered**: `"Register Now - ₹99"` with active spinner and optimistic UI feedback.
    - **Registered**: Switches dynamically to `"Upload Submission"`.
    - **Closed / Full**: Disabled state with `"Registration Closed"`.
11. **Submission Modal**: Allows registered dancers to enter video URLs and submit their performances.

---

## 📝 Assignment Specifics & Evaluation Responses (PDF Page 2)

### 1. Important Assumptions Made

- **User Identity Context**: In a full production app, the user's ID and auth token would come from an OAuth / JWT authorization header (`req.headers.authorization`). For testing flexibility, the screen supports dynamic user switching (`dancer_ananya`, `dancer_priya`, etc.) so evaluators can test multi-user concurrency without clearing cookies or logging in and out.
- **Payment Verification Step**: In production, the "Register Now - ₹99" action would redirect to a Razorpay gateway webhook flow before writing to the database. For this technical module, payment confirmation is atomically simulated upon pressing the CTA.
- **Static vs Dynamic Lifecycle**: Competition metadata (judge, rewards breakdown, rules) is largely read-heavy, while slot booking and submission state are write-heavy and demand strict consistency.

### 2. Major Technical Decisions

- **Pure JavaScript & React Native**: Built using modern, modular React Native (Expo) and ES6+ JavaScript, ensuring frictionless execution across Web, iOS, and Android without compilation friction.
- **Atomic Compare-and-Swap in MongoDB**: Rather than standard application-level read-modify-write patterns (which cause race conditions), we use MongoDB's atomic `findOneAndUpdate` with conditional checks on `bookedSlots < totalSlots` and registration deadlines.
- **Compensating Rollback Architecture**: If creating the user registration record encounters a network glitch or unique constraint violation, a compensating decrement `{ $inc: { bookedSlots: -1 } }` immediately returns the slot to the pool.
- **Embedded In-Memory MongoDB Fallback**: To ensure any evaluator has a zero-setup experience, the backend connects to MongoDB if available, or automatically spins up an ephemeral embedded MongoDB instance if no local daemon is running.

### 3. Trade-Offs Considered

- **MongoDB `$expr` vs Redis Distributed Locks**:
  - _Trade-off_: MongoDB atomic queries provide ACID consistency for single documents without needing extra infrastructure. For extreme traffic spikes (e.g. 50,000 requests/second), a Redis distributed counter with a queue would be preferred to spare the database.
- **Client Polling vs WebSockets for Live Slots**:
  - _Trade-off_: We used a lightweight pull-to-refresh and optimistic state updates for the slot count. For production, a WebSocket / SSE connection can broadcast realtime slot decrements across all connected users.
- **Single Monorepo vs Multi-repo**:
  - _Trade-off_: Monorepo structure simplifies full-stack testing and review while keeping backend and mobile packages cleanly isolated.

### 4. Production Improvements & Next Steps

- **Redis Caching Layer**: Add Redis read-through caching for competition metadata with automatic invalidation on admin edits.
- **Payment Gateway Integration**: Complete Razorpay order creation and signature verification webhooks.
- **Cloudflare / AWS S3 Direct Uploads**: Use presigned S3/Cloudflare R2 URLs for video performance uploads directly from the mobile client.
- **Push Notifications**: Integrate Expo Push Notifications to notify users when the registration is 1 hour from closing or when results are published.

---

## 🧪 Verification & Testing Commands

```bash
# 1. Run concurrency stress test
cd backend
npm test

# 2. Seed database
cd backend
npm run seed

# 3. Start backend API
npm start

# 4. Start mobile app in web mode (in another terminal)
cd ../mobile
npm run web
```
