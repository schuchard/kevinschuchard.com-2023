import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import Layout from '../components/Layout';
import CardHeader from '../components/CardHeader';

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <Layout metaDesc="Kevin Schuchard blog posts">
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <div className="content">
              <h1 className="title is-2">Latest Posts</h1>
            </div>
            {posts.map(({ node: post }) => (
              <div className="home-post k-card" key={post.id}>
                <CardHeader date={post.frontmatter.date}>
                  <h1 className="title is-4 w400">
                    <Link className="has-text-primary index-list-title" to={post.fields.slug}>
                      {post.frontmatter.title}
                    </Link>
                  </h1>
                </CardHeader>
                <p>{post.frontmatter.description}</p>
              </div>
            ))}
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
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            description
          }
        }
      }
    }
  }
`;
