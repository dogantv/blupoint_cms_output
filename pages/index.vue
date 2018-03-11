<template>
  <section class="container">
    <h1>{{ $t('home.title') }}</h1>
    <fa-icon pack="fab" name="font-awesome" />
    <fa-icon pack="fas" name="coffee" />
    <fa-icon pack="fas" name="cog" :spin="true" :fixed-width="false" />
    <fa-icon pack="fab" name="fort-awesome" size="4x" />
    <fa-icon pack="fas" name="spinner" :pulse="true" :fixed-width="true" />
    <fa-icon pack="fab" name="fort-awesome" :rotation="90" />
    <fa-icon pack="fab" name="internet-explorer" flip="both" />
    <ul class="fa-ul">
      <li><fa-icon pack="fas" name="check-square" :list-item="true" />List icons</li>
      <li><fa-icon pack="fas" name="check-square" :list-item="true" />can be used</li>
      <li><fa-icon pack="fas" name="square" :list-item="true" />as bullets</li>
      <li><fa-icon pack="fas" name="square" :list-item="true" />in lists</li>
    </ul>
    <div v-for="domain in domains.data.items" :key="domain._id">
      {{ domain.name }}
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
