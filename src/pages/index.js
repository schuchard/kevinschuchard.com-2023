import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import Layout from '../components/Layout';

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <Layout metaDesc="Kevin Schuchard blog posts">
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <div className="section">
              <div className="content">
                <h1 className="has-text-weight-bold is-size-2">Latest Posts</h1>
              </div>
              {posts.map(({ node: post }) => (
                <div className="home-post k-card" key={post.id}>
                  <h1 className="k-space-between">
                    <Link className="has-text-primary index-list-title" to={post.fields.slug}>
                      {post.frontmatter.title}
                    </Link>
                    <small>{post.frontmatter.date}</small>
                  </h1>
                  <p>{post.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
