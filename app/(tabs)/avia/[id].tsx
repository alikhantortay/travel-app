import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { mockAviaOffers } from '../../../src/api/mockAviaData';

export default function AviaOfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const offer = mockAviaOffers.find(o => o.id === id);

  if (!offer) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>✈️</Text>
        <Text style={styles.errorText}>Билет не найден</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Вернуться к поиску</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerCard}>
        <Text style={styles.route}>
          {offer.segments[0].origin} → {offer.segments[offer.segments.length - 1].destination}
        </Text>
        <Text style={styles.price}>{offer.price.toLocaleString()} ₸</Text>
        
        <View style={styles.badgesWrapper}>
          <View style={[styles.badge, !offer.isBaggageIncluded && styles.badgeOutlined]}>
            <Text style={[styles.badgeText, !offer.isBaggageIncluded && styles.badgeTextOutlined]}>
              {offer.isBaggageIncluded ? '✓ Багаж включён' : '✗ Багаж не включён'}
            </Text>
          </View>
          <View style={[styles.badge, styles.badgePrimary]}>
            <Text style={styles.badgeTextPrimary}>
              {offer.segments.length - 1 === 0 ? 'Прямой рейс' : `Пересадок: ${offer.segments.length - 1}`}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Детали маршрута</Text>
      
      {offer.segments.map((seg, idx) => (
        <View key={seg.id} style={styles.segmentCard}>
          <View style={styles.segmentHeader}>
            <Text style={styles.segmentAirline}>{seg.airline}</Text>
            <View style={styles.durationBadge}>
              <Text style={styles.segmentDuration}>{seg.durationMinutes} мин в пути</Text>
            </View>
          </View>
          
          <View style={styles.segmentRoute}>
            <View style={styles.segmentPoint}>
              <Text style={styles.segmentCode}>{seg.origin}</Text>
              <Text style={styles.segmentTime}>
                {new Date(seg.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.flightLine}>
              <View style={styles.dot} />
              <View style={styles.line} />
              <View style={styles.dot} />
            </View>
            <View style={styles.segmentPoint}>
              <Text style={styles.segmentCode}>{seg.destination}</Text>
              <Text style={styles.segmentTime}>
                {new Date(seg.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>

          {idx < offer.segments.length - 1 && (
            <View style={styles.stopover}>
              <Text style={styles.stopoverText}>⏱ Пересадка в городе {seg.destination}</Text>
            </View>
          )}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Условия тарифа</Text>
      <View style={styles.rulesCard}>
        <View style={styles.ruleRow}>
          <Text style={styles.ruleIcon}>💳</Text>
          <Text style={styles.ruleText}>Возврат: возможен с удержанием</Text>
        </View>
        <View style={styles.ruleRow}>
          <Text style={styles.ruleIcon}>🔄</Text>
          <Text style={styles.ruleText}>Обмен: платный, со сбором авиакомпании</Text>
        </View>
        <View style={styles.ruleRow}>
          <Text style={styles.ruleIcon}>🧳</Text>
          <Text style={styles.ruleText}>{offer.isBaggageIncluded ? 'Багаж: включён в стоимость' : 'Багаж: оплачивается отдельно'}</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.bookBtn}
        onPress={() => router.push(`/payment/${offer.id}` as any)}
      >
        <Text style={styles.bookBtnText}>Купить за {offer.price.toLocaleString()} ₸</Text>
      </TouchableOpacity>
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
    padding: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 24,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#1a56db',
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#1a56db', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20 },
      android: { elevation: 4 },
      default: { boxShadow: '0px 8px 20px rgba(26,86,219,0.08)' },
    }),
  },
  route: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1a56db',
    letterSpacing: -1,
    marginBottom: 20,
  },
  badgesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 13,
  },
  badgeOutlined: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgeTextOutlined: {
    color: '#64748b',
  },
  badgePrimary: {
    backgroundColor: '#eff6ff',
    borderWidth: 0,
  },
  badgeTextPrimary: {
    color: '#1a56db',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  segmentCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  segmentAirline: {
    fontWeight: '800',
    fontSize: 16,
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  durationBadge: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  segmentDuration: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  segmentRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentPoint: {
    alignItems: 'center',
    width: 60,
  },
  segmentCode: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  segmentTime: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  flightLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
  },
  stopover: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  stopoverText: {
    color: '#d97706',
    fontSize: 14,
    fontWeight: '600',
  },
  rulesCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  ruleIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  ruleText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  bookBtn: {
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
  bookBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
