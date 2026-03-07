<template>
  <div class="container">
    <div class="slider">
      <div class="sale" v-if="product.oldPrice">-{{sale}}%</div>
      <div class="slider">
        <Slider
          :images="product.image"
          :settings="{
            textShadow: '1px 1px 2px #ccc',
            fade: true,
            controls: false,
            imgWidth: 600,
            imgHeight: 800
          }"
        />
      </div>
    </div>
    <div class="details">
      <div class="product_card-price">
        <div class="price-section">
          <div class="old-price new-price">{{ product.oldPrice }} $</div>
          <div class="price">Регулярная цена {{ product.price }} $</div>
        </div>
        <div class="price-time">Время работы: {{ product.fulfillmentTime }} дней</div>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "~/components/Slider.vue"

export default {
  name: 'Card',
  components: {
    Slider
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed:{
    sale(){
      return Math.floor(100 - ((this.product.oldPrice/this.product.price)*100))
    }
  }
}
</script>

<style scoped>

</style>
