<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";

const tab = ref(0);
const processed = ref([]);
const unprocessed = ref([]);
const services = ref([]);
const organizations = ref([]);
// const processed = [
//   {
//     organizationName: "Министерство связи и информатизации Республики Беларусь",
//     orderType: "Прием граждан",
//     date: "17.07.2024",
//     time: "11:00",
//     icon: "mdi-text-box-outline",
//   },
//   {
//     organizationName: "МЭО ГАИ ГУВД Мингорисполкома",
//     orderType: "Выдача водительского удостоверения",
//     date: "12.08.2024",
//     time: "09:00",
//     icon: "mdi-text-box-outline",
//   },
//   {
//     organizationName:
//       "Учреждение здравоохранения «33-я городская студенческая поликлиника»",
//     orderType: "Прием офтальмолога",
//     date: "14.05.2024",
//     time: "08:00",
//     icon: "mdi-text-box-outline",
//   },
//   {
//     organizationName: "ООО «Космосистемс»",
//     orderType: "Стрижка мужская",
//     date: "12.08.2024",
//     time: "",
//     icon: "mdi-text-box-outline",
//   },
// ];

// const unprocessed = [
//   {
//     organizationName:
//       "Учреждение здравоохранения «33-я городская студенческая поликлиника»",
//     orderType: "Выписка из медицинской карты",
//     icon: "mdi-text-box-outline",
//   },
//   {
//     organizationName: "ООО «Космосистемс»",
//     orderType: "Стрижка мужская",
//     date: "12.08.2024",
//     time: "",
//     icon: "mdi-text-box-outline",
//   },
// ];

onMounted(async () => {
  await getBookings();
});

async function getBookings() {
  try {
    const { data } = await axios.get("/api/v1/bookings/1/users");
    const { content: bookingsList } = data;
    processed.value = bookingsList.filter((booking) => booking.isProcessed);
    unprocessed.value = bookingsList.filter((booking) => !booking.isProcessed);
  } catch (error) {
    console.log(error);
  }
}

function formatDateTime(value: string) {
  const dateArr = value.split("T");
  const date = dateArr[0].split("-").reverse().join(".");
  const time = dateArr[1].substring(0, dateArr[1].length - 3);
  return `${date} ${time}`;
}
</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="fill-height mx-auto" max-width="900">
      <v-tabs
        v-model="tab"
        align-tabs="center"
        class="mb-6"
        color="deep-purple-accent-4"
      >
        <v-tab :value="0">Обработанные</v-tab>
        <v-tab :value="1">Необработанные</v-tab>
      </v-tabs>

      <v-row v-if="tab === 0">
        <v-col v-for="(item, index) in processed" :key="index" cols="6">
          <v-dialog class="ml-auto" max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <v-card
                v-bind="activatorProps"
                class="py-4"
                color="surface-variant"
                :prepend-icon="item.icon"
                rel="noopener noreferrer"
                rounded="lg"
                :subtitle="item.serviceName"
                :title="item.organizationName"
                variant="text"
              >
                <v-overlay
                  opacity=".06"
                  scrim="primary"
                  contained
                  model-value
                  persistent
                />
              </v-card>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card style="overflow: hidden">
                <v-toolbar>
                  <v-toolbar-title>Информация о заявке</v-toolbar-title>
                  <v-btn
                    icon="mdi-close"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-toolbar>

                <v-card-text>
                  <v-row>
                    <v-col cols="3"><b>Организация</b></v-col>
                    <v-col>{{ item.organizationName }}</v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="3"><b>Услуга</b></v-col>
                    <v-col>{{ item.serviceName }}</v-col>
                  </v-row>

                  <v-row v-if="item.employeeFullName">
                    <v-col cols="3"><b>ФИО сотрудника</b></v-col>
                    <v-col>{{ item.employeeFullName }}</v-col>
                  </v-row>

                  <v-row v-if="item.dateTime" class="mb-2">
                    <v-col cols="3"><b>Дата и время</b></v-col>
                    <v-col>{{ formatDateTime(item.dateTime) }}</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>

      <v-row v-if="tab === 1">
        <v-col v-for="(item, index) in unprocessed" :key="index" cols="6">
          <v-dialog class="ml-auto" max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <v-card
                v-bind="activatorProps"
                class="py-4"
                color="surface-variant"
                :prepend-icon="item.icon"
                rel="noopener noreferrer"
                rounded="lg"
                :subtitle="item.serviceName"
                :title="item.organizationName"
                variant="text"
              >
                <v-overlay
                  opacity=".06"
                  scrim="primary"
                  contained
                  model-value
                  persistent
                />
              </v-card>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card style="overflow: hidden">
                <v-toolbar>
                  <v-toolbar-title>Информация о заявке</v-toolbar-title>
                  <v-btn
                    icon="mdi-close"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-toolbar>

                <v-card-text>
                  <v-row>
                    <v-col cols="3"><b>Организация</b></v-col>
                    <v-col>{{ item.organizationName }}</v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="3" class="mb-2"><b>Услуга</b></v-col>
                    <v-col>{{ item.serviceName }}</v-col>
                  </v-row>

                  <v-row v-if="item?.date && item?.time" class="mb-2">
                    <v-col cols="3"><b>Дата и время</b></v-col>
                    <v-col>{{ item?.date }} {{ item?.time }}</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
