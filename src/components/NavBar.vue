<script setup lang="ts">
import { ref } from "vue";

const value = ref(1);
</script>

<template>
  <v-layout class="overflow-visible mx-14 my-4" style="height: 54px">
    <v-bottom-navigation
      v-model="value"
      :elevation="7"
      class="rounded-lg"
      color="teal"
      grow
    >
      <!-- <v-btn to="/">
        <v-icon>mdi-home-outline</v-icon>
        Главная
      </v-btn> -->

      <v-btn to="/profile/1">
        <v-icon>mdi-heart</v-icon>
        Личный кабинет
      </v-btn>

      <v-btn to="/profile-admin/103">
        <v-icon>mdi-heart</v-icon>
        Админ
      </v-btn>

      <v-btn to="/profile-organization/56">
        <v-icon>mdi-heart</v-icon>
        Админ организации
      </v-btn>

      <v-btn to="/org-info">
        <v-icon>mdi-domain</v-icon>
        Организациям
      </v-btn>

      <v-btn to="/info">
        <v-icon>mdi-information-outline</v-icon>
        О нас
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
