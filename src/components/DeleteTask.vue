<template>
  <v-dialog
    v-model="doShowDialog"
    persistent
    max-width="500"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        small
        text
        icon
        class="mx-2 mt-1"
        v-on="on"
      >
        <v-icon>
          mdi-delete-outline
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        Delete "{{ task.title }}"
      </v-card-title>
      <v-card-text>{{ task.description }}</v-card-text>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
          color="googs"
          text
          @click="doShowDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="googs"
          text
          @click="doDeleteTask"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'DeleteTask',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      doShowDialog: false
    };
  },
  methods: {
    doDeleteTask () {
      this.deleteTask(this.task._id)
        .then((data) => {
          this.doShowDialog = false;
          this.updateSnackbar({ title: `"${this.task.title}" deleted.`, doShow: true });
        });
    },
    ...mapActions(['deleteTask', 'updateSnackbar'])
  }
};
</script>
