<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-6">
              <v-toolbar
                color="googs"
                dark
                flat
              >
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form
                  ref="form"
                >
                  <v-text-field
                    v-model="email"
                    label="E-Mail"
                    name="email"
                    prepend-icon="mdi-account"
                    type="text"
                    :rules="rulesText"
                  />
                  <v-text-field
                    id="password"
                    v-model="password"
                    label="Password"
                    name="password"
                    :rules="rulesText"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="googs white--text"
                  router
                  to="/register"
                >
                  <div class="mx-3">
                    Register
                  </div>
                </v-btn>
                <v-spacer />
                <v-btn
                  rounded
                  color="googs white--text"
                  :loading="isLoading"
                  @click.prevent="login"
                >
                  <div class="mx-3">
                    Login
                  </div>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      rulesText: [
        v => !!v || 'required field'
        // v => (v && v.length > 5) || 'value must be greater than 5 characters'
      ],
      isLoading: false,
      showPassword: false
    };
  },
  methods: {
    login () {
      if (this.$refs.form.validate()) {
        this.isLoading = true;

        const user = {
          email: this.email,
          password: this.password
        };

        this.$store.dispatch('login', user)
          .then((data) => {
            this.isLoading = false;
            this.$router.push({ name: this.$route.params.redirectTo || 'Dashboard' });
          })
          .catch((err) => {
            window.alert(`invalid login ${err.message}`);
          });
      }
    }
  }
};
</script>
