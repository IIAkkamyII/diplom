<script setup lang="ts">
import router from "@/router";

function navigateTo(path: string) {
  router.push(path);
}
</script>

<template>
  <v-img src="/src/assets/info.jpg">
    <NavBar />

    <v-container>
      <h2 class="mb-1 text-blue-grey-lighten-4">Информация о сервисе</h2>
      <br />

      <h3 class="mb-1 text-blue-grey-lighten-4">
        Сервис для онлайн записи и получения услуг в Республике Беларусь
        предоставляет ряд возможностей как организациям, так и физическим лицам.
        <br />
        <br />

        <b>Организации</b> могут внести перечень оказываемых услуг, сотрудников
        и время оказания услуг каждым из сотрудников в текущем и следующем
        месяце.
        <br />
        <br />

        <b>Физические лица</b> могут осуществить запись на любую из услуг,
        оказываемых выбранной организацией, а также оставить запрос на
        предоставление организацией необходимого документа (например, выписки из
        поликлиники).
        <br />
        Получение документов доступно только для пользователей, указавших
        паспортные данные.
        <br />
        Информация о записях и заявках отображаются в
        <span
          class="cursor-pointer text-blue-lighten-3"
          @click="navigateTo('login')"
          >личном кабинете</span
        >
        пользователя.
        <br />
        <br />

        <span
          class="cursor-pointer text-blue-lighten-3"
          @click="navigateTo('org-info')"
          >Подать заявку</span
        >
        на регистрацию организации.
        <span
          class="cursor-pointer text-blue-lighten-3"
          @click="navigateTo('registration')"
          >Зарегистрироваться</span
        >
        как физическое лицо.
      </h3>
    </v-container>
  </v-img>
</template>
