import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate and update countdown timer in real-time
 * @param {string|Date} targetDateIsoOrObj 
 */
export function useCountdown(targetDateIsoOrObj) {
  const calculateTimeLeft = () => {
    if (!targetDateIsoOrObj) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        formatted: '00d : 00h : 00m : 00s',
        isExpired: true,
        totalSecondsLeft: 0
      };
    }

    const targetTime = new Date(targetDateIsoOrObj).getTime();
    const now = Date.now();
    const difference = targetTime - now;

    if (difference <= 0) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        formatted: 'Registration Ended',
        isExpired: true,
        totalSecondsLeft: 0
      };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    const pad = (n) => n.toString().padStart(2, '0');

    const days = pad(d);
    const hours = pad(h);
    const minutes = pad(m);
    const seconds = pad(s);

    return {
      days,
      hours,
      minutes,
      seconds,
      formatted: `${days}d : ${hours}h : ${minutes}m : ${seconds}s`,
      isExpired: false,
      totalSecondsLeft: totalSeconds
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      if (updated.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateIsoOrObj]);

  return timeLeft;
}
