import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Elements, CardElement, injectStripe } from 'react-stripe-elements';
import { Flex } from '@rebass/grid';

import { Span } from './Text';
import StyledCheckbox from './StyledCheckbox';

const StyledCardElement = styled(CardElement)`
  min-width: 200px;
  max-width: 450px;
  max-height: 55px;
  margin: 0px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
  border-image: initial;
  padding: 1rem;
  border-radius: 3px;
`;

StyledCardElement.defaultProps = {
  style: { base: { fontSize: '14px', color: '#313233' } },
};

class NewCreditCardFormWithoutStripe extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    error: PropTypes.string,
    hasSaveCheckBox: PropTypes.bool,
    hidePostalCode: PropTypes.bool,
    onChange: PropTypes.func,
    onReady: PropTypes.func,
    stripe: PropTypes.object,
  };

  static defaultProps = {
    hasSaveCheckBox: true,
    hidePostalCode: false,
  };

  componentDidMount() {
    if (this.props.onReady && this.props.stripe) {
      this.props.onReady({ stripe: this.props.stripe });
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.onReady && !oldProps.stripe && this.props.stripe) {
      this.props.onReady({ stripe: this.props.stripe });
    }
  }

  render() {
    const { name, onChange, error, hasSaveCheckBox, hidePostalCode } = this.props;
    return (
      <Flex flexDirection="column">
        <StyledCardElement
          hidePostalCode={hidePostalCode}
          onChange={value => onChange({ name, type: 'StripeCreditCard', value })}
        />
        {error && (
          <Span display="block" color="red.500" pt={2} fontSize="Tiny">
            {error}
          </Span>
        )}
        {hasSaveCheckBox && (
          <Flex mt={3} alignItems="center">
            <StyledCheckbox defaultChecked name="save" label="Save this card to my account" onChange={onChange} />
          </Flex>
        )}
      </Flex>
    );
  }
}

const NewCreditCardFormWithStripe = injectStripe(NewCreditCardFormWithoutStripe);

const NewCreditCardForm = props => (
  <Elements>
    <NewCreditCardFormWithStripe {...props} />
  </Elements>
);

export default NewCreditCardForm;
