<template>

  <div class="product_card">
    <div class="sale" v-if="product.oldPrice">-{{sale}}%</div>
    <div class="product_card-image">
      <div class="slider">
        <Slider
          :images="product.image"
          :settings="{
            textShadow: '1px 1px 2px #ccc',
            fade: true,
            controls: false,
            imgWidth: 350,
            imgHeight: 800
          }"
        />
      </div>
    </div>
    <h5>{{ product.name }}</h5>
    <div class="product_card-price">
      <div class="price-section">
        <div class="old-price new-price">{{ product.oldPrice }} $</div>
        <div class="price">Регулярная цена {{ product.price }} $</div>
      </div>
      <div class="price-time">Время работы: {{ product.fulfillmentTime }} дней</div>
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
.product_card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 350px;
  min-height: 350px;
  border: solid 1px #000000;
  border-radius: 10px;
  padding: 10px;
  margin: 15px;
}
.slider{
  min-height: 400px;
  margin-bottom: 15px;
}
.new-price{
  color: red;
  font-size: 18px;
  font-weight: bold;
}
.sale{
  width: fit-content;
  background-color: red;
  color: aliceblue;
  border-radius: 8px;
  padding: 3px;
  margin: 5px 0 0 20px;
  position: absolute;
  z-index: 2;
}
</style>
