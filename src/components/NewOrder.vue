<script setup lang="ts">
import axios from "axios";

import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const selectedDate = ref<Date>(new Date());
const selectedDayTimesList = ref<string[]>([]);
const selectedOrganization = ref(null);
const selectedService = ref(null);
const selectedTime = ref(null);

const hasAvailableSlots = computed(() =>
  Boolean(selectedDayTimesList.value.length)
);

const showTimePicker = computed(
  () => selectedService?.value && !selectedService?.value?.hasFile
);

const organizations = ref([]);
const services = ref([]);
const schedule = ref([]);
const availableDates = ref([]);
const availableTime = ref([]);
const employeeId = ref(null);

const route = useRoute();

const getLocaleDate = (value: Date) =>
  value.toLocaleDateString().split(".").reverse().join("-");

onMounted(() => {
  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const weekDays = document.querySelectorAll(".v-date-picker-month__weekday");
  weekDays.forEach((day, index) => {
    day.innerHTML = daysOfWeek[index];
  });

  getOrganizations();
});

watch(selectedOrganization, (value, oldValue) => {
  if (value !== oldValue) {
    getServices(value.id);
  }
});

watch(selectedService, async (value, oldValue) => {
  if (value !== oldValue) {
    availableDates.value = [];
    selectedDayTimesList.value = [];
    employeeId.value = await getEmployeeByService(value.id);
    await getSchedule(employeeId.value!);
  }
});

watch(
  selectedDate,
  async (value, oldValue) => {
    if (value !== oldValue) {
      const timeThisDay = availableDates.value.filter(
        (item) => item.split("T")[0] === getLocaleDate(value)
      );
      selectedDayTimesList.value = timeThisDay.map((item) => {
        const time: string = item.split("T")[1];
        return time.substring(0, time.length - 3);
      });
    }
  },
  {
    immediate: true,
  }
);

async function getOrganizations() {
  try {
    const { data } = await axios.get("/api/v1/organizations");
    const { content: organizationsList } = data;
    organizations.value = organizationsList;
  } catch (error) {
    console.log(error);
  }
}

async function getServices(organizationId: number) {
  try {
    const { data } = await axios.get(`/api/v1/services/${organizationId}`);
    const { content: servicesList } = data;
    services.value = servicesList;
    // .map((item) => item.name);
  } catch (error) {
    console.log(error);
  }
}

async function getEmployeeByService(serviceId: number) {
  try {
    const { data } = await axios.get(`/api/v1/employees/${serviceId}`);
    const { id } = data;
    return id;
  } catch (error) {
    console.log(error);
  }
}

async function getSchedule(employeeId: number) {
  try {
    const { data } = await axios.get(`/api/v1/schedules/${employeeId}`);
    availableDates.value = data
      .filter((item) => !item.isBooked)
      .map((item) => item.workTime);
    // services.value = servicesList;
    // .map((item) => item.name);
  } catch (error) {
    console.log(error);
  }
}

async function createAppointment() {
  const today = new Date();
  const currentDate = getLocaleDate(today);
  const booking = selectedService?.value.hasFile
    ? {
        isProcessed: false,
        serviceId: selectedService.value.id,
        dateTime: `${currentDate}T00:00:00`,
        employeeId: 1,
        userId: +route.params.id,
      }
    : {
        isProcessed: true,
        serviceId: selectedService.value.id,
        dateTime: `${getLocaleDate(selectedDate.value)}T${selectedTime.value}`,
        employeeId: employeeId.value,
        userId: +route.params.id,
      };
  try {
    await axios.post("/api/v1/bookings", booking);
  } catch (error) {
    console.log(error);
  }
}

function allowedDates(value: Date) {
  const today = new Date();
  const currentDate = getLocaleDate(today);
  const filteredDates = availableDates.value
    .map((item) => item.split("T")[0])
    .filter((date) => date >= currentDate);
  // const filteredDates = availableDates.value.filter(
  //   (date) => date >= currentDate
  // );
  return filteredDates.includes(getLocaleDate(value));
}

function updateSelectedTime(value: string) {
  selectedTime.value = `${value}:00`;
}
</script>

<template>
  <v-container class="fill-height d-flex">
    <v-responsive class="align-center fill-height mx-auto" max-width="900">
      <v-row align="center" class="mt-0">
        <v-col cols="4">Организация</v-col>
        <v-col cols="8">
          <v-autocomplete
            v-model="selectedOrganization"
            :items="organizations"
            item-title="name"
            item-value="id"
            placeholder="Выберите организацию"
            return-object
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center" class="mt-0">
        <v-col cols="4">Услуга</v-col>
        <v-col cols="8">
          <v-autocomplete
            v-model="selectedService"
            :items="services"
            item-title="name"
            item-value="id"
            placeholder="Выберите услугу"
            return-object
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row v-if="showTimePicker">
        <v-col cols="4">Выберите дату и время</v-col>
        <v-col align="center" cols="8">
          <v-date-picker
            v-model="selectedDate"
            :allowed-dates="allowedDates"
            locale="ru-RU"
            first-day-of-week="1"
            show-adjacent-months
            hide-header
          ></v-date-picker>
        </v-col>
      </v-row>

      <v-row v-if="showTimePicker" style="height: 100px">
        <v-col cols="4"></v-col>

        <v-col v-if="!hasAvailableSlots" cols="8" align="center">
          В этот день нет свободного времени
        </v-col>

        <v-col v-else cols="8" align="center">
          <v-chip-group>
            <v-chip
              v-for="(item, index) in selectedDayTimesList"
              :key="index"
              @click="updateSelectedTime(item)"
            >
              {{ item }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row>
        <v-col align="end">
          <v-btn color="blue-grey-lighten-1" @click="createAppointment"
            >Сохранить</v-btn
          >
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<!-- <style>
.v-date-picker-controls__month
  > .v-btn--density-default:first-of-type:disabled {
  color: gray;
  cursor: not-allowed;
}
</style> -->
