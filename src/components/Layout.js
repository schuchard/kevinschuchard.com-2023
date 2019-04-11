import React from 'react';
import Helmet from 'react-helmet';

import Navbar from '../components/Navbar';
import 'prismjs/themes/prism-tomorrow.css';
import './all.sass';

const TemplateWrapper = ({ children, metaDesc }) => (
  <div>
    <Helmet>
      <title>Kevin Schuchard</title>
      <meta name="Description" content={metaDesc} />
    </Helmet>
    <Navbar />
    <section className="section">
      <div className="container">{children}</div>
    </section>
  </div>
);

export default TemplateWrapper;
