<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="login" class="p-6 w-96 bg-white rounded shadow-md">
      <h1 class="text-2xl font-bold mb-4">Iniciar sesión</h1>

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
      <!-- Para mostrar el error -->
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        Iniciar sesión
      </button>
      <p class="text-center mt-2">
        <a
          href="#"
          @click.prevent="goToRegister"
          class="text-blue-500 hover:underline"
          >¿Ya tienes una cuenta?</a
        >
      </p>
    </form>
  </div>
</template>

<script>
import axios from "@/utils/axios-config";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    goToRegister() {
      this.$router.push("/register");
    },
    async login() {
      try {
        const response = await axios.post("/login", {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("token", response.data.token);
        this.$notify({
          title: "Inicio de sesión exitoso",
          text: "Bienvenido a la tienda",
          type: "success",
        });
        this.$router.push("/order");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.error = "Credenciales inválidas";
        } else {
          this.error = "Hubo un error al intentar iniciar sesión";
        }
      }
    },
  },
};
</script>
