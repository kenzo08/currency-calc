<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCurrencyStore } from '../stores/currency';
import {storeToRefs} from 'pinia';
import {CurrencyCode} from '../types/currency.ts';

const currencyStore = useCurrencyStore();
const { fetchRates, convert } = currencyStore
const { state } = storeToRefs(currencyStore)

const currencies: CurrencyCode[] = ['USD', 'EUR', 'RUB'];

const exchangeRates = computed(() => {
  const rates = [];
  for (const currency of currencies) {
    if (currency !== state.value.baseCurrency) {
      const rate = convert(1, state.value.baseCurrency, currency);
      rates.push({
        currency,
        rate: rate.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      });
    }
  }
  return rates;
});

const swapWith = (currency: CurrencyCode) => {
  if (currency !== state.value.baseCurrency) {
    state.value.baseCurrency = currency;
  }
};



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
      <div v-for="{ currency, rate } in exchangeRates" :key="currency"
           class="p-4 bg-white rounded shadow flex items-center justify-between">
        <p class="text-xl">
          1 {{ state.baseCurrency }}
          <button @click="swapWith(currency)" class="mx-2 text-xl hover:rotate-180 transition">
            ↔️
          </button>
          {{ currency }} = {{ rate }}
        </p>
      </div>
    </div>
  </div>
</template>