<template>
  <section id="services" class="services-section" v-if="services && services.length">
    <div class="services-grid">
      <div
        v-for="(service, index) in services"
        :key="index"
        class="service-card"
      >
        <div class="service-bg" :style="{ backgroundImage: `url(${service.image})` }"></div>
        <div class="service-overlay"></div>
        <div class="service-content">
          <div class="service-icon">
            <svg v-if="index === 0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <svg v-else-if="index === 1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <svg v-else-if="index === 2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h3 class="service-title">{{ service.title }}</h3>
          <div class="service-hover">
            <a href="#" class="service-link">read more <span>&rarr;</span></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ServicesCards',
  computed: {
    services(): any[] {
      const page = this.$store.getters['page/page']
      return page?.workFeatures || []
    }
  }
})
</script>

<style scoped>
.services-section {
  padding: 0 20px 80px;
}

.services-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.service-card {
  position: relative;
  min-height: 380px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
}

.service-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.service-card:hover .service-bg {
  transform: scale(1.05);
}

.service-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 100%);
}

.service-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  z-index: 2;
  color: #fff;
}

.service-icon {
  margin-bottom: 16px;
  opacity: 0.9;
}

.service-icon svg {
  color: #fff;
}

.service-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.4;
}

.service-hover {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  margin-top: 12px;
}

.service-card:hover .service-hover {
  opacity: 1;
  transform: translateY(0);
}

.service-link {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}

.service-link:hover {
  color: #fff;
}

@media (max-width: 992px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .services-grid {
    grid-template-columns: 1fr;
  }

  .service-card {
    min-height: 300px;
  }
}
</style>
