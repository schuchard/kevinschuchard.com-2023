import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Content, { HTMLContent } from '../components/Content';
import { Helmet } from 'react-helmet';
import EventLink from '../components/EventLink';

export const EventsPageTemplate = ({ title, content, contentComponent, events, helmet }) => {
  const PageContent = contentComponent || Content;

  const trim = (text) => {
    return text && text.length > 300 ? `${text.slice(0, 301)}...` : text;
  };

  return (
    <section className="section section--gradient">
      {helmet || ''}
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section">
              <h1 className="title is-size-3 has-text-weight-bold is-bold-light">{title}</h1>
              <ul>
                {events.map((event) => (
                  <li key={event.id} className="event">
                    <h2>{event.title}</h2>
                    <small>{event.date}</small>
                    <p>{trim(event.description)}</p>
                    <div className="event-links">
                      <EventLink url={event.slides} name="Slides" />
                      <EventLink url={event.video} name="Video" />
                      <EventLink url={event.repo} name="Repo" />
                    </div>
                    {event.otherLinks && event.otherLinks.length > 0 && (
                      <ul>
                        {event.otherLinks.map((l) => (
                          <li key={l}>
                            - <EventLink url={l} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <PageContent className="content" content={content} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

EventsPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  events: PropTypes.any,
  contentComponent: PropTypes.func,
};

const EventsPage = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <Layout metaDesc="Kevin Schuchard Events">
      <EventsPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
        helmet={<Helmet title={`Kevin Schuchard | ${post.frontmatter.title}`} />}
        events={post.frontmatter.events}
      />
    </Layout>
  );
};

EventsPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default EventsPage;

export const eventsPageQuery = graphql`
  query EventsPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        description
        events {
          id
          title
          description
          date(formatString: "MMMM DD, YYYY")
          image
          alt
          slides
          video
          repo
          embedLink
          location {
            name
            address
            city
            state
            country
          }
          otherLinks
        }
      }
    }
  }
`;
