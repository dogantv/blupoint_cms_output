<template>
  <div>
    <div class="text-center mb-5"><img src="~/assets/img/logo-white.png" alt="Blupoint CMS" class="logo" /></div>
    <p>{{ $t('pleaseEnterYourUsernameAndPassword') }}</p>
    <el-form class="login-form" ref="loginForm" label-position="top" :model="loginForm" :rules="rules">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" @keyup.enter.native="submitForm('loginForm')" :placeholder="$t('username')"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')" type="password" :placeholder="$t('password')"></el-input>
      </el-form-item>
      <div class="row">
        <div class="col text-left">
        </div>
        <div class="col text-right">
          <el-button type="primary" @click="submitForm('loginForm')" :disabled="$store.state.loading">{{ $t('login') }}</el-button>
        </div>
      </div>
    </el-form>
    <div class="languages">
      <nuxt-link class="font-weight-light" :to="switchLocalePath('tr')">tr</nuxt-link>
      <span class="font-weight-light"> | </span>
      <nuxt-link class="font-weight-light" :to="switchLocalePath('en')">en</nuxt-link>
    </div>
  </div>
</template>
<script>
  export default {
    layout: 'auth',
    head () {
      return {
        title: this.$t('login')
      }
    },
    data () {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [{
            required: true,
            message: this.$t('validationErrors.usernameRequired'),
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: this.$t('validationErrors.passwordRequired'),
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$auth.login({
              data: {
                username: this.loginForm.username,
                password: this.loginForm.password
              }
            }).then(() => {
              if (this.$store.state.auth.user.domains && this.$store.state.auth.user.domains.length) {
                return this.$router.push(this.$i18n.defaultLocale === this.$i18n.locale ? '/' : '/' + this.$i18n.locale)
              }
              this.$alert(this.$t('notAuthorizedAnyDomain'), this.$t('error'), {
                confirmButtonText: this.$t('ok'),
                closeOnClickModal: false,
                callback: () => {
                  this.$store.dispatch('logout')
                }
              })
            }).catch((e) => {
              const errCode = e.response.data.error.code
              this.$notify.error({
                title: this.$t('error'),
                message: this.$t(errCode)
              })
            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
