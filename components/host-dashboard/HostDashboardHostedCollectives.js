import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import { isEmpty, omitBy } from 'lodash';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import { API_V2_CONTEXT } from '../../lib/graphql/helpers';

import { Box, Flex, Grid } from '../Grid';
import LoadingPlaceholder from '../LoadingPlaceholder';
import MessageBox from '../MessageBox';
import MessageBoxGraphqlError from '../MessageBoxGraphqlError';
import Pagination from '../Pagination';
import SearchBar from '../SearchBar';
import StyledHr from '../StyledHr';
import { H1 } from '../Text';

import HostAdminCollectiveCard from './HostAdminCollectiveCard';
import HostAdminCollectiveFilters, { COLLECTIVE_FILTER } from './HostAdminCollectiveFilters';

const COLLECTIVES_PER_PAGE = 20;

// TODO: This query is using `legacyId` for host and member.account to interface with the
// legacy `AddFundsForm`. Once the new add funds form will be implemented, we can remove these fields.
const hostedCollectivesQuery = gql`
  query HostDashboardHostedCollectives(
    $hostSlug: String!
    $limit: Int!
    $offset: Int!
    $orderBy: OrderByInput
    $hostFeesStructure: HostFeeStructure
    $searchTerm: String
  ) {
    host(slug: $hostSlug) {
      id
      legacyId
      slug
      name
      currency
      isHost
      type
      settings
      hostFeePercent
      plan {
        id
        hostFees
        hostFeeSharePercent
      }
      memberOf(
        role: HOST
        limit: $limit
        offset: $offset
        orderBy: $orderBy
        hostFeesStructure: $hostFeesStructure
        searchTerm: $searchTerm
        isApproved: true
      ) {
        offset
        limit
        totalCount
        nodes {
          id
          createdAt
          account {
            id
            legacyId
            name
            slug
            website
            type
            currency
            imageUrl(height: 96)
            isFrozen
            tags
            settings
            createdAt
            stats {
              id
              balance {
                valueInCents
                currency
              }
            }
            ... on AccountWithHost {
              hostFeesStructure
              hostFeePercent
            }
            ... on AccountWithContributions {
              totalFinancialContributors
            }
            ... on AccountWithParent {
              parent {
                id
                slug
                name
              }
            }
          }
        }
      }
    }
  }
`;

const checkIfQueryHasFilters = query =>
  Object.entries(query).some(([key, value]) => {
    return !['view', 'offset', 'limit', 'hostCollectiveSlug', 'sort-by'].includes(key) && value;
  });

const getVariablesFromQuery = query => {
  return {
    offset: parseInt(query.offset) || 0,
    limit: parseInt(query.limit) || COLLECTIVES_PER_PAGE,
    searchTerm: query.searchTerm,
    hostFeesStructure: query['fees-structure'],
    orderBy: {
      field: 'CREATED_AT',
      direction: query['sort-by'] === 'oldest' ? 'ASC' : 'DESC',
    },
  };
};

const ROUTE_PARAMS = ['hostCollectiveSlug', 'slug', 'section', 'view'];

const updateQuery = (router, newParams) => {
  const query = omitBy({ ...router.query, ...newParams }, (value, key) => !value || ROUTE_PARAMS.includes(key));
  const pathname = router.asPath.split('?')[0];
  return router.push({ pathname, query });
};

const HostDashboardHostedCollectives = ({ hostSlug }) => {
  const router = useRouter() || {};
  const query = router.query;
  const hasFilters = React.useMemo(() => checkIfQueryHasFilters(query), [query]);
  const { data, error, loading, variables } = useQuery(hostedCollectivesQuery, {
    variables: { hostSlug, ...getVariablesFromQuery(omitBy(query, isEmpty)) },
    context: API_V2_CONTEXT,
  });

  const hostedMemberships = data?.host?.memberOf;
  return (
    <Box maxWidth={1000} m="0 auto">
      <Flex alignItems="start" mb={16} flexWrap="wrap">
        <H1 fontSize="24px" lineHeight="36px" fontWeight={700} color="black.900" letterSpacing="-.025em">
          <FormattedMessage id="HostedCollectives" defaultMessage="Hosted Collectives" />
        </H1>
        <Box mx="auto" />
        <SearchBar
          defaultValue={query.searchTerm}
          onSubmit={searchTerm => updateQuery(router, { searchTerm, offset: null })}
          height={36}
        />
      </Flex>
      <Box mb={34}>
        {data?.host ? (
          <HostAdminCollectiveFilters
            values={query}
            filters={[COLLECTIVE_FILTER.SORT_BY, COLLECTIVE_FILTER.FEE_STRUCTURE]}
            onChange={queryParams => updateQuery(router, { ...queryParams, offset: null })}
          />
        ) : loading ? (
          <LoadingPlaceholder height={70} />
        ) : null}
      </Box>

      {error && <MessageBoxGraphqlError error={error} mb={2} />}

      {!error && !loading && !hostedMemberships?.nodes.length ? (
        <MessageBox type="info" withIcon data-cy="zero-collective-message">
          {hasFilters ? (
            <FormattedMessage id="discover.searchNoResult" defaultMessage="No Collectives match the current search." />
          ) : (
            <FormattedMessage id="menu.collective.none" defaultMessage="No Collectives yet" />
          )}
        </MessageBox>
      ) : (
        <React.Fragment>
          <Grid gridGap={24} gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))">
            {loading
              ? Array.from(new Array(COLLECTIVES_PER_PAGE)).map((_, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <LoadingPlaceholder key={index} height={362} borderRadius="8px" />
                ))
              : hostedMemberships?.nodes.map(member => (
                  <HostAdminCollectiveCard
                    key={member.id}
                    host={data.host}
                    collective={member.account}
                    since={member.createdAt}
                  />
                ))}
          </Grid>
          <Flex mt={5} justifyContent="center">
            <Pagination
              total={hostedMemberships?.totalCount}
              limit={variables.limit}
              offset={variables.offset}
              ignoredQueryParams={ROUTE_PARAMS}
            />
          </Flex>
        </React.Fragment>
      )}
    </Box>
  );
};

HostDashboardHostedCollectives.propTypes = {
  hostSlug: PropTypes.string.isRequired,
  router: PropTypes.object,
};

export default HostDashboardHostedCollectives;
