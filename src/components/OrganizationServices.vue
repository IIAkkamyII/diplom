<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const search = ref("");
const newService = ref<string | null>(null);
const hasFile = ref(false);
const loading = ref(false);

const route = useRoute();

interface ServiceItem {
  hasFile: boolean;
  id: number;
  name: string;
  organizationName: string;
}

const headers = [
  {
    title: "Наименование услуги",
    value: "name",
    sortable: true,
  },
  { title: "Электронный документ", value: "hasFile" },
  {
    title: "Действия",
    value: "actions",
  },
];

const services = ref<ServiceItem[]>([]);

onMounted(async () => {
  await getServices();
});

async function getServices() {
  loading.value = true;
  try {
    const { data } = await axios.get(`/api/v1/services/${route.params.id}`);
    const { content } = data;
    services.value = content;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function addService() {
  loading.value = true;
  try {
    await axios.post("/api/v1/services", {
      name: newService.value,
      organizationId: route.params.id,
      hasFile: hasFile.value,
    });
    newService.value = null;
    hasFile.value = false;
    getServices();
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

function accept(item: any) {
  console.log(item);
}

async function deleteService(serviceId: number) {
  loading.value = true;
  try {
    await axios.delete(`/api/v1/services/${serviceId}`);
    getServices();
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}
</script>

<template>
  <v-container>
    <v-responsive>
      <v-row>
        <v-col>
          <v-text-field
            v-model="newService"
            placeholder="Введите наименование новой услуги"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-checkbox
            v-model="hasFile"
            label="Электронный документ"
          ></v-checkbox>
        </v-col>
        <v-col>
          <v-btn
            class="mt-2"
            :disabled="!newService?.length"
            color="teal-darken-3"
            prepend-icon="mdi-playlist-plus"
            @click="addService"
          >
            Добавить новую услугу
            <v-overlay
              opacity=".06"
              scrim="primary"
              contained
              model-value
              persistent
            />
          </v-btn>
        </v-col>
      </v-row>

      <v-text-field v-model="search" label="Поиск"></v-text-field>

      <v-data-table
        :headers="headers"
        :items="services"
        :search="search"
        :loading="loading"
        item-key="name"
        items-per-page="5"
      >
        <template v-slot:[`item.hasFile`]="{ item }">
          <div class="d-flex">
            <v-checkbox v-model="item.hasFile" disabled></v-checkbox>
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-dialog class="ml-auto" max-width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  class="mr-2"
                  size="small"
                  color="teal-darken-3"
                >
                  Редактировать
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
                    <v-toolbar-title>Редактировать услугу</v-toolbar-title>
                    <v-btn
                      icon="mdi-close"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-toolbar>

                  <v-form v-model="form">
                    <v-card-text>
                      <v-row align="center" dense>
                        <v-col cols="4">Наименование услуги</v-col>
                        <v-col>
                          <v-text-field
                            v-model="item.name"
                            :rules="[required]"
                            placeholder="Введите наименование услуги"
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-row class="pt-0">
                        <v-col cols="4" class="pt-4"
                          >Электронные документы</v-col
                        >

                        <v-col class="pt-0">
                          <v-checkbox
                            v-model="item.hasFile"
                            :items="services"
                            color="blue-grey-lighten-2"
                            item-title="name"
                            item-value="name"
                            chips
                            closable-chips
                            multiple
                            hide-details
                          >
                          </v-checkbox>
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
            <v-btn
              class="mr-2"
              size="small"
              color="deep-orange-darken-1"
              @click="deleteService(item.id)"
              >Удалить</v-btn
            >
          </div>
        </template>
      </v-data-table>
    </v-responsive>
  </v-container>
</template>
