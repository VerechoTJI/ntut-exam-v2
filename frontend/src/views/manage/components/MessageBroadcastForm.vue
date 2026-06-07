<script setup lang="ts">
import { ref } from 'vue';
import { useManageStore } from '../../../stores/manage.store';

const manageStore = useManageStore();
const messageText = ref('');

const sendMessage = async () => {
  if (!messageText.value.trim()) return;
  if (confirm('Are you sure you want to broadcast this message to all students?')) {
    await manageStore.broadcastMessage(messageText.value);
    if (!manageStore.error) {
      messageText.value = '';
      alert('Message broadcasted successfully!');
    }
  }
};
</script>

<template>
  <v-card elevation="2" border>
    <v-card-title class="text-h6 font-weight-bold px-6 pt-6">
      <v-icon start color="primary">mdi-broadcast</v-icon>
      Broadcast Message
    </v-card-title>
    <v-card-text class="px-6 pb-6">
      <p class="text-body-2 text-medium-emphasis mb-6 mt-2">
        Send an announcement or warning to all connected student terminals.
      </p>
      <v-textarea
        v-model="messageText"
        label="Message Content"
        placeholder="Type your message here..."
        rows="5"
        variant="outlined"
        color="primary"
        hide-details
        class="mb-6"
      ></v-textarea>
      <v-btn
        color="primary"
        size="x-large"
        block
        @click="sendMessage"
        :loading="manageStore.loading"
        :disabled="!messageText.trim()"
        class="font-weight-bold text-body-1"
      >
        <v-icon start>mdi-send</v-icon>
        Send to All
      </v-btn>
    </v-card-text>
  </v-card>
</template>
