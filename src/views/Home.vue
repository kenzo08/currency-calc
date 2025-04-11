<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCurrencyStore } from '../stores/currency';
import {storeToRefs} from 'pinia';

const currencyStore = useCurrencyStore();
const { fetchRates, convert } = currencyStore
const { baseCurrency, loading, error } = storeToRefs(currencyStore)

const currencies = ['USD', 'EUR', 'RUB'];

const exchangeRates = computed(() => {
  const rates = [];
  for (const currency of currencies) {
    if (currency !== baseCurrency.value) {
      const rate = convert(1, baseCurrency.value, currency);
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
  if (currency !== baseCurrency.value) {
    baseCurrency.value = currency;
  }
};



onMounted(() => {
  fetchRates();
});
</script>

<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Exchange Rates</h1>

    <div v-if="loading" class="text-center">
      Loading rates...
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <div v-for="{ currency, rate } in exchangeRates" :key="currency"
           class="p-4 bg-white rounded shadow flex items-center justify-between">
        <p class="text-xl">
          1 {{ baseCurrency }}
          <button @click="swapWith(currency)" class="mx-2 text-xl hover:rotate-180 transition">
            ↔️
          </button>
          {{ currency }} = {{ rate }}
        </p>
      </div>
    </div>
  </div>
</template>