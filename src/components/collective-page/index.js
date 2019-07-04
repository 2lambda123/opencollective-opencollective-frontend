import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { get } from 'lodash';

// OC Frontend imports
import theme from '../../constants/theme';
import { debounceScroll } from '../../lib/ui-utils';
import Container from '../Container';

// Collective page imports
import { AllSectionsNames, Sections, Dimensions } from './_constants';
import Hero from './Hero';
import SectionAbout from './SectionAbout';
import SectionBudget from './SectionBudget';
import SectionContribute from './SectionContribute';
import SectionContributors from './SectionContributors';
import SectionUpdates from './SectionUpdates';

/** A mutation used by child components to update the collective */
const EditCollectiveMutation = gql`
  mutation EditCollective($id: Int!, $longDescription: String) {
    editCollective(collective: { id: $id, longDescription: $longDescription }) {
      id
      longDescription
    }
  }
`;

/**
 * This is the collective page main layout, holding different blocks together
 * and watching scroll to synchronise the view for children properly.
 *
 * See design: https://www.figma.com/file/e71tBo0Sr8J7R5n6iMkqI42d/09.-Collectives?node-id=2338%3A36062
 */
export default class CollectivePage extends Component {
  static propTypes = {
    /** The collective to display */
    collective: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      image: PropTypes.string,
      backgroundImage: PropTypes.string,
      twitterHandle: PropTypes.string,
      githubHandle: PropTypes.string,
      website: PropTypes.string,
      description: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      settings: PropTypes.object,
    }).isRequired,

    /** Collective's host */
    host: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      image: PropTypes.string,
    }),

    /** Collective contributors */
    contributors: PropTypes.arrayOf(PropTypes.object),
    topOrganizations: PropTypes.arrayOf(PropTypes.object),
    topIndividuals: PropTypes.arrayOf(PropTypes.object),

    /** Collective tiers */
    tiers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        description: PropTypes.string,
      }),
    ),

    /** Collective transactions & expenses */
    transactions: PropTypes.arrayOf(PropTypes.object),
    expenses: PropTypes.arrayOf(PropTypes.object),

    /** Updates / announcements */
    updates: PropTypes.arrayOf(PropTypes.object),

    /** Collective stats */
    stats: PropTypes.object,

    /** Collective events */
    events: PropTypes.arrayOf(PropTypes.object),

    /** The logged in user */
    LoggedInUser: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.sectionsRefs = {}; // This will store a map of sectionName => sectionRef
    this.state = {
      isFixed: false,
      selectedSection: AllSectionsNames[0],
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    this.onScroll(); // First tick in case scroll is restored when page loads
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = debounceScroll(() => {
    // Fixes the Hero when a certain scroll threshold is reached
    if (window.scrollY >= theme.sizes.navbarHeight + Dimensions.HERO_FIXED_HEIGHT) {
      if (!this.state.isFixed) {
        this.setState({ isFixed: true });
      }
    } else if (this.state.isFixed) {
      this.setState({ isFixed: false });
    }

    // Update selected section
    const distanceThreshold = 200;
    const currentViewBottom = window.scrollY + window.innerHeight;
    for (let i = AllSectionsNames.length - 1; i >= 0; i--) {
      const sectionName = AllSectionsNames[i];
      const sectionRef = this.sectionsRefs[sectionName];
      if (sectionRef && currentViewBottom - distanceThreshold > sectionRef.offsetTop) {
        if (this.state.selectedSection !== sectionName) {
          this.setState({ selectedSection: sectionName });
        }
        break;
      }
    }
  });

  onSectionClick = sectionName => {
    window.location.hash = `section-${sectionName}`;
    const sectionTop = this.sectionsRefs[sectionName].offsetTop;
    window.scrollTo(0, sectionTop - Dimensions.HERO_FIXED_HEIGHT);
  };

  onCollectiveClick = () => {
    window.scrollTo(0, 0);
  };

  renderSection(section, canEdit) {
    const { collective, contributors, tiers, events, transactions, stats, expenses } = this.props;

    if (section === Sections.ABOUT) {
      return <SectionAbout collective={collective} canEdit={canEdit} editMutation={EditCollectiveMutation} />;
    } else if (section === Sections.CONTRIBUTORS) {
      return <SectionContributors collectiveName={collective.name} contributors={contributors} />;
    } else if (section === Sections.CONTRIBUTE) {
      return (
        <SectionContribute
          collective={collective}
          tiers={tiers}
          events={events}
          topOrganizations={this.props.topOrganizations}
          topIndividuals={this.props.topIndividuals}
        />
      );
    } else if (section === Sections.BUDGET) {
      return <SectionBudget collective={collective} transactions={transactions} expenses={expenses} stats={stats} />;
    } else if (section === Sections.UPDATES) {
      return (
        <SectionUpdates collective={collective} canSeeDrafts={canEdit} isLoggedIn={Boolean(this.props.LoggedInUser)} />
      );
    }

    // Placeholder for sections not implemented yet
    return (
      <Container display="flex" borderBottom="1px solid lightgrey" py={8} justifyContent="center" fontSize={36}>
        [Section] {section}
      </Container>
    );
  }

  render() {
    const { collective, host, LoggedInUser } = this.props;
    const { isFixed, selectedSection } = this.state;
    const canEdit = Boolean(LoggedInUser && LoggedInUser.canEditCollective(collective));
    const sections = get(collective, 'settings.collective-page.sections', AllSectionsNames);

    return (
      <Container borderTop="1px solid #E6E8EB">
        <Container height={Dimensions.HERO_PLACEHOLDER_HEIGHT}>
          <Hero
            collective={collective}
            host={host}
            sections={sections}
            canEdit={canEdit}
            isFixed={isFixed}
            selectedSection={selectedSection}
            onSectionClick={this.onSectionClick}
            onCollectiveClick={this.onCollectiveClick}
          />
        </Container>
        {sections.map(section => (
          <div key={section} ref={sectionRef => (this.sectionsRefs[section] = sectionRef)} id={`section-${section}`}>
            {this.renderSection(section, canEdit)}
          </div>
        ))}
      </Container>
    );
  }
}
