<template>
  <section class="container">
    <el-form ref="form" :model="form" :rules="rules">
      <div class="row">
        <div class="col-24 col-md-18 text-truncate">
          <h1 class="mt-1 text-truncate">{{ form.name || $t('createOutput') }}</h1>
          <small class="form-text">
            <a class="text-muted" :href="outputUrl" target="_blank">{{outputUrl}}</a>
          </small>
        </div>
        <div class="col-24 col-md text-right">
          <el-button class="align-middle mt-2" @click="submitForm()">
            <span>{{ $t('save') }}</span>
          </el-button>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-24 col-md-12">
          <el-form-item :label="$t('name')" prop="name">
            <el-input v-model="form.name" @change="setSlug" :placeholder="$t('name')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('slug')" prop="slug">
            <el-input v-model="form.slug" :placeholder="$t('slug')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('type')" prop="type">
            <el-select v-model="form.type" :placeholder="$t('type')" class="w-100" @change="changeType">
              <el-option label="RSS" value="rss"></el-option>
              <el-option label="Sitemap" value="sitemap"></el-option>
              <el-option label="Sitemap (News)" value="news_sitemap"></el-option>
              <el-option label="Sitemap (Complex)" value="complex_sitemap"></el-option>
              <el-option label="Sitemap Index" value="sitemap_index"></el-option>
              <el-option label="xml" value="xml"></el-option>
              <el-option label="json" value="json"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="col-24 col-md-12">
          <el-form-item :label="$t('domain')" prop="domain_id">
            <el-select v-model="form.domain_id" :placeholder="$t('domain')" class="w-100" @change="changeDomain">
              <el-option v-for="domain in domains.data.items" :key="domain._id" :label="domain.name" :value="domain._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('platform')" prop="platform_id">
            <el-select v-model="form.platform_id" :placeholder="$t('platform')" class="w-100" :disabled="platforms.data.count <= 0">
              <el-option v-for="platform in platforms.data.items" :key="platform._id" :label="platform.name" :value="platform._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('datasource')" prop="datasource_id">
            <el-select v-model="form.datasource_id" :placeholder="$t('datasource')" class="w-100" :disabled="datasources.data.count <= 0">
              <el-option v-for="datasource in datasources.data.items" :key="datasource._id" :label="datasource.name" :value="datasource._id"></el-option>
            </el-select>
          </el-form-item>          
        </div>
      </div>
      <el-tabs v-model="activeTab">
        <el-tab-pane :label="$t('template')" name="template">
          <blockquote>
            <small class="text-muted">{{ $t('descs.templateUsage') }}</small>
          </blockquote>
          <el-form-item prop="template" v-if="selectedTemplate">
            <ace v-model="form.template" prop-id="template" :type="selectedTemplate.editorType" />
          </el-form-item>
          <blockquote>
            <small class="text-muted">{{ $t('descs.functionUsage') }}</small>&nbsp;
            <el-button type="text" @click="addFunction">{{ $t('add') }}</el-button>
          </blockquote>
          <div v-for="(item, index) in form.functions" :key="index">
            <hr />
            <div class="row">
              <div class="col-24 col-md-12">
                <el-button style="position:relative;z-index:10" class="float-left align-center mt-1 pr-2 text-danger" :plain="true" size="mini" type="text" @click="removeFunction(item)">
                  <i class="el-icon-error"></i>
                </el-button>
                <el-form-item
                  :label="$t('function')"
                  :prop="'functions.' + index + '.name'"
                  :rules="{
                    required: true, message: $t('validationErrors.nameRequired'), trigger: 'blur'
                  }"
                >
                  <el-input v-model="item.name" :placeholder="$t('name')"></el-input>
                </el-form-item>
              </div>
            </div>
            <el-form-item
              class=""
              :prop="'functions.' + index + '.function'"
              :rules="{
                required: true, message: $t('validationErrors.functionRequired'), trigger: 'blur'
              }"
            >
              <ace v-model="item.function" :prop-id="'functions.' + index + '.function'" type="javascript" />
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('preview')" name="preview">
          <div class="row">
            <div class="col-18">
              <el-form-item prop="params">
                <el-input v-model="params" :placeholder="testQueryTemplate || $t('params')"></el-input>
                <small v-if="params" class="text-muted">{{ testQueryTemplate || $t('params') }}</small>
              </el-form-item>
            </div>
            <div class="col">
              <el-button @click="setPreview()">
                <span>{{ $t('preview') }}</span>
              </el-button>
            </div>
          </div>
          <ace ref="preview" v-model="output" v-if="output" :readonly="true" prop-id="preview" :type="previewEditorType" />
            <blockquote v-else>
              <small class="text-muted">{{ $t('descs.preview') }}</small>
            </blockquote>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </section>
</template>

<script>
import slugify from 'slugify'
import ace from '~/components/ace'
import Mustache from 'mustache'
import safeEval from 'safe-eval'
export default {
  components: {
    ace
  },
  data () {
    return {
      outputs: {
        data: {
          items: [],
          count: 0
        }
      },
      domains: {
        data: {
          items: [],
          count: 0
        }
      },
      datasources: {
        data: {
          items: [],
          count: 0
        }
      },
      platforms: {
        data: {
          items: [],
          count: 0
        }
      },
      activeTab: 'template',
      params: null,
      output: '',
      templates: require('~/utils/types.js'),
      previewEditorType: 'xml',
      oldType: '',
      form: {
        name: '',
        slug: '',
        domain_id: '',
        datasource_id: '',
        platform_id: '',
        type: '',
        template: null,
        membership_id: this.$auth.state.user.membership_id,
        functions: []
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('validationErrors.nameRequired'),
            trigger: 'blur'
          },
          {
            min: 3,
            message: this.$t('validationErrors.lengthShouldBeMinThree'),
            trigger: 'blur'
          }
        ],
        slug: [
          {
            required: true,
            message: this.$t('validationErrors.slugRequired'),
            trigger: 'blur'
          },
          {
            min: 3,
            message: this.$t('validationErrors.lengthShouldBeMinThree'),
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('validationErrors.typeRequired'),
            trigger: 'blur'
          }
        ],
        template: [
          {
            required: true,
            message: this.$t('validationErrors.templateRequired'),
            trigger: 'blur'
          }
        ],
        domain_id: [
          {
            required: true,
            message: this.$t('validationErrors.domainRequired'),
            trigger: 'blur'
          }
        ],
        datasource_id: [
          {
            required: true,
            message: this.$t('validationErrors.datasourceRequired'),
            trigger: 'blur'
          }
        ],
        platform_id: [
          {
            required: true,
            message: this.$t('validationErrors.platformRequired'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    outputUrl () {
      return `${process.env.ORIGIN}/api/domains/${this.form.domain_id}/${this.form.slug}`
    },
    selectedDomain () {
      if (this.form.domain_id) {
        return this.domains.data.items.find(x => x._id === this.form.domain_id)
      } else {
        return null
      }
    },
    selectedPlatform () {
      if (this.form.platform_id) {
        return this.platforms.data.items.find(x => x._id === this.form.platform_id)
      }
    },
    selectedDatasource () {
      if (this.form.datasource_id) {
        return this.datasources.data.items.find(x => x._id === this.form.datasource_id)
      }
    },
    selectedTemplate () {
      if (this.form.type) {
        let _template = this.templates[this.form.type]
        return _template
      }
    },
    testQueryTemplate () {
      let temp = ''
      if (this.selectedDatasource) {
        for (const key in this.selectedDatasource.params) {
          temp += '&' + key + '=' + (this.selectedDatasource.params[key].value || '')
        }
      }
      return temp
    }
  },
  methods: {
    changeType (val) {
      if (!this.form.template) {
        this.form.template = this.selectedTemplate.template
        this.oldType = this.form.type
      } else if (this.selectedTemplate.template !== this.form.template) {
        this.$confirm(this.$t('doYouWantToChangeTemplate'), this.$t('warning'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(async () => {
          this.form.template = this.selectedTemplate.template
          this.oldType = this.form.type
        }).catch(() => {
          this.form.type = this.oldType
        })
      }
    },
    setSlug () {
      if (!this.form.slug) {
        this.form.slug = slugify(this.form.name.toLowerCase())
      }
    },
    async changeDomain (e) {
      this.form.platform_id = null
      this.form.datasource_id = null
      await this.getDomainPlatformsAndDataSources()
    },
    async getDomainPlatformsAndDataSources () {
      let datasourcesTask = this.$axios.post(`api/domains/${this.form.domain_id}/datasources/_query`, {
        where: {
          query_type: 'collection'
        }
      })
      let platformsTask = this.$axios.post(`api/domains/${this.form.domain_id}/platforms/_query`, {})
      let promises = await Promise.all([datasourcesTask, platformsTask])

      this.datasources = promises[0].data
      this.platforms = promises[1].data
    },
    async setPreview () {
      const cheerio = require('cheerio')

      this.previewEditorType = this.selectedTemplate.editorType

      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            let {data} = await this.$axios.get(`api/domains/${this.form.domain_id}/datasources/${this.selectedDatasource.slug}/result?${this.params}`, {
              baseURL: process.env.DELIVERY_URL,
              headers: {
                'Authorization': `Basic ${this.selectedPlatform._id}:${this.selectedPlatform.platform_secret}`
              }
            })
            let _items = data.data.items
            _items.forEach((item) => {
              item['__cheerio'] = cheerio
            })
            let templateData = {
              domain: this.selectedDomain,
              items: _items,
              count: data.data.count,
              now: this.$moment().locale('en').format(this.selectedTemplate.datetimeFormat),
              formatDate: () => {
                return (text, render) => {
                  let date = render(text)
                  date = this.$moment(date).locale('en').format(this.selectedTemplate.datetimeFormat)
                  return date
                }
              }
            }
            if (this.form.functions) {
              this.form.functions.forEach(item => {
                templateData[item.name] = safeEval(item.function)
              })
            }
            this.output = Mustache.render(this.form.template, templateData)
          } catch (e) {
            if (e.response && e.response.data) {
              this.previewEditorType = 'json'
              this.output = JSON.stringify(e.response.data, null, 2)
            }
          }
        } else {
          return false
        }
      })
    },
    async submitForm () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.form.datasource_slug = this.selectedDatasource.slug
            this.form.platform_secret = this.selectedPlatform.platform_secret
            if (this.$route.params.id) {
              await this.$axios.put(`api/outputs/${this.$route.params.id}`, this.form, {
                baseURL: `${process.env.ORIGIN}`
              })
              this.$message({
                type: 'success',
                message: this.$t('successfullySaved')
              })
            } else {
              let {data} = await this.$axios.post(`api/outputs`, this.form, {
                baseURL: `${process.env.ORIGIN}`
              })
              this.$message({
                type: 'success',
                message: this.$t('successfullySaved')
              })
              this.$router.push(this.localePath({ name: 'id', params: { id: data._id } }))
            }
          } catch (e) {
            if (e.response && e.response.status === 409) {
              this.$notify.error({
                title: this.$t('error'),
                message: this.$t('duplicateRecord')
              })
            }
          }
        } else {
          return false
        }
      })
    },
    addFunction () {
      if (!this.form.functions) this.$set(this.form, 'functions', [])
      this.form.functions.push({
        'name': '',
        'function': `function () {
  // this -> item
  return function (text, render) {
    var _text = render(text)
    _text = _text.replace('a', 'b')
    return _text
  } 
}`
      })
    },
    removeFunction (item) {
      let index = this.form.functions.indexOf(item)
      this.form.functions.splice(index, 1)
    }
  },
  created () {
    let outputsTask = this.$axios.get('api/outputs', {
      baseURL: `${process.env.ORIGIN}`,
      headers: {
        'X-Membership-Id': this.$auth.state.user.membership_id
      }
    })

    let domainsTask = this.$axios.post('api/domains/_query', {})

    Promise.all([outputsTask, domainsTask]).then((res) => {
      this.outputs = res[0].data
      this.domains = res[1].data

      if (this.$route.params.id) {
        this.$axios.get(`api/outputs/${this.$route.params.id}`, {
          baseURL: `${process.env.ORIGIN}`,
          headers: {
            'X-Membership-Id': this.$auth.state.user.membership_id
          }
        }).then((res) => {
          this.form = res.data
          this.oldType = this.form.type
          this.getDomainPlatformsAndDataSources()
        }).catch((e) => {
          this.$router.push(this.localePath('index'))
        })
      }
    })
  },
  head () {
    return {
      title: this.$t('outputs')
    }
  }
}
</script>
