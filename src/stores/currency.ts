import { defineStore } from 'pinia';
import axios from 'axios';
import {ref} from 'vue';

interface ExchangeRates {
  [key: string]: number;
}

export const useCurrencyStore = defineStore('currency', ()=>{
  const baseCurrency = ref('USD')
  const   rates =  ref<ExchangeRates>({})
   const  loading = ref(false)
   const error = ref<null | string>(null)

  async function fetchRates() {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('https://status.neuralgeneration.com/api/currency');
      rates.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch exchange rates';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  function setBaseCurrency(currency: string) {
    baseCurrency.value = currency;
  }

  function convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }
    const directRate = rates.value[`${fromCurrency.toLowerCase()}-${toCurrency.toLowerCase()}`];
    if (directRate) {
      return Number((amount * directRate).toFixed(2));
    }

    const inverseRate = rates.value[`${toCurrency.toLowerCase()}-${fromCurrency.toLowerCase()}`];
    if (inverseRate) {
      return Number((amount / inverseRate).toFixed(2));
    }

    return 0;
  }

  return {fetchRates, setBaseCurrency, convert, baseCurrency, error, loading, rates};
});