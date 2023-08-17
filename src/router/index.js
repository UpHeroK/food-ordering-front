import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../views/UserLogin.vue'

function redirectToAppropriatePage() {
  // Si el usuario está autenticado, redirige a UserOrder
  if (localStorage.getItem('token')) {
    return '/order';
  }
  // Si no está autenticado, redirige a login
  return '/login';
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        // Si el usuario está autenticado, redirige a UserOrder
        if (localStorage.getItem('token')) {
          return '/order';
        }
        // Si no está autenticado, redirige a login
        return '/login';
      }
    },
    {
      path: '/login',
      name: 'login',
      component: UserLogin,
      beforeEnter: (to, from, next) => {
        // Si el usuario está autenticado, redirige a UserOrder
        if (localStorage.getItem('token')) {
          next('/order');
        } else {
          next(); // Continuar a la página de login si no está autenticado
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/UserRegistration.vue'),
      beforeEnter: (to, from, next) => {
        // Si el usuario está autenticado, redirige a UserOrder
        if (localStorage.getItem('token')) {
          next('/order');
        } else {
          next(); // Continuar a la página de login si no está autenticado
        }
      }
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/UserOrder.vue')
      

    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})


export default router

