<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const search = ref("");
const name = ref(null);
const loading = ref(false);
const form = ref(true);

const route = useRoute();

interface ServiceItem {
  hasFile: boolean;
  id: number;
  name: string;
  organizationName: string;
}

interface EmployeeItem {
  hasFile: boolean;
  id: number;
  fullName: string;
  serviceName: string;
}

const headers = [
  { title: "ФИО сотрудника", value: "fullName", sortable: true },
  { title: "Услуги", value: "serviceName", sortable: true },
  { title: "График работы", value: "rate", sortable: true },
  {
    title: "Действия",
    value: "actions",
  },
];

const selectedServices = ref(null);
const selectedSchedule = ref(null);
const schedule = [
  {
    name: "Два через два",
  },
  {
    name: "Пять через два",
  },
];

const employees = ref<EmployeeItem[]>([]);
const services = ref<ServiceItem[]>([]);

onMounted(async () => {
  await getEmployees();
  await getServices();
});

async function getEmployees() {
  loading.value = true;
  try {
    const { data } = await axios.get(
      `/api/v1/employees/organizations/${route.params.id}`
    );
    const { content } = data;
    employees.value = content;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function getServices() {
  loading.value = true;
  try {
    const { data } = await axios.get(`/api/v1/services/${route.params.id}`);
    const { content } = data;
    services.value = content.filter((item: ServiceItem) => !item.hasFile);
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function addEmployee() {
  loading.value = true;
  try {
    await axios.post("/api/v1/employees", {
      fullName: name.value,
      serviceId: +selectedServices.value!,
      organizationId: +route.params.id,
      rate: selectedSchedule.value,
    });
    getEmployees();
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

function accept(item: any) {
  console.log(item);
}

async function deleteEmployee(employeeId: number) {
  loading.value = true;
  try {
    await axios.delete(`/api/v1/employees/${employeeId}`);
    getEmployees();
  } catch (error) {
    console.log(error);
    loading.value = false;
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
    <v-responsive>
      <v-row>
        <v-col>
          <v-dialog class="ml-auto" max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                color="teal-darken-3"
                prepend-icon="mdi-account-plus"
              >
                Добавить сотрудника
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
                <v-toolbar>
                  <v-toolbar-title>Информация о сотруднике</v-toolbar-title>
                  <v-btn
                    icon="mdi-close"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-toolbar>

                <v-form v-model="form" @submit.prevent="onSubmit">
                  <v-card-text>
                    <v-row align="center" dense>
                      <v-col cols="4">ФИО сотрудника</v-col>
                      <v-col>
                        <v-text-field
                          v-model="name"
                          :rules="[required]"
                          placeholder="Иванов Иван Иванович"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row align="center">
                      <v-col cols="4">Оказываемые услуги</v-col>

                      <v-col class="pt-0">
                        <v-autocomplete
                          v-model="selectedServices"
                          :items="services"
                          color="blue-grey-lighten-2"
                          item-title="name"
                          item-value="id"
                          label="Выберите услугу"
                        >
                          <!-- <template v-slot:chip="{ props, item }">
                            <v-chip
                              v-bind="props"
                              :text="item.raw.name"
                            ></v-chip>
                          </template>

                          <template v-slot:item="{ props, item }">
                            <v-list-item
                              v-bind="props"
                              :text="item.raw.name"
                            ></v-list-item>
                          </template> -->
                        </v-autocomplete>
                      </v-col>
                    </v-row>

                    <v-row align="center">
                      <v-col cols="4">Время работы</v-col>

                      <v-col class="pt-0">
                        <v-autocomplete
                          v-model="selectedSchedule"
                          :items="schedule"
                          color="blue-grey-lighten-2"
                          item-title="name"
                          item-value="name"
                          label="Выберите время работы "
                        >
                          <!-- <template v-slot:chip="{ props, item }">
                            <v-chip
                              v-bind="props"
                              :text="item.raw.name"
                            ></v-chip>
                          </template>

                          <template v-slot:item="{ props, item }">
                            <v-list-item
                              v-bind="props"
                              :text="item.raw.name"
                            ></v-list-item>
                          </template> -->
                        </v-autocomplete>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col align="end">
                        <v-btn
                          :disabled="!form"
                          color="blue-grey-darken-2"
                          @click="
                            isActive.value = false;
                            addEmployee();
                          "
                          >Сохранить</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field v-model="search" label="Поиск"></v-text-field>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="employees"
        :search="search"
        item-key="employeeFullName"
        items-per-page="5"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-btn
              class="mr-2"
              size="small"
              color="teal-darken-3"
              @click="accept(item)"
              >Редактировать</v-btn
            >
            <v-btn
              class="mr-2"
              size="small"
              color="deep-orange-darken-1"
              @click="deleteEmployee(item.id)"
              >Удалить</v-btn
            >
          </div>
        </template>
      </v-data-table>
    </v-responsive>
  </v-container>
</template>
