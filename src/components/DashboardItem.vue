<template>
  <v-card
    flat
  >
    <v-layout
      :class="`pa-5 task ${status}`"
      row
      wrap
      align-center
    >
      <v-flex
        xs12
        sm8
        md6
        wrap
        class="py-2"
      >
        {{ task.title }}
      </v-flex>
      <v-flex
        xs6
        sm4
        md2
        class="py-2"
      >
        <v-avatar
          size="20"
          class="mr-1 grey lighten-2"
        >
          <img :src="avatarPath">
        </v-avatar>

        {{ task.owner.name }}
      </v-flex>
      <v-flex
        xs6
        sm8
        md2
        class="py-2"
      >
        {{ dateDueFormatted }}
      </v-flex>
      <v-flex
        xs12
        sm4
        md2
        class="py-2"
      >
        <v-chip
          small
          :class="`${status} v-chip--active`"
          text-color="white"
          :style="{ width: '100px', display: 'block', textAlign: 'center' }"
        >
          {{ status }}
        </v-chip>
      </v-flex>
    </v-layout>
    <v-divider />
  </v-card>
</template>

<script>
import moment from 'moment';
import { status } from '../mixins/status';

export default {
  name: 'DashboardItem',
  mixins: [status],
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    status () {
      return this.getStatus(this.task.isCompleted, this.task.dateDue);
    },
    dateDueFormatted () {
      return moment(this.task.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('ddd, MMM Do YYYY');
    },
    avatarPath () {
      return `${process.env.VUE_APP_API_BASE_URL}/users/${this.task.owner._id}/avatar`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.task.completed {
  border-left: 5px solid $completed;
}

.task.overdue {
  border-left: 5px solid $overdue;
}

.task.ongoing {
  border-left: 5px solid $ongoing;
}

.v-chip.completed {
  background: $completed;
  /* background: var(--v-completed); */
}

.v-chip.overdue {
  background: $overdue;
  /* background: var(--v-overdue); */
}

.v-chip.ongoing {
  background: $ongoing;
  /* background: var(--v-ongoing); */
}
</style>
