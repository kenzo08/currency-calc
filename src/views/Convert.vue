<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCurrencyStore } from '../stores/currency'
import { storeToRefs } from 'pinia'
import type { CurrencyCode } from '../types/currency.ts'

const currencyStore = useCurrencyStore()
const { fetchRates, convert } = currencyStore
const { state } = storeToRefs(currencyStore)

const currencies: CurrencyCode[] = ['USD', 'EUR', 'RUB']

const amount1 = ref('')
const amount2 = ref('')
const currency1 = ref<CurrencyCode>('USD')
const currency2 = ref<CurrencyCode>('EUR')
const inputError = ref('')

const validateInput = (value: string): boolean => {
  if (value === '') return true
  const numValue = Number(value.replace(/,/g, ''))
  return !isNaN(numValue) && numValue >= 0
}

const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const parseNumber = (value: string): number => {
  return Number(value.replace(/,/g, '')) || 0
}

const updateAmount2 = () => {
  if (!validateInput(amount1.value)) {
    inputError.value = 'Please enter a valid number'
    amount2.value = ''
    return
  }
  inputError.value = ''

  if (amount1.value === '') {
    amount2.value = ''
    return
  }

  const result = convert(parseNumber(amount1.value), currency1.value, currency2.value)
  amount2.value = formatNumber(result)
}

const updateAmount1 = () => {
  if (!validateInput(amount2.value)) {
    inputError.value = 'Please enter a valid number'
    amount1.value = ''
    return
  }
  inputError.value = ''

  if (amount2.value === '') {
    amount1.value = ''
    return
  }

  const result = convert(parseNumber(amount2.value), currency2.value, currency1.value)
  amount1.value = formatNumber(result)
}

watch([currency1, currency2], () => {
  if (amount1.value) {
    updateAmount2()
  } else if (amount2.value) {
    updateAmount1()
  }
})

onMounted(() => {
  if (!Object.keys(state.value.rates).length) fetchRates()
})
</script>

<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Currency Converter</h1>

    <div v-if="state.loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4">Loading rates...</p>
    </div>

    <div v-else-if="state.error" class="text-red-500 text-center p-4 bg-red-100 rounded-lg">
      {{ state.error }}
    </div>

    <div v-else class="max-w-md mx-auto">
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <div class="flex flex-col space-y-4">
            <input
              type="text"
              v-model="amount1"
              @input="updateAmount2"
              placeholder="Enter amount"
              class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              v-model="currency1"
              class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="currency in currencies" :key="currency" :value="currency">
                {{ currency }}
              </option>
            </select>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <div class="flex flex-col space-y-4">
            <input
              type="text"
              v-model="amount2"
              @input="updateAmount1"
              placeholder="Enter amount"
              class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              v-model="currency2"
              class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="currency in currencies" :key="currency" :value="currency">
                {{ currency }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="inputError" class="text-red-500 text-center p-4 bg-red-100 rounded-lg">
          {{ inputError }}
        </div>
      </div>
    </div>
  </div>
</template>
