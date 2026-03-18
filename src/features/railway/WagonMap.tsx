import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Seat as SeatType } from '../../api/mockRailwayData';
import SeatItem from './Seat';

interface Props {
  seats: SeatType[];
  selectedIds: string[];
  onSeatPress: (seat: SeatType) => void;
}

export default function WagonMap({ seats, selectedIds, onSeatPress }: Props) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.8, Math.min(savedScale.value * e.scale, 3));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedX.value + e.translationX;
      translateY.value = savedY.value + e.translationY;
    })
    .onEnd(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pan, pinch);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const coupeSeats = seats.filter(s => s.type !== 'side');
  const sideSeats = seats.filter(s => s.type === 'side');

  const renderCoupe = useCallback(
    (coupeIdx: number) => {
      const start = coupeIdx * 4;
      const group = coupeSeats.slice(start, start + 4);
      const lower = group.filter(s => s.type === 'lower');
      const upper = group.filter(s => s.type === 'upper');
      return (
        <View key={coupeIdx} style={styles.coupe}>
          <Text style={styles.coupeLabel}>К{coupeIdx + 1}</Text>
          <View style={styles.coupeRow}>
            {lower.map(seat => (
              <SeatItem
                key={seat.id}
                seat={seat}
                isSelected={selectedIds.includes(seat.id)}
                onPress={onSeatPress}
              />
            ))}
          </View>
          <View style={styles.coupeRow}>
            {upper.map(seat => (
              <SeatItem
                key={seat.id}
                seat={seat}
                isSelected={selectedIds.includes(seat.id)}
                onPress={onSeatPress}
              />
            ))}
          </View>
        </View>
      );
    },
    [coupeSeats, selectedIds, onSeatPress]
  );

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.gestureContainer}>
        <Animated.View style={[styles.wagon, animatedStyle]}>
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: '#4A90D9' }]} /><Text style={styles.legendText}>Нижнее</Text>
            <View style={[styles.legendDot, { backgroundColor: '#7B68EE' }]} /><Text style={styles.legendText}>Верхнее</Text>
            <View style={[styles.legendDot, { backgroundColor: '#48C774' }]} /><Text style={styles.legendText}>Боковое</Text>
            <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} /><Text style={styles.legendText}>Выбрано</Text>
            <View style={[styles.legendDot, { backgroundColor: '#ccc' }]} /><Text style={styles.legendText}>Занято</Text>
          </View>

          <Text style={styles.sectionLabel}>Купе</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.coupesRow}>
              {Array.from({ length: 9 }, (_, i) => renderCoupe(i))}
            </View>
          </ScrollView>

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Боковые</Text>
          <View style={styles.sideRow}>
            {sideSeats.map(seat => (
              <SeatItem
                key={seat.id}
                seat={seat}
                isSelected={selectedIds.includes(seat.id)}
                onPress={onSeatPress}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  gestureContainer: { flex: 1, overflow: 'hidden' },
  wagon: { padding: 12 },
  legend: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12, gap: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 4, marginRight: 4 },
  legendText: { fontSize: 11, color: '#555', marginRight: 8 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 6 },
  coupesRow: { flexDirection: 'row' },
  coupe: { marginRight: 10, alignItems: 'center' },
  coupeLabel: { fontSize: 10, color: '#888', marginBottom: 2 },
  coupeRow: { flexDirection: 'row' },
  sideRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
