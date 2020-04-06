import { Box } from '@rebass/grid';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Container from '../components/Container';
import ExpandableExpensePolicies from '../components/expenses/ExpandableExpensePolicies';
import CreateExpenseFAQ from '../components/faqs/CreateExpenseFAQ';
import FormattedMoneyAmount from '../components/FormattedMoneyAmount';
import LinkCollective from '../components/LinkCollective';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import { H5, Strong, P } from '../components/Text';

/**
 * Provide some info (ie. collective balance, tags, policies, etc.) for the expense pages
 * in a sidebar.
 */
const ExpenseInfoSidebar = ({ isLoading, host, collective }) => {
  return (
    <Box width="100%">
      <Box display={['none', 'block']}>
        <H5 mb={3}>
          <FormattedMessage id="CollectiveBalance" defaultMessage="Collective balance" />
        </H5>
        <Container borderLeft="1px solid" borderColor="green.600" pl={3} fontSize="H5" color="black.500">
          {isLoading ? (
            <LoadingPlaceholder height={28} width={75} />
          ) : (
            <FormattedMoneyAmount
              currency={collective.currency}
              amount={collective.balance}
              amountStyles={{ color: 'black.800' }}
            />
          )}
        </Container>
        {host && (
          <P fontSize="SmallCaption" color="black.600" mt={2}>
            <FormattedMessage
              id="withColon"
              defaultMessage="{item}:"
              values={{ item: <FormattedMessage id="Fiscalhost" defaultMessage="Fiscal Host" /> }}
            />{' '}
            <LinkCollective collective={host}>
              <Strong color="black.600">{host.name}</Strong>
            </LinkCollective>
          </P>
        )}
      </Box>
      <ExpandableExpensePolicies host={host} collective={collective} mt={50} />
      <Box mt={50}>
        <CreateExpenseFAQ withBorderLeft withNewButtons titleProps={{ fontSize: 'H5', fontWeight: 500, mb: 3 }} />
      </Box>
    </Box>
  );
};

ExpenseInfoSidebar.propTypes = {
  isLoading: PropTypes.bool,
  /** Must be provided if isLoading is false */
  collective: PropTypes.shape({
    currency: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }),
  host: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default React.memo(ExpenseInfoSidebar);
