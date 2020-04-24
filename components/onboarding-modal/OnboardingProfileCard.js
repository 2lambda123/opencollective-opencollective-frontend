import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '../Grid';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import Avatar from '../../components/Avatar';
import StyledTag from '../../components/StyledTag';
import StyledTooltip from '../../components/StyledTooltip';

const Admin = styled(StyledTag).attrs({ variant: 'rounded-right' })``;

class OnboardingProfileCard extends React.Component {
  static propTypes = {
    collective: PropTypes.object,
    adminCollective: PropTypes.object,
    removeAdmin: PropTypes.func,
  };

  render() {
    const { collective, removeAdmin, adminCollective } = this.props;
    const { name, email } = collective;

    return (
      <Flex my={1} ml={2}>
        {/* for invited users email is null */}
        {email === null ? (
          <StyledTooltip
            content={() => <FormattedMessage id="onboarding.admins.pending" defaultMessage="Pending for approval" />}
          >
            <Admin
              closeButtonProps={{
                onClick: () => {
                  removeAdmin(collective);
                },
              }}
            >
              <Flex alignItems="center">
                <Avatar radius={16} collective={collective} />
                <Box fontSize="Caption" ml={2}>
                  {name}
                </Box>
              </Flex>
            </Admin>
          </StyledTooltip>
        ) : (
          <Admin
            closeButtonProps={
              collective.id !== adminCollective.id
                ? {
                    onClick: () => {
                      removeAdmin(collective);
                    },
                  }
                : null
            }
          >
            <Flex alignItems="center">
              <Avatar radius={16} collective={collective} />
              <Box fontSize="Caption" ml={2}>
                {name}
              </Box>
            </Flex>
          </Admin>
        )}
      </Flex>
    );
  }
}

export default OnboardingProfileCard;
