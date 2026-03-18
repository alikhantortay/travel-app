import { mockAviaOffers, AviaOffer } from './mockAviaData';

export const fetchAviaOffers = async (): Promise<AviaOffer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAviaOffers);
    }, 800);
  });
};
