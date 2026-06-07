<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  alerts: any[];
}>();

const totalAlerts = computed(() => props.alerts.length);
const unresolvedAlerts = computed(() => props.alerts.filter((a) => !a.isOk).length);

const topViolator = computed(() => {
  if (props.alerts.length === 0) return { studentID: '無', count: 0 };
  const counts: Record<string, number> = {};
  props.alerts.forEach((a) => {
    if (a.testId) {
      counts[a.testId] = (counts[a.testId] || 0) + 1;
    }
  });
  let maxStudent = '無';
  let maxCount = 0;
  for (const studentID in counts) {
    if (counts[studentID] > maxCount) {
      maxCount = counts[studentID];
      maxStudent = studentID;
    }
  }
  return { studentID: maxStudent, count: maxCount };
});
</script>

<template>
  <v-row class="mb-6">
    <!-- Total Alerts Card -->
    <v-col cols="12" sm="4">
      <v-card
        class="mx-auto rounded-lg text-white elevation-3 gradient-total"
        border
      >
        <v-card-text class="d-flex justify-space-between align-center py-5">
          <div>
            <div class="text-subtitle-2 font-weight-medium text-uppercase tracking-wider opacity-80">
              異常警告總數
            </div>
            <div class="text-h3 font-weight-black mt-1">
              {{ totalAlerts }}
            </div>
          </div>
          <v-avatar size="56" color="rgba(255, 255, 255, 0.15)">
            <v-icon size="32" icon="mdi-shield-alert-outline"></v-icon>
          </v-avatar>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Unresolved Alerts Card -->
    <v-col cols="12" sm="4">
      <v-card
        class="mx-auto rounded-lg text-white elevation-3 gradient-unresolved"
        border
      >
        <v-card-text class="d-flex justify-space-between align-center py-5">
          <div>
            <div class="text-subtitle-2 font-weight-medium text-uppercase tracking-wider opacity-80">
              未處理異常
            </div>
            <div class="text-h3 font-weight-black mt-1">
              {{ unresolvedAlerts }}
            </div>
          </div>
          <v-avatar size="56" color="rgba(255, 255, 255, 0.15)">
            <v-icon size="32" icon="mdi-alert-decagram-outline"></v-icon>
          </v-avatar>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Top Infraction Student Card -->
    <v-col cols="12" sm="4">
      <v-card
        class="mx-auto rounded-lg text-white elevation-3 gradient-violator"
        border
      >
        <v-card-text class="d-flex justify-space-between align-center py-5">
          <div>
            <div class="text-subtitle-2 font-weight-medium text-uppercase tracking-wider opacity-80">
              異常最多學生
            </div>
            <div class="text-h4 font-weight-black mt-1 text-truncate" style="max-width: 180px;">
              {{ topViolator.studentID }}
            </div>
            <div class="text-caption mt-1 opacity-90">
              共計 {{ topViolator.count }} 次記錄
            </div>
          </div>
          <v-avatar size="56" color="rgba(255, 255, 255, 0.15)">
            <v-icon size="32" icon="mdi-account-alert-outline"></v-icon>
          </v-avatar>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.tracking-wider {
  letter-spacing: 0.05em;
}
.opacity-80 {
  opacity: 0.8;
}
.opacity-90 {
  opacity: 0.9;
}
.gradient-total {
  background: linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%);
}
.gradient-unresolved {
  background: linear-gradient(135deg, #e65c00 0%, #f9d423 100%);
}
.gradient-violator {
  background: linear-gradient(135deg, #d31027 0%, #ea384d 100%);
}
</style>
