<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <div>
    <v-img height="100vh" cover src="/src/assets/home.jpg">
      <NavBar />
      <v-container class="fill-height">
        <v-responsive class="align-center fill-height mx-auto" max-width="900">
          <v-img class="mb-4" height="150" src="@/assets/home-icon.svg" />

          <div class="text-center">
            <h1 class="mb-1 text-teal-lighten-4">
              Добро пожаловать в сервис для онлайн записи и получения услуг в
              Республике Беларусь
            </h1>

            <v-btn class="mx-2 my-4" color="teal-darken-1" to="login">
              Вход
            </v-btn>

            <v-btn class="my-4" color="teal-darken-1" to="registration">
              Регистрация
            </v-btn>
          </div>
        </v-responsive>
      </v-container>
    </v-img>
  </div>
</template>

<style>
h2 {
  text-shadow: 1px 1px 2px rgb(20, 37, 16);
}
</style>
