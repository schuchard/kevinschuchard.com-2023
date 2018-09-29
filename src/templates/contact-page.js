import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Content, { HTMLContent } from '../components/Content';
import mail from '../img/mail.svg';
import user from '../img/user.svg';

class ContactPageTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userEmail: '',
      userMessage: '',
      touched: {
        userEmail: false,
        userName: false,
        userMessage: false,
      },
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  validate(userEmail, userName, userMessage) {
    return {
      userEmail: userEmail.length === 0,
      userName: userName.length === 0,
      userMessage: userMessage.length === 0,
    };
  }

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  };

  canBeSubmitted() {
    const errors = this.validate(this.state.userEmail, this.state.userName, this.state.userMessage);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return { ...errors, isDisabled };
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    if (!this.canBeSubmitted().isDisabled) {
      console.log(this.state);
    }
  };

  render() {
    const PageContent = this.props.contactComponent || Content;
    // const { errors } = this.canBeSubmitted();

    return (
      <section className="section section--gradient">
        <div className="container">
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <div className="section">
                <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
                  {this.props.title}
                </h2>
                <PageContent className="content" content={this.props.content} />
                <form onSubmit={this.handleSubmit}>
                  <div className="field">
                    <label className="label">Name</label>
                    <div className="control has-icons-right">
                      <input
                        className="input"
                        type="text"
                        placeholder="Name"
                        name="userName"
                        value={this.state.userName}
                        onChange={this.handleInputChange}
                      />
                      <span className="icon is-small is-right">
                        <img src={user} alt="name" />
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-right">
                      <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        name="userEmail"
                        value={this.state.userEmail}
                        onChange={this.handleInputChange}
                        //   onBlur={this.handleBlur('email')}
                      />
                      <span className="icon is-small is-right">
                        <img src={mail} alt="mail" />
                      </span>
                    </div>
                    {/* <p className="help is-danger">This email is invalid</p> */}
                  </div>

                  <div className="field">
                    <label className="label">Message</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        placeholder="Message"
                        name="userMessage"
                        value={this.state.userMessage}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="field is-grouped">
                    <div className="control">
                      <button className="button is-link">Submit</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ContactPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contactComponent: PropTypes.func,
};

const ContactPage = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <Layout>
      <ContactPageTemplate
        contactComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
    </Layout>
  );
};

ContactPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ContactPage;

export const contactPageQuery = graphql`
  query ContactPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
