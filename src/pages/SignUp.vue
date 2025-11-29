<script setup lang="ts">
import { onMounted, ref } from "vue";
import router from "@/router";
import axios from "axios";

interface UserInfo {
  id: number;
  fullName: string;
  email: string;
}

const email = ref(null);
const password = ref(null);
const passwordRepeated = ref(null);
const form = ref(true);
const loading = ref(false);
const users = ref<string[]>([]);

onMounted(async () => {
  await getUsersList();
});

async function getUsersList() {
  try {
    const { data } = await axios.get("/api/v1/users");
    const { content: usersList } = data;
    users.value = usersList.map((user: UserInfo) => user.email);
    console.log(users.value);
  } catch (error) {
    console.log(error);
  }
}

async function onSubmit() {
  if (!form.value) return;

  const newUserId = await createUser();
  navigateTo(`/profile/${newUserId}`);
}

async function createUser() {
  loading.value = true;
  try {
    const { data: newUserId } = await axios.post("api/v1/users", {
      email: email.value,
      password: password.value,
    });
    return newUserId;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

function unique(value: string) {
  return !users.value.includes(value) || "Электронная почта уже используется";
}

function required(value: string) {
  return !!value || "Поле обязательно для заполнения";
}

function samePasswords() {
  return password.value === passwordRepeated.value || "Пароли не совпадают";
}

function navigateTo(path: string) {
  router.push(path);
}
</script>

<template>
  <v-img src="/src/assets/login.jpg" height="100vh" cover>
    <NavBar />
    <v-card class="mx-auto px-6 py-8" max-width="364">
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="[required, unique]"
          class="mb-2"
          label="Адрес электронной почты"
          placeholder="Введите адрес электронной почты"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          class="mb-2"
          :readonly="loading"
          :rules="[required]"
          label="Введите пароль"
          placeholder="Введите пароль"
          type="password"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="passwordRepeated"
          class="mb-2"
          :readonly="loading"
          :rules="[required, samePasswords]"
          label="Повторите пароль"
          placeholder="Введите пароль"
          type="password"
          clearable
        ></v-text-field>

        <v-btn
          :disabled="!form"
          :loading="loading"
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Зарегистрироваться
        </v-btn>

        <div class="mt-4" align="center">
          Уже зарегистрированы?
          <span
            class="cursor-pointer text-blue-lighten-3"
            @click="navigateTo('login')"
          >
            Войти
          </span>
        </div>
      </v-form>
    </v-card>
  </v-img>
</template>
