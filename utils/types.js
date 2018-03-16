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
    contentType: 'application/rss+xml',
    editorType: 'xml'
  },
  sitemap: {
    template: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {{#items}}
    <url>
        <loc>{{{domain.domain}}}{{{url}}}</loc>
    </url>
    {{/items}}
</urlset> `,
    datetimeFormat: 'YYYY-MM-DDThh:mm:ss.sZ',
    contentType: 'application/xml',
    editorType: 'xml'
  },
  sitemap_index: {
    template: `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {{#items}}
    <sitemap>
        <loc>{{{domain.domain}}}/sitemap?skip={{skip}}&limit={{limit}}</loc>
        <lastmod>{{now}}</lastmod>
    </sitemap>
    {{/items}}
</sitemapindex>`,
    datetimeFormat: 'YYYY-MM-DDThh:mm:ss.sZ',
    contentType: 'application/xml',
    editorType: 'xml'
  },
  news_sitemap: {
    template: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    {{#items}}
    <url>
        <loc>{{{domain.domain}}}{{{url}}}</loc>
        <news:news>
            <news:publication>
                <news:name>{{domain.name}}</news:name>
                <news:language>tr</news:language>
            </news:publication>
            <news:genres>PressRelease, Blog</news:genres>
            <news:publication_date>{{#formatDate}}{{sys.published_at}}{{/formatDate}}</news:publication_date>
            <news:title>{{title}}</news:title>
            <news:keywords>{{tagHelper}}</news:keywords>
        </news:news>
    </url>
    {{/items}}
</urlset>`,
    datetimeFormat: 'YYYY-MM-DDThh:mm:ss.sZ',
    contentType: 'application/xml',
    editorType: 'xml'
  },
  complex_sitemap: {
    template: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    {{#items}}
    <url> 
        <loc>{{{domain.domain}}}{{{url}}}</loc> 
        <image:image>
            <image:loc>{{{domain.domain}}}{{{image_url}}}</image:loc>
            <image:caption>{{image.metadata.title}}</image:caption>
        </image:image>
        <video:video>
            <video:content_loc>
                http://www.example.com/video123.flv
            </video:content_loc>
            <video:player_loc allow_embed="yes" autoplay="ap=1">
                http://www.example.com/videoplayer.swf?video=123
            </video:player_loc>
            <video:thumbnail_loc>
                {{{domain.domain}}}{{{video.image_url}}}
            </video:thumbnail_loc>
            <video:title>{{video.title}}</video:title>  
            <video:description>
                {{video.description}}
            </video:description>
        </video:video>
    </url>
    {{/items}}
</urlset> `,
    datetimeFormat: 'YYYY-MM-DDThh:mm:ss.sZ',
    contentType: 'application/xml',
    editorType: 'xml'
  },
  xml: {
    template: `<?xml version="1.0" encoding="UTF-8"?>`,
    datetimeFormat: 'YYYY-MM-DDThh:mm:ss.sZ',
    contentType: 'application/xml'
  },
  json: {
    template: `{
  "data": {
    "items": [],
    "count": 0
  } 
}`,
    datetimeFormat: 'YYYY-MM-DDThh:mm:ss.sZ',
    contentType: 'application/json',
    editorType: 'json'
  }
}

module.exports = templates
