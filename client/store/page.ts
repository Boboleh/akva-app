import {ActionTree, GetterTree, MutationTree} from "vuex"
import {RootState} from "~/store/index"

export interface IAbout {
  title: string
  subtitle: string
  description: string
}
export interface ICategory {
  active: boolean
  value: string
}
export interface IMainOptions {
  title?: string
  description?: string
  image: string
}

export interface IInfoOptions {
  title: string;
  subtitle: string;
  telephone: number;
  email: string;
  instagram: string;
  facebook: string;
}

export interface IPage {
  name: string
  about: IAbout
  category: ICategory[]
  slider: IMainOptions[]
  bestseller: IMainOptions[]
  workFeatures: IMainOptions[]
  infoOptions: IInfoOptions
  whatNew: IMainOptions[]
  fulfillmentProcedure: IMainOptions[]
}

export const state = () => ({
  page: {} as IPage
})

export type PageState = ReturnType<typeof state>
export const getters: GetterTree<PageState, RootState> = {
  page: (state) => state.page
}
export const mutations: MutationTree<PageState> = {
  setPage(state, {page}: {page: IPage } ) {
    state.page = page
  }
}
export const actions: ActionTree<PageState, RootState> = {
  async getPage({commit}, {name}: {name: string}) {
    const res = await (this as any).$axios.$get('api/page', {params: {name}})
    commit('setPage', {page: res})
  }
}
