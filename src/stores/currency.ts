import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import type { CurrencyCode, CurrencyState } from '../types/currency.ts';

const API_URL = 'https://status.neuralgeneration.com/api/currency';

export const useCurrencyStore = defineStore('currency', () => {
  const state = ref<CurrencyState>({
    baseCurrency: 'RUB',
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

  return {
    state,
    fetchRates,
    setBaseCurrency,
  };
});