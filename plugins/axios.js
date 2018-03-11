export default function ({ $axios, redirect }) {
  $axios.onRequest(config => {
  })

  $axios.onError(error => {
    throw error
  })
}
