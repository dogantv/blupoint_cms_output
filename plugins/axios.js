export default function ({ $axios, redirect }) {
  $axios.onRequest(config => {
  })

  $axios.onError(error => {
    if (error.response.status === 401) {
      redirect('/login')
    }
    throw error
  })
}
