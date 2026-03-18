import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useOrdersStore, Order } from '../../../src/store/useOrdersStore';
import BookingCountdown from '../../../src/components/BookingCountdown';

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
  failed: 'Ошибка',
};

export default function OrdersScreen() {
  const orders = useOrdersStore(state => state.orders);

  const renderItem = ({ item }: { item: Order }) => {
    const isNavigable = item.status === 'pending' || item.status === 'paid';

    const content = (
      <View style={styles.cardInner}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderType}>{item.type === 'avia' ? '✈️ Авиабилет' : '🚆 ЖД билет'}</Text>
            <Text style={styles.orderId}>#{item.id}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: STATUS_BG[item.status] }]}>
            <View style={[styles.badgeDot, { backgroundColor: STATUS_COLOR[item.status] }]} />
            <Text style={[styles.badgeText, { color: STATUS_COLOR[item.status] }]}>
              {STATUS_LABEL[item.status]}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

        {item.expiresAt && item.status === 'pending' && (
          <View style={styles.timerWrap}>
            <BookingCountdown expiresAt={item.expiresAt} />
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.amount}>{item.amount.toLocaleString()} ₸</Text>
          {isNavigable && (
            <Text style={styles.arrowHint}>Подробнее →</Text>
          )}
        </View>
      </View>
    );

    return isNavigable ? (
      <TouchableOpacity
        activeOpacity={0.82}
        style={styles.card}
        onPress={() => router.push(`/(tabs)/orders/${item.id}` as any)}
      >
        {content}
      </TouchableOpacity>
    ) : (
      <View style={[styles.card, styles.cardDisabled]}>{content}</View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🗂️</Text>
            <Text style={styles.emptyText}>Заказов пока нет</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#1a56db', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 3 },
      default: { boxShadow: '0px 4px 12px rgba(26,86,219,0.08)' },
    }),
  },
  cardInner: {
    padding: 16,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderType: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  orderId: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 10,
  },
  timerWrap: {
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    marginTop: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a56db',
  },
  arrowHint: {
    fontSize: 13,
    color: '#1a56db',
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
});
