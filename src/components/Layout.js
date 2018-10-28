import React from 'react'
import Helmet from 'react-helmet'

import Navbar from '../components/Navbar'
import 'prismjs/themes/prism-tomorrow.css'
import './all.sass'

const TemplateWrapper = ({ children, metaDesc }) => (
  <div>
    <Helmet>
      <title>Kevin Schuchard</title>
      <link rel="preload" href="https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmYUtfBBc4AMP6lQ.woff2" as="font" crossorigin type="font/woff2"></link>
      <link rel="preload" href="https://fonts.gstatic.com/s/opensans/v15/mem8YaGs126MiZpBA-UFVZ0bf8pkAg.woff2" as="font" crossorigin type="font/woff2"></link>
      <meta name="Description" content={metaDesc} />
    </Helmet>
    <Navbar />
    <div>{children}</div>
  </div>
);

export default TemplateWrapper
