<template>
  <div>
    <header class="container">
       <div class="row">
        <div class="col"></div>
        <div class="col-8 text-center"><img src="~/assets/img/logo.png" alt="Blupoint CMS" class="logo" /></div>
        <div class="col">
           <el-date-picker
      v-model="currentDate"
      type="datetime"
      placeholder="Select date and time">
    </el-date-picker>
        </div>
      </div>
    </header>
    <nuxt/>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      currentDate: null
    }
  }
}
</script>
