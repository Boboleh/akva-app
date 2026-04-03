<template>
  <div>
    <NavBar/>
    <Nuxt/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from "~/components/layout/NavBar.vue"

export default Vue.extend({
  name: 'DefaultLayout',
  components: {
    NavBar
  }
})
</script>
