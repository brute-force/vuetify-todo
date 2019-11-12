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
                <v-toolbar-title>{{ operation }}</v-toolbar-title>
              </v-toolbar>
              <v-form
                ref="form"
              >
                <v-card-text>
                  <v-text-field
                    v-if="operation === 'register'"
                    v-model="user.name"
                    label="Name"
                    name="name"
                    prepend-icon="mdi-account"
                    type="text"
                    :rules="rulesText"
                  />
                  <v-text-field
                    v-model="user.email"
                    label="E-Mail"
                    name="email"
                    prepend-icon="mdi-email"
                    type="text"
                    :rules="rulesText"
                  />
                  <v-text-field
                    id="password"
                    v-model="user.password"
                    label="Password"
                    name="password"
                    :rules="rulesText"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    text
                    color="googs white--text"
                    router
                    :to="'/' + operationOther"
                  >
                    <div class="mx-3">
                      {{ operationOther }}
                    </div>
                  </v-btn>
                  <v-spacer />
                  <v-btn
                    rounded
                    color="googs white--text"
                    :loading="isLoading"
                    @click.prevent="doSubmit"
                  >
                    <div class="mx-3">
                      {{ operation }}
                    </div>
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    operation: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      user: {
        name: '',
        email: '',
        password: ''
      },
      rulesText: [
        v => !!v || 'required field'
        // v => (v && v.length > 5) || 'value must be greater than 5 characters'
      ],
      isLoading: false,
      showPassword: false
    };
  },
  computed: {
    operationOther () {
      return this.operation === 'login' ? 'register' : 'login';
    }
  },
  methods: {
    doSubmit () {
      if (this.$refs.form.validate()) {
        console.log(this.operation, this.user);
        this.$emit(this.operation, this.user);
      }
    }
  }
};
</script>
