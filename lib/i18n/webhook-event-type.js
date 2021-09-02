import { defineMessages } from 'react-intl';

import { WebhookEvents } from '../constants/notificationEvents';

const TypesI18n = defineMessages({
  [WebhookEvents.ALL]: {
    id: 'WebhookEvents.All',
    defaultMessage: 'All',
  },
  [WebhookEvents.CONNECTED_ACCOUNT_CREATED]: {
    id: 'WebhookEvents.CONNECTED_ACCOUNT_CREATED',
    defaultMessage: 'Connected account added',
  },
  [WebhookEvents.COLLECTIVE_APPLY]: {
    id: 'WebhookEvents.COLLECTIVE_APPLY',
    defaultMessage: 'New collective application',
  },
  [WebhookEvents.COLLECTIVE_APPROVED]: {
    id: 'WebhookEvents.COLLECTIVE_APPROVED',
    defaultMessage: 'Collective application approved',
  },
  [WebhookEvents.COLLECTIVE_CREATED]: {
    id: 'WebhookEvents.COLLECTIVE_CREATED',
    defaultMessage: 'Collective created',
  },
  [WebhookEvents.COLLECTIVE_COMMENT_CREATED]: {
    id: 'WebhookEvents.COLLECTIVE_COMMENT_CREATED',
    defaultMessage: 'New comment',
  },
  [WebhookEvents.COLLECTIVE_EXPENSE_CREATED]: {
    id: 'WebhookEvents.COLLECTIVE_EXPENSE_CREATED',
    defaultMessage: 'New expenses',
  },
  [WebhookEvents.COLLECTIVE_EXPENSE_DELETED]: {
    id: 'WebhookEvents.COLLECTIVE_EXPENSE_DELETED',
    defaultMessage: 'Expense deleted',
  },
  [WebhookEvents.COLLECTIVE_EXPENSE_UPDATED]: {
    id: 'WebhookEvents.COLLECTIVE_EXPENSE_UPDATED',
    defaultMessage: 'Expense updated',
  },
  [WebhookEvents.COLLECTIVE_EXPENSE_REJECTED]: {
    id: 'WebhookEvents.COLLECTIVE_EXPENSE_REJECTED',
    defaultMessage: 'Expense rejected',
  },
  [WebhookEvents.COLLECTIVE_EXPENSE_APPROVED]: {
    id: 'WebhookEvents.COLLECTIVE_EXPENSE_APPROVED',
    defaultMessage: 'Expense approved',
  },
  [WebhookEvents.COLLECTIVE_EXPENSE_PAID]: {
    id: 'WebhookEvents.COLLECTIVE_EXPENSE_PAID',
    defaultMessage: 'Expense paid',
  },
  [WebhookEvents.COLLECTIVE_MEMBER_CREATED]: {
    id: 'WebhookEvents.COLLECTIVE_MEMBER_CREATED',
    defaultMessage: 'New member',
  },
  [WebhookEvents.COLLECTIVE_TRANSACTION_CREATED]: {
    id: 'WebhookEvents.COLLECTIVE_TRANSACTION_CREATED',
    defaultMessage: 'New transaction',
  },
  [WebhookEvents.COLLECTIVE_UPDATE_CREATED]: {
    id: 'WebhookEvents.COLLECTIVE_UPDATE_CREATED',
    defaultMessage: 'New update draft',
  },
  [WebhookEvents.COLLECTIVE_UPDATE_PUBLISHED]: {
    id: 'WebhookEvents.COLLECTIVE_UPDATE_PUBLISHED',
    defaultMessage: 'Update published',
  },
  [WebhookEvents.SUBSCRIPTION_CANCELED]: {
    id: 'WebhookEvents.SUBSCRIPTION_CANCELED',
    defaultMessage: 'Subscription cancelled',
  },
  [WebhookEvents.TICKET_CONFIRMED]: {
    id: 'WebhookEvents.TICKET_CONFIRMED',
    defaultMessage: 'Ticket confirmed',
  },
});

/**
 * Translate the webhook event
 *
 * @param {object} `intl` - see `injectIntl`
 * @param {string} `type`
 */
export const i18nWebhookEventType = (intl, type) => {
  const i18nMsg = TypesI18n[type];
  return i18nMsg ? intl.formatMessage(i18nMsg) : type;
};
