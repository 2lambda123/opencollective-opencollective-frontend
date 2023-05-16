import { defineMessages, MessageDescriptor } from 'react-intl';

import { ActivityTypes } from '../constants/activities';

export const ActivityDescriptionI18n = defineMessages({
  // Collective creation & applications
  COLLECTIVE_CREATED: {
    defaultMessage:
      '<AccountType></AccountType> <Account></Account> created{hasParent, select, true { under <AccountParent></AccountParent>} other {}}',
  },
  COLLECTIVE_EDITED: {
    defaultMessage: '<Account></Account> edited',
  },
  COLLECTIVE_REJECTED: {
    defaultMessage: '<Account></Account> application rejected',
  },
  ORGANIZATION_COLLECTIVE_CREATED: {
    defaultMessage: '<Account></Account> created',
  },
  COLLECTIVE_CREATED_GITHUB: {
    defaultMessage: '<Account></Account> created through GitHub',
  },
  COLLECTIVE_APPLY: {
    defaultMessage: '<Account></Account> applied to be hosted by <Host></Host>',
  },
  COLLECTIVE_APPROVED: {
    defaultMessage: '<Account></Account> application approved',
  },
  // Freezing collectives
  COLLECTIVE_FROZEN: {
    defaultMessage: '<Account></Account> frozen',
  },
  COLLECTIVE_UNFROZEN: {
    defaultMessage: '<Account></Account> unfrozen',
  },
  // Comments & conversations
  COLLECTIVE_COMMENT_CREATED: {
    defaultMessage: 'New comment on <CommentEntity></CommentEntity>',
  },
  // TODO: Link update
  UPDATE_COMMENT_CREATED: {
    defaultMessage: 'New comment on update',
  },
  EXPENSE_COMMENT_CREATED: {
    defaultMessage: 'New comment on <Expense>expense</Expense>',
  },
  // TODO: Link conversation
  CONVERSATION_COMMENT_CREATED: {
    defaultMessage: 'New comment on conversation',
  },
  // TODO Link conversation
  COLLECTIVE_CONVERSATION_CREATED: {
    defaultMessage: 'New conversation started on <Account></Account>',
  },
  // Expenses
  COLLECTIVE_EXPENSE_CREATED: {
    defaultMessage: 'New <Expense>expense</Expense> from <FromAccount></FromAccount> to <Account></Account>',
  },
  COLLECTIVE_EXPENSE_DELETED: {
    defaultMessage: 'Expense deleted',
  },
  COLLECTIVE_EXPENSE_UPDATED: {
    defaultMessage: '<Expense>Expense</Expense> from <FromAccount></FromAccount> to <Account></Account> updated',
  },
  COLLECTIVE_EXPENSE_REJECTED: {
    defaultMessage: 'Rejected <Expense>expense</Expense> from <FromAccount></FromAccount> to <Account></Account>',
  },
  COLLECTIVE_EXPENSE_APPROVED: {
    defaultMessage: 'Approved <Expense>expense</Expense> from <FromAccount></FromAccount> to <Account></Account>',
  },
  COLLECTIVE_EXPENSE_UNAPPROVED: {
    defaultMessage: 'Unapproved <Expense>expense</Expense> from <FromAccount></FromAccount> to <Account></Account>',
  },
  COLLECTIVE_EXPENSE_MOVED: {
    defaultMessage: '<Expense>Expense</Expense> moved from <FromAccount></FromAccount> to <Account></Account>',
  },
  COLLECTIVE_EXPENSE_PAID: {
    defaultMessage: 'Paid <Expense>expense</Expense> from <FromAccount></FromAccount> to <Account></Account>',
  },
  COLLECTIVE_EXPENSE_MARKED_AS_UNPAID: {
    defaultMessage: 'Marked <Expense>expense</Expense> as unpaid',
  },
  COLLECTIVE_EXPENSE_MARKED_AS_SPAM: {
    defaultMessage: 'Marked <Expense>expense</Expense> as SPAM',
  },
  COLLECTIVE_EXPENSE_MARKED_AS_INCOMPLETE: {
    defaultMessage: 'Marked <Expense>expense</Expense> as incomplete',
  },
  COLLECTIVE_EXPENSE_PROCESSING: {
    defaultMessage: '<Expense>Expense</Expense> processing',
  },
  COLLECTIVE_EXPENSE_SCHEDULED_FOR_PAYMENT: {
    defaultMessage: '<Expense>Expense</Expense> scheduled for payment',
  },
  COLLECTIVE_EXPENSE_ERROR: {
    defaultMessage: '<Expense>Expense</Expense> payment failed',
  },
  COLLECTIVE_EXPENSE_INVITE_DRAFTED: {
    defaultMessage: 'Invited someone to submit <Expense>expense</Expense> to <Account></Account>',
  },
  COLLECTIVE_EXPENSE_RECURRING_DRAFTED: {
    defaultMessage: 'New draft created for <Expense>recurring expense</Expense> on <Account></Account>',
  },
  COLLECTIVE_EXPENSE_MISSING_RECEIPT: {
    defaultMessage: 'Notified admins about a missing receipt for <Expense>expense</Expense> on <Account></Account>',
  },
  TAXFORM_REQUEST: {
    defaultMessage: 'Tax form request sent to <Account></Account>',
  },
  // Members
  COLLECTIVE_MEMBER_CREATED: {
    defaultMessage: '<FromAccount></FromAccount> joined <Account></Account> as a <MemberRole></MemberRole>',
  },
  COLLECTIVE_MEMBER_INVITED: {
    defaultMessage:
      '<FromAccount></FromAccount> was invited to join <Account></Account> as a <MemberRole></MemberRole>',
  },
  COLLECTIVE_CORE_MEMBER_INVITED: {
    defaultMessage:
      '<FromAccount></FromAccount> was invited to join <Account></Account> as a <MemberRole></MemberRole>',
  },
  COLLECTIVE_CORE_MEMBER_INVITATION_DECLINED: {
    defaultMessage:
      '<FromAccount></FromAccount> declined the invitation to join <Account></Account> as a <MemberRole></MemberRole>',
  },
  COLLECTIVE_CORE_MEMBER_ADDED: {
    defaultMessage:
      '<FromAccount></FromAccount> was added to <Account></Account> with the role <MemberRole></MemberRole>',
  },
  COLLECTIVE_CORE_MEMBER_EDITED: {
    defaultMessage: 'Edited <FromAccount></FromAccount> membership to <Account></Account>',
  },
  COLLECTIVE_CORE_MEMBER_REMOVED: {
    defaultMessage: '<FromAccount></FromAccount> removed as <MemberRole></MemberRole> of <Account></Account>',
  },
  // Transactions
  COLLECTIVE_TRANSACTION_CREATED: {
    defaultMessage: 'New transaction from <FromAccount></FromAccount> to <Account></Account>',
  },
  // Updates
  COLLECTIVE_UPDATE_CREATED: {
    defaultMessage: 'New update drafted on <Account></Account>',
  },
  COLLECTIVE_UPDATE_PUBLISHED: {
    defaultMessage: 'Update published on <Account></Account>',
  },
  // Contact
  COLLECTIVE_CONTACT: {
    defaultMessage: '<FromAccount></FromAccount> contacted <Account></Account>',
  },
  // Virtual cards
  // TODO: Link virtual cards and/or admin page
  COLLECTIVE_VIRTUAL_CARD_ADDED: {
    defaultMessage: 'New virtual card added to <Account></Account>',
  },
  COLLECTIVE_VIRTUAL_CARD_CREATED: {
    defaultMessage: 'New virtual card created on <Account></Account>',
  },
  COLLECTIVE_VIRTUAL_CARD_MISSING_RECEIPTS: {
    defaultMessage: 'Notified admins about a missing receipt for <Expense>expense</Expense> on <Account></Account>',
  },
  COLLECTIVE_VIRTUAL_CARD_SUSPENDED: {
    defaultMessage: 'Virtual card suspended on <Account></Account>',
  },
  VIRTUAL_CARD_REQUESTED: {
    defaultMessage: 'Requested a virtual card for <Account></Account>',
  },
  VIRTUAL_CARD_PURCHASE: {
    defaultMessage: 'New <Expense>purchase</Expense> with virtual card',
  },
  VIRTUAL_CARD_CHARGE_DECLINED: {
    defaultMessage: 'Virtual card charge declined on <Account></Account>',
  },
  // Connected accounts
  CONNECTED_ACCOUNT_CREATED: {
    id: 'WebhookEvents.CONNECTED_ACCOUNT_CREATED',
    defaultMessage: 'Connected account added',
  },
  // Contributions
  SUBSCRIPTION_CANCELED: {
    defaultMessage: '<Order>Recurring contribution</Order> cancelled',
  },
  TICKET_CONFIRMED: {
    id: 'WebhookEvents.TICKET_CONFIRMED',
    defaultMessage: 'Ticket confirmed',
  },
  CONTRIBUTION_REJECTED: {
    defaultMessage: 'Contribution from <FromAccount></FromAccount> rejected by <Account></Account>',
  },
  ORDER_CANCELED_ARCHIVED_COLLECTIVE: {
    defaultMessage: '<Order>Recurring contribution</Order> cancelled on <Account></Account> (archived)',
  },
  ORDER_PROCESSING: {
    defaultMessage:
      '<Order>Contribution</Order> from <FromAccount></FromAccount> to <Account></Account> set as processing',
  },
  ORDER_PROCESSING_CRYPTO: {
    defaultMessage:
      'Crypto <Order>contribution</Order> from <FromAccount></FromAccount> to <Account></Account> set as processing',
  },
  ORDER_PENDING_CONTRIBUTION_NEW: {
    defaultMessage: 'New pending <Order>contribution</Order> from <FromAccount></FromAccount> to <Account></Account>',
  },
  ORDER_PENDING_CONTRIBUTION_REMINDER: {
    defaultMessage:
      'Sent reminder to <FromAccount></FromAccount> about <Order>contribution</Order> to <Account></Account>',
  },
  BACKYOURSTACK_DISPATCH_CONFIRMED: {
    defaultMessage: 'BackYourStack dispatch confirmed for <Account></Account>',
  },
  PAYMENT_FAILED: {
    defaultMessage:
      'Payment from <FromAccount></FromAccount> to <Account></Account> for <Order>contribution</Order> failed',
  },
  PAYMENT_CREDITCARD_CONFIRMATION: {
    defaultMessage: 'Asked for credit card confirmation for <Order>contribution</Order> on <Account></Account>',
  },
  PAYMENT_CREDITCARD_EXPIRING: {
    defaultMessage: 'Sent a reminder about expiring credit card to <Account></Account>',
  },
  USER_PAYMENT_METHOD_CREATED: {
    defaultMessage: 'Created a new payment method for <Account></Account>',
  },
  // Sign in
  USER_NEW_TOKEN: {
    defaultMessage: 'Requested a new sign in token', // Deprecated and replaced by USER_SIGNIN
  },
  USER_SIGNIN: {
    defaultMessage: 'Signed In',
  },
  OAUTH_APPLICATION_AUTHORIZED: {
    defaultMessage: 'Authorized a new OAuth application',
  },
  USER_CHANGE_EMAIL: {
    defaultMessage: 'Changed email address',
  },
  USER_PASSWORD_SET: {
    defaultMessage: 'Changed password',
  },
  TWO_FACTOR_CODE_ADDED: {
    defaultMessage: 'Two factor authentication added',
  },
  TWO_FACTOR_CODE_DELETED: {
    defaultMessage: 'Two factor authentication removed',
  },
  // Gift cards
  USER_CARD_CLAIMED: {
    defaultMessage: 'Claimed a gift card from <FromAccount></FromAccount>',
  },
  USER_CARD_INVITED: {
    defaultMessage: 'Generated a new gift card for <Account></Account>',
  },
  // Host
  ACTIVATED_COLLECTIVE_AS_HOST: {
    defaultMessage: 'Activated <Account></Account> as a host',
  },
  ACTIVATED_COLLECTIVE_AS_INDEPENDENT: {
    defaultMessage: 'Activated <Account></Account> as an independent collective',
  },
  DEACTIVATED_COLLECTIVE_AS_HOST: {
    defaultMessage: 'Deactivated <Account></Account> as a host',
  },
});

type ActivityTranslations = Partial<Record<keyof typeof ActivityTypes, MessageDescriptor>>;

export const ActivityTypeI18n: ActivityTranslations = defineMessages({
  ACTIVITY_ALL: {
    id: 'WebhookEvents.All',
    defaultMessage: 'All',
  },
  CONNECTED_ACCOUNT_CREATED: {
    id: 'WebhookEvents.CONNECTED_ACCOUNT_CREATED',
    defaultMessage: 'Connected account added',
  },
  COLLECTIVE_APPLY: {
    id: 'WebhookEvents.COLLECTIVE_APPLY',
    defaultMessage: 'New collective application',
  },
  COLLECTIVE_APPROVED: {
    id: 'WebhookEvents.COLLECTIVE_APPROVED',
    defaultMessage: 'Collective application approved',
  },
  COLLECTIVE_REJECTED: {
    id: 'WebhookEvents.COLLECTIVE_REJECTED',
    defaultMessage: 'Collective application rejected',
  },
  COLLECTIVE_CREATED: {
    id: 'WebhookEvents.COLLECTIVE_CREATED',
    defaultMessage: 'Collective created',
  },
  ORGANIZATION_COLLECTIVE_CREATED: {
    defaultMessage: 'Organization created',
  },
  USER_CREATED: {
    defaultMessage: 'User profile created',
  },
  USER_NEW_TOKEN: {
    defaultMessage: 'Signed in',
  },
  USER_CHANGE_EMAIL: {
    defaultMessage: 'Changed email address',
  },
  USER_CARD_CLAIMED: {
    defaultMessage: 'Gift card claimed',
  },
  USER_CARD_INVITED: {
    defaultMessage: 'Gift card invited',
  },
  USER_PAYMENT_METHOD_CREATED: {
    defaultMessage: 'New payment method',
  },
  COLLECTIVE_CREATED_GITHUB: {
    defaultMessage: 'Collective created via GitHub',
  },
  COLLECTIVE_EDITED: {
    defaultMessage: 'Account edited',
  },
  COLLECTIVE_CONVERSATION_CREATED: {
    id: 'Conversation.created',
    defaultMessage: 'Conversation created',
  },
  COLLECTIVE_EXPENSE_CREATED: {
    id: 'WebhookEvents.COLLECTIVE_EXPENSE_CREATED',
    defaultMessage: 'New expenses',
  },
  COLLECTIVE_EXPENSE_UNAPPROVED: {
    id: 'Expense.Activity.Unapproved',
    defaultMessage: 'Expense unapproved',
  },
  COLLECTIVE_EXPENSE_DELETED: {
    defaultMessage: 'Expense deleted',
  },
  COLLECTIVE_EXPENSE_UPDATED: {
    id: 'Expense.Activity.Updated',
    defaultMessage: 'Expense updated',
  },
  COLLECTIVE_EXPENSE_REJECTED: {
    id: 'Expense.Activity.Rejected',
    defaultMessage: 'Expense rejected',
  },
  COLLECTIVE_EXPENSE_APPROVED: {
    id: 'Expense.Activity.Approved',
    defaultMessage: 'Expense approved',
  },
  COLLECTIVE_EXPENSE_PAID: {
    id: 'Expense.Activity.Paid',
    defaultMessage: 'Expense paid',
  },
  COLLECTIVE_EXPENSE_MOVED: {
    defaultMessage: 'Expense moved',
  },
  COLLECTIVE_EXPENSE_MARKED_AS_UNPAID: {
    id: 'Expense.Activity.MarkedAsUnpaid',
    defaultMessage: 'Expense marked as unpaid',
  },
  COLLECTIVE_EXPENSE_INVITE_DRAFTED: {
    id: 'Expense.Activity.Invite.Drafted',
    defaultMessage: 'Expense invited',
  },
  COLLECTIVE_EXPENSE_PROCESSING: {
    id: 'Expense.Activity.Processing',
    defaultMessage: 'Expense processing',
  },
  COLLECTIVE_EXPENSE_SCHEDULED_FOR_PAYMENT: {
    id: 'Expense.Activity.ScheduledForPayment',
    defaultMessage: 'Expense scheduled for payment',
  },
  COLLECTIVE_EXPENSE_ERROR: {
    id: 'Expense.Activity.Error',
    defaultMessage: 'Expense error',
  },
  COLLECTIVE_EXPENSE_MARKED_AS_SPAM: {
    id: 'Expense.Activity.MarkedAsSpam',
    defaultMessage: 'Expense marked as spam',
  },
  COLLECTIVE_EXPENSE_MARKED_AS_INCOMPLETE: {
    id: 'Expense.Activity.MarkedAsIncomplete',
    defaultMessage: 'Expense marked as incomplete',
  },
  COLLECTIVE_EXPENSE_RECURRING_DRAFTED: {
    defaultMessage: 'Recurring expense drafted',
  },
  COLLECTIVE_MEMBER_CREATED: {
    id: 'WebhookEvents.COLLECTIVE_MEMBER_CREATED',
    defaultMessage: 'New member',
  },
  COLLECTIVE_FROZEN: {
    defaultMessage: 'Frozen account',
  },
  COLLECTIVE_UNFROZEN: {
    defaultMessage: 'Unfrozen account',
  },
  COLLECTIVE_MEMBER_INVITED: {
    defaultMessage: 'Invited members',
  },
  COLLECTIVE_CORE_MEMBER_ADDED: {
    defaultMessage: 'Core member added',
  },
  COLLECTIVE_CORE_MEMBER_INVITED: {
    defaultMessage: 'Core member invited',
  },
  COLLECTIVE_CORE_MEMBER_INVITATION_DECLINED: {
    defaultMessage: 'Core member invitation declined',
  },
  COLLECTIVE_CORE_MEMBER_REMOVED: {
    defaultMessage: 'Core member removed',
  },
  COLLECTIVE_CORE_MEMBER_EDITED: {
    defaultMessage: 'Core member edited',
  },
  COLLECTIVE_CONTACT: {
    id: 'Contact',
    defaultMessage: 'Contact',
  },
  COLLECTIVE_VIRTUAL_CARD_SUSPENDED: {
    defaultMessage: 'Virtual card suspended',
  },
  COLLECTIVE_VIRTUAL_CARD_ADDED: {
    defaultMessage: 'Virtual card added',
  },
  VIRTUAL_CARD_REQUESTED: {
    defaultMessage: 'Virtual card requested',
  },
  VIRTUAL_CARD_CHARGE_DECLINED: {
    defaultMessage: 'Virtual card charge declined',
  },
  CONTRIBUTION_REJECTED: {
    defaultMessage: 'Contribution rejected',
  },
  COLLECTIVE_TRANSACTION_CREATED: {
    id: 'WebhookEvents.COLLECTIVE_TRANSACTION_CREATED',
    defaultMessage: 'New transaction',
  },
  COLLECTIVE_UPDATE_CREATED: {
    id: 'WebhookEvents.COLLECTIVE_UPDATE_CREATED',
    defaultMessage: 'New update drafted',
  },
  COLLECTIVE_UPDATE_PUBLISHED: {
    id: 'connectedAccounts.twitter.updatePublished.toggle.label',
    defaultMessage: 'Update published',
  },
  SUBSCRIPTION_CANCELED: {
    defaultMessage: 'Recurring contribution cancelled',
  },
  SUBSCRIPTION_ACTIVATED: {
    defaultMessage: 'Recurring contribution activated',
  },
  SUBSCRIPTION_CONFIRMED: {
    defaultMessage: 'Recurring contribution confirmed',
  },
  TICKET_CONFIRMED: {
    id: 'WebhookEvents.TICKET_CONFIRMED',
    defaultMessage: 'Ticket confirmed',
  },
  ORDER_CANCELED_ARCHIVED_COLLECTIVE: {
    defaultMessage: 'Contribution canceled (archived collective)',
  },
  ORDER_PROCESSING: {
    defaultMessage: 'Contribution processing',
  },
  ORDER_PROCESSING_CRYPTO: {
    defaultMessage: 'Contribution processing (crypto)',
  },
  ORDER_PENDING_CONTRIBUTION_NEW: {
    defaultMessage: 'New pending contribution',
  },
  ORDER_THANKYOU: {
    defaultMessage: 'New contribution',
  },
  ORDERS_SUSPICIOUS: {
    defaultMessage: 'Suspicious contribution',
  },
  ACTIVATED_COLLECTIVE_AS_HOST: {
    defaultMessage: 'Activated as host',
  },
  ACTIVATED_COLLECTIVE_AS_INDEPENDENT: {
    defaultMessage: 'Activated as independent',
  },
  DEACTIVATED_COLLECTIVE_AS_HOST: {
    defaultMessage: 'Deactivated as host',
  },
  PAYMENT_FAILED: {
    defaultMessage: 'Payment failed',
  },
  TAXFORM_REQUEST: {
    defaultMessage: 'Tax form request',
  },
  COLLECTIVE_COMMENT_CREATED: {
    defaultMessage: 'Comment posted',
  },
  CONVERSATION_COMMENT_CREATED: {
    defaultMessage: 'New comment on conversation',
  },
  UPDATE_COMMENT_CREATED: {
    defaultMessage: 'New comment on update',
  },
  EXPENSE_COMMENT_CREATED: {
    defaultMessage: 'New comment on expense',
  },
});
