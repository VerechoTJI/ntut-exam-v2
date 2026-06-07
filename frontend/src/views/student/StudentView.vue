<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useStudentStore } from '../../stores/student.store';
import StudentList from './components/StudentList.vue';
import StudentDetails from './components/StudentDetails.vue';

const studentStore = useStudentStore();
const selectedStudent = ref<any | null>(null);

onMounted(async () => {
  await studentStore.fetchStudents();
});

const handleSelectStudent = (student: any) => {
  selectedStudent.value = student;
};

// Check if any student is online to show general stats
const onlineCount = computed(() => studentStore.students.filter(s => s.isOnline).length);
</script>

<template>
  <v-container fluid class="pa-6 h-100 d-flex flex-column">
    <v-row class="mb-2 align-center justify-space-between flex-grow-0">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Student Management (學生管理)</h1>
        <p class="text-subtitle-1 text-medium-emphasis">管理學生上線狀態、裝置綁定與檢視提交程式碼</p>
      </v-col>
      <v-col cols="auto" class="d-flex align-center gap-4">
        <v-chip color="success" variant="tonal" class="font-weight-bold" size="large">
          <v-icon start>mdi-account-multiple</v-icon>
          目前上線: {{ onlineCount }} / {{ studentStore.students.length }}
        </v-chip>
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="studentStore.fetchStudents"
          :loading="studentStore.loading"
        >
          重新整理
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="studentStore.error" type="error" closable class="mb-4 flex-grow-0">
      {{ studentStore.error }}
    </v-alert>

    <v-row class="flex-grow-1 min-h-0">
      <!-- Left Pane: Student List -->
      <v-col cols="12" md="4" lg="3" class="h-100">
        <StudentList 
          :students="studentStore.students" 
          :selected-student="selectedStudent"
          @select="handleSelectStudent"
        />
      </v-col>

      <!-- Right Pane: Student Details & Code -->
      <v-col cols="12" md="8" lg="9" class="h-100">
        <StudentDetails 
          :student="selectedStudent" 
          @refresh-list="studentStore.fetchStudents"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.h-100 {
  height: 100%;
}
.min-h-0 {
  min-height: 0;
}
.gap-4 {
  gap: 16px;
}
</style>
