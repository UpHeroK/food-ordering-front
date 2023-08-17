<template>
  <div class="flex h-screen bg-gray-100 transition-all duration-300">
    <div v-if="$store.state.user" class="flex w-full transition">
      <div class="flex-1 bg-white p-6 overflow-y-auto">
        <OrderHistory />

        <h2 class="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
          Productos
        </h2>

        <div
          v-if="products && products.length > 0"
          class="grid grid-cols-3 gap-4"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @add-to-order="addToOrder"
            :disabled="false"
          />
        </div>
      </div>

      <OrderDescription
        :showShippingDetails="showShippingDetails"
        @UpdateShippingDetails="handleShippingDetailsChange"
      />
    </div>
    <div
      v-else
      class="text-center text-xl font-semibold animate-pulse mt-6 ml-6"
    >
      Cargando...
    </div>
  </div>
</template>

<script>
import OrderHistory from "@/components/OrderHistory.vue";
import ProductCard from "@/components/ProductCard.vue";
import OrderDescription from "@/components/OrderDescription.vue";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  components: {
    ProductCard,
    OrderDescription,
    OrderHistory,
  },
  data() {
    return {
      showShippingDetails: false,
    };
  },
  computed: {
    ...mapState({
      products: "products",
    }),
  },
  mounted() {
    this.fetchProducts();
    this.fetchUser();
  },
  methods: {
    ...mapActions(["fetchProducts", "fetchUser"]),
    ...mapMutations(["ADD_TO_ORDER"]),
    addToOrder(product) {
      this.ADD_TO_ORDER(product);
    },
    handleShippingDetailsChange(newValue) {
      this.showShippingDetails = newValue;
    },
  },
};
</script>
