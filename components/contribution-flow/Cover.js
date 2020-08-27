import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Avatar from '../Avatar';
import Container from '../Container';
import { Flex } from '../Grid';
import LinkCollective from '../LinkCollective';
import { H2, P } from '../Text';

/**
 * Cover to display information about the collective in the contribution flow.
 */
const Cover = ({ collective, tier }) => {
  return (
    <Container pt={[4, 48]} mb={28}>
      <Flex alignItems="center" flexDirection="column" mx="auto" width="100%" maxWidth={320}>
        <LinkCollective collective={collective}>
          <Flex justifyContent="center">
            <Avatar collective={collective} radius="10rem" />
          </Flex>
          <H2 as="h1" color="black.900" textAlign="center">
            {collective.name}
          </H2>
        </LinkCollective>

        {tier && (
          <P fontSize="16px" color="black.600" mt={3} textAlign="center">
            {tier.type === 'TICKET' ? (
              <FormattedMessage
                id="contribute.ticketType"
                defaultMessage='Order a "{name}" ticket'
                values={{ name: tier.name }}
              />
            ) : (
              <FormattedMessage
                id="contribute.contributorType"
                defaultMessage='Contribute to "{name}" tier'
                values={{ name: tier.name }}
              />
            )}
          </P>
        )}
      </Flex>
    </Container>
  );
};

Cover.propTypes = {
  collective: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    type: PropTypes.string,
    parentCollective: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
  tier: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default React.memo(Cover);
