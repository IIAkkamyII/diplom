<script setup>
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const darkMode = ref(false);

onBeforeUnmount(() => {
  setLocalStorage();
});

onBeforeMount(() => {
  getLocalStorage();
});

const toggleTheme = () => {
  theme.global.defaultThe.value = darkMode.value ? "dark" : "light";
  // Optional: Get value of current theme
  console.log(`Current theme is dark? ${theme.global.name.value}`);
};

function getLocalStorage() {
  const theme = localStorage.getItem("theme", theme.global.name.value);

  if (
    (theme === "light" && !darkMode.value) ||
    (theme === "dark" && darkMode.value)
  ) {
    return;
  }
  toggleTheme();
}

function setLocalStorage() {
  localStorage.setItem("theme", theme.global.name.value);
}
</script>

<template>
  <v-switch
    inset
    color="info"
    v-model="darkMode"
    @change="toggleTheme()"
    :label="`It's ${darkMode ? 'Dark' : 'Light'}!`"
  ></v-switch>
</template>
