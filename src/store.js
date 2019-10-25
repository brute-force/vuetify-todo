
import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import moment from 'moment';
import { status } from './mixins/status';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: Cookies.get('token') || '',
    user: JSON.parse(Cookies.get('user') || '{}'),
    tasks: [],
    myTasks: [],
    snackbar: {
      title: '',
      doShow: false
    }
  },
  mutations: {
    login (state, { token, user }) {
      state.token = token;
      state.user = user;
    },
    logout (state) {
      state.token = '';
      state.user = {};
    },
    setTasks (state, tasks) {
      state.tasks = tasks;
    },
    setMyTasks (state, tasks) {
      state.myTasks = tasks;
    },
    createTask (state, task) {
      state.myTasks.push(task);

      task.owner = {
        _id: state.user.id,
        name: state.user.name,
        email: state.user.email
      };

      state.tasks.push(task);
      state.tasks.sort((a, b) => {
        const propA = status.methods.getStatus(a.isCompleted, a.dateDue);
        const propB = status.methods.getStatus(b.isCompleted, b.dateDue);

        if (propA < propB) {
          return -1;
        } else if (propA > propB) {
          return 1;
        } else {
          const momentA = moment(a.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
          const momentB = moment(b.dateDue, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

          if (momentA.isBefore(momentB)) {
            return -1;
          } else if (momentA.isAfter(momentB)) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    },
    deleteTask (state, id) {
      const index = state.myTasks.findIndex((task) => task._id === id);

      if (index !== -1) {
        state.myTasks.splice(index, 1);
      }
    },
    updateTask (state, task) {
      const index = state.myTasks.findIndex((_task) => _task._id === task._id);

      if (index !== -1) {
        state.myTasks.splice(index, 1, task);
      }
    },
    updateSnackbar (state, snackbar) {
      state.snackbar = snackbar;
    }
  },
  actions: {
    register ({ commit }, user) {
      return new Promise((resolve, reject) => {
        this.$http.post('/users', { name: user.name, email: user.email, password: user.password })
          .then((res) => {
            const { token, user: { name, _id } } = res.data;
            user.name = name;
            user.id = _id;
            delete user.password;

            // set secure to true when deploying to an https environment
            // const opts = { expires: 1, samesite: 'Strict', secure: true };
            const opts = { expires: 1, samesite: 'Strict' };

            Cookies.set('token', token, opts);
            Cookies.set('user', JSON.stringify(user), opts);

            this.$http.defaults.headers.common.Authorization = token;

            commit('login', { token, user });

            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    login ({ commit }, user) {
      return new Promise((resolve, reject) => {
        this.$http.post('/users/login', { email: user.email, password: user.password })
          .then((res) => {
            const { token, user: { name, _id } } = res.data;
            user.name = name;
            user.id = _id;
            delete user.password;

            // set secure to true when deploying to an https environment
            // const opts = { expires: 1, samesite: 'Strict', secure: true };
            const opts = { expires: 1, samesite: 'Strict' };

            Cookies.set('token', token, opts);
            Cookies.set('user', JSON.stringify(user), opts);

            this.$http.defaults.headers.common.Authorization = token;

            commit('login', { token, user });

            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        this.$http.get('/users/logout')
          .then((res) => {
            Cookies.remove('token');
            Cookies.remove('user');

            delete this.$http.defaults.headers.common.Authorization;

            commit('logout');

            resolve('logged out');
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getAllTasks ({ commit }) {
      return new Promise((resolve, reject) => {
        this.$http.get('/tasks/all')
          .then((res) => {
            commit('setTasks', res.data);

            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getMyTasks ({ commit }) {
      return new Promise((resolve, reject) => {
        this.$http.get('/tasks?sortBy=dateDue:desc')
          .then((res) => {
            commit('setMyTasks', res.data);

            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    createTask ({ commit }, task) {
      return new Promise((resolve, reject) => {
        this.$http.post('/tasks', task)
          .then((res) => {
            commit('createTask', res.data);

            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    deleteTask ({ commit }, id) {
      return new Promise((resolve, reject) => {
        this.$http.delete(`/tasks/${id}`)
          .then((res) => {
            commit('deleteTask', id);

            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    updateTask ({ commit }, { _id, ...task }) {
      return new Promise((resolve, reject) => {
        this.$http.patch(`/tasks/${_id}`, task)
          .then((res) => {
            task._id = _id;
            commit('updateTask', task);

            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    updateSnackbar ({ commit }, snackbar) {
      commit('updateSnackbar', snackbar);
    }
  },
  getters: {
    token: state => state.token,
    user: state => state.user,
    allTasks: state => state.tasks,
    myTasks: state => state.myTasks,
    snackbar: state => state.snackbar
    // tasksByUserId: state => id => state.tasks.filter((task) => task.owner._id === id),
    // myTasks: state => state.tasks.filter((task) => task.owner._id === state.user.id)
  }
});
