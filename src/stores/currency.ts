import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import type { CurrencyCode, CurrencyState } from '../types/currency.ts';

const API_URL = 'https://status.neuralgeneration.com/api/currency';

export const useCurrencyStore = defineStore('currency', () => {
  const state = ref<CurrencyState>({
    baseCurrency: 'USD',
    rates: {},
    loading: false,
    error: null
  });

  const lastFetchTime = ref<number>(0);



  async function fetchRates() {
    state.value.loading = true;
    state.value.error = null;

    try {
      const response = await axios.get(API_URL);
      state.value.rates = response.data;
      lastFetchTime.value = Date.now();
    } catch (err) {
      state.value.error = err instanceof Error ? err.message : 'Failed to fetch exchange rates';
      console.error('Error fetching rates:', err);
    } finally {
      state.value.loading = false;
    }
  }

  function setBaseCurrency(currency: CurrencyCode) {
    state.value.baseCurrency = currency;
  }

  function convert(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rateKey = `${fromCurrency.toLowerCase()}-${toCurrency.toLowerCase()}`;
    const rate = state.value.rates[rateKey];

    if (rate) {
      return Number((amount * rate).toFixed(2));
    }

    return 0;
  }

  return {
    state,
    fetchRates,
    setBaseCurrency,
    convert,
  };
});