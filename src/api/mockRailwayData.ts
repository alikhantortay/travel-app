export type SeatType = 'lower' | 'upper' | 'side';
export type SeatStatus = 'available' | 'taken';

export interface Seat {
  id: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  price: number;
}

export interface Carriage {
  id: string;
  number: number;
  seats: Seat[];
}

function generateSeats(): Seat[] {
  const seats: Seat[] = [];
  for (let coupe = 0; coupe < 9; coupe++) {
    const base = coupe * 4;
    seats.push({ id: `s${base + 1}`, number: base + 1, type: 'lower', status: Math.random() > 0.3 ? 'available' : 'taken', price: 8500 });
    seats.push({ id: `s${base + 2}`, number: base + 2, type: 'lower', status: Math.random() > 0.3 ? 'available' : 'taken', price: 8500 });
    seats.push({ id: `s${base + 3}`, number: base + 3, type: 'upper', status: Math.random() > 0.3 ? 'available' : 'taken', price: 6500 });
    seats.push({ id: `s${base + 4}`, number: base + 4, type: 'upper', status: Math.random() > 0.3 ? 'available' : 'taken', price: 6500 });
  }
  for (let i = 0; i < 9; i++) {
    seats.push({ id: `ss${i * 2 + 1}`, number: 37 + i * 2, type: 'side', status: Math.random() > 0.4 ? 'available' : 'taken', price: 4500 });
    seats.push({ id: `ss${i * 2 + 2}`, number: 37 + i * 2 + 1, type: 'side', status: Math.random() > 0.4 ? 'available' : 'taken', price: 4500 });
  }
  return seats;
}

export const mockCarriage: Carriage = {
  id: 'c1',
  number: 5,
  seats: generateSeats(),
};
