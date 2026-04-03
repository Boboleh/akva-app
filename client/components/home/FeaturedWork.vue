<template>
  <section id="featured" class="featured-section" v-if="items && items.length">
    <div class="featured-inner">
      <div class="featured-header">
        <h2 class="featured-heading">Featured<br>work</h2>
        <div class="featured-header-right">
          <span class="header-line"></span>
          <a href="#" class="btn-all-work">all work <span class="btn-dot"></span></a>
        </div>
      </div>

      <div class="featured-grid">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="featured-item"
        >
          <div class="featured-image-wrapper">
            <img :src="item.image" :alt="item.title" class="featured-image" />
            <div class="featured-overlay">
              <a href="#" class="featured-view-btn">view</a>
            </div>
          </div>
          <h3 class="featured-title">{{ item.title }}</h3>
          <span class="featured-category">{{ item.description }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'FeaturedWork',
  computed: {
    items(): any[] {
      const page = this.$store.getters['page/page']
      return page?.bestseller || []
    }
  }
})
</script>

<style scoped>
.featured-section {
  padding: 80px 20px;
  background: #fff;
}

.featured-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.featured-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 60px;
}

.featured-heading {
  font-size: 64px;
  font-weight: 700;
  color: #111;
  line-height: 1.1;
  margin: 0;
}

.featured-header-right {
  display: flex;
  align-items: center;
  gap: 30px;
  padding-bottom: 12px;
}

.header-line {
  display: block;
  width: 60px;
  height: 2px;
  background: #111;
}

.btn-all-work {
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

.btn-all-work:hover {
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

.featured-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.featured-item:nth-child(even) {
  margin-top: 60px;
}

.featured-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background: #f5f5f5;
}

.featured-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.featured-item:hover .featured-image {
  transform: scale(1.03);
}

.featured-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-image-wrapper:hover .featured-overlay {
  opacity: 1;
}

.featured-view-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #fff;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: transform 0.3s ease;
}

.featured-view-btn:hover {
  transform: scale(1.1);
}

.featured-title {
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin: 16px 0 4px;
}

.featured-category {
  font-size: 14px;
  color: #888;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .featured-heading {
    font-size: 40px;
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }

  .featured-item:nth-child(even) {
    margin-top: 0;
  }

  .featured-image {
    height: 280px;
  }

  .featured-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
