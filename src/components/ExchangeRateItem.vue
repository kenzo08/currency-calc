<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCurrencyStore } from '../stores/currency'
import { storeToRefs } from 'pinia'
import type { CurrencyCode } from '../types/currency.ts'

const props = defineProps<{
  baseCurrency: CurrencyCode
  targetCurrency: CurrencyCode
}>()

const currencyStore = useCurrencyStore()
const { state } = storeToRefs(currencyStore)

const current = ref(props.baseCurrency)
const target = ref(props.targetCurrency)

const rate = computed(() => {
  const rateKey = `${current.value.toLowerCase()}-${target.value.toLowerCase()}`
  const rate = state.value.rates[rateKey]
  return rate ? rate.toString() : '0'
})

const swapWith = () => {
  ;[current.value, target.value] = [target.value, current.value]
}

watch(
  () => [props.baseCurrency, props.targetCurrency],
  ([newBase, newTarget]) => {
    current.value = newBase
    target.value = newTarget
  }
)
</script>

<template>
  <div class="p-4 bg-white rounded shadow flex items-center justify-between">
    <p class="text-xl">
      1 {{ current }}
      <button @click="swapWith" class="mx-2 text-xl hover:rotate-180 transition">↔️</button>
      {{ target }} = {{ rate }}
    </p>
  </div>
</template>
