<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDeviceStore } from '../../stores/device.store';
import DeviceGrid from './components/DeviceGrid.vue';

const deviceStore = useDeviceStore();
const itemsPerRow = ref(4);

onMounted(() => {
  deviceStore.fetchDevices();
});

function refreshDevices() {
  deviceStore.fetchDevices();
}
</script>

<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-4 align-center">
      <v-col cols="12" sm="6">
        <h1 class="text-h4 font-weight-bold">Device Connection Status</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Monitor lab PC active connections and bindings</p>
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
            :max="8"
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
          :loading="deviceStore.loading"
          @click="refreshDevices"
          class="rounded-lg"
        >
          Refresh
        </v-btn>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-alert
      v-if="deviceStore.error"
      type="error"
      title="Error Loading Devices"
      class="mb-6 rounded-lg"
      closable
    >
      {{ deviceStore.error }}
    </v-alert>

    <!-- Loading Skeleton Grid -->
    <div v-if="deviceStore.loading && !deviceStore.devices.length" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <div class="text-subtitle-1 text-medium-emphasis mt-4">Scanning lab network status...</div>
    </div>

    <!-- Empty State -->
    <v-card 
      v-else-if="!deviceStore.devices.length" 
      class="text-center py-12 border-dashed rounded-xl"
      variant="flat"
    >
      <v-card-text>
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-monitor-off</v-icon>
        <div class="text-h6 text-grey-darken-1 font-weight-bold">No Devices Found</div>
        <div class="text-subtitle-2 text-grey-darken-1 mt-1">Please ensure the database is initialized with student accounts.</div>
      </v-card-text>
    </v-card>

    <!-- Devices Grid -->
    <DeviceGrid
      v-else
      :devices="deviceStore.devices"
      :items-row="itemsPerRow"
      :items-per-row="itemsPerRow"
    />
  </v-container>
</template>

<style scoped>
.max-width-slider {
  max-width: 200px;
}
.border-dashed {
  border: 2px dashed rgba(0, 0, 0, 0.1) !important;
}
</style>
