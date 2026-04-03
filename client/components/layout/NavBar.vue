<script lang="ts">
import Vue from 'vue'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

export default Vue.extend({
  name: 'NavBar',
  data() {
    return {
      scrolled: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 50
    }
  }
})
</script>

<template>
  <nav class="navbar-fixed" :class="{ 'navbar-scrolled': scrolled }">
    <div class="navbar-inner">
      <div class="navbar-brand">
        <a href="/">Akva.</a>
      </div>
      <div class="navbar-links">
        <a href="/" class="nav-link active">home</a>
        <a href="#featured" class="nav-link">projects</a>
        <a href="#services" class="nav-link">pages</a>
        <a href="#contact" class="nav-link">contact</a>
      </div>
      <div class="navbar-social">
        <a href="https://www.facebook.com/profile.php?id=100063578886716" target="_blank" rel="noopener">
          <b-icon-facebook />
        </a>
        <a href="#" target="_blank" rel="noopener">
          <b-icon-twitter />
        </a>
        <a href="https://www.instagram.com/akvastarart/" target="_blank" rel="noopener">
          <b-icon-instagram />
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 40px;
  transition: background-color 0.3s ease, padding 0.3s ease;
}

.navbar-scrolled {
  background-color: #fff;
  padding: 12px 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand a {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  letter-spacing: 0.5px;
}

.navbar-scrolled .navbar-brand a {
  color: #111;
}

.navbar-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 1px;
  background: #fff;
}

.navbar-scrolled .nav-link {
  color: rgba(0, 0, 0, 0.5);
}

.navbar-scrolled .nav-link:hover,
.navbar-scrolled .nav-link.active {
  color: #111;
}

.navbar-scrolled .nav-link.active::after {
  background: #111;
}

.navbar-social {
  display: flex;
  gap: 16px;
}

.navbar-social a {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  transition: color 0.3s ease;
}

.navbar-social a:hover {
  color: #fff;
}

.navbar-scrolled .navbar-social a {
  color: rgba(0, 0, 0, 0.5);
}

.navbar-scrolled .navbar-social a:hover {
  color: #111;
}

@media (max-width: 768px) {
  .navbar-fixed {
    padding: 15px 20px;
  }

  .navbar-links {
    display: none;
  }

  .navbar-brand a {
    font-size: 18px;
  }
}
</style>
