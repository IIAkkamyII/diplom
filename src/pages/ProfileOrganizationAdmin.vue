<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import OrganizationEdit from "@/components/OrganizationEdit.vue";
import OrganizationOrders from "@/components/OrganizationOrders.vue";
import OrganizationEmployees from "@/components/OrganizationEmployees.vue";
import OrganizationServices from "@/components/OrganizationServices.vue";
import { useRoute } from "vue-router";
import axios from "axios";

const selectedItem = ref("orders");
const email = ref("");
const organizationName = ref("");

const isOrdersActive = computed(() => selectedItem.value === "orders");
const isProfileInfoActive = computed(() => selectedItem.value === "edit");
const isServicesActive = computed(() => selectedItem.value === "services");
const isEmployeesActive = computed(() => selectedItem.value === "employees");

const route = useRoute();

onMounted(async () => {
  await getOrganizationInfo();
});

async function getOrganizationInfo() {
  try {
    const { data: organizationInfo } = await axios.get(
      `/api/v1/organizations/${route.params.id}`
    );
    email.value = organizationInfo.email;
    organizationName.value = organizationInfo.name;
  } catch (error) {
    console.log(error);
  }
}

function navigateTo(path: string) {
  router.replace(path);
}

function updateSelection(value: string) {
  selectedItem.value = value;
}
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer color="blue-grey-darken-1">
        <v-list>
          <v-list-item
            prepend-icon="mdi-domain"
            :title="organizationName"
            :subtitle="email"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item
            prepend-icon="mdi-home-outline"
            title="На главную"
            value="home"
            @click="navigateTo('/')"
          />
          <v-list-item
            prepend-icon="mdi-pencil-outline"
            title="Об организации"
            value="edit"
            :active="isProfileInfoActive"
            @click="updateSelection('edit')"
          />
          <v-list-item
            prepend-icon="mdi-folder"
            title="Заявки"
            value="orders"
            :active="isOrdersActive"
            @click="updateSelection('orders')"
          />
          <v-list-item
            prepend-icon="mdi-account-group"
            title="Сотрудники"
            value="employees"
            :active="isEmployeesActive"
            @click="updateSelection('employees')"
          />
          <v-list-item
            prepend-icon="mdi-format-list-bulleted"
            title="Услуги"
            value="services"
            :active="isServicesActive"
            @click="updateSelection('services')"
          />
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 100vh">
        <OrganizationEdit v-if="isProfileInfoActive" />
        <OrganizationOrders v-if="isOrdersActive" />
        <OrganizationEmployees v-if="isEmployeesActive" />
        <OrganizationServices v-if="isServicesActive" />
      </v-main>
    </v-layout>
  </v-card>
</template>
