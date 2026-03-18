export interface FlightSegment {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
}

export interface AviaOffer {
  id: string;
  price: number;
  segments: FlightSegment[];
  isBaggageIncluded: boolean;
}

export const mockAviaOffers: AviaOffer[] = [
  {
    id: 'o1',
    price: 15000,
    isBaggageIncluded: true,
    segments: [
      { id: 's1', airline: 'Air Astana', origin: 'ALA', destination: 'NQZ', departureTime: '2023-10-10T10:00:00', arrivalTime: '2023-10-10T11:45:00', durationMinutes: 105 }
    ]
  },
  {
    id: 'o2',
    price: 12000,
    isBaggageIncluded: false,
    segments: [
      { id: 's2', airline: 'FlyArystan', origin: 'ALA', destination: 'NQZ', departureTime: '2023-10-10T15:00:00', arrivalTime: '2023-10-10T16:40:00', durationMinutes: 100 }
    ]
  },
  {
    id: 'o3',
    price: 25000,
    isBaggageIncluded: true,
    segments: [
      { id: 's3', airline: 'SCAT', origin: 'ALA', destination: 'CIT', departureTime: '2023-10-10T08:00:00', arrivalTime: '2023-10-10T09:30:00', durationMinutes: 90 },
      { id: 's4', airline: 'SCAT', origin: 'CIT', destination: 'NQZ', departureTime: '2023-10-10T11:00:00', arrivalTime: '2023-10-10T12:30:00', durationMinutes: 90 }
    ]
  },
  {
    id: 'o4',
    price: 35000,
    isBaggageIncluded: true,
    segments: [
      { id: 's5', airline: 'Qazaq Air', origin: 'ALA', destination: 'DMB', departureTime: '2023-10-10T06:00:00', arrivalTime: '2023-10-10T07:20:00', durationMinutes: 80 },
      { id: 's6', airline: 'Qazaq Air', origin: 'DMB', destination: 'GUW', departureTime: '2023-10-10T09:00:00', arrivalTime: '2023-10-10T10:15:00', durationMinutes: 75 },
      { id: 's7', airline: 'Qazaq Air', origin: 'GUW', destination: 'NQZ', departureTime: '2023-10-10T12:00:00', arrivalTime: '2023-10-10T14:30:00', durationMinutes: 150 }
    ]
  },
  {
    id: 'o5',
    price: 18000,
    isBaggageIncluded: false,
    segments: [
      { id: 's8', airline: 'SCAT', origin: 'ALA', destination: 'NQZ', departureTime: '2023-10-10T17:00:00', arrivalTime: '2023-10-10T18:40:00', durationMinutes: 100 }
    ]
  }
];
