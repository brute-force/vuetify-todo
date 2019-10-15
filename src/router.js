import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Tasks from './views/Tasks';
import People from './views/People';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/people',
      name: 'People',
      component: People,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (router.app.$http.defaults.headers.common.Authorization) {
      router.app.$http.get('/users/me')
        .then((res) => {
          // console.log(`good token. redirecting to ${to.name}.`);
          next();
        })
        .catch((err) => {
          console.log(`invalid token. redirecting to login. ${err.data.error}`);
          next({ name: 'Login', params: { redirectTo: to.name } });
        });
    } else {
      // console.log('no token. redirecting to login.');
      next({ name: 'Login', params: { redirectTo: to.name } });
    }
  } else {
    next();
  }
});

export default router;
