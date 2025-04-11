export type CurrencyCode = 'USD' | 'EUR' | 'RUB' | 'BRL' | 'KZT' | 'IDR';

export interface ExchangeRates {
  [key: string]: number;
}

export interface CurrencyState {
  baseCurrency: CurrencyCode;
  rates: ExchangeRates;
  loading: boolean;
  error: string | null;
}

export interface ExchangeRate {
  currency: CurrencyCode;
  rate: string;
} 