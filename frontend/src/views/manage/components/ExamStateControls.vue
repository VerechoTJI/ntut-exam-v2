<script setup lang="ts">
import { useManageStore } from '../../../stores/manage.store';

const manageStore = useManageStore();

const states = [
  { value: 'UNINITIALIZED', label: '未初始化 (Uninitialized)', color: 'grey', icon: 'mdi-database-off' },
  { value: 'NOT_STARTED', label: '未開始 (Not Started)', color: 'info', icon: 'mdi-clock-outline' },
  { value: 'IN_PROGRESS', label: '考試中 (In Progress)', color: 'success', icon: 'mdi-play-circle' },
  { value: 'FINISHED', label: '考試結束 (Finished)', color: 'error', icon: 'mdi-stop-circle' },
];

const setState = async (state: string) => {
  if (confirm(`Are you sure you want to change the exam state to ${state}?`)) {
    await manageStore.setExamState(state);
  }
};
</script>
<template>
  <v-card class="mb-4" elevation="2" border>
    <v-card-title class="text-h6 font-weight-bold px-6 pt-6">
      <v-icon start color="primary">mdi-state-machine</v-icon>
      Exam State Control
    </v-card-title>
    <v-card-text class="px-6 pb-6">
      <div class="d-flex align-center mb-6 mt-2">
        <span class="text-subtitle-1 font-weight-medium mr-4">Current State:</span>
        <v-chip
          :color="states.find(s => s.value === manageStore.examState)?.color || 'grey'"
          size="large"
          class="font-weight-bold px-4"
          variant="flat"
        >
          <v-icon start>{{ states.find(s => s.value === manageStore.examState)?.icon || 'mdi-help-circle' }}</v-icon>
          {{ states.find(s => s.value === manageStore.examState)?.label || manageStore.examState }}
        </v-chip>
      </div>

      <v-divider class="mb-6"></v-divider>

      <v-row>
        <v-col v-for="state in states" :key="state.value" cols="12" sm="6" md="3">
          <v-btn
            block
            size="x-large"
            :color="state.color"
            :variant="manageStore.examState === state.value ? 'flat' : 'outlined'"
            @click="setState(state.value)"
            :disabled="manageStore.loading"
            class="text-body-1 font-weight-bold"
          >
            <v-icon start>{{ state.icon }}</v-icon>
            {{ state.label.split(' ')[0] }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
