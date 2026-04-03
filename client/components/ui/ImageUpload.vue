<script lang="ts">
import Vue from 'vue'

interface UploadedFile {
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
}

interface FilePreview {
  file: File
  preview: string
  uploading: boolean
  progress: number
  uploaded?: UploadedFile
  error?: string
}

export default Vue.extend({
  name: 'ImageUpload',

  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    maxFiles: {
      type: Number,
      default: 10
    },
    maxSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB
    },
    acceptedTypes: {
      type: Array as () => string[],
      default: () => ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    },
    token: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      files: [] as FilePreview[],
      isDragging: false,
      uploadedFiles: [] as UploadedFile[]
    }
  },

  computed: {
    canAddMore(): boolean {
      return this.multiple ? this.files.length < this.maxFiles : this.files.length === 0
    },
    acceptString(): string {
      return (this.acceptedTypes as string[]).join(',')
    }
  },

  methods: {
    onDragEnter(e: DragEvent) {
      e.preventDefault()
      this.isDragging = true
    },

    onDragLeave(e: DragEvent) {
      e.preventDefault()
      this.isDragging = false
    },

    onDragOver(e: DragEvent) {
      e.preventDefault()
    },

    onDrop(e: DragEvent) {
      e.preventDefault()
      this.isDragging = false
      const droppedFiles = e.dataTransfer?.files
      if (droppedFiles) {
        this.handleFiles(droppedFiles)
      }
    },

    onFileSelect(e: Event) {
      const input = e.target as HTMLInputElement
      if (input.files) {
        this.handleFiles(input.files)
      }
      input.value = ''
    },

    handleFiles(fileList: FileList) {
      const newFiles = Array.from(fileList)

      for (const file of newFiles) {
        if (!this.canAddMore) {
          this.$emit('error', `Maximum ${this.maxFiles} files allowed`)
          break
        }

        if (!this.acceptedTypes.includes(file.type)) {
          this.$emit('error', `File type ${file.type} is not allowed`)
          continue
        }

        if (file.size > this.maxSize) {
          this.$emit('error', `File ${file.name} exceeds maximum size of ${this.formatSize(this.maxSize)}`)
          continue
        }

        const preview: FilePreview = {
          file,
          preview: URL.createObjectURL(file),
          uploading: false,
          progress: 0
        }

        this.files.push(preview)
      }
    },

    async uploadFile(index: number) {
      const filePreview = this.files[index]
      if (!filePreview || filePreview.uploading || filePreview.uploaded) return

      filePreview.uploading = true
      filePreview.progress = 0
      filePreview.error = undefined

      const formData = new FormData()
      formData.append('file', filePreview.file)

      try {
        const config: any = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              filePreview.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            }
          }
        }

        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }

        const response = await this.$axios.$post('api/upload/single', formData, config)

        filePreview.uploaded = response
        filePreview.uploading = false
        filePreview.progress = 100

        this.uploadedFiles.push(response)
        this.$emit('uploaded', response)
        this.$emit('change', this.uploadedFiles)
      } catch (error: any) {
        filePreview.uploading = false
        filePreview.error = error.response?.data?.message || 'Upload failed'
        this.$emit('error', filePreview.error)
      }
    },

    async uploadAll() {
      const pendingFiles = this.files.filter(f => !f.uploaded && !f.uploading)
      for (let i = 0; i < this.files.length; i++) {
        if (!this.files[i].uploaded && !this.files[i].uploading) {
          await this.uploadFile(i)
        }
      }
    },

    removeFile(index: number) {
      const file = this.files[index]
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      if (file.uploaded) {
        const uploadedIndex = this.uploadedFiles.findIndex(f => f.filename === file.uploaded!.filename)
        if (uploadedIndex > -1) {
          this.uploadedFiles.splice(uploadedIndex, 1)
        }
      }
      this.files.splice(index, 1)
      this.$emit('change', this.uploadedFiles)
    },

    async deleteFromServer(index: number) {
      const file = this.files[index]
      if (!file.uploaded) return

      try {
        const config: any = { headers: {} }
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }

        await this.$axios.$delete(`api/upload/${file.uploaded.filename}`, config)
        this.removeFile(index)
        this.$emit('deleted', file.uploaded)
      } catch (error: any) {
        this.$emit('error', error.response?.data?.message || 'Delete failed')
      }
    },

    formatSize(bytes: number): string {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    clearAll() {
      this.files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
      this.files = []
      this.uploadedFiles = []
      this.$emit('change', [])
    },

    getUploadedUrls(): string[] {
      return this.uploadedFiles.map(f => f.url)
    }
  },

  beforeDestroy() {
    this.files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
  }
})
</script>

<template>
  <div class="image-upload">
    <div
      class="upload-zone"
      :class="{ 'is-dragging': isDragging, 'has-files': files.length > 0 }"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
      @click="$refs.fileInput.click()"
      v-if="canAddMore"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="acceptString"
        :multiple="multiple"
        class="file-input"
        @change="onFileSelect"
      />
      <div class="upload-content">
        <div class="upload-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <p class="upload-text">
          <span v-if="isDragging">Drop files here</span>
          <span v-else>Drag & drop images here or <strong>click to browse</strong></span>
        </p>
        <p class="upload-hint">
          {{ multiple ? `Up to ${maxFiles} files` : 'Single file' }}, max {{ formatSize(maxSize) }}
        </p>
      </div>
    </div>

    <div class="files-preview" v-if="files.length > 0">
      <div
        class="file-item"
        v-for="(file, index) in files"
        :key="index"
      >
        <div class="file-preview">
          <img :src="file.preview" :alt="file.file.name" />
          <div class="file-overlay" v-if="file.uploading">
            <b-progress :value="file.progress" :max="100" animated />
          </div>
          <div class="file-status uploaded" v-if="file.uploaded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="file-status error" v-if="file.error">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
        </div>
        <div class="file-info">
          <p class="file-name" :title="file.file.name">{{ file.file.name }}</p>
          <p class="file-size">{{ formatSize(file.file.size) }}</p>
          <p class="file-error" v-if="file.error">{{ file.error }}</p>
        </div>
        <div class="file-actions">
          <b-button
            v-if="!file.uploaded && !file.uploading"
            size="sm"
            variant="primary"
            @click.stop="uploadFile(index)"
          >
            Upload
          </b-button>
          <b-button
            v-if="file.uploaded"
            size="sm"
            variant="danger"
            @click.stop="deleteFromServer(index)"
          >
            Delete
          </b-button>
          <b-button
            v-if="!file.uploaded"
            size="sm"
            variant="outline-secondary"
            @click.stop="removeFile(index)"
          >
            Remove
          </b-button>
        </div>
      </div>
    </div>

    <div class="upload-actions" v-if="files.length > 0">
      <b-button
        variant="success"
        @click="uploadAll"
        :disabled="files.every(f => f.uploaded || f.uploading)"
      >
        Upload All
      </b-button>
      <b-button
        variant="outline-danger"
        @click="clearAll"
      >
        Clear All
      </b-button>
    </div>
  </div>
</template>

<style scoped>
.image-upload {
  width: 100%;
}

.upload-zone {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.upload-zone:hover {
  border-color: #0d6efd;
  background-color: #e7f1ff;
}

.upload-zone.is-dragging {
  border-color: #0d6efd;
  background-color: #cfe2ff;
}

.file-input {
  display: none;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  color: #6c757d;
  margin-bottom: 16px;
}

.upload-zone:hover .upload-icon,
.upload-zone.is-dragging .upload-icon {
  color: #0d6efd;
}

.upload-text {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #495057;
}

.upload-hint {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
}

.files-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.file-item {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.file-preview {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
  background: #f8f9fa;
}

.file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.file-status {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-status.uploaded {
  background: #198754;
  color: white;
}

.file-status.error {
  background: #dc3545;
  color: white;
}

.file-info {
  padding: 12px;
}

.file-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  margin: 0;
  font-size: 12px;
  color: #6c757d;
}

.file-error {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #dc3545;
}

.file-actions {
  padding: 0 12px 12px;
  display: flex;
  gap: 8px;
}

.file-actions .btn {
  flex: 1;
}

.upload-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
