import React from 'react'
import Helmet from 'react-helmet'

import Navbar from '../components/Navbar'
import './all.sass'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet>
      <title>Kevin Schuchard</title>
      <link rel="stylesheet" as="font" crossorigin href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto:900"/>
    </Helmet>
    <Navbar />
    <div>{children}</div>
  </div>
);

export default TemplateWrapper
