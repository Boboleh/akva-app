<template>
  <div class="home-page">
    <NavBar />
    <HeroSlider />
    <AboutSection />
    <ServicesCards />
    <FeaturedWork />
    <WorkProcess />
    <FooterSection />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from '~/components/layout/NavBar.vue'
import HeroSlider from '~/components/home/HeroSlider.vue'
import AboutSection from '~/components/home/AboutSection.vue'
import ServicesCards from '~/components/home/ServicesCards.vue'
import FeaturedWork from '~/components/home/FeaturedWork.vue'
import WorkProcess from '~/components/home/WorkProcess.vue'
import FooterSection from '~/components/home/FooterSection.vue'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    NavBar,
    HeroSlider,
    AboutSection,
    ServicesCards,
    FeaturedWork,
    WorkProcess,
    FooterSection
  },
  async asyncData({ store }) {
    return await Promise.all([
      store.dispatch('product/getAll', {}),
      store.dispatch('page/getPage', { name: 'Main page' })
    ])
  },
  computed: {
    products(): any {
      return this.$store.getters['product/products']
    },
    page(): any {
      return this.$store.getters['page/page']
    }
  }
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

.home-page {
  overflow-x: hidden;
}
</style>
