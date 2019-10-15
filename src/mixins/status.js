import moment from 'moment';

export const status = {
  methods: {
    getStatus (isCompleted, dateDue) {
      if (isCompleted) {
        return 'completed';
      } else {
        return moment().isBefore(moment(dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) ? 'ongoing' : 'overdue';
      }
    }
  }
};
