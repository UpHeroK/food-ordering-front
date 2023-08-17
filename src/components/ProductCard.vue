<template>
  <div class="bg-white shadow-xl rounded-md flex flex-col h-full">
    <img
      :src="product.image"
      alt="Product Image"
      class="w-full h-40 object-cover rounded"
    />
    <div class="p-4 flex-grow flex flex-col justify-between">
      <div>
        <h3 class="font-bold text-xl">{{ product.name }}</h3>
        <p class="text-sm text-gray-600">{{ product.description }}</p>
      </div>

      <div>
        <div class="mt-2 text-center font-bold">
          ${{ product.price }} x {{ product.amount }} = ${{
            (product.price * product.amount).toFixed(2)
          }}
        </div>
        <div class="mt-2 flex justify-between">
          <button
            @click="decrementamount"
            class="bg-red-300 text-white p-1 rounded-l hover:bg-red-500 w-1/2"
          >
            -
          </button>
          <span class="border p-1 w-1/4 text-center">{{ product.amount }}</span>
          <button
            @click="incrementamount"
            class="bg-green-400 text-white p-1 rounded-r hover:bg-green-600 w-1/2"
          >
            +
          </button>
        </div>
        <button
          @click="addToOrder"
          class="mt-2 bg-blue-500 text-white w-full p-2 hover:bg-blue-600 rounded"
        >
          Agregar al Pedido
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    decrementamount() {
      if (this.product.amount > 1) {
        this.product.amount--;
      }
    },
    incrementamount() {
      this.product.amount++;
    },
    addToOrder() {
      this.$emit("add-to-order", this.product);
    },
  },
};
</script>
