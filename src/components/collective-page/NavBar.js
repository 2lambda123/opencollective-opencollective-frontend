import React from 'react';
import { PropTypes } from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { omit } from 'lodash';
import styled, { css } from 'styled-components';
import themeGet from '@styled-system/theme-get';

import Container from '../Container';
import { Sections, AllSectionsNames } from './_constants';

const MenuLink = styled(props => <a {...omit(props, ['isSelected'])} />)`
  padding: 4px 16px 0 16px;
  color: #71757a;
  display: flex;
  align-items: center;
  border-bottom: 3px solid rgb(0, 0, 0, 0);
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.2px;
  text-decoration: none;
  white-space: nowrap;

  &:focus {
    color: ${themeGet('colors.primary.700')};
    text-decoration: none;
  }

  &:hover {
    color: ${themeGet('colors.primary.400')};
  }

  ${props =>
    props.isSelected &&
    css`
      color: #090a0a;
      font-weight: 500;
      border-bottom: 3px solid ${themeGet('colors.primary.500')};
    `}
`;

const i18nSection = defineMessages({
  [Sections.CONTRIBUTE]: {
    id: 'CollectivePage.NavBar.Contribute',
    defaultMessage: 'Contribute',
  },
  [Sections.CONVERSATIONS]: {
    id: 'CollectivePage.NavBar.Conversations',
    defaultMessage: 'Conversations',
  },
  [Sections.BUDGET]: {
    id: 'CollectivePage.NavBar.Budget',
    defaultMessage: 'Budget',
  },
  [Sections.CONTRIBUTORS]: {
    id: 'CollectivePage.NavBar.Contributors',
    defaultMessage: 'Contributors',
  },
  [Sections.ABOUT]: {
    id: 'CollectivePage.NavBar.About',
    defaultMessage: 'About',
  },
  [Sections.UPDATES]: {
    id: 'CollectivePage.NavBar.Updates',
    defaultMessage: 'Updates',
  },
});

/**
 * The NavBar that displays all the invidual sections. The component will take the
 * entire height available, so parent is responsible for its size.
 */
const NavBar = ({ sections, selected, onSectionClick, linkBuilder, intl }) => {
  return (
    <Container display="flex" height="100%" css={{ overflowX: 'auto' }} data-cy="CollectivePage.NavBar">
      {sections.map(section => (
        <MenuLink
          key={section}
          href={linkBuilder(section)}
          isSelected={section === selected}
          onClick={e => {
            onSectionClick(section);
            e.preventDefault();
          }}
        >
          {i18nSection[section] ? intl.formatMessage(i18nSection[section]) : section}
        </MenuLink>
      ))}
    </Container>
  );
};

NavBar.propTypes = {
  /** Called with the new section name when it changes */
  onSectionClick: PropTypes.func.isRequired,
  /** An optionnal function to build links URLs. Usefull to override behaviour in test/styleguide envs. */
  linkBuilder: PropTypes.func.isRequired,
  /** The list of sections to be displayed by the NavBar */
  sections: PropTypes.arrayOf(PropTypes.oneOf(AllSectionsNames)),
  /** Currently selected section */
  selected: PropTypes.oneOf(AllSectionsNames),
  /** @ignore From injectIntl */
  intl: PropTypes.object,
};

NavBar.defaultProps = {
  sections: AllSectionsNames,
  linkBuilder: section => `#section-${section}`,
};

export default React.memo(injectIntl(NavBar));
