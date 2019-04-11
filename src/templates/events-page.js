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
    <div className="columns">
      {helmet}
      <div className="column is-8 is-offset-2">
        <div className="section">
          <h1 className="title is-size-3 has-text-weight-bold is-bold-light">{title}</h1>
          <ul>
            {events.map((event) => (
              <li key={event.id} className="event k-card">
                <h2 className="k-space-between">
                  {event.title}
                  <small>
                    <i>{event.date}</i>
                  </small>
                </h2>

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
                        <EventLink url={l} />
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
