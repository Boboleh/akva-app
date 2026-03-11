import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from './index'

export interface UploadedFile {
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
}

export interface UploadState {
  uploadedFiles: UploadedFile[]
  uploading: boolean
  error: string | null
}

export const state = (): UploadState => ({
  uploadedFiles: [],
  uploading: false,
  error: null
})

export const getters: GetterTree<UploadState, RootState> = {
  uploadedFiles: (state) => state.uploadedFiles,
  uploading: (state) => state.uploading,
  error: (state) => state.error,
  uploadedUrls: (state) => state.uploadedFiles.map(f => f.url)
}

export const mutations: MutationTree<UploadState> = {
  setUploading(state, value: boolean) {
    state.uploading = value
  },
  setError(state, error: string | null) {
    state.error = error
  },
  addUploadedFile(state, file: UploadedFile) {
    state.uploadedFiles.push(file)
  },
  removeUploadedFile(state, filename: string) {
    const index = state.uploadedFiles.findIndex(f => f.filename === filename)
    if (index > -1) {
      state.uploadedFiles.splice(index, 1)
    }
  },
  clearUploadedFiles(state) {
    state.uploadedFiles = []
  }
}

export const actions: ActionTree<UploadState, RootState> = {
  async uploadSingle({ commit }, { file, token }: { file: File, token: string }) {
    commit('setUploading', true)
    commit('setError', null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await (this as any).$axios.$post('api/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      commit('addUploadedFile', response)
      commit('setUploading', false)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Upload failed'
      commit('setError', message)
      commit('setUploading', false)
      throw error
    }
  },

  async uploadMultiple({ commit }, { files, token }: { files: File[], token: string }) {
    commit('setUploading', true)
    commit('setError', null)

    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await (this as any).$axios.$post('api/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      response.files.forEach((file: UploadedFile) => {
        commit('addUploadedFile', file)
      })

      commit('setUploading', false)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Upload failed'
      commit('setError', message)
      commit('setUploading', false)
      throw error
    }
  },

  async deleteFile({ commit }, { filename, token }: { filename: string, token: string }) {
    try {
      await (this as any).$axios.$delete(`api/upload/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      commit('removeUploadedFile', filename)
      return true
    } catch (error: any) {
      const message = error.response?.data?.message || 'Delete failed'
      commit('setError', message)
      throw error
    }
  },

  clearFiles({ commit }) {
    commit('clearUploadedFiles')
    commit('setError', null)
  }
}
