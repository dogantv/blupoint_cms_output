<template>
  <div>
    <div :id="'javascript-editor-' + propId" class="editor el-input__inner"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: '',
      type: String
    },
    readonly: {
      default: false,
      type: Boolean
    },
    propId: {
      default: '',
      type: String
    },
    type: {
      default: 'xml',
      type: String
    }
  },
  data () {
    return {
      editor: undefined
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      if (this.editor.getValue() !== newValue || this.readonly) {
        this.editor.setValue(newValue)
      }
    }
  },
  mounted () {
    const ace = require('brace')
    require('brace/mode/xml')
    require('brace/mode/javascript')
    require('brace/theme/xcode')

    this.editor = ace.edit('javascript-editor-' + this.propId)
    this.editor.getSession().setMode(`ace/mode/${this.type}`)
    this.editor.setTheme('ace/theme/xcode')

    this.editor.setOptions({
      maxLines: 40
    })

    this.editor.setValue(this.value || '')
    this.editor.clearSelection()

    if (!this.readonly) {
      this.editor.on('change', (e) => {
        this.$emit('input', this.editor.getValue())
      })
    } else {
      this.editor.setReadOnly(true)
    }
  }
}
</script>
<style scoped lang="scss">
  .editor {
    width: 100%;
  }
</style>
