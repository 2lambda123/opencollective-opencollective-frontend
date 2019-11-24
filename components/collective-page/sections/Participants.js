import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { uniqBy, get } from 'lodash';
import { Box } from '@rebass/grid';
import Responses from '../../Responses';
import SectionTitle from '../SectionTitle';
import ContainerSectionContent from '../ContainerSectionContent';
import { exportRSVPs } from '../../../lib/export_file';

const StyledAdminActions = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.05rem;
  ul {
    overflow: hidden;
    text-align: center;
    margin: 0 auto;
    padding: 0;
    display: flex;
    justify-content: center;
    flex-direction: row;
    list-style: none;

    li {
      margin: 0 2rem;
    }
  }
`;

const Participants = ({ collective: event, LoggedInUser }) => {
  // const ticketOrders = event.orders
  //   .filter(order => (order.tier && order.tier.type === TierTypes.TICKET))
  //   .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Logic from old Event component, (filter away tiers with 'sponsor in the name')
  // to handle orders where there is no tier to check for TICKET:
  const guests = event.orders
    .filter(order => !get(order, 'tier.name', '').match(/sponsor/i))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const uniqueGuests = uniqBy(guests, r => r.fromCollective && r.fromCollective.id);

  const formattedForResponsesComponent = uniqueGuests.map(order => ({
    user: order.fromCollective,
    createdAt: order.createdAt,
    status: 'YES',
  }));

  const canEditEvent = LoggedInUser && LoggedInUser.canEditEvent(event);

  return (
    <Box pt={[4, 5]}>
      <ContainerSectionContent pt={[4, 5]}>
        <SectionTitle textAlign="center">
          <FormattedMessage
            id="event.responses.title.going"
            values={{ n: uniqueGuests.length }}
            defaultMessage="{n} {n, plural, one {person going} other {people going}}"
          />
        </SectionTitle>
        {canEditEvent && (
          <StyledAdminActions>
            <ul>
              <li>
                <a href={`/${event.parentCollective.slug}/events/${event.slug}/nametags.pdf`}>
                  <FormattedMessage id="Event.PrintNameTags" defaultMessage="Print name tags" />
                </a>
              </li>
              <li>
                <a href={`mailto:${event.slug}@${event.parentCollective.slug}.opencollective.com`}>
                  <FormattedMessage id="Event.SendEmail" defaultMessage="Send email" />
                </a>
              </li>
              <li>
                <a onClick={() => exportRSVPs(event)}>
                  <FormattedMessage id="Export.Format" defaultMessage="Export {format}" values={{ format: 'CSV' }} />
                </a>
              </li>
            </ul>
          </StyledAdminActions>
        )}
        <Responses responses={formattedForResponsesComponent} />
      </ContainerSectionContent>
    </Box>
  );
};

Participants.propTypes = {
  collective: PropTypes.shape({
    orders: PropTypes.array,
  }).isRequired,
  LoggedInUser: PropTypes.object,
};

export default Participants;
