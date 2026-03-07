import { GetterTree, MutationTree, ActionTree } from 'vuex'

export const state = () => ({
  error: null as string | null,
  loading: false,
  modal: null
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  error: (state) => state.error,
  loading: (state) => state.loading
}

export const mutations: MutationTree<RootState> = {
  setError(state, error: string | null) {
    state.error = error
  },
  loading(state, value: boolean) {
    state.loading = value
  }
}
