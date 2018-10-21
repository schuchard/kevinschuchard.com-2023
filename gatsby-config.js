module.exports = {
  siteMetadata: {
    title: 'Kevin Schuchard',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-62178810-2',
        // Puts tracking script in the head instead of the body
        head: false,
        // Avoids sending pageview hits from custom paths
        exclude: ['/admin/**'],
        siteSpeedSampleRate: 10,
        cookieDomain: 'kevinschuchard.com',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 1096,
              quality: 65
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `KevinSchuchard`,
        short_name: `Schuchard`,
        start_url: `/`,
        background_color: `#5aa8fc`,
        theme_color: `#5c63f2`,
        display: `minimal-ui`,
        icon: `src/img/manifest-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        // Regex based on http://stackoverflow.com/a/18017805
        navigateFallbackWhitelist: [/^[^?]*([^.?]{5}|\.html)(\?.*)?$/],
        navigateFallbackBlacklist: [/\?(.+&)?no-cache=1$/, /admin/],
        cacheId: `kevinschuchard-offline`,
        dontCacheBustUrlsMatching: /(.*js$|\/static\/)/,
        runtimeCaching: [
          {
            // Add runtime caching of various page resources.
            urlPattern: /\.(?:png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
            handler: `staleWhileRevalidate`,
          },
        ],
        skipWaiting: true,
        clientsClaim: true,
      },
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
};
