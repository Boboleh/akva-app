<script lang="ts">
import Vue from 'vue'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
export default {
  name: 'NavBar'
}
</script>

<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <div class="container d-block">
        <div class="row  justify-content-between">
          <div class="d-flex">
            <b-navbar-nav>
              <b-nav-item href="#">Home</b-nav-item>
            </b-navbar-nav>
          </div>
          <div class="d-flex">
            <b-navbar-nav>
              <b-nav-item-dropdown text="Lang" right>
                <b-dropdown-item href="#">EN</b-dropdown-item>
                <b-dropdown-item href="#">UA</b-dropdown-item>
              </b-nav-item-dropdown>
              <b-nav-item-dropdown text="User" right>
                <b-dropdown-item href="#">Account</b-dropdown-item>
                <b-dropdown-item href="#">Settings</b-dropdown-item>
              </b-nav-item-dropdown>
              <b-nav-item href="https://www.instagram.com/akvastarart/">
                <b-icon-instagram/>
              </b-nav-item>
              <b-nav-item href="https://www.facebook.com/profile.php?id=100063578886716">
                <b-icon-facebook/>
              </b-nav-item>
              <b-nav-item href="#">
                <b-icon-twitter/>
              </b-nav-item>
            </b-navbar-nav>
          </div>
        </div>
      </div>
    </b-navbar>
  </div>
</template>

<style scoped>

</style>
