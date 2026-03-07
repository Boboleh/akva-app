import {RootState} from "~/store/index"
import {ActionTree, GetterTree, MutationTree} from "vuex"
import {Context} from '@nuxt/types'
import {IMainOptions} from "~/store/page"

export interface IProductCharacteristics {
  name: string
  value: string
}

export interface IProduct {
  id: string
  image: IMainOptions[]
  name: string
  subtitle: string
  price: number
  oldPrice: number
  description: string
  category: string[]
  tags: string
  fulfillmentTime: number
  characteristics: IProductCharacteristics[]
}

export const state = () => ({
  products: [] as IProduct[],
  count: 0,
  product: {} as IProduct
})

export type ProductState = ReturnType<typeof state>

export const getters: GetterTree<ProductState, RootState> = {
  products: (state) => state.products,
  count: (state) => state.count,
  product: (state) => state.product
}

export const mutations: MutationTree<ProductState> = {
  setProducts(state, {products, count}: { products: IProduct[], count: number }) {
    state.products = products
    state.count = count
  },
  setProduct(state, product: IProduct) {
    state.product = product
  }
}

export const actions: ActionTree<ProductState, RootState> = {
  async getAll({commit}) {
    const res = await (this as any).$axios.$post('api/product/findAll', {})

    commit('setProducts', {products: res.products, count: res.count})
  }
}

