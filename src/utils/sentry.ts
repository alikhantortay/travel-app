import * as Sentry from '@sentry/react-native';

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    debug: __DEV__,
  });
}

export type IokaErrorCode =
  | 'AMOUNT_MISMATCH'
  | 'TRANSACTION_DECLINED'
  | 'ORDER_NOT_FOUND'
  | 'UNKNOWN';

export function captureIokaError(
  error: Error,
  code: IokaErrorCode,
  orderId: string
) {
  Sentry.withScope((scope) => {
    scope.setTag('order_id', orderId);
    scope.setTag('ioka_error_code', code);
    scope.setContext('ioka_error', {
      code,
      orderId,
      message: error.message,
    });
    Sentry.captureException(error);
  });
}
