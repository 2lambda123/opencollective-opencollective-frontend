import React from 'react';
import { defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import { Flex } from '@rebass/grid';
import styled, { css } from 'styled-components';

import StyledButton from './StyledButton';
import { Span } from './Text';
import roles from '../constants/roles';
import withIntl from '../lib/withIntl';

export const CONTRIBUTOR_FILTERS = {
  ALL: 'ALL',
  CORE: 'CORE',
  FINANCIAL: 'FINANCIAL',
};

const FILTERS_LIST = Object.values(CONTRIBUTOR_FILTERS);

const Translations = defineMessages({
  [CONTRIBUTOR_FILTERS.ALL]: {
    id: 'ContributorsFilter.All',
    defaultMessage: 'All contributors',
  },
  [CONTRIBUTOR_FILTERS.CORE]: {
    id: 'ContributorsFilter.Core',
    defaultMessage: 'Core contributors',
  },
  [CONTRIBUTOR_FILTERS.FINANCIAL]: {
    id: 'ContributorsFilter.Financial',
    defaultMessage: 'Financial contributors',
  },
  [CONTRIBUTOR_FILTERS.GITHUB]: {
    id: 'ContributorsFilter.Github',
    defaultMessage: 'Github contributors',
  },
});

/**
 * For a given list of members, returns all the filters that can be applied
 * to the list.
 */
export const getMembersFilters = members => {
  const filters = new Set([CONTRIBUTOR_FILTERS.ALL]);
  for (const m of members) {
    // Add role to the set
    if (m.role === roles.ADMIN) {
      filters.add(CONTRIBUTOR_FILTERS.CORE);
    } else if ([roles.BACKER, roles.FUNDRAISER].includes(m.role)) {
      filters.add(CONTRIBUTOR_FILTERS.FINANCIAL);
    }

    // No need to traverse the entire list if we already registered all the types
    // No need to count the first one (ALL) - so we do length - 1
    if (filters.length === FILTERS_LIST.length - 1) {
      break;
    }
  }

  // Ensure we preserver filters order by sorting them according to the base list
  return Array.from(filters).sort((filter1, filter2) => {
    return FILTERS_LIST.indexOf(filter1) > FILTERS_LIST.indexOf(filter2) ? 1 : -1;
  });
};

// Members roles weights
const ROLES_WEIGHT = {
  [roles.FUNDRAISER]: 1,
  [roles.MEMBER]: 2,
  [roles.BACKER]: 3,
  [roles.CONTRIBUTOR]: 4,
  [roles.ADMIN]: 5,
};

const getRoleWeight = role => {
  return ROLES_WEIGHT[role] || 0;
};

/**
 * A helper to filter a members list by member type that returns only unique
 * members (based on the collective id).
 *
 * Please ensure you memoize this one properly is the cost can be pretty depending
 * on the number of members.
 */
export const filterMembers = (members, filter) => {
  if (!members) {
    return [];
  }

  // Set filterFunc
  let filterFunc = null;
  if (filter === CONTRIBUTOR_FILTERS.FINANCIAL) {
    filterFunc = m => [roles.BACKER, roles.FUNDRAISER].includes(m.role);
  } else if (filter === CONTRIBUTOR_FILTERS.CORE) {
    filterFunc = m => m.role === roles.ADMIN;
  }

  const membersMap = {};
  members.forEach(member => {
    // Apply the function to filter by type
    if (filterFunc && !filterFunc(member)) {
      return;
    }

    // Ensure uniqueness
    const collectiveId = member.collective.id;
    if (membersMap[collectiveId]) {
      // Conflict on roles! Take ADMIN > CONTRIBUTOR > BACKER > FUNDRAISER > FOLLOWER
      if (getRoleWeight(member.role) > getRoleWeight(membersMap[collectiveId].role)) {
        membersMap[collectiveId] = member;
      }
    } else {
      membersMap[collectiveId] = member;
    }
  });

  return Object.values(membersMap);
};

/**
 * An individual filtering button
 */
const FilterBtn = styled(({ filter, isSelected, onChange, ...props }) => {
  return (
    <StyledButton
      onClick={isSelected ? undefined : () => onChange(filter)}
      buttonStyle={isSelected ? 'dark' : 'standard'}
      {...props}
    />
  );
})`
  margin: 0 8px;

  ${props =>
    !props.isSelected &&
    css`
    backgroundColor: '#F5F7FA',
    color: '#4E5052',
    border: '1px solid #F5F7FA',
  `}
`;

/**
 * A set of filters for contributors types. This file also exports helper functions
 * to deal with the filters, incuding:
 * - `getMembersFilters`: For a given list of members, returns all the filters that can be applied to the list.
 * - `filterMembers`: A helper to filter a members list by member type.
 */
const ContributorsFilter = ({ intl, selected, onChange, filters }) => {
  return (
    <Flex css={{ overflowX: 'auto' }}>
      {filters.map(filter => {
        return (
          <FilterBtn key={filter} filter={filter} onChange={onChange} isSelected={filter === selected}>
            <Span textTransform="capitalize" whiteSpace="nowrap">
              {intl.formatMessage(Translations[filter])}
            </Span>
          </FilterBtn>
        );
      })}
    </Flex>
  );
};

ContributorsFilter.propTypes = {
  /** Selected filter */
  selected: PropTypes.oneOf(FILTERS_LIST).isRequired,
  /** Called when another filter is selected */
  onChange: PropTypes.func.isRequired,
  /** An optional list of active filters */
  filters: PropTypes.arrayOf(PropTypes.oneOf(FILTERS_LIST)),
  /** @ignore from withIntl */
  intl: PropTypes.object,
};

ContributorsFilter.defaultProps = {
  filters: FILTERS_LIST,
};

export default withIntl(ContributorsFilter);
