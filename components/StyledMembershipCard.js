import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import { get } from 'lodash';
import { FormattedMessage, FormattedDate } from 'react-intl';

import { getCollectiveMainTag } from '../lib/collective.lib';
import roles from '../lib/constants/roles';
import { formatCurrency } from '../lib/utils';
import StyledCard from './StyledCard';
import LinkCollective from './LinkCollective';
import Container from './Container';
import { P, Span } from './Text';
import Avatar from './Avatar';
import I18nCollectiveTags from './I18nCollectiveTags';
import StyledTag from './StyledTag';
import FormattedMoneyAmount from './FormattedMoneyAmount';

const getBackground = collective => {
  const backgroundImage = collective.backgroundImage || get(collective, 'parentCollective.backgroundImage');
  return backgroundImage
    ? `url(/static/images/collective-card-mask.png) bottom, url(${backgroundImage}) no-repeat, #1776E1`
    : 'url(/static/images/collective-card-mask.png) bottom, #1776E1';
};

const formatStrongValue = msg => (
  <Span textTransform="capitalize" fontSize="LeadParagraph" fontWeight="bold">
    {msg}
  </Span>
);

/**
 * A card to show a user's membership.
 */
const StyledMembershipCard = ({ membership, ...props }) => {
  const { collective, since, stats, role } = membership;
  return (
    <StyledCard width={250} height={360} position="relative" {...props}>
      <Container style={{ background: getBackground(collective) }} backgroundSize="cover" height={100} px={3} pt={26}>
        <Container border="2px solid white" borderRadius="25%" backgroundColor="white.full" width={68}>
          <Avatar collective={collective} radius={64} />
        </Container>
      </Container>
      <Flex flexDirection="column" justifyContent="space-between" height={260}>
        <Container p={3}>
          <LinkCollective collective={collective}>
            <P fontSize="LeadParagraph" fontWeight="bold" color="black.800">
              {collective.name}
            </P>
          </LinkCollective>
          <StyledTag display="inline-block" my={2}>
            <I18nCollectiveTags
              tags={getCollectiveMainTag(get(collective, 'host.id'), collective.tags, collective.type)}
            />
          </StyledTag>
        </Container>
        <Container p={3}>
          {role === roles.BACKER ? (
            <Box mb={2}>
              <P fontSize="Caption">
                <FormattedMessage
                  id="Membership.ContributorSince"
                  defaultMessage="{contributorType} since"
                  values={{
                    contributorType: (
                      <FormattedMessage id="Member.Role.BACKER" defaultMessage="Financial Contributor" />
                    ),
                  }}
                />
                <Span display="block" fontSize="LeadParagraph" fontWeight="bold">
                  <FormattedDate value={since} month="long" year="numeric" />
                </Span>
              </P>
              <P mt={3}>
                <FormattedMessage id="membership.totalDonations.title" defaultMessage="amount contributed">
                  {msg => (
                    <Span textTransform="capitalize" fontSize="Caption">
                      {msg}
                    </Span>
                  )}
                </FormattedMessage>
                <Span display="block" fontSize="LeadParagraph" fontWeight="bold">
                  {/** Ideally we should breakdown amounts donated per currency, but for now
                    API only returns the total amount in USD. */
                  formatCurrency(stats.totalDonations, 'USD', { precision: 0 })}
                </Span>
              </P>
            </Box>
          ) : (
            <Box mb={2}>
              <P fontSize="Caption">
                {collective.stats.backers.all > 0 && (
                  <FormattedMessage
                    id="Membership.ContributorsCount"
                    defaultMessage="{count, plural, one {<strong>1</strong> Contributor} other {<strong>{count}</strong> Contributors}} "
                    values={{
                      count: collective.stats.backers.all,
                      strong: formatStrongValue,
                    }}
                  />
                )}
              </P>
              <P mt={3} fontSize="Caption">
                {collective.stats.yearlyBudget > 0 && (
                  <FormattedMessage
                    id="StyledMembershipCard.YearlyBudget"
                    defaultMessage="{amount} yearly budget"
                    values={{
                      amount: (
                        <Span fontWeight="bold">
                          <FormattedMoneyAmount
                            amount={collective.stats.yearlyBudget}
                            currency={collective.currency || 'USD'}
                            amountStyles={{ fontSize: 'LeadParagraph' }}
                          />
                        </Span>
                      ),
                    }}
                  />
                )}
              </P>
            </Box>
          )}
        </Container>
      </Flex>
    </StyledCard>
  );
};

StyledMembershipCard.propTypes = {
  membership: PropTypes.shape({
    role: PropTypes.string,
    since: PropTypes.string,
    stats: PropTypes.shape({
      totalDonations: PropTypes.numer,
    }),
    collective: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string,
      currency: PropTypes.string,
      backgroundImage: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      host: PropTypes.shape({
        id: PropTypes.number,
      }),
      parentCollective: PropTypes.shape({
        backgroundImage: PropTypes.string,
      }),
      stats: PropTypes.shape({
        yearlyBudget: PropTypes.numer,
        backers: PropTypes.shape({
          all: PropTypes.number,
        }),
      }),
    }),
  }).isRequired,
};

export default StyledMembershipCard;
