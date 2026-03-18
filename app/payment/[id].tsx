import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { captureIokaError } from '../../src/utils/sentry';

export default function PaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');

  const handlePay = async () => {
    setStatus('loading');
    await new Promise(res => setTimeout(res, 2000));
    const success = Math.random() > 0.3;
    if (success) {
      setStatus('success');
    } else {
      const err = new Error('Transaction declined by bank');
      captureIokaError(err, 'TRANSACTION_DECLINED', id ?? 'unknown');
      setStatus('failed');
    }
  };

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a56db" />
        <Text style={styles.loadingText}>Обработка платежа...</Text>
        <Text style={styles.loadingSubtext}>Пожалуйста, не закрывайте приложение</Text>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View style={styles.center}>
        <View style={styles.iconCircleSuccess}>
          <Text style={styles.resultIcon}>✅</Text>
        </View>
        <Text style={styles.resultTitle}>Оплата прошла успешно!</Text>
        <Text style={styles.resultSubtitle}>Билет отправлен на вашу почту</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(tabs)/orders')}>
          <Text style={styles.primaryBtnText}>Перейти к заказам</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.center}>
        <View style={styles.iconCircleFail}>
          <Text style={styles.resultIcon}>❌</Text>
        </View>
        <Text style={styles.resultTitle}>Транзакция отклонена</Text>
        <Text style={styles.resultSubtitle}>Попробуйте другую карту или повторите позже</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setStatus('idle')}>
          <Text style={styles.primaryBtnText}>Попробовать снова</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryBtnText}>Вернуться назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Оплата заказа</Text>

      <Text style={styles.sectionTitle}>Способ оплаты</Text>
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.cardIconWrap}>
            <Text style={styles.cardIcon}>💳</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Банковская карта</Text>
            <Text style={styles.cardSub}>Visa, Mastercard, Mir</Text>
          </View>
          <View style={styles.radioChecked}>
            <View style={styles.radioInner} />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Данные карты</Text>
      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Номер карты</Text>
        <View style={styles.inputMock}>
          <Text style={styles.inputText}>•••• •••• •••• 4242</Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.inputMock, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.inputText}>12/26</Text>
          </View>
          <View style={[styles.inputMock, { flex: 1 }]}>
            <Text style={styles.inputText}>•••</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoAlert}>
        <Text style={styles.infoAlertIcon}>🔒</Text>
        <Text style={styles.infoText}>
          После нажатия вы будете перенаправлены в приложение банка для подтверждения. После оплаты вы вернётесь обратно.
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.88} style={styles.payBtn} onPress={handlePay}>
        <Text style={styles.payBtnText}>Оплатить заказ</Text>
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
  loadingText: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 24,
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  loadingSubtext: {
    color: '#64748b',
    marginTop: 8,
    fontSize: 15,
  },
  iconCircleSuccess: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircleFail: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultIcon: {
    fontSize: 48,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  resultSubtitle: {
    color: '#64748b',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: '#1a56db',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryBtn: {
    marginTop: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '700',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#1a56db', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16 },
      android: { elevation: 3 },
      default: { boxShadow: '0px 6px 16px rgba(26,86,219,0.08)' },
    }),
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 4,
  },
  cardSub: {
    color: '#64748b',
    fontSize: 13,
  },
  radioChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a56db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1a56db',
  },
  fieldLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputMock: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  inputText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
  },
  infoAlert: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoAlertIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    color: '#1e3a8a',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
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
  payBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
