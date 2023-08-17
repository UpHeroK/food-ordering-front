<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      @submit.prevent="register"
      class="p-6 w-96 bg-white rounded shadow-md"
    >
      <div class="flex items-center mb-4">
        <button
          @click="goToLogin"
          class="mr-4 bg-transparent p-1 text-blue-500 hover:text-blue-600 focus:outline-none"
        >
          <i class="fa fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold">Registro</h1>
      </div>

      <div class="mb-4">
        <label for="name" class="block text-sm font-medium mb-2">Nombre:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div class="mb-4">
        <label for="surname" class="block text-sm font-medium mb-2"
          >Apellido:</label
        >
        <input
          type="text"
          id="surname"
          v-model="surname"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div class="mb-4">
        <label for="email" class="block text-sm font-medium mb-2"
          >Correo electrónico:</label
        >
        <input
          type="email"
          id="email"
          v-model="email"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium mb-2"
          >Contraseña:</label
        >
        <input
          type="password"
          id="password"
          minlength="6"
          v-model="password"
          class="w-full p-2 border rounded"
          required
        />
      </div>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        Registrar
      </button>
    </form>
  </div>
</template>
<script>
import axios from "@/utils/axios-config";
import "font-awesome/css/font-awesome.min.css";

export default {
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
    async register() {
      try {
        const response = await axios.post("/register", {
          name: this.name,
          lastname: this.surname,
          email: this.email,
          password: this.password,
        });

        // Si la respuesta es exitosa y contiene un token, guardarlo
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
          this.$notify({
            title: "Registro exitoso",
            text: "Bienvenido a la tienda",
            type: "success",
          });
          this.$router.push("/order");
        } else {
          this.error =
            "Registro exitoso, pero no se proporcionó el token. Contacta al soporte.";
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          this.error = error.response.data.message;
        } else {
          this.error =
            "Error durante el registro. Por favor intenta nuevamente.";
        }
      }
    },
  },
};
</script>