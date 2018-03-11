<template>
  <section class="container text-center">
    <h1 class="title text-center">
      {{ error.statusCode }}
    </h1>
    <h2 class="info text-center">
      {{ error.message }}
    </h2>
    <nuxt-link class="button" to="/" v-if="error.statusCode === 404">
      {{ $t('homepage') }}
    </nuxt-link>
  </section>
</template>
<script>
export default {
  props: ['error']
}
</script>
