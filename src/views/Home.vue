<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import { useCurrencyStore } from '../stores/currency';
import { storeToRefs } from 'pinia';
import ExchangeRateItem from '../components/ExchangeRateItem.vue';
import type { CurrencyCode } from '../types/currency.ts';

const currencyStore = useCurrencyStore();
const { fetchRates } = currencyStore;
const { state } = storeToRefs(currencyStore);

const currentCurrency = ref<CurrencyCode>(state.value.baseCurrency);
const currencies: CurrencyCode[] = ['USD', 'EUR', 'RUB'];


watch(()=> state.value.baseCurrency, (newCurrency)=>{
  currentCurrency.value = newCurrency;
})

const otherCurrencies = computed(() => {
  return currencies.filter(currency => currency !== currentCurrency.value);
});

onMounted(() => {
  if (!Object.keys(state.value.rates).length)
    fetchRates();
});
</script>

<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Exchange Rates</h1>

    <div v-if="state.loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4">Loading rates...</p>
    </div>

    <div v-else-if="state.error" class="text-red-500">
      {{ state.error }}
    </div>

    <div v-else class="space-y-4">
      <ExchangeRateItem
        v-for="currency in otherCurrencies"
        :key="currency"
        :baseCurrency="currentCurrency"
        :targetCurrency="currency"
      />
    </div>
  </div>
</template>