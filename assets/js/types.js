const templates = {
  rss: {
    template: `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
<channel>
    <title>{{domain.name}}</title>
    <description>{{domain.description}}</description>
    <link>{{{domain.domain}}}</link>
    <language>TR</language>
    <copyright>{{copyrightInfo}}</copyright>
    <pubDate>{{now}}</pubDate>
    <lastBuildDate>{{now}}</lastBuildDate>
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
    datetimeFormat: 'ddd, DD MMM YYYY HH:mm:ss ZZ',
    contentType: 'application/rss+xml'
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
    datetimeFormat: 'ddd, DD MMM YYYY HH:mm:ss ZZ',
    contentType: 'application/xml'
  }
}

module.exports = templates
