import React from 'react';
import { Link } from 'gatsby';
import github from '../img/github.svg';
import gitlab from '../img/gitlab.svg';
import twitter from '../img/twitter.svg';
import SocialLink from './SocialLink';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
  }

  toggleActive = () => {
    this.setState((state) => ({ isActive: !state.isActive }));
  };

  render() {
    return (
      <nav className="navbar is-transparent">
        <div className="navbar-brand">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">
              <figure className="image">Kevin Schuchard</figure>
            </Link>
          </div>
          <div className="navbar-burger burger" data-target="navBar" onClick={this.toggleActive}>
            <span />
            <span />
            <span />
          </div>
        </div>

        <div id="navBar" className={'navbar-menu' + (this.state.isActive ? ' is-active' : '')}>
          <div className="navbar-start">
            <Link className="navbar-item" to="/about">
              About
            </Link>
            <Link className="navbar-item" to="/events">
              Events
            </Link>
            {/* <Link className="navbar-item" to="/contact">
              Contact
            </Link> */}
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <SocialLink url="https://twitter.com/KevinSchuchard" linkType={twitter} altType="Twitter" />
              <SocialLink url="https://github.com/schuchard" linkType={github} altType="Github" />
              <SocialLink url="https://gitlab.com/schuchard" linkType={gitlab} altType="Gitlab" />
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
