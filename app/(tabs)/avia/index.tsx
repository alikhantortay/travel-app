import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchAviaOffers } from '../../../src/api/aviaApi';
import { useAviaFilters } from '../../../src/store/useAviaFilters';
import AviaFiltersModal from '../../../src/features/avia/AviaFiltersModal';

export default function AviaScreen() {
  const { data: offers, isLoading } = useQuery({
    queryKey: ['aviaOffers'],
    queryFn: fetchAviaOffers,
  });

  const filters = useAviaFilters();
  const [modalVisible, setModalVisible] = useState(false);

  const availableAirlines = useMemo(() => {
    if (!offers) return [];
    const airlines = new Set<string>();
    offers.forEach(o => o.segments.forEach(s => airlines.add(s.airline)));
    return Array.from(airlines);
  }, [offers]);

  const filteredOffers = useMemo(() => {
    if (!offers) return [];
    return offers.filter(offer => {
      const stopsCount = offer.segments.length - 1;
      const stopsMatch = filters.stops.length === 0 || filters.stops.some(s => s === 2 ? stopsCount >= 2 : s === stopsCount);

      const mainAirline = offer.segments[0].airline;
      const airlineMatch = filters.airlines.length === 0 || filters.airlines.includes(mainAirline);

      const baggageMatch = filters.isBaggageIncluded === null || offer.isBaggageIncluded === filters.isBaggageIncluded;

      return stopsMatch && airlineMatch && baggageMatch;
    });
  }, [offers, filters]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a56db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Билеты на самолёт</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.filterBtnText}>Фильтры</Text>
        </TouchableOpacity>
      </View>
      
      {filteredOffers.length === 0 ? (
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyIcon}>🛫</Text>
          <Text style={styles.emptyText}>Ничего не найдено</Text>
          <TouchableOpacity onPress={filters.resetFilters} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Сбросить фильтры</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOffers}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.88}
              onPress={() => router.push(`/(tabs)/avia/${item.id}` as any)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.price}>{item.price.toLocaleString()} ₸</Text>
                <View style={[styles.badge, !item.isBaggageIncluded && styles.badgeOutlined]}>
                  <Text style={[styles.badgeText, !item.isBaggageIncluded && styles.badgeTextOutlined]}>
                    {item.isBaggageIncluded ? 'О Багаж включен' : 'Без багажа'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.segmentsContainer}>
                {item.segments.map((seg, idx) => (
                  <View key={seg.id} style={[styles.segment, idx > 0 && styles.segmentDivider]}>
                    <Text style={styles.airline}>{seg.airline}</Text>
                    <View style={styles.routeRow}>
                      <View style={styles.timeBlock}>
                        <Text style={styles.time}>{new Date(seg.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        <Text style={styles.city}>{seg.origin}</Text>
                      </View>
                      <View style={styles.flightLine}>
                        <View style={styles.dot} />
                        <View style={styles.line} />
                        <View style={styles.dot} />
                      </View>
                      <View style={styles.timeBlock}>
                        <Text style={styles.time}>{new Date(seg.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        <Text style={styles.city}>{seg.destination}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.stops}>
                  {item.segments.length - 1 === 0 ? 'Прямой рейс' : `Пересадок: ${item.segments.length - 1}`}
                </Text>
                <Text style={styles.selectHint}>Выбрать →</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <AviaFiltersModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        availableAirlines={availableAirlines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
  },
  filterBtn: {
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  filterBtnText: {
    color: '#1a56db',
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#1a56db', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16 },
      android: { elevation: 3 },
      default: { boxShadow: '0px 6px 16px rgba(26,86,219,0.08)' },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a56db',
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeOutlined: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgeText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 12,
  },
  badgeTextOutlined: {
    color: '#64748b',
  },
  segmentsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  segment: {},
  segmentDivider: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  airline: {
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeBlock: {
    alignItems: 'center',
    width: 60,
  },
  time: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  city: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 4,
  },
  flightLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stops: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  selectHint: {
    color: '#1a56db',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 24,
  },
  resetBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1a56db',
    borderRadius: 12,
  },
  resetBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  }
});
