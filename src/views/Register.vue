<template>
  <Authenticate
    operation="register"
    @register="doRegister"
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
    doRegister (user) {
      this.isLoading = true;

      this.register(user)
        .then((data) => {
          this.isLoading = false;
          this.$router.push({ name: this.$route.params.redirectTo || 'Dashboard' });
        })
        .catch((err) => {
          window.alert(`invalid register ${err.message}`);
        });
    },
    ...mapActions(['register'])
  }

};
</script>
