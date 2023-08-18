import { createStore } from 'vuex';
import axios from '@/utils/axios-config';

export default createStore({
  state: {
    products: [],
    orderItems: [],
    ordersHistory: [],
    user: null
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },

    SET_PRODUCTS(state, products) {
      state.products = products.data;
      state.products.forEach(product => {
        product.amount = 1;
      });
    },

    ADD_TO_ORDER(state, product) {
      const existingItem = state.orderItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.amount += product.amount;
      } else {
        state.orderItems.push({ ...product });
      }
      product.amount = 1;
    },

    REMOVE_FROM_ORDER(state, productId) {
      state.orderItems = state.orderItems.filter(item => item.id !== productId);
    }, 
    
    CLEAR_ORDER_ITEMS(state) {
      state.orderItems = [];
    },
    
    SET_ORDERS_HISTORY(state, orders) {
      state.ordersHistory = orders;
    },
  },

  actions: {
    async fetchUser({ commit }) {
      try {
        const response = await axios.get('/user');
        commit('SET_USER', response.data);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    },
    async fetchProducts({ commit }) {
      try {
        const response = await axios.get('products');
        commit('SET_PRODUCTS', response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async fetchOrdersHistory({ commit }) {
      try {
        const { data } = await axios.get("/order");
        commit('SET_ORDERS_HISTORY', data.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    }
    
  },

  getters: {
    total(state) {
      return state.orderItems.reduce((acc, item) => acc + (item.price * item.amount), 0);
    }
  }
});
