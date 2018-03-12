<template>
  <div>
    <output-form />
  </div>
</template>

<script>
import OutputForm from '~/components/form'
export default {
  components: {
    OutputForm
  },
  head () {
    return {
      title: this.$t('createOutput')
    }
  }
}
</script>
