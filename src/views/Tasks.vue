<template>
  <v-content>
    <NavBar />
    <v-content class="mx-4 mb-4 pa-2">
      <div class="tasks">
        <h1 class="subheading grey--text mt-2">
          Tasks
        </h1>
        <v-container class="mx-6 my-5">
          <v-expansion-panels
            inset
            focusable
          >
            <Task
              v-for="task in sortedTasks"
              :key="task._id"
              :task="task"
            />
          </v-expansion-panels>
        </v-container>
      </div>
    </v-content>
  </v-content>
</template>

<script>
import moment from 'moment';
import NavBar from '@/components/NavBar';
import Task from '@/components/Task';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    NavBar,
    Task
  },
  computed: {
    ...mapState(['tasks']),
    ...mapGetters(['user', 'myTasks']),
    sortedTasks () {
      // return this.tasksByUserId(this.user.id).slice(0).sort((a, b) => {
      // return this.tasks.filter((task) => task.owner._id === this.user.id).sort((a, b) => {
      return this.myTasks.slice(0).sort((a, b) => {
        if (a.isCompleted < b.isCompleted) {
          return -1;
        } else if (a.isCompleted > b.isCompleted) {
          return 1;
        } else {
          const momentA = moment(a.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
          const momentB = moment(b.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

          if (momentA.isBefore(momentB)) {
            return -1;
          } else if (momentA.isAfter(momentB)) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    }
  },
  created () {
    this.$store.dispatch('getMyTasks')
      .then((data) => {
        // console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};
</script>
