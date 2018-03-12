<template>
  <section class="container">
    <div class="row">
      <div class="col">
        <h1 class="mt-1">{{ $t('outputs') }}</h1>
      </div>
      <div class="col text-right">
        <nuxt-link :to="localePath('create')" class="el-button el-button--default align-middle mt-2" >
          <span>{{ $t('create') }}</span>
        </nuxt-link>
      </div>
    </div>
    <div v-for="output in outputs.data.items" :key="output._id" v-if="outputs.data.count > 0">
      <hr />
      <h5><nuxt-link class="text-dark" :to="output._id">{{ output.name }}</nuxt-link></h5>
      <small class="text-muted">{{ $moment(output.sys.created_at).fromNow() }}</small> - 
      <small class="text-muted">{{ output.type }}</small>&nbsp;
      <el-dropdown @command="itemAction">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="{'action': 'edit', output: output}">{{ $t('edit') }}</el-dropdown-item>
          <el-dropdown-item :command="{'action': 'delete', output: output}">{{ $t('delete') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="text-secondary" v-if="outputs.data.count <= 0">
      <hr />
      {{ $t('thereIsNoOutput') }}
    </div>
  </section>
</template>

<script>
export default {
  middleware: ['auth'],
  async asyncData ({app}) {
    let {data} = await app.$axios.get('api/outputs', {
      baseURL: `http://${app.context.env.host}:${app.context.env.port}`
    })
    return {
      outputs: data
    }
  },
  methods: {
    async refresh () {
      let {data} = await this.$axios.get('api/outputs', {
        baseURL: `http://${process.env.host}:${process.env.port}`
      })
      this.outputs = data
    },
    async itemAction (command) {
      if (command.action === 'edit') {
        this.$router.push(this.localePath({ name: 'id', params: { id: command.output._id } }))
      }
      if (command.action === 'delete') {
        this.$confirm(this.$t('areYouSureToDelete'), this.$t('warning'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(async () => {
          try {
            await this.$axios.delete(`api/outputs/${command.output._id}`, {
              baseURL: `http://${process.env.host}:${process.env.port}`
            })
            this.refresh()
            this.$message({
              type: 'success',
              message: this.$t('deleteCompleted')
            })
          } catch (e) {
            console.error(e)
          }
        }).catch(() => {
        })
      }
    }
  },
  head () {
    return {
      title: this.$t('outputs')
    }
  }
}
</script>
