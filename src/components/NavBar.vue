<template>
  <nav>
    <Snackbar />
    <v-app-bar
      app
      flat
    >
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
      />
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">shall</span>
        <span>we?</span>
      </v-toolbar-title>
      <v-spacer />
      <v-menu offset-y>
        <template
          v-slot:activator="{ on }"
        >
          <v-btn
            text
            color="grey"
            v-on="on"
          >
            <v-icon left>
              mdi-expand
            </v-icon>
            <span>menu</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="link in links"
            :key="link.text"
            router
            :to="link.route"
          >
            <v-list-item-title>
              {{ link.text }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        text
        color="grey"
        @click.prevent="doLogout"
      >
        <span>log out</span>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="googs"
    >
      <v-layout
        column
        align-center
      >
        <v-flex class="mt-5">
          <v-avatar
            size="72"
            class="grey lighten-2"
          >
            <img :src="`/img/${this.$store.getters.user.id}.jpg`">
          </v-avatar>
        </v-flex>
        <v-flex class="mt-1">
          <p class="white--text subheading mt-1">
            {{ this.$store.getters.user.name }}
          </p>
        </v-flex>
        <v-flex class="mt-4 mb-3">
          <CreateOrUpdateTask
            :operation="'create'"
          >
            <span>
              create new task
            </span>
          </CreateOrUpdateTask>
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-item-icon>
            <v-icon
              class="white--text"
            >
              {{ link.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="white--text"
            >
              {{ link.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import Snackbar from '@/components/Snackbar';
import CreateOrUpdateTask from '@/components/CreateOrUpdateTask';
import { mapActions } from 'vuex';

export default {
  name: 'NavBar',
  components: {
    CreateOrUpdateTask,
    Snackbar
  },
  data () {
    return {
      drawer: true,
      links: [
        {
          icon: 'mdi-view-dashboard',
          text: 'Dashboard',
          route: '/'
        },
        {
          icon: 'mdi-folder',
          text: 'Tasks',
          route: '/tasks'
        },
        {
          icon: 'mdi-account',
          text: 'People',
          route: '/people'
        }
      ]
    };
  },
  methods: {
    doLogout () {
      this.logout()
        .then(() => {
          this.$router.push({ name: 'Login', params: { redirectTo: 'Dashboard' } })
            // .then(() => {
            //   console.log('logged out.');
            // })
            .catch((err) => {
              console.warn(`navigation error: ${err.message}`);
            });
        });
    },
    ...mapActions(['logout'])
  }
};
</script>
