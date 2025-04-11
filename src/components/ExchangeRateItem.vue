<script setup lang="ts">
import { computed } from 'vue';
import { useCurrencyStore } from '../stores/currency';
import { storeToRefs } from 'pinia';
import type { CurrencyCode } from '../types/currency.ts';

const props = defineProps<{
  baseCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
}>();

const emit = defineEmits<{
  (e: 'swap', currency: CurrencyCode): void;
}>();

const currencyStore = useCurrencyStore();
const { state } = storeToRefs(currencyStore);

const rate = computed(() => {
  const rateKey = `${props.baseCurrency.toLowerCase()}-${props.targetCurrency.toLowerCase()}`;
  const rate = state.value.rates[rateKey];
  return rate ? rate.toString() : '0';
});

const swapWith = () => {
  emit('swap', props.targetCurrency);
};
</script>

<template>
  <div class="p-4 bg-white rounded shadow flex items-center justify-between">
    <p class="text-xl">
      1 {{ baseCurrency }}
      <button @click="swapWith" class="mx-2 text-xl hover:rotate-180 transition">
        ↔️
      </button>
      {{ targetCurrency }} = {{ rate }}
    </p>
  </div>
</template> 