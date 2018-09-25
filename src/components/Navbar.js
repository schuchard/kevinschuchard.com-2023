import React from 'react';
import { Link } from 'gatsby';
import github from '../img/github-icon.svg';

const Navbar = () => (
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <figure className="image">Kevin Schuchard</figure>
        </Link>
      </div>
      <div class="navbar-burger burger" data-target="navBar">
        <span />
        <span />
        <span />
      </div>
    </div>

    <div id="navBar" class="navbar-menu">
      <div class="navbar-start">
        <Link className="navbar-item" to="/about">
          About
        </Link>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
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

export default Navbar;
