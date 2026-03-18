import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

interface Props {
  expiresAt: number;
}

export default function BookingCountdown({ expiresAt }: Props) {
  const [remaining, setRemaining] = useState(expiresAt - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRemaining(expiresAt - now);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (remaining <= 0) {
    return <Text style={styles.expired}>⏰ Бронь истекла</Text>;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return (
    <Text style={styles.timer}>{minutes}:{seconds}</Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 24,
    color: '#d97706',
    fontWeight: '800',
    letterSpacing: 2,
  },
  expired: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '700',
  },
});
