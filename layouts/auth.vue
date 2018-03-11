<template>
  <div class="auth-container">
    <div class="">
      <div class="row align-items-center">
        <div class="col-20 offset-2 col-sm-14 offset-sm-5 col-md-10 offset-md-7 col-lg-8 offset-lg-8 col-xl-6 offset-lg-9">
          <nuxt/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    options: {
      auth: false
    }
  }
</script>
<style lang="scss">
  @import 'assets/scss/auth';
</style>
