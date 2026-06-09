<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useConnectionStore } from '../../stores/connection.store';
import DeviceGrid from './components/DeviceGrid.vue';

const connectionStore = useConnectionStore();
const itemsPerRow = ref(4);

onMounted(() => {
  connectionStore.fetchDevices();
});

function refreshDevices() {
  connectionStore.fetchDevices();
}

const formattedDevices = computed(() => {
  return connectionStore.devices.map(d => ({
    id: d.user?.testId || '',
    name: d.user?.name || '',
    ipAddress: d.ipAddress,
    deviceUuid: d.deviceUuid,
    isOnline: d.isOnline
  }));
});
</script>

<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-4 align-center">
      <v-col cols="12" sm="6">
        <h1 class="text-h4 font-weight-bold">Device Monitor</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Live view of student IP and device bindings</p>
      </v-col>
      
      <v-col cols="12" sm="6" class="d-flex justify-sm-end align-center">
        <!-- Slider to control column count -->
        <div class="mr-6 flex-grow-1 max-width-slider">
          <div class="text-caption text-medium-emphasis mb-1 font-weight-bold">
            Devices Per Row: {{ itemsPerRow }}
          </div>
          <v-slider
            v-model="itemsPerRow"
            :min="2"
            :max="20"
            :step="1"
            thumb-label
            hide-details
            density="compact"
            color="primary"
          ></v-slider>
        </div>

        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-refresh"
          :loading="connectionStore.loading"
          @click="refreshDevices"
          class="rounded-lg"
        >
          Refresh
        </v-btn>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-alert
      v-if="connectionStore.error"
      type="error"
      title="Error Loading Devices"
      class="mb-6 rounded-lg"
      closable
      @click:close="connectionStore.error = null"
    >
      {{ connectionStore.error }}
    </v-alert>

    <!-- Loading Skeleton Grid -->
    <div v-if="connectionStore.loading && !connectionStore.devices.length" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <div class="text-subtitle-1 text-medium-emphasis mt-4">Scanning lab network status...</div>
    </div>

    <!-- Empty State -->
    <v-card 
      v-else-if="!connectionStore.devices.length" 
      class="text-center py-12 border-dashed rounded-xl"
      variant="flat"
    >
      <v-card-text>
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-monitor-off</v-icon>
        <div class="text-h6 text-grey-darken-1 font-weight-bold">No Devices Found</div>
      </v-card-text>
    </v-card>

    <!-- Devices Grid -->
    <DeviceGrid
      v-else
      :devices="formattedDevices"
      :items-per-row="itemsPerRow"
    />
  </v-container>
</template>

<style scoped>
.max-width-slider {
  max-width: 300px;
}
.border-dashed {
  border: 2px dashed rgba(0, 0, 0, 0.1) !important;
}
</style>
