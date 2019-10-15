<template>
  <v-snackbar
    v-model="snackbar.doShow"
    :timeout="3000"
    top
    color="success"
  >
    <span>{{ snackbar.title }}</span>
    <v-btn
      text
      color="white"
      @click="updateSnackbar({ title: '', doShow: false })"
    >
      close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['snackbar'])
  },
  methods: {
    ...mapActions(['updateSnackbar'])
  }
};
</script>
