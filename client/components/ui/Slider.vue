<template>
  <div class="container item">
    <b-carousel
      id="carousel-fade"
      :style="`text-shadow: ${settings.textShadow}`"
      :fade="settings.fade"
      :controls="settings.controls"
      class="custom-carousel"
    >
      <b-carousel-slide
        v-for="(image, index) in images"
        :key="index"
        :img-blank="true"
        :img-alt="image.title"
      >
        <template v-slot:img>
          <div
            class="d-block w-100 custom-slide"
            :style="{ backgroundImage: 'url(' + image.image + ')' }"
          ></div>
        </template>
        <div class="d-flex flex-column align-items-start text-left">
          <h2 class="shadow">{{ image.title }}</h2>
          <p class="shadow">{{ image.description }}</p>
        </div>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Slider',
  props: {
    images: {
      type: Array,
      required: true,
      default: () => [],
    },
    settings: {
      type: Object,
      required: false,
      default: () => ({
        textShadow: '0px 0px 2px #000',
        fade: true,
        controls: true,
      }),
    },
  },
}
</script>

<style scoped>
.container {
  width: auto;
}

.custom-carousel .custom-slide {
  height: 480px; /* Фиксированная высота */
  background-size: cover;
  background-position: center center;
}
.shadow{
  text-shadow: 2px 2px 4px #000000
}
</style>
