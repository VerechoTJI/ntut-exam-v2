<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  scoreRecord: any;
  examConfig: any;
}>();

const emit = defineEmits(['update:modelValue']);

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

// We flatten the config and matching puzzleResults into a list of "Testcase details"
const testcaseDetails = computed(() => {
  if (!props.scoreRecord || !props.examConfig) return [];
  
  const details: any[] = [];
  const puzzleResults = props.scoreRecord.puzzleResults || {};

  props.examConfig.sections?.forEach((section: any) => {
    section.puzzles?.forEach((puzzle: any) => {
      const pResult = puzzleResults[puzzle.id] || {};
      const subtaskResults = pResult.subtasks || [];
      
      puzzle.subtasks?.forEach((subtask: any, stIndex: number) => {
        const stRes = subtaskResults[stIndex] || { visible: [], hidden: [] };
        
        // visible testcases
        subtask.visible?.forEach((tc: any, tcIndex: number) => {
          const res = stRes.visible ? stRes.visible[tcIndex] : {};
          if (res) {
            details.push({
              puzzleTitle: puzzle.title,
              subtaskTitle: subtask.title,
              type: 'Visible',
              input: tc.input,
              expectedOutput: tc.output,
              actualOutput: res.stdout || res.stderr || res.error || '',
              status: res.status || 'N/A',
              time: res.time || 0,
              memory: res.memory || 0
            });
          }
        });
        
        // hidden testcases
        subtask.hidden?.forEach((tc: any, tcIndex: number) => {
          const res = stRes.hidden ? stRes.hidden[tcIndex] : {};
          if (res) {
            details.push({
              puzzleTitle: puzzle.title,
              subtaskTitle: subtask.title,
              type: 'Hidden',
              input: tc.input,
              expectedOutput: tc.output,
              actualOutput: res.stdout || res.stderr || res.error || '',
              status: res.status || 'N/A',
              time: res.time || 0,
              memory: res.memory || 0
            });
          }
        });
      });
    });
  });

  return details;
});

const statusColor = (status: string) => {
  if (status === 'AC') return 'success';
  if (status === 'WA') return 'error';
  if (status === 'TLE' || status === 'MLE') return 'warning';
  return 'grey';
};
</script>

<template>
  <v-dialog v-model="show" max-width="1200px" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between bg-primary text-white">
        <span>Submission Details: {{ scoreRecord?.user?.name }} ({{ scoreRecord?.user?.testId }})</span>
        <v-btn icon="mdi-close" variant="text" @click="show = false"></v-btn>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text class="pa-0 bg-grey-lighten-4">
        <v-table hover fixed-header height="600px">
          <thead>
            <tr>
              <th class="font-weight-bold">Puzzle</th>
              <th class="font-weight-bold">Subtask</th>
              <th class="font-weight-bold">Type</th>
              <th class="font-weight-bold">Status</th>
              <th class="font-weight-bold" style="width: 25%">Input</th>
              <th class="font-weight-bold" style="width: 25%">Expected Output</th>
              <th class="font-weight-bold" style="width: 25%">Actual Output</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, i) in testcaseDetails" :key="i">
              <td>{{ detail.puzzleTitle }}</td>
              <td>{{ detail.subtaskTitle }}</td>
              <td>
                <v-chip size="x-small" :color="detail.type === 'Visible' ? 'info' : 'grey'">
                  {{ detail.type }}
                </v-chip>
              </td>
              <td>
                <v-chip size="small" :color="statusColor(detail.status)" variant="flat" class="font-weight-bold">
                  {{ detail.status }}
                </v-chip>
                <div class="text-caption mt-1 text-grey-darken-1">{{ detail.time }}s / {{ (detail.memory / 1024 / 1024).toFixed(1) }}MB</div>
              </td>
              <td><pre class="bg-grey-lighten-3 pa-2 rounded text-caption" style="white-space: pre-wrap;">{{ detail.input }}</pre></td>
              <td><pre class="bg-grey-lighten-3 pa-2 rounded text-caption" style="white-space: pre-wrap;">{{ detail.expectedOutput }}</pre></td>
              <td><pre class="bg-grey-lighten-3 pa-2 rounded text-caption" style="white-space: pre-wrap;" :class="{'text-error': detail.status !== 'AC'}">{{ detail.actualOutput }}</pre></td>
            </tr>
          </tbody>
        </v-table>
        <div v-if="!testcaseDetails.length" class="pa-8 text-center text-medium-emphasis">
          No testcase details found for this user.
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
pre {
  max-height: 150px;
  overflow-y: auto;
}
</style>
