<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const tab = ref(1);
const search = ref("");
const loading = ref(false);
const form = ref(true);

const processed = ref<[]>([]);
const unprocessed = ref<[]>([]);
const automatic = ref<[]>([]);

const route = useRoute();

onMounted(async () => {
  await getOrders();
});

async function getOrders() {
  loading.value = true;
  try {
    const { data } = await axios.get(`/api/v1/bookings`);
    const { content } = data;
    const organizationBookings = content.filter(
      (booking) => booking.organizationId === +route.params.id
    );
    processed.value = organizationBookings.filter(
      (booking) => booking.serviceHasFile && booking.isProcessed
    );
    unprocessed.value = organizationBookings.filter(
      (booking) => booking.serviceHasFile && !booking.isProcessed
    );
    automatic.value = organizationBookings.filter(
      (booking) => !booking.serviceHasFile
    );
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

function onSubmit() {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
}

const headersProcessed = [
  { title: "ФИО заказчика", value: "userFullName", sortable: true },
  {
    title: "Номер паспорта заказчика",
    value: "userPassportNumber",
    sortable: true,
  },
  { title: "Наименование услуги", value: "serviceName", sortable: true },
  { title: "Файл", value: "fileName", sortable: true },
];

// const ordersProcessed = [
//   {
//     userFullName: "Петрова Любовь Леонидовна",
//     userPassportNumber: "123456787654321",
//     serviceName: "Выписка из медицинской карты",
//     fileName: "Выписка_Петрова_Л_Л.pdf",
//   },
//   {
//     userFullName: "Синичкин Михаил Андреевич",
//     userPassportNumber: "2143567589432617",
//     serviceName: "Выписка из медицинской карты",
//     fileName: "Выписка_Синичкин_М_А.pdf",
//   },
// ];

const headersUnprocessed = [
  { title: "ФИО заказчика", value: "userFullName", sortable: true },
  {
    title: "Номер паспорта заказчика",
    value: "userPassportNumber",
    sortable: true,
  },
  { title: "Наименование услуги", value: "serviceName", sortable: true },
  {
    title: "Действия",
    value: "actions",
  },
];

// const unprocessed = [
//   {
//     userFullName: "Синичкин Константин Михайлович",
//     userPassportNumber: "98764536217623456",
//     serviceName: "Выписка из медицинской карты",
//   },
// ];

const headersAutomatic = [
  { title: "ФИО сотрудника", value: "employeeFullName", sortable: true },
  { title: "Наименование услуги", value: "serviceName", sortable: true },
  { title: "ФИО заказчика", value: "userFullName", sortable: true },
  { title: "Дата и время", value: "dateTime", sortable: true },
];

// const ordersAutomatic = [
//   {
//     userFullName: "Синичкина Мария Ивановна",
//     serviceName: "Прием ЛОРа",
//     employeeFullName: "Иванов Иван Иванович",
//     serviceDateTime: "14.05.2024 08:00",
//   },
//   {
//     userFullName: "Фролов Игорь Геннадьевич",
//     serviceName: "Прием офтальмолога",
//     employeeFullName: "Петров Петр Петрович",
//     serviceDateTime: "20.05.2024 16:00",
//   },
// ];

function accept(item: any) {
  console.log(item);
}

function decline(item: any) {
  console.log(item);
}

function convertDateTime(value: string) {
  const dateTimeArr = value.split("T");
  const date = dateTimeArr[0].split("-").reverse().join(".");
  const time = dateTimeArr[1].substring(0, dateTimeArr[1].length - 3);
  console.log(date, time);
  return `${date} ${time}`;
  //  return value.toLocaleDateString().split(".").reverse().join("-");
}
</script>

<template>
  <v-container>
    <v-responsive>
      <v-tabs
        v-model="tab"
        align-tabs="center"
        class="mb-6"
        color="deep-purple-accent-4"
      >
        <v-tab :value="0">Обработанные</v-tab>
        <v-tab :value="1">Необработанные</v-tab>
        <v-tab :value="2">Автоматические</v-tab>
      </v-tabs>

      <v-text-field v-model="search" label="Поиск"></v-text-field>

      <v-data-table
        v-if="tab === 0"
        :headers="headersProcessed"
        :items="processed"
        :search="search"
        item-key="name"
        items-per-page="5"
      >
        <template v-slot:[`item.fileName`]="{ item }">
          <a href="/">
            {{ item.fileName }}
          </a>
        </template>
      </v-data-table>

      <v-data-table
        v-if="tab === 1"
        :headers="headersUnprocessed"
        :items="unprocessed"
        :search="search"
        item-key="name"
        items-per-page="5"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-dialog class="ml-auto" max-width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  class="mr-2"
                  size="small"
                  color="deep-orange-darken-1"
                  @click="decline(item)"
                  >Отклонить</v-btn
                >
                <v-btn
                  v-bind="activatorProps"
                  size="small"
                  color="blue-grey-darken-2"
                  @click="accept(item)"
                  >Прикрепить файл

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
                    <v-toolbar-title>Загрузить файл</v-toolbar-title>
                    <v-btn
                      icon="mdi-close"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-toolbar>

                  <v-form v-model="form" @submit.prevent="onSubmit">
                    <v-card-text>
                      <v-row align="center" dense>
                        <v-col cols="2">Файл</v-col>
                        <v-col>
                          <v-file-input label="Выберите файл"></v-file-input>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col align="end">
                          <v-btn :disabled="!form" color="blue-grey-darken-2"
                            >Сохранить</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-form>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </template>
      </v-data-table>

      <v-data-table
        v-if="tab === 2"
        :headers="headersAutomatic"
        :items="automatic"
        :search="search"
        item-key="name"
        items-per-page="5"
      >
        <template v-slot:[`item.dateTime`]="{ item }">
          {{ convertDateTime(item.dateTime) }}
        </template>
      </v-data-table>
    </v-responsive>
  </v-container>
</template>
