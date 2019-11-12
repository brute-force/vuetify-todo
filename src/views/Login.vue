<template>
  <Authenticate
    operation="login"
    @login="doLogin"
  />
</template>

<script>
import Authenticate from '@/components/Authenticate';
import { mapActions } from 'vuex';

export default {
  components: {
    Authenticate
  },
  methods: {
    doLogin (user) {
      this.isLoading = true;

      this.login(user)
        .then((data) => {
          this.isLoading = false;
          this.$router.push({ name: this.$route.params.redirectTo || 'Dashboard' });
        })
        .catch((err) => {
          window.alert(`invalid login ${err.message}`);
        });
    },
    ...mapActions(['login'])
  }

};
</script>
