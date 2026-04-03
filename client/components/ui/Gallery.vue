<template>
  <div class="gallery">
    <div v-for="(item, index) in images" :key="index" class="gallery-item">
      <img :src="item.image" :alt="item.title || 'Gallery Image'" class="gallery-image"/>
      <h3 v-if="item.title">{{ item.title }}</h3>
      <p v-if="item.description">{{ item.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue';
import { IMainOptions } from "~/store/page"

export default defineComponent({
  name: 'Gallery',
  props: {
    images: {
      type: Array as () => IMainOptions[],
      required: true,
    },
  },
})
</script>

<style scoped>
.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
}

.image-item {
  width: calc(33% - 20px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.image-item:hover {
  transform: translateY(-5px);
}

.image {
  width: 100%;
  height: auto;
  display: block;
}

.info {
  padding: 10px;
}

.info h3 {
  margin: 0;
  font-size: 1.25rem;
}

.info p {
  margin: 10px 0 0;
  font-size: 0.875rem;
}
</style>
