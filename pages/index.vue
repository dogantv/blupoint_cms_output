<template>
  <section class="container">
    <div class="row">
      <div class="col">
        <h1>{{ $t('outputs') }}</h1>
      </div>
      <div class="col text-right">
        <el-button class="align-middle" >{{ $t('create') }}</el-button>
      </div>
    </div>
    
  </section>
</template>

<script>
export default {
  middleware: ['auth'],
  async asyncData ({app}) {
    let { data } = await app.$axios.post('/api/domains/_query', {})
    return { domains: data }
  },
  head () {
    return {
      title: this.$t('outputs')
    }
  }
}
</script>
