import React from 'react';
import SocialLink from './SocialLink';
import twitter from '../img/twitter.svg';

export const Footer = ({ children }) => (
  <div className="k-footer">
    <h3>Thanks for reading</h3>
    <p>
      If you have any questions or want to discuss this article, connect with me on Twitter and give me
      a follow to hear about my latest posts.
    </p>
    <SocialLink url="https://twitter.com/KevinSchuchard" linkType={twitter} altType="Twitter" />
  </div>
);

Footer.propTypes = {};

export default Footer;
