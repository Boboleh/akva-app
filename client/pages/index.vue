<template>
  <div>
    <NavBar/>
    <div class="theme-background">
      <div class="bg-dark"></div>
    </div>
    <div class="slider">
      <Slider :images="page.slider"/>
    </div>
    <section class="about">
      <h2>{{ page.about.title }}</h2>
      <h3>{{ page.about.subtitle }}</h3>
      <p>{{ page.about.description }}</p>
    </section>
    <div class="products-container">
      <Card
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
    <section class="bestseller">
      <h2>Bestsellers</h2>
      <Gallery :images="page.bestseller"/>
    </section>
    <section class="work-features">
      <h2>Work Features</h2>
      <div class="gallery">
        <Gallery :images="page.workFeatures"/>
      </div>
    </section>
    <section class="contact-info">
      <h2>Contact Information</h2>
      <p>{{ page.info.title }}</p>
      <p>{{ page.info.subtitle }}</p>
      <p>Phone: {{ page.info.telephone }}</p>
      <p>Email: {{ page.info.email }}</p>
      <a :href="page.info.instagram">Instagram</a>
      <a :href="page.info.facebook">Facebook</a>
    </section>
    <section class="what-new">
      <h2>What's New</h2>
      <div class="gallery">
        <Gallery :images="page.whatNew"/>
      </div>
    </section>
    <section class="fulfillment-procedure">
      <h2>Fulfillment Procedure</h2>
      <div class="gallery">
        <Gallery :images="page.fulfillmentProcedure"/>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from "~/components/Card.vue"
import Slider from "~/components/Slider.vue"
import Gallery from "~/components/Gallery.vue"
import NavBar from "~/components/NavBar.vue"

export default Vue.extend({
  name: 'IndexPage',
  components: {
    NavBar,
    Card,
    Slider,
    Gallery
  },
  async asyncData({store}) {
    return await Promise.all([
      store.dispatch('product/getAll', {}),
      store.dispatch('page/getPage', { name: 'Main page' })
    ])
  },
  methods: {
  },
  computed: {
    products(): any {
      return this.$store.getters['product/products']
    },
    page(): any {
      const page = this.$store.getters['page/page']
      console.log('page', page)
      return page
    }
  }
})
</script>

<style>
.products-container, .gallery {
  width: 1140px;
  margin: 30px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.about, .bestseller, .work-features, .contact-info, .what-new, .fulfillment-procedure {
  width: 1140px;
  margin: 30px auto;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
