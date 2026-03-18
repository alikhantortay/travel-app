import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useOrdersStore } from '../../../src/store/useOrdersStore';
import BookingCountdown from '../../../src/components/BookingCountdown';

export type { Order as MockOrder } from '../../../src/store/useOrdersStore';

const STATUS_COLOR: Record<string, string> = {
  pending: '#f59e0b',
  paid: '#10b981',
  failed: '#ef4444',
};

const STATUS_BG: Record<string, string> = {
  pending: '#fffbeb',
  paid: '#ecfdf5',
  failed: '#fef2f2',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Ожидает оплаты',
  paid: 'Оплачено',
  failed: 'Ошибка оплаты',
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrdersStore(state => state.orders.find(o => o.id === id));

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.notFound}>Заказ не найден</Text>
        <TouchableOpacity style={styles.backBtnOutline} onPress={() => router.push('/(tabs)/railway' as any)}>
          <Text style={styles.backBtnOutlineText}>Вернуться назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderIdLabel}>Детали заказа</Text>
            <Text style={styles.orderId}>#{order.id}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: STATUS_BG[order.status] }]}>
            <Text style={[styles.badgeText, { color: STATUS_COLOR[order.status] }]}>
              {STATUS_LABEL[order.status]}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{order.description}</Text>

        {order.expiresAt && order.status === 'pending' && (
          <View style={styles.timerBox}>
            <View style={styles.timerIconWrap}>
              <Text style={styles.timerIcon}>⏳</Text>
            </View>
            <View style={styles.timerTextWrap}>
              <Text style={styles.timerHint}>Осталось на оплату</Text>
              <BookingCountdown expiresAt={order.expiresAt} />
            </View>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Тип бронирования</Text>
          <Text style={styles.value}>{order.type === 'avia' ? '✈️ Авиабилет' : '🚆 ЖД билет'}</Text>
        </View>

        {order.seats && order.seats.length > 0 && (
          <View style={styles.seatsSection}>
            <Text style={styles.seatsTitle}>Выбранные места</Text>
            <View style={styles.seatsList}>
              {order.seats.map(seat => (
                <View key={seat.id} style={styles.seatRow}>
                  <Text style={styles.seatInfo}>
                    Место {seat.number} <Text style={styles.seatType}>({seat.type === 'lower' ? 'нижнее' : seat.type === 'upper' ? 'верхнее' : 'боковое'})</Text>
                  </Text>
                  <Text style={styles.seatPrice}>{seat.price.toLocaleString()} ₸</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Итого к оплате</Text>
          <Text style={styles.amount}>{order.amount.toLocaleString()} ₸</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {order.status === 'pending' && (
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.payBtn}
            onPress={() => router.push(`/payment/${order.id}` as any)}
          >
            <Text style={styles.payBtnText}>Перейти к оплате</Text>
          </TouchableOpacity>
        )}

        {order.status === 'failed' && (
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.payBtn, styles.payBtnFailed]}
            onPress={() => router.push(`/payment/${order.id}` as any)}
          >
            <Text style={styles.payBtnText}>Повторить оплату</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.push('/(tabs)/railway' as any)}>
          <Text style={styles.backBtnText}>Вернуться к поиску ЖД</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  notFound: {
    fontSize: 20,
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  backBtnOutline: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a56db',
    backgroundColor: '#fff',
  },
  backBtnOutlineText: {
    color: '#1a56db',
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#1a56db', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20 },
      android: { elevation: 4 },
      default: { boxShadow: '0px 8px 20px rgba(26,86,219,0.08)' },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderIdLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  description: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 24,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  timerIconWrap: {
    marginRight: 12,
  },
  timerIcon: {
    fontSize: 24,
  },
  timerTextWrap: {
    flex: 1,
  },
  timerHint: {
    fontSize: 13,
    color: '#d97706',
    fontWeight: '600',
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
  },
  value: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  seatsSection: {
    marginTop: 8,
  },
  seatsTitle: {
    fontWeight: '700',
    color: '#64748b',
    fontSize: 14,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  seatsList: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  seatInfo: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
  },
  seatType: {
    color: '#64748b',
    fontWeight: '400',
  },
  seatPrice: {
    color: '#1a56db',
    fontWeight: '700',
    fontSize: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  amount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a56db',
    letterSpacing: -1,
  },
  actions: {
    marginTop: 24,
    gap: 16,
  },
  payBtn: {
    backgroundColor: '#1a56db',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#1a56db', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
      android: { elevation: 4 },
      default: { boxShadow: '0px 4px 12px rgba(26,86,219,0.2)' },
    }),
  },
  payBtnFailed: {
    backgroundColor: '#ef4444',
  },
  payBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backBtnText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
});
