<script setup lang="ts">
import { onMounted } from 'vue';
import { useConfigStore } from '../../stores/config.store';
import ConfigForm from './components/ConfigForm.vue';
import DbInitPanel from './components/DbInitPanel.vue';

const configStore = useConfigStore();

onMounted(() => {
  configStore.fetchConfig();
  configStore.fetchInitStatus();
});
</script>

<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Exam Configuration Dashboard</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Configure and initialize global exam settings</p>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-alert v-if="configStore.error" type="error" closable class="mb-6">
      {{ configStore.error }}
    </v-alert>

    <v-row>
      <v-col cols="12" md="4">
        <DbInitPanel />
      </v-col>
      <v-col cols="12" md="8">
        <v-card :loading="configStore.loading" class="pa-0 rounded-lg" elevation="2">
          <ConfigForm v-if="configStore.config" :initial-data="configStore.config" :disabled="configStore.isInitialized" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
