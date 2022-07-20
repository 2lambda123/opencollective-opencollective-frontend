import { get, isBoolean, trim } from 'lodash';
import slugify from 'slugify';

import { Sections } from '../components/collective-page/_constants';

import {
  CollectiveCategory,
  CollectiveTagsCategories,
  CollectiveType,
  OPENSOURCE_COLLECTIVE_ID,
} from './constants/collectives';
import { ProvidersWithRecurringPaymentSupport } from './constants/payment-methods';
import MEMBER_ROLE from './constants/roles';
import { isSectionForAdminsOnly } from './collective-sections';
import { getCollectivePageRoute } from './url-helpers';

/**
 * For a given host and/or a list of tags, returns the main tag for the category of the
 * collective. If none matches, defaults to `CollectiveCategory.COLLECTIVE`
 */
export const getCollectiveMainTag = (hostCollectiveId = null, tags = [], type, settings = null) => {
  // All collectives from "Open Source Collective 501c3" are set to "Open source" category
  if (hostCollectiveId === OPENSOURCE_COLLECTIVE_ID) {
    return CollectiveCategory.OPEN_SOURCE;
  }

  // Try to guess the main category from tags
  if (tags) {
    const tagWithCategory = tags.find(tag => CollectiveTagsCategories[tag]);
    if (tagWithCategory) {
      const category = CollectiveTagsCategories[tagWithCategory];
      return CollectiveCategory[category];
    }
  }

  // Try to get from the type
  if (type === CollectiveType.EVENT) {
    return CollectiveCategory.EVENT;
  } else if (type === CollectiveType.ORGANIZATION) {
    return CollectiveCategory.ORGANIZATION;
  } else if (type === CollectiveType.USER) {
    return CollectiveCategory.USER;
  } else if (type === CollectiveType.PROJECT) {
    return CollectiveCategory.PROJECT;
  } else if (type === CollectiveType.FUND) {
    return CollectiveCategory.FUND;
  }

  // Funds MVP, to refactor
  if (settings && settings.fund) {
    return CollectiveCategory.FUND;
  }

  // Default to 'Collective'
  return CollectiveCategory.COLLECTIVE;
};

export const expenseSubmissionAllowed = (collective, user) => {
  if (!collective?.settings?.disablePublicExpenseSubmission) {
    return true;
  }
  // NOTE: canEditCollective curently returns true if ADMIN or HOST admin
  if (user?.isRoot() || user?.canEditCollective(collective)) {
    return true;
  }
  return user?.memberOf.some(member => member.collective.slug === collective.slug);
};

export const getCollectiveTypeForUrl = collective => {
  if (!collective) {
    return;
  }

  if (collective.type === 'EVENT') {
    return 'events';
  }
  if (collective.type === 'PROJECT') {
    return 'projects';
  }
};

export const hostIsTaxDeductibeInTheUs = host => {
  return get(host, 'settings.taxDeductibleDonations');
};

export const suggestSlug = value => {
  const slugOptions = {
    replacement: '-',
    lower: true,
    strict: true,
  };

  return trim(slugify(value, slugOptions), '-');
};

export const getTopContributors = contributors => {
  const topOrgs = [];
  const topIndividuals = [];

  for (const contributor of contributors) {
    // We only care about financial contributors that donated $$$
    if (!contributor.isBacker || !contributor.totalAmountDonated) {
      continue;
    }

    // Put contributors in the array corresponding to their types
    if (contributor.type === CollectiveType.USER) {
      topIndividuals.push(contributor);
    } else if (
      [CollectiveType.ORGANIZATION, CollectiveType.COLLECTIVE, CollectiveType.FUND].includes(contributor.type)
    ) {
      topOrgs.push(contributor);
    }

    if (topIndividuals.length >= 10 && topOrgs.length >= 10) {
      break;
    }
  }

  // If one of the two categories is not filled, complete with more contributors from the other
  const nbColsPerCategory = 2;
  const nbFreeColsFromOrgs = nbColsPerCategory - Math.ceil(topOrgs.length / 5);
  const nbFreeColsFromIndividuals = nbColsPerCategory - Math.ceil(topOrgs.length / 5);
  let takeNbOrgs = 10;
  let takeNbIndividuals = 10;

  if (nbFreeColsFromOrgs > 0) {
    takeNbIndividuals += nbFreeColsFromOrgs * 5;
  } else if (nbFreeColsFromIndividuals > 0) {
    takeNbOrgs += nbFreeColsFromIndividuals * 5;
  }

  return [topOrgs.slice(0, takeNbOrgs), topIndividuals.slice(0, takeNbIndividuals)];
};

export const isEmptyCollectiveLocation = account => {
  if (!account?.location) {
    return true;
  } else {
    const { name, address, country, lat, long } = account.location;
    return !(address || country || (lat && long)) && name !== 'Online';
  }
};

export const getContributeRoute = collective => {
  let pathname = `${getCollectivePageRoute(collective)}/donate`;
  if (
    get(collective, 'settings.disableCustomContributions', false) &&
    get(collective, 'settings.disableCryptoContributions', true)
  ) {
    if (collective.tiers && collective.tiers.length > 0) {
      const tier = collective.tiers[0];
      pathname = `${getCollectivePageRoute(collective)}/contribute/${tier.slug}-${tier.id}/checkout`;
    } else {
      return null;
    }
  }
  return pathname;
};

export const getSuggestedTags = collective => {
  return collective?.expensesTags?.map(({ tag }) => tag) || [];
};

/** Checks if recurring contributions are allowed for the user for a given collective **/
export const canContributeRecurring = (collective, user) => {
  // If the host has a payment method that supports recurring payments (PayPal, Credit Card, etc.)
  const paymentProviderSupportRecurring = pm => ProvidersWithRecurringPaymentSupport.includes(pm);
  if (collective.host.supportedPaymentMethods.some(paymentProviderSupportRecurring)) {
    return true;
  }

  // Otherwise the only other option to contribute recurring is if the user is an admin of another collective under the same host
  const hostId = collective.host.legacyId;
  const collectiveId = collective.legacyId;
  return Boolean(
    user?.memberOf.some(
      member =>
        member.collective?.host?.id === hostId && // Must be under the same host
        member.collective.id !== collectiveId && // Must not be the same collective
        member.role === MEMBER_ROLE.ADMIN,
    ),
  );
};

/*
 * Displays the name string as "Legal name (Display name)" if legal name exists.
 * Example: Sudharaka (Suds)
 */
export const formatAccountName = (displayName, legalName) => {
  if (!legalName) {
    return displayName;
  } else if (legalName === displayName || legalName.includes(displayName)) {
    return legalName;
  } else {
    return `${legalName} (${displayName})`;
  }
};

/*
 * Validate the account holder name against the legal name. Following cases are considered a match,
 *
 * 1) Punctuation are ignored; "Evil Corp, Inc" and "Evil Corp, Inc." are considered a match.
 * 2) Accents are ignored; "François" and "Francois" are considered a match.
 * 3) The first name and last name order is ignored; "Benjamin Piouffle" and "Piouffle Benjamin" is considered a match.
 */
export const compareNames = (accountHolderName, legalName) => {
  // Ignore 501(c)(3) in both account holder name and legal name
  legalName = legalName?.replaceAll('501(c)(3)', '') || '';
  accountHolderName = accountHolderName?.replaceAll('501(c)(3)', '') || '';

  const namesArray = legalName.trim().split(' ');
  let legalNameReversed;
  if (namesArray.length === 2) {
    const firstName = namesArray[0];
    const lastName = namesArray[1];
    legalNameReversed = `${lastName} ${firstName}`;
  }
  return !(
    accountHolderName.localeCompare(legalName, undefined, {
      sensitivity: 'base',
      ignorePunctuation: true,
    }) &&
    accountHolderName.localeCompare(legalNameReversed, undefined, {
      sensitivity: 'base',
      ignorePunctuation: true,
    })
  );
};

/* Returns true if the account is a fiscal host. Returns false for self-hosted accounts */
export const isHostAccount = c => c.isHost === true && c.type !== 'COLLECTIVE';

/* Returns true if the account is self-hosted */
export const isSelfHostedAccount = c => c.isHost === true && c.type === 'COLLECTIVE';

/* Returns true if the account is an individual. Works with GQLV1 (Collectives) & GQLV2 (Accounts) */
export const isIndividualAccount = account => ['USER', 'INDIVIDUAL'].includes(account.type);

/* Checks whether an account supports grants */
export const accountSupportsGrants = (account, host) => {
  const accountHasGrantFlag = get(account, 'settings.expenseTypes.hasGrant');
  const hostHasGrantFlag = get(host, 'settings.expenseTypes.hasGrant');
  if (isBoolean(accountHasGrantFlag)) {
    // If the account's feature flag is set, use it as the main source of truth
    return accountHasGrantFlag;
  } else if (isBoolean(hostHasGrantFlag)) {
    // If the host has configured grants to be opt-in
    return hostHasGrantFlag;
  } else if (get(host, 'settings.disableGrantsByDefault')) {
    // If the host has configured grants to be opt-in, the previous flag (`hasGrant`) **must** be set
    return false;
  } else {
    return [CollectiveType.FUND, CollectiveType.PROJECT].includes(account?.type);
  }
};

/* Checks whether an account supports invoices */
export const accountSupportsInvoices = (account, host) => {
  const accountHasInvoiceFlag = get(account, 'settings.expenseTypes.hasInvoice');
  const hostHasInvoiceFlag = get(host, 'settings.expenseTypes.hasInvoice');
  if (isBoolean(accountHasInvoiceFlag)) {
    // If the account's feature flag is set, use it as the main source of truth
    return accountHasInvoiceFlag;
  } else if (isBoolean(hostHasInvoiceFlag)) {
    // If the host has configured invoices to be opt-in
    return hostHasInvoiceFlag;
  } else {
    // else default behavior is true
    return true;
  }
};

/* Checks whether an account supports receipts */
export const accountSupportsReceipts = (account, host) => {
  const accountHasReceiptFlag = get(account, 'settings.expenseTypes.hasReceipt');
  const hostHasReceiptFlag = get(host, 'settings.expenseTypes.hasReceipt');
  if (isBoolean(accountHasReceiptFlag)) {
    // If the account's feature flag is set, use it as the main source of truth
    return accountHasReceiptFlag;
  } else if (isBoolean(hostHasReceiptFlag)) {
    // If the host has configured receipts to be opt-in
    return hostHasReceiptFlag;
  } else {
    // else default behavior is true
    return true;
  }
};

export const loggedInUserCanAccessFinancialData = (user, collective) => {
  if (!isSectionForAdminsOnly(collective, Sections.BUDGET)) {
    return true;
  } else if (!user) {
    return false;
  } else {
    return user.isRoot() || user.canEditCollective(collective) || !user.isHostAdmin(collective);
  }
};

/** A small helper to get the integer legacy ID for a collective/account. Works with GQLV1 and GQLV2. */
export const getLegacyIdForCollective = collective => {
  if (!collective) {
    return null;
  } else if (typeof collective.id === 'number') {
    return collective.id;
  } else if (typeof collective.legacyId === 'number') {
    return collective.legacyId;
  }
};
