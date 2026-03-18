import { create } from 'zustand';

export interface BookedSeat {
  id: string;
  number: number;
  type: 'lower' | 'upper' | 'side';
  price: number;
}

export interface Order {
  id: string;
  type: 'avia' | 'railway';
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  expiresAt?: number;
  seats?: BookedSeat[];
}

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: Order['status']) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [
    {
      id: 'ORD-001',
      type: 'avia',
      description: 'Алматы → Астана, 10 октября, Air Astana',
      amount: 15000,
      status: 'pending',
    },
    {
      id: 'ORD-002',
      type: 'railway',
      description: 'Поезд №001, Вагон 5, Место 12',
      amount: 8500,
      status: 'paid',
    },
    {
      id: 'ORD-003',
      type: 'avia',
      description: 'Алматы → Шымкент, 15 октября, SCAT',
      amount: 12000,
      status: 'failed',
    },
  ],
  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),
  updateStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));
