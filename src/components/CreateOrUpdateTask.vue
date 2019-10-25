<template>
  <v-dialog
    v-model="doShow"
    max-width="600px"
  >
    <template
      v-slot:activator="{ on }"
    >
      <v-btn
        small
        text
        v-bind="activatorSlotAttributes"
        :class="operation === 'create' ? 'success' : 'mx-2 mt-1'"
        v-on="on"
      >
        <slot />
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h2>{{ operation }} task</h2>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          class="px-3"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="title"
            :rules="rulesText"
            label="title"
            prepend-icon="mdi-pencil-outline"
          />
          <v-textarea
            v-model="description"
            :rules="rulesText"
            label="description"
            prepend-icon="mdi-text"
          />
          <v-menu max-width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                label="due date"
                prepend-icon="mdi-calendar-range"
                :value="dateDueFormatted"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="dateDue" />
          </v-menu>
          <v-checkbox
            v-model="isCompleted"
            label="completed"
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
              {{ operation }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';

export default {
  props: {
    operation: {
      type: String,
      required: true
    },
    task: {
      type: Object,
      required: false,
      default: () => {
        return {
          title: '',
          description: '',
          dateDue: moment().add(1, 'd').format('YYYY-MM-DDTHH:mm:ss.sssZ'),
          isCompleted: false
        };
      }
    }
  },
  data () {
    return {
      title: this.task.title,
      description: this.task.description,
      dateDue: moment(this.task.dateDue, 'YYYY-MM-DDTHH:mm:ss.sssZ').format('YYYY-MM-DD'),
      isCompleted: this.task.isCompleted,
      rulesText: [
        v => !!v || 'required field',
        v => (v && v.length > 5) || 'value must be greater than 5 characters'
      ],
      // rulesDate: [
      //   v => moment(v, 'ddd, MMM Do YYYY').isAfter(moment().local()) || 'due date must be after today'
      // moment(this.task.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('ddd, MMM Do YYYY')
      // ],
      isLoading: false,
      doShow: false
    };
  },
  computed: {
    dateDueFormatted () {
      return this.dateDue ? moment(this.dateDue, 'YYYY-MM-DD').format('ddd, MMM Do YYYY') : '';
    },
    activatorSlotAttributes () {
      const attributes = {};

      if (this.operation === 'create') {
        attributes.rounded = true;
      } else if (this.operation === 'update') {
        attributes.icon = true;
      }

      return attributes;
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.isLoading = true;

        const task = {
          title: this.title,
          description: this.description,
          dateDue: moment(this.dateDue, 'YYYY-MM-DD').toDate().toISOString(),
          isCompleted: this.isCompleted
        };

        if (this.operation === 'create') {
          this.createTask(task)
            .then((data) => {
              this.isLoading = false;
              this.doShow = false;

              this.updateSnackbar({ title: `"${this.title}" created.`, doShow: true });
              this.$refs.form.reset();
            });
        } else if (this.operation === 'update') {
          task._id = this.task._id;

          this.updateTask(task)
            .then((data) => {
              this.isLoading = false;
              this.doShow = false;

              this.updateSnackbar({ title: `"${this.title}" updated.`, doShow: true });
            });
        }
      }
    },
    ...mapActions(['createTask', 'updateTask', 'updateSnackbar'])
  }
};
</script>
