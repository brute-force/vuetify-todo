<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      disable-icon-rotate
      :class="`title ${status}`"
    >
      {{ task.title }}
      <template v-slot:actions>
        <div class="mx-6">
          {{ dateDueFormatted }}
        </div>
        <v-icon v-if="status === 'completed'">
          mdi-calendar-check
        </v-icon>
        <v-icon v-if="status === 'overdue'">
          mdi-calendar-alert
        </v-icon>
        <v-icon v-if="status === 'ongoing'">
          mdi-calendar-clock
        </v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row>
        <div class="font-italic mt-3">
          {{ task.description }}
        </div>
        <v-spacer />
        <CreateOrUpdateTask
          :operation="'update'"
          :task="task"
        >
          <v-icon>
            mdi-pencil-outline
          </v-icon>
        </CreateOrUpdateTask>
        <DeleteTask :task="task" />
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import moment from 'moment';
import CreateOrUpdateTask from '@/components/CreateOrUpdateTask';
import DeleteTask from '@/components/DeleteTask';

export default {
  name: 'Task',
  components: {
    CreateOrUpdateTask,
    DeleteTask
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    status () {
      if (this.task.isCompleted) {
        return 'completed';
      } else {
        return moment().isBefore(moment(this.task.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) ? 'ongoing' : 'overdue';
      }
    },
    dateDueFormatted () {
      return moment(this.task.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('ddd, MMM Do YYYY');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.title.completed {
  border-left: 4px solid $completed;
}

.title.overdue {
  border-left: 4px solid $overdue;
}

.title.ongoing {
  border-left: 4px solid $ongoing;
}
</style>
