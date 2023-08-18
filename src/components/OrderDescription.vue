<template>
  <div class="w-1/3 bg-gray-200 p-6">
    <div class="relative">
      <div class="w-full flex justify-end">
        <button
          @click="toggleDropdown"
          class="flex items-center space-x-2 focus:outline-none border-gray-500 border rounded px-3 py-2 gap-3 hover:bg-gray-300"
        >
          <i class="fa fa-user"></i>
          {{ this.$store.state.user?.name }}
        </button>
      </div>

      <div
        :class="{
          'opacity-0 invisible': !showDropdown,
          'opacity-100': showDropdown,
        }"
        class="transition-opacity duration-300 absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg"
      >
        <button
          @click="logout"
          class="block w-full text-left px-4 py-2 hover:bg-gray-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
    <h2 class="text-xl font-semibold mb-4">Mi pedido</h2>
    <ul class="divide-y divide-gray-300">
      <li
        v-for="item in orderItems"
        :key="item.id"
        class="py-2 pl-4 pr-3 bg-white shadow-md rounded-md my-2 flex justify-between items-center"
      >
        <div>
          {{ item.name }} x {{ item.amount }} = ${{ calculateTotal(item) }}
        </div>
        <button
          v-if="!showShippingDetails"
          @click="removeFromOrder(item.id)"
          class="bg-red-500 text-white p-1 hover:bg-red-600 rounded h-6 w-6 flex items-center justify-center"
        >
          X
        </button>
      </li>
    </ul>
    <div class="mt-4 font-semibold">Total: ${{ total }}</div>
    <button
      v-if="!showShippingDetails && orderItems.length > 0"
      @click="requestShowShippingDetails"
      class="mt-4 bg-blue-500 text-white w-full p-2 hover:bg-blue-600 rounded"
    >
      Siguiente
    </button>

    <div v-if="showShippingDetails" class="mt-4">
      <h3 class="text-xl font-semibold mb-4">Detalles de envío</h3>

      <!-- Formulario de envío -->
      <form @submit.prevent="processOrder">
        <div class="mb-4">
          <label for="address" class="block text-sm font-medium text-gray-700"
            >Dirección</label
          >
          <input
            type="text"
            id="address"
            minlength="5"
            required
            v-model="address"
            placeholder="Ingresa tu dirección"
            class="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700"
            >Teléfono</label
          >
          <input
            type="text"
            id="number"
            v-model="phone"
            @input="ensureNumericInput"
            placeholder="Ingresa tu número de teléfono"
            class="mt-1 p-2 w-full border rounded-md"
            minlength="6"
            pattern="\d{6,}"
            title="Ingresa un número de teléfono válido con al menos 6 dígitos."
          />
        </div>

        <button
          type="submit"
          class="mt-4 bg-green-500 text-white w-full p-2 hover:bg-green-600 rounded"
        >
          Ordenar
        </button>
      </form>

      <button
        @click="goBack"
        class="mt-4 bg-red-500 text-white w-full p-2 hover:bg-red-600 rounded"
      >
        Volver hacia atrás
      </button>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios-config";
import { mapState, mapMutations , mapActions } from "vuex";

export default {
  props: {
    showShippingDetails: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      address: "",
      phone: "",
      showDropdown: false,
    };
  },
  computed: {
    ...mapState({
      orderItems: "orderItems",
    }),
    total() {
      if (!this.orderItems || !this.orderItems.length) {
        return 0;
      }
      return this.orderItems
        .reduce((acc, item) => acc + item.price * item.amount, 0)
        .toFixed(2);
    },
  },
  methods: {
    ...mapActions(['fetchOrdersHistory']),
    ...mapMutations(["REMOVE_FROM_ORDER", "CLEAR_ORDER_ITEMS"]),
    calculateTotal(item) {
      return (item.price * item.amount).toFixed(2);
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    removeFromOrder(productId) {
      this.REMOVE_FROM_ORDER(productId);
    },
    goBack() {
      // Aquí es donde notificas al componente padre del cambio
      this.$emit("UpdateShippingDetails", false);
      this.address = "";
      this.phone = "";
    },
    requestShowShippingDetails() {
      this.$emit("UpdateShippingDetails", true);
    },
    ensureNumericInput(event) {
      const numericValue = event.target.value.replace(/[^\d]/g, "");
      this.phone = numericValue;
    },
    processOrder() {
      const transformedPayload = {
        total: this.total,
        address: this.address,
        phone: this.phone,
        products: this.orderItems.map((item) => ({
          id: item.id,
          amount: item.amount,
        })),
      };
      console.log("transformedPayload", transformedPayload);

      // Enviando la petición al servidor
      axios
        .post("order", transformedPayload)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            console.log("Pedido creado con éxito!", response.data);

            //llamar al notify para mostrar el mensaje de exito
            //no salio por ningun lado xd
            this.fetchOrdersHistory();
            this.$notify({
              title: "Pedido creado con éxito!",
              text: "Tu pedido ha sido creado con éxito!",
              type: "success",
            });
            // Limpiando los campos
            this.address = "";
            this.phone = "";

            // Notificando al componente padre que el pedido se completó
            this.$emit("UpdateShippingDetails", false);

            // Limpiando el carrito de productos
            this.CLEAR_ORDER_ITEMS();
          }
        })
        .catch((error) => {
          console.error("Hubo un error al crear el pedido", error);
          // Puedes agregar más manejo de errores aquí,
          // como mostrar un mensaje al usuario, etc.
        });
    },
    async logout() {
      try {
        localStorage.removeItem("token");

        delete axios.defaults.headers.common["Authorization"];

        this.$router.push("/login"); // Usando vue-router para redirigir al usuario.
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
  },
};
</script>
<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>