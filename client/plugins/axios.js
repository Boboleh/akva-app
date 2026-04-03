export default function ({ $axios, store }) {
  $axios.onError((error) => {
    store.commit('setError', error, { root: true })
  })
}
