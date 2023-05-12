import React from 'react';
import PropTypes from 'prop-types';
import { Link as IconLink } from '@styled-icons/feather/Link';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';

import useClipboard from '../../lib/hooks/useClipboard';

import Container from '../Container';
import { Box, Flex } from '../Grid';
import I18nFormatters from '../I18nFormatters';
import MessageBox from '../MessageBox';
import StyledButton from '../StyledButton';
import StyledLink from '../StyledLink';
import { P, Span } from '../Text';

const StepCheckout = ({ stepDetails, order }) => {
  const { isCopied, copy } = useClipboard();

  const renderCryptoInformation = order => {
    const pledgeCurrency = order?.data?.thegivingblock?.pledgeCurrency;
    const depositAddress = order?.paymentMethod?.data?.depositAddress;

    return (
      <Flex flexDirection="column" width={1} mt="24px">
        <MessageBox type="info" fontSize="13px" mb={2}>
          <FormattedMessage
            id="collective.user.orderProcessing.crypto"
            defaultMessage="<strong>Your contribution is pending.</strong> We also sent you these details to your email. Once the transaction is completed you will receive a confirmation email with the details."
            values={I18nFormatters}
          />
          {` `}
          {['BTC', 'ETH', 'BCH', 'LTC', 'ZEC', 'DOGE'].includes(pledgeCurrency) && (
            <FormattedMessage
              defaultMessage="You can view the status of your transaction at the Blockchain explorer: {link}"
              values={{
                link: (
                  <StyledLink
                    openInNewTab
                    href={`https://blockchair.com/search?q=${depositAddress}`}
                  >{`https://blockchair.com/search?q=${depositAddress}`}</StyledLink>
                ),
              }}
            />
          )}
        </MessageBox>
        {!['BTC', 'ETH', 'BCH', 'LTC', 'ZEC', 'DOGE', 'FIL', 'XTZ', 'MIR'].includes(pledgeCurrency) && (
          <MessageBox type="warning" fontSize="13px" mb={2}>
            <FormattedMessage
              defaultMessage="Send only {pledgeCurrency} (Using the Ethereum Mainnet/ERC-20 token) to this address. Sending other unsupported tokens or NFTs to this address may result in the loss of your donation. This address will expire after 180 days if not used."
              values={{ pledgeCurrency }}
            />
          </MessageBox>
        )}
      </Flex>
    );
  };

  return (
    <Container width={1}>
      <Box textAlign={['center']}>
        <FormattedMessage
          id="NewContribute.crypto.donationDescription"
          defaultMessage="Use the address below to donate {amount} from your wallet"
          values={{
            amount: (
              <span style={{ color: 'black.900' }}>
                <b>
                  {stepDetails.cryptoAmount} {stepDetails.currency.value}
                </b>
              </span>
            ),
          }}
        />
        {order?.paymentMethod?.data?.depositAddress && (
          <React.Fragment>
            <QRCode
              value={order.paymentMethod.data.depositAddress}
              imageSettings={{
                src: `/static/images/crypto-logos/${stepDetails.currency.value}.svg`,
                height: 40,
                width: 40,
                excavate: true,
              }}
              renderAs="svg"
              size={256}
              level="L"
              includeMargin
            />
            <P mb="16px">{order.paymentMethod.data.depositAddress}</P>
            <StyledButton onClick={() => copy(order.paymentMethod.data.depositAddress)} disabled={isCopied}>
              <Span mr={1}>
                <FormattedMessage
                  id="NewContribute.crypto.QRCodeCopyButton"
                  defaultMessage="Click to copy wallet address"
                />
              </Span>
              <IconLink size="20px" />
            </StyledButton>
            {renderCryptoInformation(order)}
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
};

StepCheckout.propTypes = {
  stepDetails: PropTypes.object,
  order: PropTypes.object,
};

export default StepCheckout;
