<template>
  <section class="hero-slider" v-if="slides && slides.length" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="hero-slide"
      :class="{ active: currentIndex === index }"
      :style="{ backgroundImage: `url(${slide.image})` }"
    >
      <div class="hero-overlay"></div>
    </div>

    <div class="hero-content">
      <span class="hero-accent-line"></span>
      <h1 class="hero-title">{{ currentSlide.title }}</h1>
      <p class="hero-description" v-if="currentSlide.description">{{ currentSlide.description }}</p>
    </div>

    <button class="hero-arrow hero-arrow-left" @click="prevSlide">
      <span>&larr;</span>
    </button>
    <button class="hero-arrow hero-arrow-right" @click="nextSlide">
      <span>&rarr;</span>
    </button>

    <a href="#featured" class="hero-view-btn">view</a>

    <div class="hero-counter">
      <span class="counter-current">{{ formattedCurrent }}</span>
      <span class="counter-divider">&mdash;</span>
      <span class="counter-total">{{ formattedTotal }}</span>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HeroSlider',
  data() {
    return {
      currentIndex: 0,
      autoplayInterval: null as ReturnType<typeof setInterval> | null
    }
  },
  computed: {
    slides(): any[] {
      const page = this.$store.getters['page/page']
      return page?.slider || []
    },
    currentSlide(): any {
      return this.slides[this.currentIndex] || {}
    },
    formattedCurrent(): string {
      return String(this.currentIndex + 1).padStart(2, '0')
    },
    formattedTotal(): string {
      return String(this.slides.length).padStart(2, '0')
    }
  },
  mounted() {
    this.startAutoplay()
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    this.stopAutoplay()
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length
    },
    startAutoplay() {
      this.autoplayInterval = setInterval(this.nextSlide, 5000)
    },
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval)
        this.autoplayInterval = null
      }
    },
    pauseAutoplay() {
      this.stopAutoplay()
    },
    resumeAutoplay() {
      this.startAutoplay()
    },
    handleKeydown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') this.prevSlide()
      if (e.key === 'ArrowRight') this.nextSlide()
    }
  }
})
</script>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #111;
}

.hero-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hero-slide.active {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
}

.hero-content {
  position: absolute;
  left: 80px;
  bottom: 30%;
  z-index: 10;
  max-width: 600px;
}

.hero-accent-line {
  display: block;
  width: 60px;
  height: 2px;
  background: #fff;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  line-height: 1.15;
  margin: 0;
  letter-spacing: -0.5px;
}

.hero-description {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 16px;
  line-height: 1.6;
}

.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  padding: 16px;
  transition: color 0.3s ease;
}

.hero-arrow:hover {
  color: #fff;
}

.hero-arrow-left {
  left: 20px;
}

.hero-arrow-right {
  right: 20px;
}

.hero-view-btn {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fff;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero-view-btn:hover {
  transform: translateY(-50%) scale(1.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-counter {
  position: absolute;
  bottom: 40px;
  left: 80px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  letter-spacing: 1px;
}

.counter-current {
  color: #fff;
  font-weight: 600;
}

.counter-divider {
  display: inline-block;
  width: 30px;
  text-align: center;
}

@media (max-width: 768px) {
  .hero-content {
    left: 30px;
    right: 30px;
    bottom: 25%;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-view-btn {
    display: none;
  }

  .hero-counter {
    left: 30px;
    bottom: 30px;
  }

  .hero-arrow-left {
    left: 10px;
  }

  .hero-arrow-right {
    right: 10px;
  }
}
</style>
