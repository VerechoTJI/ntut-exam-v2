<script setup lang="ts">
import { ref } from 'vue';
import { useStudentStore } from '../../../stores/student.store';
import CodeViewer from './CodeViewer.vue';

const props = defineProps<{
  student: any;
}>();

const studentStore = useStudentStore();
const loadingCode = ref(false);
const evaluating = ref(false);
const resetLoading = ref(false);
const submissions = ref<any[]>([]);
const evalResult = ref<any>(null);
const evalError = ref<string | null>(null);

const emit = defineEmits<{
  (e: 'refresh-list'): void;
}>();

// Fetch code when student changes
const fetchCode = async () => {
  if (!props.student || !props.student.id) return;
  loadingCode.value = true;
  evalResult.value = null;
  evalError.value = null;
  try {
    submissions.value = await studentStore.fetchStudentCode(props.student.id);
  } catch (err) {
    console.error(err);
  } finally {
    loadingCode.value = false;
  }
};

// Expose fetchCode so parent can trigger it, or just watch inside component
import { watch } from 'vue';
watch(() => props.student, (newVal, oldVal) => {
  if (newVal && newVal.id !== oldVal?.id) {
    fetchCode();
  }
}, { immediate: true });

const handleResetBinding = async () => {
  if (!confirm(`確定要清除學生 ${props.student.name} (${props.student.id}) 的裝置綁定嗎？`)) return;
  resetLoading.value = true;
  try {
    await studentStore.resetDeviceBinding(props.student.id);
    emit('refresh-list');
  } catch (err) {
    alert('重新綁定失敗');
  } finally {
    resetLoading.value = false;
  }
};

const handleReevaluate = async () => {
  if (!confirm(`確定要重新評測學生 ${props.student.name} (${props.student.id}) 的所有程式碼嗎？`)) return;
  evaluating.value = true;
  evalResult.value = null;
  evalError.value = null;
  try {
    const res = await studentStore.reevaluateStudentCode(props.student.id);
    evalResult.value = res;
    // Assuming score store needs to be updated too, but we are in student view
    // A success message is fine.
  } catch (err: any) {
    evalError.value = err.message || '評測失敗';
  } finally {
    evaluating.value = false;
  }
};
</script>

<template>
  <div v-if="!student" class="h-100 d-flex align-center justify-center bg-grey-lighten-4 rounded-lg border text-medium-emphasis">
    <div class="text-center">
      <v-icon size="64" class="mb-4 opacity-50">mdi-account-search</v-icon>
      <div class="text-h6">請從左側選擇一名學生</div>
    </div>
  </div>

  <div v-else class="h-100 d-flex flex-column">
    <!-- Student Header Info -->
    <v-card border elevation="1" class="mb-4">
      <v-card-text class="d-flex align-start flex-wrap gap-4">
        <v-avatar color="primary" size="80" variant="tonal" class="mr-4 mt-2">
          <span class="text-h4 font-weight-bold">{{ (student.name || '?').charAt(0).toUpperCase() }}</span>
        </v-avatar>
        
        <div class="flex-grow-1">
          <div class="d-flex align-center mb-1">
            <h2 class="text-h4 font-weight-bold mb-0 mr-4">{{ student.name || 'Unknown' }}</h2>
            <v-chip
              :color="student.isOnline ? 'success' : 'grey'"
              size="small"
              variant="flat"
              class="font-weight-bold"
            >
              {{ student.isOnline ? '上線中 (Online)' : '離線 (Offline)' }}
            </v-chip>
          </div>
          <div class="text-subtitle-1 text-medium-emphasis mb-4">學號: {{ student.id }}</div>
          
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-list-item class="px-0" density="compact">
                <template v-slot:prepend>
                  <v-icon color="info" size="small" class="mr-2">mdi-ip-network</v-icon>
                </template>
                <v-list-item-title class="text-body-2">IP 位址</v-list-item-title>
                <v-list-item-subtitle class="text-body-1 font-weight-medium">
                  {{ student.ipAddress || '尚未紀錄' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list-item class="px-0" density="compact">
                <template v-slot:prepend>
                  <v-icon color="deep-purple" size="small" class="mr-2">mdi-laptop</v-icon>
                </template>
                <v-list-item-title class="text-body-2">裝置 UUID</v-list-item-title>
                <v-list-item-subtitle class="text-body-1 font-weight-medium">
                  {{ student.deviceUuid || '尚未綁定' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-column gap-2 mt-2">
          <v-btn
            color="warning"
            prepend-icon="mdi-cellphone-link-off"
            :loading="resetLoading"
            @click="handleResetBinding"
            variant="flat"
            width="160"
          >
            重新綁定裝置
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-gavel"
            :loading="evaluating"
            @click="handleReevaluate"
            variant="flat"
            width="160"
          >
            重新評測程式碼
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Evaluation Result Alert -->
    <v-alert
      v-if="evalResult"
      type="success"
      variant="tonal"
      closable
      class="mb-4"
      @click:close="evalResult = null"
    >
      重新評測請求已送出並執行成功！(如果需要查看新分數，請至成績看板重新整理)
    </v-alert>
    
    <v-alert
      v-if="evalError"
      type="error"
      variant="tonal"
      closable
      class="mb-4"
      @click:close="evalError = null"
    >
      評測失敗: {{ evalError }}
    </v-alert>

    <!-- Code Viewer -->
    <CodeViewer :submissions="submissions" :loading="loadingCode" class="flex-grow-1" />
  </div>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
.gap-4 {
  gap: 16px;
}
</style>
