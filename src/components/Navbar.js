import React from 'react';
import { Link } from 'gatsby';
import github from '../img/github-icon.svg';

export default class NavBar extends React.Component {
  constructor() {
    super();
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
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
                <a
                  className="navbar-item"
                  href="https://github.com/schuchard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="icon">
                    <img src={github} alt="Github" />
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
