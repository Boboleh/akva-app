<template>
  <section class="process-section" v-if="steps && steps.length">
    <div class="process-inner">
      <h2 class="process-heading">Work process</h2>

      <div class="process-content">
        <div class="process-tabs">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="process-tab"
            :class="{ active: activeStep === index }"
            @click="activeStep = index"
          >
            <span class="tab-title">{{ step.title }}</span>
            <span class="tab-number">{{ formatNumber(index) }}</span>
          </div>
        </div>

        <div class="process-detail">
          <p class="process-description">{{ steps[activeStep].description }}</p>
          <a href="#" class="btn-read-more">read more <span class="btn-dot"></span></a>
        </div>

        <div class="process-visual">
          <div class="visual-circle visual-circle-lg"></div>
          <div class="visual-circle visual-circle-sm"></div>
          <div class="visual-dots"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'WorkProcess',
  data() {
    return {
      activeStep: 0
    }
  },
  computed: {
    steps(): any[] {
      const page = this.$store.getters['page/page']
      return page?.fulfillmentProcedure || []
    }
  },
  methods: {
    formatNumber(index: number): string {
      return String(index + 1).padStart(2, '0')
    }
  }
})
</script>

<style scoped>
.process-section {
  background: #111;
  color: #fff;
  padding: 80px 20px;
}

.process-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.process-heading {
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 50px;
}

.process-content {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

.process-tabs {
  flex: 0 0 220px;
}

.process-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  cursor: pointer;
  border-left: 2px solid transparent;
  padding-left: 20px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.4);
}

.process-tab.active {
  border-left-color: #fff;
  color: #fff;
}

.process-tab:hover {
  color: rgba(255, 255, 255, 0.8);
}

.tab-title {
  font-size: 16px;
  font-weight: 500;
}

.tab-number {
  font-size: 12px;
  opacity: 0.6;
}

.process-detail {
  flex: 1;
  max-width: 400px;
}

.process-description {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin: 0 0 30px;
}

.btn-read-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #fff;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.btn-read-more:hover {
  border-color: #fff;
  color: #fff;
}

.btn-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f5c518;
}

.process-visual {
  flex: 0 0 200px;
  position: relative;
  height: 200px;
}

.visual-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.visual-circle-lg {
  width: 180px;
  height: 180px;
  top: 0;
  right: 0;
}

.visual-circle-sm {
  width: 100px;
  height: 100px;
  bottom: 0;
  right: 40px;
}

.visual-dots {
  position: absolute;
  top: 50%;
  right: 50%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 6px dotted rgba(255, 255, 255, 0.15);
}

@media (max-width: 768px) {
  .process-content {
    flex-direction: column;
    gap: 30px;
  }

  .process-tabs {
    flex: none;
    display: flex;
    overflow-x: auto;
    gap: 0;
    width: 100%;
  }

  .process-tab {
    border-left: none;
    border-bottom: 2px solid transparent;
    padding: 10px 16px;
    white-space: nowrap;
  }

  .process-tab.active {
    border-left-color: transparent;
    border-bottom-color: #fff;
  }

  .process-visual {
    display: none;
  }

  .process-heading {
    font-size: 30px;
  }
}
</style>
