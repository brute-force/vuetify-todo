<template>
  <v-content>
    <NavBar />
    <v-content class="mx-4 mb-4 pa-2">
      <div class="home">
        <h1 class="subheading grey--text mt-2">
          Dashboard
        </h1>
        <v-container class="mx-6 my-5">
          <v-layout
            class="pa-5 table-header"
            row
            wrap
            align-center
          >
            <v-flex
              xs12
              sm8
              md6
              class="py-2"
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    small
                    color="grey lighten-5"
                    class="px-2"
                    v-on="on"
                    @click="sort('title')"
                  >
                    <v-icon
                      left
                      small
                    >
                      mdi-folder
                    </v-icon>
                    <span class="caption text-uppercase">title</span>
                    <v-icon
                      v-if="sortBy === 'title'"
                      small
                      class="ml-2"
                    >
                      mdi-sort-{{ sortDirection }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>sort tasks by title</span>
              </v-tooltip>
            </v-flex>
            <v-flex
              xs6
              sm4
              md2
              class="py-2"
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    small
                    color="grey lighten-5"
                    class="px-2"
                    v-on="on"
                    @click="sort('assignee')"
                  >
                    <v-icon
                      left
                      small
                    >
                      mdi-account
                    </v-icon>
                    <span class="caption text-uppercase">Assignee</span>
                    <v-icon
                      v-if="sortBy === 'assignee'"
                      small
                      class="ml-2"
                    >
                      mdi-sort-{{ sortDirection }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>sort tasks by assignee</span>
              </v-tooltip>
            </v-flex>
            <v-flex
              xs6
              sm8
              md2
              class="py-2"
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    small
                    color="grey lighten-5"
                    class="px-2"
                    v-on="on"
                    @click="sort('dateDue')"
                  >
                    <v-icon
                      left
                      small
                    >
                      mdi-calendar
                    </v-icon>
                    <span class="caption text-uppercase">due date</span>
                    <v-icon
                      v-if="sortBy === 'dateDue'"
                      small
                      class="ml-2"
                    >
                      mdi-sort-{{ sortDirection }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>sort tasks by due date</span>
              </v-tooltip>
            </v-flex>
            <v-flex
              xs12
              sm4
              md2
              class="py-2"
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    small
                    color="grey lighten-5"
                    class="px-2"
                    v-on="on"
                    @click="sort('status')"
                  >
                    <v-icon
                      left
                      small
                    >
                      mdi-calendar-check
                    </v-icon>
                    <span class="caption text-uppercase">status</span>
                    <v-icon
                      v-if="sortBy === 'status'"
                      small
                      class="ml-2"
                    >
                      mdi-sort-{{ sortDirection }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>sort tasks by status</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <DashboardItem
            v-for="task in allTasks"
            :key="task._id"
            :task="task"
          />
        </v-container>
      </div>
    </v-content>
  </v-content>
</template>

<script>
import moment from 'moment';
import NavBar from '@/components/NavBar';
import DashboardItem from '@/components/DashboardItem';
import { mapGetters } from 'vuex';
import { status } from '../mixins/status';

export default {
  components: {
    DashboardItem,
    NavBar
  },
  mixins: [status],
  data () {
    return {
      // sortBy: 'status',
      // sortDirection: 'ascending'
      sortBy: '',
      sortDirection: ''
    };
  },
  computed: {
    ...mapGetters(['user', 'allTasks'])
  },
  created () {
    this.$store.dispatch('getAllTasks')
      .then((data) => {
        this.sort('status');
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  methods: {
    sort (prop) {
      if (prop === this.sortBy) {
        // reverse sort order if requested sort is the same as current
        this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending';
      } else {
        // otherwise sort order is ascending
        this.sortDirection = 'descending';
      }

      this.sortBy = prop;

      this.allTasks.sort((a, b) => {
        let propA, propB;

        if (prop === 'assignee') {
          propA = a.owner.name;
          propB = b.owner.name;
        } else if (prop === 'status') {
          propA = this.getStatus(a.isCompleted, a.dateDue);
          propB = this.getStatus(b.isCompleted, b.dateDue);
        } else {
          propA = a[prop];
          propB = b[prop];
        }

        if (propA === propB) {
          // additionally sort by date if there's a tie
          const momentA = moment(a.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
          const momentB = moment(b.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

          if (momentA.isBefore(momentB)) {
            return -1;
          } else if (momentA.isAfter(momentB)) {
            return 1;
          } else {
            return 0;
          }
        } else if (propA < propB) {
          return this.sortDirection === 'ascending' ? -1 : 1;
        } else if (propA > propB) {
          return this.sortDirection === 'ascending' ? 1 : -1;
        }
      });
    }
  }
};
</script>

<style scoped>
.table-header {
  border-left: 5px solid #fafafa;
}
</style>
