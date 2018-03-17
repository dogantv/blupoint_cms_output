<template>
  <div>
    <header class="container mt-3 mb-5">
       <div class="row">
        <div class="col-0 col-md-6"></div>
        <div class="col-12 col-md-12 text-left text-md-center"><img src="~/assets/img/logo.png" alt="Blupoint CMS" class="logo" /></div>
        <div class="col-12 col-md-6 text-right">
          <nuxt-link class="text-secondary font-weight-light" :to="switchLocalePath('tr')">tr</nuxt-link>
          <span class="font-weight-light text-secondary"> | </span>
          <nuxt-link class="text-secondary font-weight-light" :to="switchLocalePath('en')">en</nuxt-link>
          &nbsp;&nbsp;
          <el-dropdown  @command="userDropDownHandleCommand">
            <span class="el-dropdown-link" v-if="$auth.state.loggedIn">
              <div v-if="!$auth.state.user.profile_image">
                <fa-icon pack="fa" name="user" /> <i class="el-icon-arrow-down el-icon--right"></i>
              </div>
              <div v-else>
                <img class="rounded-circle" :src="imageBaseUrl+'/30x30/'+$auth.state.user.profile_image._id">&nbsp;<i class="el-icon-arrow-down el-icon--right"></i>
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
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imageBaseUrl: `${process.env.IMAGE_BASE_URL}/${process.env.IMAGE_QUALITY}`
    }
  },
  methods: {
    userDropDownHandleCommand (command) {
      if (command === 'signout') {
        this.$auth.logout()
        this.$router.push(this.localePath('login'))
      }
      if (command === 'outputs') {
        this.$router.push(this.localePath('index'))
      }
    }
  }
}
</script>
