<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'UploadPage',

  data() {
    return {
      token: '',
      loginForm: {
        login: '',
        password: ''
      },
      isLoggedIn: false,
      loginError: '',
      uploadedImages: [] as any[]
    }
  },

  methods: {
    async login() {
      this.loginError = ''
      try {
        const response = await this.$axios.$post('api/auth/login', this.loginForm)
        this.token = response.accessToken
        this.isLoggedIn = true
      } catch (error: any) {
        this.loginError = error.response?.data?.message || 'Login failed'
      }
    },

    logout() {
      this.token = ''
      this.isLoggedIn = false
      this.uploadedImages = []
    },

    onUploaded(file: any) {
    },

    onError(error: string) {
      this.$bvToast.toast(error, {
        title: 'Error',
        variant: 'danger',
        solid: true
      })
    },

    onChange(files: any[]) {
      this.uploadedImages = files
    },

    onDeleted(file: any) {
    }
  }
})
</script>

<template>
  <div class="container py-5">
    <h1 class="mb-4">Image Upload Demo</h1>

    <div v-if="!isLoggedIn" class="login-section">
      <b-card title="Login Required" class="mb-4">
        <b-form @submit.prevent="login">
          <b-form-group label="Email" label-for="login">
            <b-form-input
              id="login"
              v-model="loginForm.login"
              type="email"
              placeholder="admin@akva.com"
              required
            />
          </b-form-group>

          <b-form-group label="Password" label-for="password">
            <b-form-input
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="Admin123!"
              required
            />
          </b-form-group>

          <b-alert v-if="loginError" variant="danger" show>
            {{ loginError }}
          </b-alert>

          <b-button type="submit" variant="primary">
            Login
          </b-button>
        </b-form>

        <p class="mt-3 text-muted">
          Test credentials: admin@akva.com / Admin123!
        </p>
      </b-card>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0">Logged in</h5>
        <b-button variant="outline-secondary" size="sm" @click="logout">
          Logout
        </b-button>
      </div>

      <b-card title="Single Image Upload" class="mb-4">
        <ImageUpload
          :token="token"
          @uploaded="onUploaded"
          @error="onError"
          @change="onChange"
          @deleted="onDeleted"
        />
      </b-card>

      <b-card title="Multiple Image Upload" class="mb-4">
        <ImageUpload
          :token="token"
          :multiple="true"
          :max-files="5"
          @uploaded="onUploaded"
          @error="onError"
          @change="onChange"
          @deleted="onDeleted"
        />
      </b-card>

      <b-card title="Uploaded Images" v-if="uploadedImages.length > 0">
        <div class="uploaded-list">
          <div v-for="img in uploadedImages" :key="img.filename" class="uploaded-item">
            <img :src="'http://localhost:3000' + img.url" :alt="img.originalName" />
            <code>{{ img.url }}</code>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<style scoped>
.login-section {
  max-width: 400px;
  margin: 0 auto;
}

.uploaded-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.uploaded-item {
  text-align: center;
}

.uploaded-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.uploaded-item code {
  font-size: 10px;
  word-break: break-all;
  display: block;
}
</style>
