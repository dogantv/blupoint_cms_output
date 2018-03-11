<template>
  <div>
    <header class="container mt-3 mb-5">
       <div class="row">
        <div class="col"></div>
        <div class="col-6 text-center"><img src="~/assets/img/logo.png" alt="Blupoint CMS" class="logo" /></div>
        <div class="col text-right ">
          <nuxt-link class="text-secondary font-weight-light" :to="switchLocalePath('tr')">tr</nuxt-link>
          <span class="font-weight-light text-secondary"> | </span>
          <nuxt-link class="text-secondary font-weight-light" :to="switchLocalePath('en')">en</nuxt-link>
          &nbsp;&nbsp;
          <el-dropdown  @command="userDropDownHandleCommand">
            <span class="el-dropdown-link" v-if="$auth.state.loggedIn">
              <div v-if="!$auth.state.user.profile_image">
                <fa-icon pack="fa" name="user" />&nbsp;{{ $auth.state.user.fullname }}
              </div>
              <div v-else>
                <img class="rounded-circle" :src="imageBaseUrl+'/30x30/'+$auth.state.user.profile_image._id">&nbsp;<fa-icon pack="fa" name="caret-down" class="align-middle" />
              </div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="outputs">{{ $t('outputs') }}</el-dropdown-item>
              <el-dropdown-item command="signout" divided>{{ $t('signout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </header>
    <nuxt/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imageBaseUrl: `${process.env.imageBaseUrl}/${process.env.imageQuality}`
    }
  },
  methods: {
    userDropDownHandleCommand (command) {
      if (command === 'signout') {
        this.$auth.logout()
        this.$router.push('/login')
      }
      if (command === 'outputs') {
        this.$router.push(this.localePath('index'))
      }
    }
  }
}
</script>
