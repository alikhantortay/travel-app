import React from 'react';
import { View, Text, Switch, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAviaFilters } from '../../store/useAviaFilters';

interface Props {
  visible: boolean;
  onClose: () => void;
  availableAirlines: string[];
}

export default function AviaFiltersModal({ visible, onClose, availableAirlines }: Props) {
  const filters = useAviaFilters();

  const toggleStop = (stop: number) => {
    const current = filters.stops;
    if (current.includes(stop)) {
      filters.setStops(current.filter(s => s !== stop));
    } else {
      filters.setStops([...current, stop]);
    }
  };

  const toggleAirline = (airline: string) => {
    const current = filters.airlines;
    if (current.includes(airline)) {
      filters.setAirlines(current.filter(a => a !== airline));
    } else {
      filters.setAirlines([...current, airline]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Фильтры</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>Закрыть</Text></TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Пересадки</Text>
          <View style={styles.row}>
            <Switch value={filters.stops.includes(0)} onValueChange={() => toggleStop(0)} />
            <Text style={styles.label}>Без пересадок</Text>
          </View>
          <View style={styles.row}>
            <Switch value={filters.stops.includes(1)} onValueChange={() => toggleStop(1)} />
            <Text style={styles.label}>1 пересадка</Text>
          </View>
          <View style={styles.row}>
            <Switch value={filters.stops.includes(2)} onValueChange={() => toggleStop(2)} />
            <Text style={styles.label}>2 и более</Text>
          </View>

          <Text style={styles.sectionTitle}>Багаж</Text>
          <View style={styles.row}>
            <Switch
              value={filters.isBaggageIncluded === true}
              onValueChange={(val) => filters.setIsBaggageIncluded(val ? true : null)}
            />
            <Text style={styles.label}>Только с багажом</Text>
          </View>

          <Text style={styles.sectionTitle}>Авиакомпании</Text>
          {availableAirlines.map(airline => (
            <View key={airline} style={styles.row}>
              <Switch value={filters.airlines.includes(airline)} onValueChange={() => toggleAirline(airline)} />
              <Text style={styles.label}>{airline}</Text>
            </View>
          ))}
          
        </ScrollView>
        <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyBtnText}>Применить {filters.stops.length + filters.airlines.length + (filters.isBaggageIncluded !== null ? 1 : 0) > 0 ? `(${filters.stops.length + filters.airlines.length + (filters.isBaggageIncluded !== null ? 1 : 0)})` : ''}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold' },
  closeBtn: { fontSize: 16, color: '#007AFF' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  label: { marginLeft: 10, fontSize: 16 },
  applyBtn: { backgroundColor: '#007AFF', padding: 15, margin: 20, borderRadius: 10, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
