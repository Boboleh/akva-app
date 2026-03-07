export default function ({ $axios, store, redirect, error }) {
  // $axios.interceptors.response.use(
  //   (response) => {
  //     return response
  //   },
  //   async (error) => {
  //     if (error.response?.status === 401) {
  //       try {
  //         await store.dispatch('auth/refreshToken')
  //       } catch (error) {
  //         await store.dispatch('auth/logout')
  //         return redirect('/login?message=session')
  //       }
  //
  //       try {
  //         const { config } = error
  //         delete config.headers['Authorization']
  //         return $axios(config)
  //       } catch (error) {
  //         return Promise.reject(error)
  //       }
  //     }
  //     return Promise.reject(error)
  //   }
  // )

  $axios.onError((error) => {
    store.commit('setError', error, { root: true })
  })
}
