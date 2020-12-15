import React, { Fragment, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { DotsVerticalRounded } from '@styled-icons/boxicons-regular/DotsVerticalRounded';
import { Settings } from '@styled-icons/feather/Settings';
import themeGet from '@styled-system/theme-get';
import { get } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';

import { getFilteredSectionsForCollective, NAVBAR_CATEGORIES } from '../../lib/collective-sections';
import { CollectiveType } from '../../lib/constants/collectives';
import { getEnvVar } from '../../lib/env-utils';
import useGlobalBlur from '../../lib/hooks/useGlobalBlur';
import i18nCollectivePageSection from '../../lib/i18n-collective-page-section';
import { parseToBoolean } from '../../lib/utils';

import Avatar from '../Avatar';
import { AllSectionsNames, Dimensions } from '../collective-page/_constants';
import CollectiveCallsToAction from '../CollectiveCallsToAction';
import Container from '../Container';
import { Box, Flex } from '../Grid';
import Link from '../Link';
import LinkCollective from '../LinkCollective';
import LoadingPlaceholder from '../LoadingPlaceholder';
import StyledButton from '../StyledButton';
import StyledRoundButton from '../StyledRoundButton';
import { H1, P } from '../Text';

import CollectiveNavbarActionsMenu from './ActionsMenu';
import { getNavBarMenu } from './menu';
import NavBarCategoryDropdown from './NavBarCategoryDropdown';

const NAV_V2_FEATURE_FLAG = parseToBoolean(getEnvVar('NEW_COLLECTIVE_NAVBAR'));

// Nav v2 styled components
const MainContainerV2 = styled(Container)`
  background: white;
  display: flex;
  justify-content: flex-start;
  overflow-y: auto;
`;

const AvatarBox = styled(Box)`
  position: relative;

  &::before {
    content: '';
    height: 24px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
    border-right: 2px solid rgba(214, 214, 214, 1);
  }
`;

const InfosContainerV2 = styled(Container)`
  width: 1;
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition: opacity 0.075s ease-out, transform 0.1s ease-out, visibility 0.075s ease-out, width 0.1s ease-in-out;

  /** Hidden state */
  ${props =>
    props.isHidden &&
    css`
      width: 0;
      visibility: hidden;
      opacity: 0;
      transform: translateX(-20px);
    `}
`;

const CollectiveNameV2 = styled(H1)`
  letter-spacing: -0.8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
  text-decoration: none;

  a:not(:hover) {
    color: #313233;
  }
`;

// v1 components
/** Main container for the entire component */
const MainContainer = styled.div`
  background: white;
  box-shadow: 0px 6px 10px -5px rgba(214, 214, 214, 0.5);

  /** Everything's inside cannot be larger than max section width */
  & > * {
    max-width: ${Dimensions.MAX_SECTION_WIDTH}px;
    margin: 0 auto;
  }
`;

/** A single menu link */
const MenuLink = styled.a`
  display: block;
  color: ${themeGet('colors.black.700')};
  font-size: 14px;
  line-height: 24px;
  text-decoration: none;
  white-space: nowrap;
  padding: 12px 16px 16px;

  letter-spacing: 0.6px;
  text-transform: uppercase;
  font-weight: 500;

  &:focus {
    color: ${themeGet('colors.primary.700')};
    text-decoration: none;
  }

  &:hover {
    color: ${themeGet('colors.primary.400')};
    text-decoration: none;
  }

  @media (max-width: 52em) {
    padding: 16px;
  }
`;

const MenuLinkContainer = styled.div`
  cursor: pointer;

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 3px;
    background: ${themeGet('colors.primary.500')};
    transition: width 0.2s;
    float: right;
  }

  ${props =>
    props.isSelected &&
    css`
      color: #090a0a;
      font-weight: 500;
      ${MenuLink} {
        color: #090a0a;
      }
      @media (min-width: 52em) {
        &::after {
          width: 100%;
          float: left;
        }
      }
    `}

  ${props =>
    props.mobileOnly &&
    css`
      @media (min-width: 52em) {
        display: none;
      }
    `}

  @media (max-width: 52em) {
    border-top: 1px solid #e1e1e1;
    &::after {
      display: none;
    }
  }
`;

const InfosContainer = styled(Container)`
  padding: 14px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition: opacity 0.075s ease-out, transform 0.1s ease-out, visibility 0.075s ease-out;

  @media (max-width: 52em) {
    padding: 10px 16px;
  }

  /** Hidden state */
  ${props =>
    props.isHidden &&
    css`
      visibility: hidden;
      opacity: 0;
      transform: translateY(-20px);
    `}
`;

/** Displayed on mobile to toggle the menu */
const ExpandMenuIcon = styled(DotsVerticalRounded).attrs({ size: 28 })`
  cursor: pointer;
  margin-right: 4px;
  flex: 0 0 28px;
  color: ${themeGet('colors.black.500')};

  @media (min-width: 52em) {
    display: none;
  }
`;

const CollectiveName = styled.h1`
  margin: 0 8px;
  padding: 8px 0;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -1px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;

  a:not(:hover) {
    color: #313233;
  }

  @media (min-width: 52em) {
    text-align: center;
  }
`;

const isFeatureAvailable = (collective, feature) => {
  const status = get(collective.features, feature);
  return status === 'ACTIVE' || status === 'AVAILABLE';
};

const getDefaultCallsToActions = (collective, isAdmin) => {
  if (!collective) {
    return {};
  }

  const isCollective = collective.type === CollectiveType.COLLECTIVE;
  const isEvent = collective.type === CollectiveType.EVENT;

  if (NAV_V2_FEATURE_FLAG) {
    return {
      hasContact: isFeatureAvailable(collective, 'CONTACT_FORM'),
      hasApply: isFeatureAvailable(collective, 'RECEIVE_HOST_APPLICATIONS'),
      hasSubmitExpense: isFeatureAvailable(collective, 'RECEIVE_EXPENSES'),
      hasManageSubscriptions: isAdmin && isFeatureAvailable(collective, 'RECURRING_CONTRIBUTIONS'),
      hasDashboard: isAdmin && isFeatureAvailable(collective, 'HOST_DASHBOARD'),
    };
  }

  return {
    hasContact: collective.canContact,
    hasApply: collective.canApply && !isAdmin,
    hasManageSubscriptions: isAdmin && !isCollective && !isEvent,
  };
};

/**
 * The NavBar that displays all the individual sections.
 */
const CollectiveNavbar = ({
  collective,
  isAdmin,
  isLoading,
  showEdit,
  sections,
  selected,
  selectedCategory,
  LinkComponent,
  callsToAction,
  onCollectiveClick,
  onSectionClick,
  hideInfos,
  onlyInfos,
  isAnimated,
  createNotification,
  showBackButton,
  withShadow,
  useAnchorsForCategories,
}) => {
  const intl = useIntl();
  const [isExpanded, setExpanded] = React.useState(false);
  sections = sections || getFilteredSectionsForCollective(collective, isAdmin);
  callsToAction = { ...getDefaultCallsToActions(collective, isAdmin), ...callsToAction };
  const isEvent = collective?.type === CollectiveType.EVENT;

  const navbarRef = useRef();
  useGlobalBlur(navbarRef, outside => {
    if (!outside) {
      setTimeout(() => setExpanded(false), 200);
    }
  });

  return NAV_V2_FEATURE_FLAG ? (
    // v2
    <MainContainerV2
      flexDirection={['column', 'row']}
      flexWrap={['nowrap', 'wrap']}
      px={[0, Dimensions.PADDING_X[1]]}
      mx="auto"
      mt={onlyInfos ? 0 : '50px'}
      maxWidth={Dimensions.MAX_SECTION_WIDTH}
      boxShadow={withShadow ? ' 0px 6px 10px -5px rgba(214, 214, 214, 0.5)' : 'none'}
      maxHeight="100vh"
    >
      {/** Collective info */}
      <InfosContainerV2
        isHidden={hideInfos}
        isAnimated={isAnimated}
        mr={[0, 2]}
        display="flex"
        alignItems="center"
        px={[3, 0]}
        py={[2, 1]}
      >
        {showBackButton && (
          <Box display={['none', 'block']} mr={2}>
            <StyledButton px={1} isBorderless onClick={() => window && window.history.back()}>
              &larr;
            </StyledButton>
          </Box>
        )}
        <AvatarBox>
          <LinkCollective collective={collective} onClick={onCollectiveClick}>
            <Container borderRadius="25%" mr={2}>
              <Avatar collective={collective} radius={40} />
            </Container>
          </LinkCollective>
        </AvatarBox>
        <Box display={['block', null, null, onlyInfos ? 'block' : 'none']}>
          <CollectiveNameV2
            mx={2}
            py={2}
            fontSize={['16px', '20px']}
            lineHeight={['24px', '28px']}
            textAlign="center"
            fontWeight="500"
            color="black.800"
          >
            {isLoading ? (
              <LoadingPlaceholder height={14} minWidth={100} />
            ) : (
              <LinkCollective collective={collective} onClick={onCollectiveClick} />
            )}
          </CollectiveNameV2>
        </Box>
        {!onlyInfos && (
          <Box display={['block', 'none']} marginLeft="auto">
            <ExpandMenuIcon onClick={() => setExpanded(!isExpanded)} />
          </Box>
        )}
      </InfosContainerV2>
      {/** Main navbar items */}

      {!onlyInfos && (
        <Fragment>
          <Container
            ref={navbarRef}
            backgroundColor="#fff"
            display={isExpanded ? 'flex' : ['none', 'flex']}
            flexDirection={['column', 'row']}
            flexShrink={2}
            flexGrow={1}
            justifyContent={['space-between', null, 'flex-start']}
            minWidth={0}
            order={[0, 3, 0]}
            borderTop={['none', '1px solid #e1e1e1', 'none']}
            overflowX="auto"
          >
            {isLoading ? (
              <LoadingPlaceholder height={43} minWidth={150} mb={2} />
            ) : (
              getNavBarMenu(intl, collective, sections).map(({ category, links }) => (
                <NavBarCategoryDropdown
                  key={category}
                  collective={collective}
                  category={category}
                  links={links}
                  isSelected={selectedCategory === category}
                  useAnchor={useAnchorsForCategories}
                />
              ))
            )}
          </Container>

          {/* CTAs for v2 navbar & admin panel */}
          <Container
            display={isExpanded ? 'flex' : ['none', 'flex']}
            flexDirection={['column', 'row']}
            flexBasis="fit-content"
            marginLeft={[0, 'auto']}
            backgroundColor="#fff"
            zIndex={1}
          >
            {isAdmin && (
              <Flex flexDirection={['column', 'row']} alignItems={['stretch', 'center']}>
                <Link
                  width="100%"
                  route={isEvent ? 'editEvent' : 'editCollective'}
                  textDecoration="none"
                  params={
                    isEvent
                      ? { parentCollectiveSlug: collective.parentCollective?.slug, eventSlug: collective.slug }
                      : { slug: collective.slug }
                  }
                >
                  <Container
                    display="flex"
                    flexGrow={1}
                    alignItems="center"
                    borderRadius={[0, 8]}
                    background="rgba(72, 95, 211, 0.1)"
                    px={[4, 3]}
                    py={[3, 1]}
                  >
                    <Settings size={20} color="rgb(48, 76, 220)" />
                    <P
                      ml={[2, 1]}
                      textTransform="uppercase"
                      color="rgb(48, 76, 220)"
                      fontSize="14px"
                      lineHeight="16px"
                      letterSpacing="60%"
                    >
                      <FormattedMessage id="AdminPanel" defaultMessage="Admin Panel" />
                    </P>
                  </Container>
                </Link>
              </Flex>
            )}
            {!isLoading && (
              <CollectiveNavbarActionsMenu
                collective={collective}
                callsToAction={callsToAction}
                createNotification={createNotification}
              />
            )}
          </Container>
        </Fragment>
      )}
    </MainContainerV2>
  ) : (
    // v1
    <MainContainer>
      {/** Collective infos */}
      <InfosContainer isHidden={hideInfos} isAnimated={isAnimated}>
        <Flex alignItems="center" flex="1 1 80%" css={{ minWidth: 0 /** For text-overflow */ }}>
          <LinkCollective collective={collective} onClick={onCollectiveClick}>
            <Container borderRadius="25%" mr={2}>
              <Avatar collective={collective} radius={40} />
            </Container>
          </LinkCollective>
          <CollectiveName>
            {isLoading ? (
              <LoadingPlaceholder height={22} minWidth={100} />
            ) : (
              <LinkCollective collective={collective} onClick={onCollectiveClick} />
            )}
          </CollectiveName>
          {isAdmin && showEdit && (
            <Link route="editCollective" params={{ slug: collective.slug }} title="Settings">
              <StyledRoundButton size={24} bg="#F0F2F5" color="#4B4E52">
                <Settings size={17} />
              </StyledRoundButton>
            </Link>
          )}
        </Flex>
        {!onlyInfos && <ExpandMenuIcon onClick={() => setExpanded(!isExpanded)} />}
      </InfosContainer>

      {/** Navbar items and buttons */}
      {!onlyInfos && (
        <Container
          position={['absolute', 'relative']}
          display="flex"
          justifyContent="space-between"
          px={[0, Dimensions.PADDING_X[1]]}
          width="100%"
          background="white"
        >
          {isLoading ? (
            <LoadingPlaceholder height={43} minWidth={150} mb={2} />
          ) : (
            <Container
              flex="2 1 600px"
              css={{ overflowX: 'auto' }}
              display={isExpanded ? 'flex' : ['none', null, 'flex']}
              data-cy="CollectivePage.NavBar"
              flexDirection={['column', null, 'row']}
              height="100%"
              borderBottom={['1px solid #e6e8eb', 'none']}
              backgroundColor="#fff"
              zIndex={1}
            >
              {sections.map(section => (
                <MenuLinkContainer
                  key={section}
                  isSelected={section === selected}
                  onClick={() => {
                    if (isExpanded) {
                      setExpanded(false);
                    }
                    if (onSectionClick) {
                      onSectionClick(section);
                    }
                  }}
                >
                  <MenuLink
                    as={LinkComponent}
                    collectivePath={collective.path || `/${collective.slug}`}
                    section={section}
                    label={i18nCollectivePageSection(intl, section)}
                  />
                </MenuLinkContainer>
              ))}
              {/* mobile CTAs */}
              {callsToAction.hasSubmitExpense && (
                <MenuLinkContainer mobileOnly>
                  <MenuLink as={Link} route="create-expense" params={{ collectiveSlug: collective.slug }}>
                    <FormattedMessage id="menu.submitExpense" defaultMessage="Submit Expense" />
                  </MenuLink>
                </MenuLinkContainer>
              )}
              {callsToAction.hasContact && (
                <MenuLinkContainer mobileOnly>
                  <MenuLink as={Link} route="collective-contact" params={{ collectiveSlug: collective.slug }}>
                    <FormattedMessage id="Contact" defaultMessage="Contact" />
                  </MenuLink>
                </MenuLinkContainer>
              )}
              {callsToAction.hasDashboard && collective.plan.hostDashboard && (
                <MenuLinkContainer mobileOnly>
                  <MenuLink as={Link} route="host.dashboard" params={{ hostCollectiveSlug: collective.slug }}>
                    <FormattedMessage id="host.dashboard" defaultMessage="Dashboard" />
                  </MenuLink>
                </MenuLinkContainer>
              )}
            </Container>
          )}
          <div>
            {!isLoading && (
              // non-mobile CTAs
              <CollectiveCallsToAction
                display={['none', null, 'flex']}
                collective={collective}
                callsToAction={callsToAction}
              />
            )}
          </div>
        </Container>
      )}
    </MainContainer>
  );
};

CollectiveNavbar.propTypes = {
  /** Collective to show info about */
  collective: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    path: PropTypes.string,
    isArchived: PropTypes.bool,
    canContact: PropTypes.bool,
    canApply: PropTypes.bool,
    host: PropTypes.object,
    plan: PropTypes.object,
    parentCollective: PropTypes.object,
  }),
  /** Defines the calls to action displayed next to the NavBar items. Match PropTypes of `CollectiveCallsToAction` */
  callsToAction: PropTypes.shape({
    hasContact: PropTypes.bool,
    hasSubmitExpense: PropTypes.bool,
    hasApply: PropTypes.bool,
    hasDashboard: PropTypes.bool,
    hasManageSubscriptions: PropTypes.bool,
  }),
  /** Used to check what sections can be used */
  isAdmin: PropTypes.bool,
  /** Will show loading state */
  isLoading: PropTypes.bool,
  /** Wether we want to display the "/edit" button */
  showEdit: PropTypes.bool,
  /** Called with the new section name when it changes */
  onSectionClick: PropTypes.func,
  /** An optionnal function to build links URLs. Useful to override behaviour in test/styleguide envs. */
  LinkComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  /** The list of sections to be displayed by the NavBar. If not provided, will show all the sections available to this collective type. */
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['CATEGORY', 'SECTION']),
      name: PropTypes.string,
    }),
  ),
  /** Called when users click the collective logo or name */
  onCollectiveClick: PropTypes.func,
  /** Currently selected section */
  selected: PropTypes.oneOf(AllSectionsNames),
  selectedCategory: PropTypes.oneOf(Object.values(NAVBAR_CATEGORIES)),
  /** If true, the collective infos (avatar + name) will be hidden with css `visibility` */
  hideInfos: PropTypes.bool,
  /** If true, the CTAs will be hidden on mobile */
  hideButtonsOnMobile: PropTypes.bool,
  /** If true, the Navbar items and buttons will be skipped  */
  onlyInfos: PropTypes.bool,
  /** If true, the collective infos will fadeInDown and fadeOutUp when transitioning */
  isAnimated: PropTypes.bool,
  /** Set this to true to make the component smaller in height */
  isSmall: PropTypes.bool,
  createNotification: PropTypes.func,
  showBackButton: PropTypes.bool,
  withShadow: PropTypes.bool,
  /** To use on the collective page. Sets links to anchors rather than full URLs for faster navigation */
  useAnchorsForCategories: PropTypes.bool,
};

CollectiveNavbar.defaultProps = {
  hideInfos: false,
  isAnimated: false,
  onlyInfos: false,
  callsToAction: {},
  showBackButton: true,
  withShadow: true,

  // eslint-disable-next-line react/prop-types
  LinkComponent: function DefaultNavbarLink({ section, label, collectivePath, className }) {
    return (
      <Link route={`${collectivePath}#section-${section}`} className={className}>
        {label}
      </Link>
    );
  },
};

export default React.memo(CollectiveNavbar);
