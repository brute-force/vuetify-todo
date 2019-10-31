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
        <img :src="avatarUri">
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
import request from 'axios';

export default {
  data () {
    return {
      file: null,
      rules: [
        value => !value || value.size < 200000 || 'Avatar size should be less than 200 KB!'
      ],
      isLoading: false,
      doShow: false
    };
  },
  computed: {
    avatarUri () {
      return `${process.env.VUE_APP_AWS_S3_AVATAR_HOST}${this.$store.getters.user.avatarPath}`;
    }
  },
  methods: {
    imageSelect () {
      if (this.file) {
        let reader = new FileReader();
        reader.readAsDataURL(this.file);
      }
    },
    async submit () {
      if (this.$refs.form.validate()) {
        this.isLoading = true;

        // get s3 signed url
        const resS3GetSignedUrl = await this.$http.post('/users/upload', { 'Content-Type': this.file.type });
        const { key, url } = resS3GetSignedUrl.data;

        // upload avatar to s3
        await request.put(url, this.file, {
          headers: {
            'Content-Type': this.file.type
          }
        });

        // update mongodb doc with avatar path
        const resPatch = await this.$http.patch('/users/me', { avatarPath: key });
        const { avatarPath } = resPatch.data;

        // update store
        this.$store.dispatch('updateAvatarPath', avatarPath)
          .then((data) => {
            this.isLoading = false;
            this.doShow = false;

            this.updateSnackbar({ title: `"${this.file.name}" uploaded.`, doShow: true });
            this.$refs.form.reset();
          })
          .catch((err) => {
            window.alert(`invalid avatar upload ${err.message}`);
          });
      }
    },
    ...mapActions(['updateSnackbar'])
  }
};
</script>
