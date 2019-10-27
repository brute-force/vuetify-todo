<template>
  <v-dialog
    v-model="doShow"
    max-width="600px"
  >
    <template
      v-slot:activator="{ on }"
    >
      <v-avatar
        size="72"
        class="grey lighten-2"
        v-on="on"
      >
        <img :src="avatarPath">
      </v-avatar>
    </template>
    <v-card>
      <v-card-title>
        <h2>upload avatar</h2>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          class="px-3"
          @submit.prevent="submit"
        >
          <v-file-input
            v-model="file"
            label="avatar"
            outlined
            show-size
            accept="image/*"
            :rules="rules"
            prepend-icon="mdi-camera"
            color="success"
            @change="imageSelect"
          />
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              rounded
              type="submit"
              class="success mx-0 mt-3"
              :loading="isLoading"
            >
              Upload
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data () {
    return {
      file: null,
      avatarPath: `${process.env.VUE_APP_API_BASE_URL}/users/${this.$store.getters.user.id}/avatar`,
      rules: [
        value => !value || value.size < 200000 || 'Avatar size should be less than 200 KB!'
      ],
      isLoading: false,
      doShow: false
    };
  },
  methods: {
    imageSelect () {
      if (this.file) {
        let reader = new FileReader();
        reader.readAsDataURL(this.file);
      }
    },
    submit () {
      if (this.$refs.form.validate()) {
        this.isLoading = true;

        const formData = new FormData();
        formData.append('avatar', this.file);

        const headers = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };

        this.$http.post('/users/me/avatar', formData, headers)
          .then((res) => {
            this.isLoading = false;
            this.doShow = false;

            this.avatarPath += ('?' + new Date().getTime());

            this.updateSnackbar({ title: `"${this.file.name}" uploaded.`, doShow: true });
            this.$refs.form.reset();
          })
          .catch((err) => {
            alert(err);
          });
      }
    },
    ...mapActions(['updateSnackbar'])
  }
};
</script>
