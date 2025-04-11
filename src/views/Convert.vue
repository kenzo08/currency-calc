<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useCurrencyStore } from '../stores/currency';
import {storeToRefs} from 'pinia';

const currencyStore = useCurrencyStore();
const { fetchRates, convert } = currencyStore
const { loading, error } = storeToRefs(currencyStore)


const currencies = ['USD', 'EUR', 'RUB'];

const amount1 = ref('');
const amount2 = ref('');
const currency1 = ref('USD');
const currency2 = ref('EUR');
const inputError = ref('')

onMounted(() => {
  fetchRates();
});

const validateInput = (value: string): boolean => {
  if (value === '') return true;
  const numValue = Number(value.replace(/,/g, ''));
  return !isNaN(numValue) && numValue >= 0;
};

const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const parseNumber = (value: string): number => {
  return Number(value.replace(/,/g, '')) || 0;
};

const updateAmount2 = () => {
  if (!validateInput(amount1.value)) {
    inputError.value = 'Please enter a valid number';
    amount2.value = '';
    return;
  }
  inputError.value = '';

  if (amount1.value === '') {
    amount2.value = '';
    return;
  }

  const result = convert(parseNumber(amount1.value), currency1.value, currency2.value);
  amount2.value = formatNumber(result);
};

const updateAmount1 = () => {
  if (!validateInput(amount2.value)) {
    inputError.value = 'Please enter a valid number';
    amount1.value = '';
    return;
  }
  inputError.value = '';

  if (amount2.value === '') {
    amount1.value = '';
    return;
  }

  const result = convert(
    parseNumber(amount2.value),
    currency2.value,
    currency1.value
  );
  amount1.value = formatNumber(result);
};

watch([currency1, currency2], () => {
  if (amount1.value) {
    updateAmount2();
  } else if (amount2.value) {
    updateAmount1();
  }
});
</script>

<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Currency Converter</h1>
    
    <div v-if="loading" class="text-center">
      Loading rates...
    </div>
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>
    
    <div v-else class="max-w-md mx-auto">
      <div class="space-y-6">
        <div class="bg-white p-4 rounded shadow">
          <div class="flex space-x-4">
            <input
              type="text"
              v-model="amount1"
              @input="updateAmount2"
              placeholder="Enter amount"
              class="flex-1 p-2 border rounded"
            />
            <select
              v-model="currency1"
              class="p-2 border rounded"
            >
              <option v-for="currency in currencies" :key="currency" :value="currency">
                {{ currency }}
              </option>
            </select>
          </div>
        </div>

        <div class="bg-white p-4 rounded shadow">
          <div class="flex space-x-4">
            <input
              type="text"
              v-model="amount2"
              @input="updateAmount1"
              placeholder="Enter amount"
              class="flex-1 p-2 border rounded"
            />
            <select
              v-model="currency2"
              class="p-2 border rounded"
            >
              <option v-for="currency in currencies" :key="currency" :value="currency">
                {{ currency }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="inputError" class="text-red-500 text-center">
          {{ inputError }}
        </div>
      </div>
    </div>
  </div>
</template>