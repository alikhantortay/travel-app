import { create } from 'zustand';

export interface AviaFiltersState {
  stops: number[];
  airlines: string[];
  isBaggageIncluded: boolean | null;
  setStops: (stops: number[]) => void;
  setAirlines: (airlines: string[]) => void;
  setIsBaggageIncluded: (val: boolean | null) => void;
  resetFilters: () => void;
}

export const useAviaFilters = create<AviaFiltersState>((set) => ({
  stops: [],
  airlines: [],
  isBaggageIncluded: null,
  setStops: (stops) => set({ stops }),
  setAirlines: (airlines) => set({ airlines }),
  setIsBaggageIncluded: (isBaggageIncluded) => set({ isBaggageIncluded }),
  resetFilters: () => set({ stops: [], airlines: [], isBaggageIncluded: null }),
}));
