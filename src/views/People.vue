<template>
  <v-content>
    <NavBar />
    <v-content class="mx-4 mb-4 pa-2">
      <div class="people">
        <h1 class="subheading grey--text mt-2">
          People
        </h1>
        <v-container class="my-5">
          <v-layout
            row
            wrap
          >
            <v-flex
              v-for="person in people"
              :key="person.name"
              xs12
              sm6
              md4
              lg3
            >
              <v-card
                flat
                class="text-sm-center ma-3"
              >
                <v-responsive class="pt-4">
                  <v-avatar
                    size="36"
                    class="grey lighten-2"
                  >
                    <img :src="`/img/${person._id}.jpg`">
                  </v-avatar>
                </v-responsive>
                <v-card-text>
                  <div class="subheading">
                    {{ person.name }}
                  </div>
                  <div class="grey--text">
                    {{ person.email }}
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-content>
  </v-content>
</template>

<script>
import NavBar from '@/components/NavBar';

export default {
  components: {
    NavBar
  },
  data () {
    return {
      people: []
    };
  },
  created () {
    this.$http.get('/users/all')
      .then((res) => {
        this.people = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
</script>
