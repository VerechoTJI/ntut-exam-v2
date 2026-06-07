# Frontend Architecture & Development Guidelines

This document outlines the file structure, coding standards, state management practices, page specifications, and architectural rules for the frontend admin interface located in `host/frontend`.

---

## Directory Structure Overview

To keep the application modular, maintainable, and highly componentized, the project must adhere to the following directory layout:

```text
host/frontend/src/
├── main.ts              # Entry point: initializes Vue application, Router, Pinia, and Vuetify
├── App.vue              # Main application shell (includes navigation drawer, status bar, and router view)
├── assets/              # Static assets (images, global css, styling variables)
├── plugins/             # Initialization wrappers for third-party libraries
│   ├── vuetify.ts       # Vuetify UI component definition and theme setup
│   └── socket.ts        # Socket.io client configuration and initialization
├── router/              # Vue Router definition
│   └── index.ts         # Routes mapping paths to views
├── stores/              # Pinia Stores (*.store.ts) managing application state and Axios requests
│   ├── auth.store.ts
│   ├── config.store.ts
│   ├── score.store.ts
│   ├── student.store.ts
│   ├── anticheat.store.ts
│   ├── log.store.ts
│   ├── device.store.ts
│   └── manage.store.ts
├── types/               # TypeScript interfaces matching backend models and API request/response structures
│   └── index.ts
├── views/               # Page view components (corresponds directly to routes)
│   ├── config/          # /config page view and sub-components
│   ├── score/           # /score page view and sub-components
│   ├── student/         # /student page view and sub-components
│   ├── anticheat/       # /anticheat page view and sub-components
│   ├── log/             # /log page view and sub-components
│   ├── device/          # /device page view and sub-components
│   └── manage/          # /manage page view and sub-components
└── components/          # Shared global UI components (e.g., CommonConfirmDialog, StatusBadge)
```

---

## Core Stack & Libraries

* **Framework**: [Vue 3](https://vuejs.org/) utilizing **Composition API** (strictly using `<script setup lang="ts">`)
* **UI Framework**: [Vuetify 3](https://vuetifyjs.com/) for rich, premium, and fully responsive elements
* **State Management**: [Pinia](https://pinia.vuejs.org/) for managing reactive states and network requests
* **HTTP Client**: [Axios](https://axios-http.com/) for handling REST API requests with the backend
* **Routing**: [Vue Router 4](https://router.vuejs.org/) for navigation management
* **Real-time**: [socket.io-client](https://socket.io/docs/v4/client-api/) for real-time status syncing and chat broadcasts

---

## Architectural Rules & Standards

### 1. File Naming Conventions
* **Vue Views & Components**: Use PascalCase (e.g., `ConfigView.vue`, `ConfigForm.vue`, `ConfirmDialog.vue`).
* **Stores**: Use kebab-case with `.store.ts` suffix (e.g., `exam-config.store.ts`, `anticheat.store.ts`).
* **Routes & Configs**: Use kebab-case (e.g., `index.ts`, `vuetify.ts`).
* **TypeScript Types**: Declare inside `src/types/` folder and name according to domains.

### 2. Strict Page Componentization & Line Limits
To prevent huge, unmanageable view components:
* **View Line Limit**: Files inside `src/views/` (such as `ConfigView.vue`) **MUST NOT exceed 150 lines** of code.
* **Extraction of Sub-elements**: Any complex page layout, such as forms, large tables, dialogs, cards, or custom grids, must be extracted into separate component files.
* **Component Placement**:
  * If a component is reused across multiple views, place it in `src/components/`.
  * If a component is specific to only one view, place it in a sub-folder of that view (e.g., `src/views/config/components/ConfigForm.vue`).

### 3. Pinia Store Centric API Layer
To maintain clean separation of concerns and avoid network request code polluting the UI:
* **NO direct Axios calls in Vue Components**: Components are forbidden from importing Axios directly and initiating requests.
* **API Delegation**: All HTTP requests must be encapsulated inside Pinia actions.
* **Reactive Fetch State**: Pinia stores should expose reactive states for:
  * `loading` (boolean) to drive UI spinners/skeletons.
  * `error` (string or object) to hold API failures.
  * `data` (reactive variables) storing the current data structures.
* Components should read from the store's state and invoke actions to fetch or mutate data.

### 4. Socket.io Integration
* Sockets must be initialized once globally (e.g., in a plugin or in the parent `device.store.ts` / `manage.store.ts`).
* Event listeners should update the appropriate Pinia stores directly so that views automatically react to incoming events.

---

## Page Router Specifications & Components

The admin frontend must implement the following 7 pages:

### 1. `/config` (Exam Configuration)
* **Goal**: Provide a graphical user interface to create, read, update, download/upload, and apply the exam configuration payload (`exam-config.json`), as well as initializing or resetting the database.
* **Routes**: `/config`
* **Backend Endpoint Mappings**:
  * `GET /api/admin/config` - Fetch global exam configuration
  * `POST /api/admin/config` - Create/overwrite global configuration
  * `PUT /api/admin/config` - Update global configuration fields
  * `POST /api/admin/init` - Initialize database structure
  * `POST /api/admin/init/reset` - Reset/clear the database
  * `GET /api/admin/init/init-status` - Check current initialization status of backend
* **Component Layout**:
  * `ConfigView.vue` (Coordinator view: `< 100 lines`)
  * `components/ConfigForm.vue` - Graphical form input editor for exam title, time, problems, and limits.
  * `components/JsonConfigEditor.vue` - Raw JSON editor area for power users, syncing bidirectionally.
  * `components/DbInitPanel.vue` - Card panel hosting buttons to trigger backend Database Init, Reset, and current DB connection status.

### 2. `/score` (Student Scores Overview)
* **Goal**: Table interface listing all students, their submitted problem statuses, individual scores, total scores, and final grading statuses.
* **Routes**: `/score`
* **Backend Endpoint Mappings**:
  * `GET /api/admin/submissions` - Fetch student submissions and score aggregations
  * `POST /api/admin/judger/rejudge` - Trigger a rejudge operation for student submissions
* **Component Layout**:
  * `ScoreView.vue` (Coordinator view)
  * `components/ScoreTable.vue` - Data table containing student name/ID, class, individual problem grades, compile errors, final score.
  * `components/SubmissionDetailDialog.vue` - Dialog popup displaying sub-problems code content, compile messages, and execution test cases details.

### 3. `/student` (Student & Binding Management)
* **Goal**: Displays students' network and device binding information, with actions to delete student keys and remove active device bindings.
* **Routes**: `/student`
* **Backend Endpoint Mappings**:
  * `GET /api/admin/users` (if any user directory endpoint exists)
  * `DELETE /api/admin/device/:deviceUuid` - Deletes decrypted keys associated with a device UUID
  * `PUT /api/admin/users/:testId/reset-device` - Resets binding between student identifier and their hardware device
* **Component Layout**:
  * `StudentView.vue` (Coordinator view)
  * `components/StudentTable.vue` - Data table listing student exam ID, name, current bound DeviceID/UUID, last login IP address.
  * `components/ResetBindingDialog.vue` - Confirmation dialog indicating the consequences of resetting bindings or deleting keys.

### 4. `/anticheat` (Anti-cheat Warnings Log)
* **Goal**: Real-time display of potential cheating events and warnings logged during the exam.
* **Routes**: `/anticheat`
* **Backend Endpoint Mappings**:
  * `GET /api/admin/anticheat` - Retrieves previous warnings log
  * Socket events: `cheat-warning` - Listens to realtime cheating incidents
* **Component Layout**:
  * `AnticheatView.vue` (Coordinator view)
  * `components/AnticheatAlertList.vue` - Scrolling list of alerts containing timestamp, Student ID, PC IP, and Cheat Warning Category (e.g. Window Focus Lost, Virtual Machine detected, Multiple active IPs, devtools opened).
  * `components/CheatSummaryStats.vue` - Summary cards displaying count of anomalies, highest infraction students, and alerts trend chart.

### 5. `/log` (System Log Viewer)
* **Goal**: Displays database, system, and request log entries in a paginated, filterable interface.
* **Routes**: `/log`
* **Backend Endpoint Mappings**:
  * `GET /api/admin/log` - Fetch server/student action log list (supports page, limit, level, search filters)
* **Component Layout**:
  * `LogView.vue` (Coordinator view)
  * `components/LogFilterBar.vue` - Controls to select log levels (info, warn, error), datetime range, and text search input.
  * `components/LogTable.vue` - High density paginated data table showing timestamp, log level, message body, stack trace (collapsible).

### 6. `/device` (Device Connection Status)
* **Goal**: Provides a grid or lab layout overview representing the active socket connection status of all laboratory PCs.
* **Routes**: `/device`
* **Backend Endpoint Mappings**:
  * Socket events: `device-sync` / `ping-status` - Keeps connection status, CPU/RAM usage, or active screen thumbs updated.
* **Component Layout**:
  * `DeviceView.vue` (Coordinator view)
  * `components/DeviceGrid.vue` - Visual layout representation where each box is a client terminal (color coded: green = connected, red = offline, orange = idle/unregistered).
  * `components/DeviceStatusCard.vue` - Popover/drawer details panel showing client hardware details, ping latency, and connected sockets details on selection.

### 7. `/manage` (Exam Control & Messaging)
* **Goal**: Controls global exam states (start/pause/stop) and sends emergency announcement messages to students.
* **Routes**: `/manage`
* **Backend Endpoint Mappings**:
  * `POST /api/admin/exam-state` - Set state parameters (e.g. `status: 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'FINISHED'`)
  * `POST /api/admin/messages` - Send broadcast messages to all connected student terminals
* **Component Layout**:
  * `ManageView.vue` (Coordinator view)
  * `components/ExamStateControls.vue` - Quick-action header/panel containing start/pause/resume/stop buttons with confirmation prompts and safety indicators.
  * `components/MessageBroadcastForm.vue` - Form to compose text alerts, choose severity (Info, Warning, Critical), and send them. Shows history of broadcasted messages.

---

## Code Templates & Implementation Examples

### 1. Pinia Store Template (`src/stores/config.store.ts`)
```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const useConfigStore = defineStore('config', () => {
  const config = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);

  async function fetchConfig() {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/config`);
      config.value = res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to load config';
    } finally {
      loading.value = false;
    }
  }

  async function saveConfig(newConfig: any) {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/config`, newConfig);
      config.value = res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to save config';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function initializeDatabase() {
    loading.value = true;
    error.value = null;
    try {
      await axios.post(`${BACKEND_URL}/api/admin/init`);
      isInitialized.value = true;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to initialize database';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    config,
    loading,
    error,
    isInitialized,
    fetchConfig,
    saveConfig,
    initializeDatabase
  };
});
```

### 2. View Coordinator Layout Template (`src/views/config/ConfigView.vue`)
```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useConfigStore } from '@/stores/config.store';
import ConfigForm from './components/ConfigForm.vue';
import DbInitPanel from './components/DbInitPanel.vue';

const configStore = useConfigStore();

onMounted(() => {
  configStore.fetchConfig();
});
</script>

<template>
  <v-container fluid class="pa-6">
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
      <!-- DB Status and Action Panel -->
      <v-col cols="12" md="4">
        <DbInitPanel />
      </v-col>

      <!-- Graphical Config Form -->
      <v-col cols="12" md="8">
        <v-card :loading="configStore.loading" border elevation="2" class="rounded-lg">
          <v-card-text>
            <ConfigForm :initial-data="configStore.config" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
```

### 3. Component Form Template (`src/views/config/components/ConfigForm.vue`)
```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useConfigStore } from '@/stores/config.store';

const props = defineProps<{
  initialData: any;
}>();

const configStore = useConfigStore();
const localForm = ref({
  examTitle: '',
  durationMinutes: 120,
  maxAttempts: 1
});

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    localForm.value = { ...localForm.value, ...newVal };
  }
}, { immediate: true, deep: true });

const submitForm = async () => {
  try {
    await configStore.saveConfig(localForm.value);
  } catch (e) {
    console.error('Failed to submit form:', e);
  }
};
</script>

<template>
  <v-form @submit.prevent="submitForm">
    <v-text-field
      v-model="localForm.examTitle"
      label="Exam Title"
      outlined
      dense
      class="mb-4"
    ></v-text-field>

    <v-text-field
      v-model.number="localForm.durationMinutes"
      label="Duration (Minutes)"
      type="number"
      outlined
      dense
      class="mb-4"
    ></v-text-field>

    <v-text-field
      v-model.number="localForm.maxAttempts"
      label="Max Attempts per Student"
      type="number"
      outlined
      dense
      class="mb-6"
    ></v-text-field>

    <v-btn
      type="submit"
      color="primary"
      block
      class="py-2"
      :loading="configStore.loading"
    >
      Apply Configurations
    </v-btn>
  </v-form>
</template>
```
