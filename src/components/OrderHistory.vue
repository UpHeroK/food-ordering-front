
<template>
  <div v-if="orders.length" class="mx-auto my-6 ">
     <h2 class="text-xl font-semibold border-b border-gray-300 pb-2">Historial de pedidos</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-blue-100 border rounded p-2 shadow-md transition-transform transform hover:scale-105"
      >
        <p class="mb-2 "><strong>Total:</strong> ${{ order.total }}</p>
        <p class="mb-2 "><strong>Dirección:</strong> {{ order.address }}</p>
        <p class="mb-2 "><strong>Teléfono:</strong> {{ order.phone }}</p>
      </div>
    </div>
  </div>
</template>



<script>
import axios from "@/utils/axios-config";

export default {
  data() {
    return {
      orders: [],
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const { data } = await axios.get("/order");
        this.orders = data.data;
        console.log("Orders:", data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
  },
};
</script>

