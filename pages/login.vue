<template>
<div>
  <h2 class="text-center">Login</h2>
  <hr>
  <b-alert v-if="error" show variant="danger">{{ error + '' }}</b-alert>
  <b-alert show v-if="$auth.getState('redirect')">
    You have to login before accessing to <strong>{{ $auth.getState('redirect') }}</strong>
  </b-alert>
  <b-row align-h="center" align-v="center">
    <b-col md="4">
      <b-card bg-variant="light">
        <busy-overlay />
        <form @keydown.enter="login">
        <b-form-group label="Username">
          <b-input v-model="username" placeholder="anything" ref="username" />
        </b-form-group>

        <b-form-group label="Password">
          <b-input type="password" v-model="password" placeholder="123" />
        </b-form-group>

        <div class="text-center">
          <b-btn @click="login" variant="primary" block>Login</b-btn>
        </div>
        </form>
      </b-card>
    </b-col>
  </b-row>
</div>
</template>

<script>
export default {
  middleware: ['auth'],
  data () {
    return {
      username: '',
      password: '',
      error: null
    }
  },
  computed: {
    redirect () {
      return (
        this.$route.query.redirect &&
        decodeURIComponent(this.$route.query.redirect)
      )
    },
    isCallback () {
      return Boolean(this.$route.query.callback)
    }
  },
  methods: {
    async login () {
      this.error = null

      return this.$auth
        .login({
          data: {
            username: this.username,
            password: this.password
          }
        })
        .catch(e => {
          this.error = e + ''
        })
    }
  }
}
</script>
