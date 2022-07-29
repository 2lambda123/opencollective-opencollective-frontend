import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Flex } from '../../Grid';
import PreviewModal from '../../PreviewModal';
import StyledButton from '../../StyledButton';
import StyledInput from '../../StyledInput';
import StyledTextarea from '../../StyledTextarea';
import { Label, P, Span } from '../../Text';

const ReceiptTemplateForm = ({
  defaultTemplate,
  defaultReceiptTitle,
  receiptInfo,
  receiptTitlePlaceholder,
  receiptInfoPlaceholder,
  onChangeReceiptTitle,
  onChangeReceiptInfo,
}) => {
  const [showPreview, setShowPreview] = React.useState(false);

  return (
    <React.Fragment>
      <Label htmlFor="receipt-title" color="black.800" fontSize="16px" fontWeight={700} lineHeight="24px">
        <FormattedMessage defaultMessage="Receipt title" />
      </Label>
      <StyledInput
        inputId="receipt-title"
        placeholder={receiptTitlePlaceholder}
        defaultValue={defaultReceiptTitle}
        onChange={onChangeReceiptTitle}
        width="100%"
        maxWidth={414}
        mt="6px"
      />
      {defaultTemplate && (
        <P mt="6px">
          <FormattedMessage
            defaultMessage="Keep this field empty to use the default title: {receiptTitlePlaceholder}."
            values={{ receiptTitlePlaceholder }}
          />
        </P>
      )}
      <Flex justifyContent="space-between" flexDirection={['column', 'row']} pt="26px">
        <Label htmlFor="custom-message" color="black.800" fontSize="16px" fontWeight={700} lineHeight="24px">
          <FormattedMessage defaultMessage="Custom Message" />
        </Label>
        <StyledButton
          buttonStyle="secondary"
          buttonSize="tiny"
          maxWidth="78px"
          pt="4px"
          pb="4px"
          pl="14px"
          pr="14px"
          height="24px"
          onClick={() => setShowPreview(true)}
        >
          <Span fontSize="13px" fontWeight={500} lineHeight="16px">
            <FormattedMessage defaultMessage="Preview" />
          </Span>
        </StyledButton>
      </Flex>
      <StyledTextarea
        inputId="custom-message"
        placeholder={receiptInfoPlaceholder}
        defaultValue={receiptInfo}
        onChange={onChangeReceiptInfo}
        width="100%"
        height="150px"
        fontSize="13px"
        mt="14px"
        mb="23px"
      />
      {showPreview && (
        <PreviewModal
          heading={<FormattedMessage defaultMessage="Receipt Preview" />}
          onClose={() => setShowPreview(false)}
          previewImage="/static/images/invoice-title-preview.jpg"
          imgHeight="548.6px"
          imgWidth="667px"
        />
      )}
    </React.Fragment>
  );
};

ReceiptTemplateForm.propTypes = {
  defaultTemplate: PropTypes.bool,
  defaultReceiptTitle: PropTypes.string,
  receiptInfo: PropTypes.string,
  receiptInfoPlaceholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  receiptTitlePlaceholder: PropTypes.string,
  onChangeReceiptTitle: PropTypes.func.isRequired,
  onChangeReceiptInfo: PropTypes.func.isRequired,
};

export default ReceiptTemplateForm;
