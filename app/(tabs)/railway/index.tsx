import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { mockCarriage, Seat } from '../../../src/api/mockRailwayData';
import WagonMap from '../../../src/features/railway/WagonMap';
import { useOrdersStore } from '../../../src/store/useOrdersStore';

const MAX_SEATS = 4;
const BOOKING_DURATION_MS = 15 * 60 * 1000;

export default function RailwayScreen() {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const addOrder = useOrdersStore(state => state.addOrder);

  const selectedSeats = mockCarriage.seats.filter(s => selectedSeatIds.includes(s.id));

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleSeatPress = useCallback((seat: Seat) => {
    setSelectedSeatIds(prev => {
      if (prev.includes(seat.id)) {
        Haptics.selectionAsync();
        return prev.filter(id => id !== seat.id);
      }
      if (prev.length >= MAX_SEATS) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return prev;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return [...prev, seat.id];
    });
  }, []);

  const handleBook = () => {
    if (selectedSeats.length === 0) return;

    const seatNumbers = selectedSeats.map(s => `${s.number}`).join(', ');
    const seatTypes = [...new Set(selectedSeats.map(s =>
      s.type === 'lower' ? 'нижнее' : s.type === 'upper' ? 'верхнее' : 'боковое'
    ))].join('/');

    const newOrder = {
      id: `ORD-RLW-${Date.now()}`,
      type: 'railway' as const,
      description: `Поезд №001, Вагон ${mockCarriage.number}, Места ${seatNumbers} (${seatTypes})`,
      amount: totalPrice,
      status: 'pending' as const,
      expiresAt: Date.now() + BOOKING_DURATION_MS,
      seats: selectedSeats.map(s => ({
        id: s.id,
        number: s.number,
        type: s.type,
        price: s.price,
      })),
    };

    addOrder(newOrder);
    setSelectedSeatIds([]);
    router.push('/(tabs)/orders' as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Билеты на поезд</Text>
          <View style={styles.subtitleRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Поезд №001</Text>
            </View>
            <View style={[styles.badge, styles.badgeAlt]}>
              <Text style={styles.badgeTextAlt}>Вагон {mockCarriage.number}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.mapWrap}>
        <WagonMap
          seats={mockCarriage.seats}
          selectedIds={selectedSeatIds}
          onSeatPress={handleSeatPress}
        />
        <View style={styles.hintWrap}>
          <Text style={styles.hintText}>Масштабируйте двумя пальцами</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.selectedLabel}>
            Выбрано мест: <Text style={styles.selectedCount}>{selectedSeatIds.length} / {MAX_SEATS}</Text>
          </Text>
          <Text style={styles.price}>
            {totalPrice.toLocaleString()} ₸
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, selectedSeatIds.length === 0 && styles.bookBtnDisabled]}
          disabled={selectedSeatIds.length === 0}
          activeOpacity={0.88}
          onPress={handleBook}
        >
          <Text style={styles.bookBtnText}>Купить билеты</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#1a56db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  badgeAlt: {
    backgroundColor: '#e2e8f0',
  },
  badgeTextAlt: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 13,
  },
  mapWrap: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#1a56db', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.05, shadowRadius: 16 },
      android: { elevation: 10 },
      default: { boxShadow: '0px -6px 16px rgba(26,86,219,0.05)' },
    }),
  },
  hintWrap: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(15,23,42,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hintText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
  },
  footerInfo: {
    flex: 1,
  },
  selectedLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedCount: {
    fontWeight: '700',
    color: '#0f172a',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a56db',
    letterSpacing: -0.5,
  },
  bookBtn: {
    backgroundColor: '#1a56db',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginLeft: 16,
  },
  bookBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
