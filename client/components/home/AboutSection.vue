<template>
  <section class="about-section" v-if="about">
    <div class="about-inner">
      <div class="about-icon">
        <span class="icon-circle">B</span>
      </div>
      <p class="about-label">who we are</p>
      <h2 class="about-heading">{{ about.title }}</h2>

      <div class="about-columns">
        <div class="about-col-left">
          <span class="col-divider"></span>
          <p>{{ about.subtitle }}</p>
        </div>
        <div class="about-col-right">
          <p>{{ about.description }}</p>
          <a href="#" class="btn-about">about us <span class="btn-dot"></span></a>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AboutSection',
  computed: {
    about(): any {
      const page = this.$store.getters['page/page']
      return page?.about || null
    }
  }
})
</script>

<style scoped>
.about-section {
  background: #fff;
  padding: 100px 20px;
}

.about-inner {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.about-icon {
  margin-bottom: 16px;
}

.icon-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f5c518;
  color: #111;
  font-weight: 700;
  font-size: 18px;
}

.about-label {
  font-size: 13px;
  text-transform: lowercase;
  letter-spacing: 2px;
  color: #888;
  margin-bottom: 20px;
}

.about-heading {
  font-size: 40px;
  font-weight: 700;
  color: #111;
  line-height: 1.25;
  margin: 0 auto 60px;
  max-width: 700px;
}

.about-columns {
  display: flex;
  gap: 60px;
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}

.about-col-left {
  flex: 1;
}

.col-divider {
  display: block;
  width: 100%;
  max-width: 200px;
  height: 1px;
  background: #ddd;
  margin-bottom: 24px;
}

.about-col-left p {
  font-size: 15px;
  color: #333;
  line-height: 1.7;
}

.about-col-right {
  flex: 1;
}

.about-col-right p {
  font-size: 15px;
  color: #666;
  line-height: 1.7;
  margin-bottom: 30px;
}

.btn-about {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #111;
  color: #fff;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: background 0.3s ease;
}

.btn-about:hover {
  background: #333;
  color: #fff;
}

.btn-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f5c518;
}

@media (max-width: 768px) {
  .about-section {
    padding: 60px 20px;
  }

  .about-heading {
    font-size: 28px;
    margin-bottom: 40px;
  }

  .about-columns {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
