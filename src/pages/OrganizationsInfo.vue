<script setup lang="ts">
import axios from "axios";
import { computed, ref } from "vue";

const address = ref<string | null>(null);
const email = ref<string | null>(null);
const name = ref<string | null>(null);
const pan = ref<string | null>(null);
const showForm = ref(true);
const loading = ref(false);
const form = ref(true);

const isFormField = computed(
  () =>
    name.value?.length &&
    address.value?.length &&
    pan.value?.length === 9 &&
    email.value?.length
);

async function createOrganizationOrder() {
  loading.value = true;
  try {
    await axios.post("/api/v1/orders", {
      address: address.value,
      email: email.value,
      name: name.value,
      pan: pan.value,
    });
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function onSubmit() {
  if (!form.value) return;

  await createOrganizationOrder();
}

function required(value: string) {
  return !!value || "Поле обязательно для заполнения";
}

function regNumber(value: string) {
  return value.length === 9 || "Поле должно содержать 9 символов";
}

function clearForm() {
  address.value = null;
  email.value = null;
  name.value = null;
  pan.value = null;
}
</script>

<template>
  <v-img src="/src/assets/org-page.jpg" height="100vh" cover>
    <NavBar />

    <v-container>
      <h2 class="mb-1 text-blue-grey-lighten-4">Информация для организаций</h2>

      <h3 class="mb-1 text-blue-grey-lighten-4">
        Для добавления организации в систему необходимо
        <span
          class="cursor-pointer text-blue-lighten-3"
          @click="showForm = !showForm"
          >подать заявку</span
        >
        на регистрацию. <br />
        После проверки нашим администратором, на указанную вами почту будет
        выслан пароль от личного кабинета. Вы сможете изменить его позже в
        настройках.
      </h3>
      <v-card v-if="showForm" class="mt-6 pa-4" max-width="800">
        <v-form v-model="form" @submit.prevent="onSubmit">
          <h4>Заявка на регистрацию организации</h4>
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
                <v-dialog class="ml-auto" max-width="250">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      v-bind="activatorProps"
                      :disabled="!isFormField"
                      color="blue-grey-darken-2"
                      @click="createOrganizationOrder"
                      >Отправить заявку
                      <v-overlay
                        opacity=".06"
                        scrim="primary"
                        contained
                        model-value
                        persistent
                      />
                    </v-btn>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card style="overflow: hidden">
                      <v-form v-model="form">
                        <v-card-text class="d-flex flex-column justify-center">
                          <v-row align="center" dense>
                            <v-col>
                              <div class="mx-auto" style="width: 175px">
                                Ваша заявка отправлена!
                              </div>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-btn
                              class="mx-auto mb-2"
                              size="small"
                              color="teal-darken-3"
                              @click="
                                isActive.value = false;
                                clearForm();
                              "
                            >
                              ОК
                            </v-btn>
                          </v-row>
                        </v-card-text>
                      </v-form>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
      </v-card>
    </v-container>
  </v-img>
</template>
