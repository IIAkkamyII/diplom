<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { isEqual } from "lodash";

const location = ref<string | null>(null);
const email = ref<string | null>(null);
const fullName = ref<string | null>(null);
const passportNumber = ref<string | null>(null);
const password = ref(null);
const passwordNew = ref(null);
const passwordNewRepeated = ref(null);
const loading = ref(false);
const form = ref(true);

const route = useRoute();

interface OrganizationInfo {
  location: string;
  email: string;
  fullName: string;
  passportNumber: string;
}

const initialOrganizationInfo = ref<OrganizationInfo | null>(null);

const isUserInfoUpdated = computed(
  () =>
    !isEqual(initialOrganizationInfo.value, {
      location: location.value,
      email: email.value,
      fullName: fullName.value,
      passportNumber: passportNumber.value,
    })
);
const disabledUpdatePassword = computed(
  () => !password.value && !passwordNew.value && !passwordNewRepeated.value
);

onMounted(async () => {
  await getUserInfo();
});

async function getUserInfo() {
  try {
    const { data: organizationInfo } = await axios.get(
      `/api/v1/users/${route.params.id}`
    );
    email.value = organizationInfo.email;
    location.value = organizationInfo.location;
    fullName.value = organizationInfo.fullName;
    passportNumber.value = organizationInfo.passportNumber;
    initialOrganizationInfo.value = {
      location: location.value!,
      email: email.value!,
      fullName: fullName.value!,
      passportNumber: passportNumber.value!,
    };
  } catch (error) {
    console.log(error);
  }
}

function onSubmit() {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
}

function required(value: string) {
  return !!value || "Поле обязательно для заполнения";
}

// function regNumber(value: string) {
//   return value.length === 9 || "Поле должно содержать 9 символов";
// }
</script>

<template>
  <v-container>
    <v-form v-model="form" @submit.prevent="onSubmit">
      <h3>Информация о пользователе</h3>
      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="4">ФИО</v-col>
          <v-col>
            <v-text-field
              v-model="fullName"
              :rules="[required]"
              placeholder="Иванов Иван Иванович"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" class="mt-0">
          <v-col cols="4">Номер паспорта</v-col>
          <v-col class="pt-0">
            <v-text-field
              v-model="passportNumber"
              :rules="[required]"
              placeholder="XXXXXXXXXXXXXX"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4">Адрес</v-col>
          <v-col class="pt-0">
            <v-text-field
              v-model="location"
              :rules="[required]"
              placeholder="г. Минск, ул. Вокзальная 1, кв. 2, этаж 3"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4">Адрес электронной почты</v-col>
          <v-col class="pt-0">
            <v-text-field
              v-model="email"
              :rules="[required]"
              placeholder="ivanov@gmail.com"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col align="end">
            <v-btn :disabled="!isUserInfoUpdated" color="blue-grey-darken-2"
              >Сохранить</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>

    <v-form v-model="form" @submit.prevent="onSubmit">
      <h3>Изменить пароль</h3>
      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="4">Пароль</v-col>
          <v-col>
            <v-text-field
              v-model="password"
              class="mb-2"
              :readonly="loading"
              :rules="[required]"
              placeholder="Введите пароль"
              type="password"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" dense class="mt-0">
          <v-col cols="4">Новый пароль</v-col>
          <v-col>
            <v-text-field
              v-model="passwordNew"
              class="mb-2"
              :readonly="loading"
              :rules="[required]"
              placeholder="Введите новый пароль"
              type="password"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" class="mt-0">
          <v-col cols="4">Повторите новый пароль</v-col>
          <v-col class="pt-0">
            <v-text-field
              v-model="passwordNewRepeated"
              class="mb-2"
              :readonly="loading"
              :rules="[required]"
              placeholder="Введите пароль"
              type="password"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col align="end">
            <v-btn :disabled="disabledUpdatePassword" color="blue-grey-darken-2"
              >Изменить пароль</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </v-container>
</template>
