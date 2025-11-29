<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { isEqual } from "lodash";

const address = ref<string | null>(null);
const email = ref<string | null>(null);
const name = ref<string | null>(null);
const pan = ref<string | null>(null);
const password = ref(null);
const passwordNew = ref(null);
const passwordNewRepeated = ref(null);
const loading = ref(false);
const form = ref(true);

const route = useRoute();

interface OrganizationInfo {
  address: string;
  email: string;
  name: string;
  pan: string;
}

const initialOrganizationInfo = ref<OrganizationInfo | null>(null);

const isOrganizationInfoUpdated = computed(
  () =>
    !isEqual(initialOrganizationInfo.value, {
      address: address.value,
      email: email.value,
      name: name.value,
      pan: pan.value,
    })
);
const disabledUpdatePassword = computed(
  () => !password.value && !passwordNew.value && !passwordNewRepeated.value
);

onMounted(async () => {
  await getOrganizationInfo();
});

async function getOrganizationInfo() {
  try {
    const { data: organizationInfo } = await axios.get(
      `/api/v1/organizations/${route.params.id}`
    );
    email.value = organizationInfo.email;
    address.value = organizationInfo.address;
    name.value = organizationInfo.name;
    pan.value = organizationInfo.pan;
    initialOrganizationInfo.value = {
      address: address.value!,
      email: email.value!,
      name: name.value!,
      pan: pan.value!,
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

function regNumber(value: string) {
  return value.length === 9 || "Поле должно содержать 9 символов";
}
</script>

<template>
  <v-container>
    <v-form v-model="form" @submit.prevent="onSubmit">
      <h3>
        {{ name }}
      </h3>
      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="4"> Наименование организации</v-col>
          <v-col>
            <v-text-field
              v-model="name"
              :rules="[required]"
              placeholder="Открытое акционерное общество «Ромашка»"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" class="mt-0">
          <v-col cols="4">УНП организации</v-col>
          <v-col class="pt-0">
            <v-text-field
              v-model="pan"
              :rules="[required, regNumber]"
              placeholder="123456789"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4">Адрес организации</v-col>
          <v-col class="pt-0">
            <v-text-field
              v-model="address"
              :rules="[required]"
              placeholder="г. Минск, ул. Вокзальная 1, корпус 3"
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
            <v-btn
              :disabled="!isOrganizationInfoUpdated"
              color="blue-grey-darken-2"
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
