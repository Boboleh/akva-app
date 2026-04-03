<template>
  <footer id="contact" class="footer-section">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <h3 class="footer-logo">Akva.</h3>
          <p class="footer-tagline">Premium aquarium equipment and supplies</p>
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <h4>Navigation</h4>
            <a href="/">Home</a>
            <a href="#featured">Projects</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>

          <div class="footer-col" v-if="info">
            <h4>Contact</h4>
            <a v-if="info.telephone" :href="'tel:+' + info.telephone">{{ formatPhone(info.telephone) }}</a>
            <a v-if="info.email" :href="'mailto:' + info.email">{{ info.email }}</a>
          </div>

          <div class="footer-col" v-if="info">
            <h4>Social</h4>
            <a v-if="info.instagram" :href="info.instagram" target="_blank" rel="noopener">Instagram</a>
            <a v-if="info.facebook" :href="info.facebook" target="_blank" rel="noopener">Facebook</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Akva. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'FooterSection',
  computed: {
    info(): any {
      const page = this.$store.getters['page/page']
      return page?.info || null
    },
    currentYear(): number {
      return new Date().getFullYear()
    }
  },
  methods: {
    formatPhone(phone: number): string {
      const str = String(phone)
      if (str.length === 12) {
        return `+${str.slice(0, 2)} (${str.slice(2, 5)}) ${str.slice(5, 8)}-${str.slice(8, 10)}-${str.slice(10)}`
      }
      return `+${str}`
    }
  }
})
</script>

<style scoped>
.footer-section {
  background: #111;
  color: #fff;
  padding: 60px 20px 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 60px;
  margin-bottom: 50px;
}

.footer-logo {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
}

.footer-tagline {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 60px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px;
  color: #fff;
}

.footer-col a {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-col a:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    gap: 30px;
  }

  .footer-links {
    flex-direction: column;
    gap: 24px;
  }
}
</style>
