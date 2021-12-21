import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import { FormattedMessage } from 'react-intl';

import { API_V2_CONTEXT, gqlV2 } from '../../lib/graphql/helpers';

import Container from '../Container';
import StyledButton from '../StyledButton';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../StyledModal';
import { P } from '../Text';
import { TOAST_TYPE, useToasts } from '../ToastProvider';

const deleteVirtualCardMutation = gqlV2/* GraphQL */ `
  mutation deleteVirtualCard($virtualCard: VirtualCardReferenceInput!) {
    deleteVirtualCard(virtualCard: $virtualCard)
  }
`;

const DeleteVirtualCardModal = ({ virtualCard, onSuccess, onClose, ...modalProps }) => {
  const { addToast } = useToasts();

  const [deleteVirtualCard, { loading: isBusy }] = useMutation(deleteVirtualCardMutation, {
    context: API_V2_CONTEXT,
  });

  const formik = useFormik({
    initialValues: {},
    async onSubmit() {
      try {
        await deleteVirtualCard({
          variables: {
            virtualCard: { id: virtualCard.id },
          },
        });
      } catch (e) {
        addToast({
          type: TOAST_TYPE.ERROR,
          message: (
            <FormattedMessage
              defaultMessage="Error deleting virtual card: {error}"
              values={{
                error: e.message,
              }}
            />
          ),
        });
        return;
      }
      onSuccess?.(<FormattedMessage defaultMessage="Card successfully deleted" />);
      handleClose();
    },
  });

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Modal width="382px" onClose={handleClose} trapFocus {...modalProps}>
      <form onSubmit={formik.handleSubmit}>
        <ModalHeader onClose={handleClose}>
          <FormattedMessage defaultMessage="Delete virtual card" />
        </ModalHeader>
        <ModalBody pt={2}>
          <P>
            <FormattedMessage defaultMessage="You are about to delete the virtual card, are you sure you want to continue ?" />
          </P>
        </ModalBody>
        <ModalFooter isFullWidth>
          <Container display="flex" justifyContent={['center', 'flex-end']} flexWrap="Wrap">
            <StyledButton
              my={1}
              minWidth={140}
              buttonStyle="primary"
              data-cy="confirmation-modal-continue"
              loading={isBusy}
              type="submit"
              textTransform="capitalize"
            >
              <FormattedMessage defaultMessage="Delete" />
            </StyledButton>
          </Container>
        </ModalFooter>
      </form>
    </Modal>
  );
};

DeleteVirtualCardModal.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  virtualCard: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

/** @component */
export default DeleteVirtualCardModal;
