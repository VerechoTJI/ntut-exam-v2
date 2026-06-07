<script setup lang="ts">
import { computed } from 'vue';
import type { SpecialRule } from '../../../types/config';

const props = defineProps<{ modelValue?: SpecialRule[], disabled?: boolean }>();
const emit = defineEmits(['update:modelValue']);

const rules = computed({
  get: () => props.modelValue || [],
  set: (val) => emit('update:modelValue', val)
});

const addRule = () => {
  const newRules = [...rules.value];
  newRules.push({
    id: `rule-${Date.now()}`,
    type: 'regex',
    constraint: 'MUST_HAVE',
    message: '',
    severity: 'warn',
    multiplier: 1,
    params: {}
  });
  emit('update:modelValue', newRules);
};

const removeRule = (index: number) => {
  const newRules = [...rules.value];
  newRules.splice(index, 1);
  emit('update:modelValue', newRules);
};
</script>

<template>
  <div>
    <v-btn v-if="!props.disabled" size="small" color="primary" variant="tonal" prepend-icon="mdi-plus" @click="addRule" class="mb-2">
      Add Rule
    </v-btn>
    
    <v-card v-for="(rule, index) in rules" :key="index" variant="outlined" class="pa-2 mb-2">
      <div class="d-flex justify-space-between align-center mb-2">
        <span class="text-caption font-weight-bold">Rule: {{ rule.id }}</span>
        <v-btn v-if="!props.disabled" size="x-small" icon="mdi-delete" color="error" variant="text" @click="removeRule(index)"></v-btn>
      </div>
      <v-row dense>
        <v-col cols="4">
          <v-select v-model="rule.type" :items="['regex', 'use', 'composite', 'nestedLoop']" label="Type" density="compact" hide-details :disabled="props.disabled"></v-select>
        </v-col>
        <v-col cols="4">
          <v-select v-model="rule.constraint" :items="['MUST_HAVE', 'MUST_NOT_HAVE']" label="Constraint" density="compact" hide-details :disabled="props.disabled"></v-select>
        </v-col>
        <v-col cols="4">
          <v-select v-model="rule.severity" :items="['info', 'warn']" label="Severity" density="compact" hide-details :disabled="props.disabled"></v-select>
        </v-col>
        <v-col cols="9">
          <v-text-field v-model="rule.message" label="Warning Message" density="compact" hide-details :readonly="props.disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model.number="rule.multiplier" type="number" step="0.1" min="0" max="1" label="Multiplier" density="compact" hide-details :readonly="props.disabled"></v-text-field>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
