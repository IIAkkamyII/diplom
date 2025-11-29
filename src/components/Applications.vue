<script setup lang="ts">
import axios from "axios";

import { ref, onMounted, watch } from "vue";

// onMounted(() => {
//   axios
//     .get("http://localhost:8080/public-services/api/v1/organizations")
//     .then((response) => {
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

const tab = ref(1);
const search = ref("");
const loading = ref(false);
const processed = ref([]);
const unprocessed = ref([]);
const form = ref(true);
const refusalReason = ref("");

const headers = [
  { title: "Наименование организации", value: "name", sortable: true },
  { title: "УНП организации", value: "pan", sortable: true },
  { title: "Адрес организации", value: "address", sortable: true },
  {
    title: "Адрес электронной почты администратора",
    value: "email",
    sortable: true,
  },
];

const headersUnprocessed = [
  { title: "Наименование организации", value: "name", sortable: true },
  { title: "УНП организации", value: "pan", sortable: true },
  { title: "Адрес организации", value: "address", sortable: true },
  {
    title: "Адрес электронной почты",
    value: "email",
    sortable: true,
  },
  {
    title: "Действия",
    value: "actions",
  },
];

watch(
  tab,
  (value) => {
    if (value === 0) getOrganizations();
    if (value === 1) getApplications();
  },
  {
    immediate: true,
  }
);

async function getApplications() {
  loading.value = true;
  try {
    const { data } = await axios.get("/api/v1/orders", {
      params: {
        isProcessed: false,
      },
    });
    const { content: unprocessedList } = data;
    unprocessed.value = unprocessedList;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function getOrganizations() {
  loading.value = true;
  try {
    const { data } = await axios.get("/api/v1/orders", {
      params: {
        isProcessed: true,
      },
    });
    const { content: unprocessedList } = data;
    processed.value = unprocessedList;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}

async function accept(itemId: number) {
  loading.value = true;
  try {
    const { data } = await axios.patch(`/api/v1/orders/${itemId}/approving`);
    const { content: unprocessedList } = data;
    processed.value = unprocessedList;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
  getApplications();
}

async function decline(itemId: number) {
  loading.value = true;
  console.log(itemId, refusalReason.value);

  try {
    await axios.patch(`/api/v1/orders/${itemId}/rejecting`, {
      refusalReason: refusalReason.value,
    });
    // const { content: unprocessedList } = data;
    // processed.value = unprocessedList;
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
  getApplications();
}

function onSubmit(itemId: number) {
  if (!form.value) return;

  console.log(itemId, refusalReason.value);

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
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
      </v-tabs>

      <v-text-field v-model="search" label="Поиск"></v-text-field>

      <v-data-table
        v-if="tab === 0"
        :headers="headers"
        :items="processed"
        :loading="loading"
        :search="search"
        item-key="name"
        items-per-page="5"
      >
      </v-data-table>

      <v-data-table
        v-if="tab === 1"
        :headers="headersUnprocessed"
        :items="unprocessed"
        :loading="loading"
        :search="search"
        item-key="name"
        items-per-page="5"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-dialog class="ml-auto" max-width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  class="mr-2"
                  size="small"
                  color="deep-orange-darken-1"
                  >Отклонить
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
                    <v-toolbar-title>Причина отказа</v-toolbar-title>
                    <v-btn
                      icon="mdi-close"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-toolbar>

                  <v-form v-model="form" @submit.prevent="onSubmit(item.id)">
                    <v-card-text>
                      <v-row align="center" dense>
                        <v-col>
                          <v-textarea
                            v-model="refusalReason"
                            label="Укажите причину отказа"
                          />
                          <!-- <v-text-field
                            v-model="refusalReason"
                            placeholder="Укажите причину отказа"
                          /> -->
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col align="end">
                          <v-btn
                            :disabled="!refusalReason"
                            color="blue-grey-darken-2"
                            @click="
                              isActive.value = false;
                              decline(item.id);
                            "
                            >Отправить письмо</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-form>
                </v-card>
              </template>
            </v-dialog>
            <!-- <v-btn
              class="mr-2"
              size="small"
              color="deep-orange-darken-1"
              @click="decline(item.id)"
              >Отклонить</v-btn
            > -->
            <v-btn
              class="mr-2"
              size="small"
              color="teal-darken-3"
              @click="accept(item.id)"
              >Одобрить</v-btn
            >
          </div>
        </template>
      </v-data-table>
    </v-responsive>
  </v-container>
</template>
