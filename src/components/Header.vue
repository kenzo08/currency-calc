<script setup lang="ts">
import { useCurrencyStore } from '../stores/currency';
import {storeToRefs} from 'pinia';
import {CurrencyCode} from '../types/currency.ts';

const currencyStore = useCurrencyStore();
const { setBaseCurrency } = currencyStore
const { state } = storeToRefs(currencyStore)
const currencies:CurrencyCode[] = ['USD', 'EUR', 'RUB'];

const handleBaseCurrencyChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  setBaseCurrency(target.value as CurrencyCode);
};
</script>

<template>
  <header class="bg-blue-600 text-blue-300  p-4">
    <div class="container mx-auto flex justify-between items-center">
      <nav class="space-x-4">
        <router-link active-class="text-white" to="/" class="hover:text-blue-200">Home</router-link>
        <router-link active-class="text-white" to="/convert" class="hover:text-blue-200">Convert</router-link>
      </nav>
      
      <div class="flex items-center space-x-2">
        <label>Base Currency:</label>
        <select
          v-model="state.baseCurrency"
          @change="handleBaseCurrencyChange"
          class="bg-blue-500 text-white border border-blue-400 rounded px-2 py-1"
        >
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>
    </div>
  </header>
</template>