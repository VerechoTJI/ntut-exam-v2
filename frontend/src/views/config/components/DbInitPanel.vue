<script setup lang="ts">
import { useConfigStore } from '../../../stores/config.store';

const configStore = useConfigStore();

const handleInit = async () => {
  if (confirm('Are you sure you want to initialize the database?')) {
    await configStore.initializeDatabase();
  }
};

const handleReset = async () => {
  if (confirm('Are you sure you want to RESET the database? This will clear all test cases and submissions!')) {
    await configStore.resetDatabase();
  }
};
</script>

<template>
  <v-card class="rounded-lg" elevation="2">
    <v-card-item>
      <v-card-title>Database Initialization</v-card-title>
      <v-card-subtitle>Initialize or reset backend database tables</v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <div v-if="configStore.isInitialized">
        <v-alert type="success" variant="tonal" class="mb-4" density="compact">
          Database Initialized. Core configuration is now locked.
        </v-alert>
        <v-btn color="error" block @click="handleReset" :loading="configStore.loading">
          Reset Database
        </v-btn>
      </div>
      <div v-else>
        <v-alert type="info" variant="tonal" class="mb-4" density="compact">
          Waiting for initialization
        </v-alert>
        <v-btn color="primary" block @click="handleInit" :loading="configStore.loading">
          Initialize Database
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
