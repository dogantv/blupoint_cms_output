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
            <el-select v-model="form.type" :placeholder="$t('type')" class="w-100">
              <el-option label="RSS" value="rss"></el-option>
              <el-option label="Sitemap" value="sitemap"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="col-24 col-md-12">
          <el-form-item :label="$t('domain')" prop="domain_id">
            <el-select v-model="form.domain_id" :placeholder="$t('domain')" class="w-100" @change="getDomainPlatformsAndDataSources">
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
          <el-form-item prop="template">
            <ace v-model="form.template" prop-id="template" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane :label="$t('preview')" name="preview">
          <div class="row">
            <div class="col-18">
              <el-form-item prop="params">
                <el-input v-model="params" :placeholder="testQueryTemplate"></el-input>
              </el-form-item>
            </div>
            <div class="col">
              <el-button @click="setPreview()">
                <span>{{ $t('preview') }}</span>
              </el-button>
            </div>
          </div>
          <ace v-model="output" :readonly="true" prop-id="preview" />
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </section>
</template>

<script>
import slugify from 'slugify'
import ace from '~/components/ace'
import Mustache from 'mustache'
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
      templates: {
        rss: {
          template: `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
    <channel>
        <title>{{domain.name}}</title>
        <description>{{domain.description}}</description>
        <link>{{{domain.domain}}}</link>
        <language>TR</language>
        <copyright>{{copyrightInfo}}</copyright>
        <pubDate>{{pubDate}}</pubDate>
        <lastBuildDate>{{lastBuildDate}}</lastBuildDate>
        {{#items}}
        <item>
            <title>{{title}}</title>
            <description>{{description}}</description>
            <link>{{{domain.domain}}}{{{url}}}</link>
            <guid>{{{domain.domain}}}{{{url}}}</guid>
            <pubDate>{{#formatDate}}{{sys.published_at}}{{/formatDate}}</pubDate>
        </item>
        {{/items}}
    </channel>
</rss>`,
          datetimeFormat: 'ddd, DD MMM YYYY HH:mm:ss ZZ'
        },
        sitemap: {
          template: `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

{{#urls}}
<url>
  <loc>{{ root }}{{ loc }}</loc>
  <lastmod>{{ lastmod }}</lastmod>
  <changefreq>{{ changefreq }}</changefreq>
</url>
{{/urls}}
</urlset>`,
          datetimeFormat: 'ddd, DD MMM YYYY HH:mm:ss ZZ'
        }
      },
      form: {
        name: '',
        slug: '',
        domain_id: '',
        datasource_id: '',
        platform_id: '',
        type: 'rss',
        template: null
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
      return `http://output.dogannet.tv/api/domains/${this.form.domain_id}/${this.form.slug}`
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
        return this.templates[this.form.type]
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
  watch: {
    'form.type': function (newVal, oldVal) {
      console.log(newVal)
      if (newVal !== oldVal) {
        this.form.template = this.selectedTemplate.template
      }
    }
  },
  methods: {
    setSlug () {
      if (!this.form.slug) {
        this.form.slug = slugify(this.form.name.toLowerCase())
      }
    },
    async getDomainPlatformsAndDataSources () {
      let datasourcesTask = this.$axios.post(`api/domains/${this.form.domain_id}/datasources/_query`, {})
      let platformsTask = this.$axios.post(`api/domains/${this.form.domain_id}/platforms/_query`, {})
      let promises = await Promise.all([datasourcesTask, platformsTask])

      this.datasources = promises[0].data
      this.platforms = promises[1].data
    },
    async setPreview () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let {data} = await this.$axios.get(`api/domains/${this.form.domain_id}/datasources/${this.selectedDatasource.slug}/result?${this.params}`, {
            baseURL: process.env.apiDeliveryUrl,
            headers: {
              'Authorization': `Basic ${this.selectedPlatform._id}:${this.selectedPlatform.platform_secret}`
            }
          })
          this.output = Mustache.render(this.form.template, {
            domain: this.selectedDomain,
            items: data.data.items,
            pubDate: this.$moment().locale('en').format(this.selectedTemplate.datetimeFormat),
            lastBuildDate: this.$moment().locale('en').format(this.selectedTemplate.datetimeFormat),
            formatDate: () => {
              return (text, render) => {
                let date = render(text)
                date = this.$moment(date).locale('en').format(this.selectedTemplate.datetimeFormat)
                return date
              }
            }
          })
        } else {
          return false
        }
      })
    },
    async submitForm () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            if (this.$route.params.id) {
              await this.$axios.put(`api/outputs/${this.$route.params.id}`, this.form, {
                baseURL: `http://${process.env.host}:${process.env.port}`
              })
              this.$message({
                type: 'success',
                message: this.$t('successfullySaved')
              })
            } else {
              let {data} = await this.$axios.post(`api/outputs`, this.form, {
                baseURL: `http://${process.env.host}:${process.env.port}`
              })
              this.$message({
                type: 'success',
                message: this.$t('successfullySaved')
              })
              this.$router.push(this.localePath({ name: 'id', params: { id: data._id } }))
            }
          } catch (e) {
            console.error(e)
          }
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.form.template = this.selectedTemplate.template

    let outputsTask = this.$axios.get('api/outputs', {
      baseURL: `http://${process.env.host}:${process.env.port}`
    })

    let domainsTask = this.$axios.post('api/domains/_query', {})

    Promise.all([outputsTask, domainsTask]).then((res) => {
      this.outputs = res[0].data
      this.domains = res[1].data

      if (this.$route.params.id) {
        this.$axios.get(`api/outputs/${this.$route.params.id}`, {
          baseURL: `http://${process.env.host}:${process.env.port}`
        }).then((res) => {
          this.form = res.data
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
