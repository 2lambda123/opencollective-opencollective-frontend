import * as React from 'react';
import { gql, useQuery } from '@apollo/client';
import { getApplicableTaxesForCountry, TaxType } from '@opencollective/taxes';
import { Form, Formik } from 'formik';
import { get } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';

import { isIndividualAccount } from '../../lib/collective';
import { AccountTypesWithHost } from '../../lib/constants/collectives';
import { Currency } from '../../lib/constants/currency';
import { VAT_OPTIONS } from '../../lib/constants/vat';
import { requireFields, verifyFieldLength, verifyFormat } from '../../lib/form-utils';
import { API_V2_CONTEXT } from '../../lib/graphql/helpers';
import { Account, SocialLink } from '../../lib/graphql/types/v2/graphql';

import CollectiveTagsInput from '../CollectiveTagsInput';
import Link from '../Link';
import Loading from '../Loading';
import MessageBoxGraphqlError from '../MessageBoxGraphqlError';
import NotFound from '../NotFound';
import StyledButton from '../StyledButton';
import { StyledCurrencyPicker } from '../StyledCurrencyPicker';
import StyledInput from '../StyledInput';
import StyledInputFormikField from '../StyledInputFormikField';
import StyledInputGroup from '../StyledInputGroup';
import StyledInputLocation from '../StyledInputLocation';
import StyledLink from '../StyledLink';
import StyledTextarea from '../StyledTextarea';
import WarnIfUnsavedChanges from '../WarnIfUnsavedChanges';

import SocialLinksFormField from './SocialLinksFormField';
import { VATTypeSelect } from './VATTypeSelect';

interface AccountInfoFormValues {
  name: string;
  legalName?: string;
  company?: string;
  description?: string;
  slug?: string;
  startsAt?: string;
  endsAt?: string;
  timezone?: string;
  location?: {
    address?: string;
    country?: string;
    structured?: any;
    lat?: number;
    long?: number;
  };
  privateInstructions?: string;
  currency?: string;
  tags?: string[];
  socialLinks?: SocialLink[];
  settings?: {
    VAT?: { type: VAT_OPTIONS; number: string };
    GST?: { number: string };
  } & Record<string, any>;
}

const INITIAL_VALUES: AccountInfoFormValues = {
  name: '',
  legalName: '',
  description: '',
} as const;

const getInitialValues = (account: Account = undefined): AccountInfoFormValues => ({
  ...INITIAL_VALUES,
  ...account,
});

const LABEL_PROPS = { fontWeight: 'bold' };

const ACCOUNT_INFO_QUERY = gql`
  query AccountInfo($slug: String!) {
    account(slug: $slug) {
      id
      name
      slug
      legalName
      description
      isHost
      settings
      location {
        id
        name
        address
        country
        structured
        lat
        long
      }

      currency
      tags
      socialLinks {
        type
        url
      }
      ... on AccountWithParent {
        parent {
          id
          slug
        }
      }
      ... on AccountWithHost {
        host {
          id
          settings
          location {
            country
          }
        }
      }
      ... on Event {
        startsAt
        endsAt
        timezone
      }
    }
  }
`;

const validate = (intl, values) => {
  const errors = requireFields(values, ['slug']);
  verifyFieldLength(errors, values, 'name', values.legalName ? 0 : 1, 255);
  verifyFieldLength(errors, values, 'legalName', values.name ? 0 : 1, 255);
  verifyFieldLength(errors, values, 'company', 0, 255);
  verifyFieldLength(errors, values, 'description', 0, 255);
  verifyFieldLength(errors, values, 'slug', 1, 255);
  verifyFormat(errors, values, 'slug', /^[\w-]+$/);
  return errors;
};

export const EditAccountInfoForm = ({ accountSlug }) => {
  const intl = useIntl();
  const { data, loading, error } = useQuery(ACCOUNT_INFO_QUERY, {
    context: API_V2_CONTEXT,
    variables: { slug: accountSlug },
  });

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <MessageBoxGraphqlError error={error} />;
  } else if (!data.account) {
    return <NotFound />;
  }

  const account = data.account;
  const isUser = isIndividualAccount(account);
  return (
    <Formik
      initialValues={getInitialValues(account)}
      validate={values => validate(intl, values)}
      onSubmit={console.log}
    >
      {({ values, setFieldValue, dirty }) => {
        const countryForTaxes = get(values, 'location.country') || get(account.host, 'location.country');
        const applicableTaxes = getApplicableTaxesForCountry(countryForTaxes);
        return (
          <WarnIfUnsavedChanges hasUnsavedChanges={dirty}>
            <Form>
              <div className="flex flex-col gap-4">
                <StyledInputFormikField
                  name="name"
                  required={!values.legalName}
                  label={intl.formatMessage({ id: 'Fields.displayName', defaultMessage: 'Display name' })}
                  labelProps={LABEL_PROPS}
                  hint={intl.formatMessage({
                    id: 'Fields.name.description',
                    defaultMessage:
                      'Display names are public and used wherever this profile appears publicly, like contributions, comments on updates, public info on expenses, etc.',
                  })}
                >
                  {({ field }) => <StyledInput maxLength={140} {...field} />}
                </StyledInputFormikField>
                <StyledInputFormikField
                  name="legalName"
                  isPrivate
                  required={!values.name}
                  label={intl.formatMessage({ id: 'LegalName', defaultMessage: 'Legal Name' })}
                  labelProps={LABEL_PROPS}
                  hint={intl.formatMessage({
                    id: 'editCollective.legalName.description',
                    defaultMessage:
                      'Legal names are private and used in receipts, tax forms, payment details on expenses, and other non-public contexts. Legal names are only visible to admins.',
                  })}
                >
                  {({ field }) => (
                    <StyledInput
                      maxLength={140}
                      {...field}
                      placeholder={intl.formatMessage(
                        { id: 'examples', defaultMessage: 'e.g., {examples}' },
                        { examples: isUser ? 'Maria Garcia' : 'Salesforce, Inc., Airbnb, Inc.' },
                      )}
                    />
                  )}
                </StyledInputFormikField>
                <StyledInputFormikField
                  name="slug"
                  required={true}
                  label={intl.formatMessage({ id: 'account.slug.label', defaultMessage: 'Handle' })}
                  labelProps={LABEL_PROPS}
                  hint={intl.formatMessage({
                    id: 'Fields.slug.description',
                    defaultMessage:
                      'A unique identifier used in URLs for this profile. Changing it will break existing links.',
                  })}
                >
                  {({ field }) => (
                    <StyledInputGroup
                      prepend={`${process.env.WEBSITE_URL}/`}
                      maxLength={140}
                      {...field}
                      onChange={e => {
                        e.target.value = e.target.value.trim().toLowerCase();
                        field.onChange(e);
                      }}
                    />
                  )}
                </StyledInputFormikField>
                <StyledInputFormikField
                  name="company"
                  label={intl.formatMessage({ defaultMessage: 'Company' })}
                  labelProps={LABEL_PROPS}
                  hint={intl.formatMessage({
                    id: 'collective.company.description',
                    defaultMessage: 'Start with @ to reference an organization (e.g., @airbnb)',
                  })}
                >
                  {({ field }) => <StyledInput maxLength={140} {...field} />}
                </StyledInputFormikField>
                <StyledInputFormikField
                  name="description"
                  required={account.type === 'COLLECTIVE'}
                  label={intl.formatMessage({
                    id: 'collective.description.label',
                    defaultMessage: 'Short description',
                  })}
                  labelProps={LABEL_PROPS}
                >
                  {({ field }) => <StyledInput {...field} />}
                </StyledInputFormikField>
                {account.type === 'EVENT' && (
                  <React.Fragment>
                    <StyledInputFormikField
                      name="startsAt"
                      type="datetime-local"
                      label={intl.formatMessage({ id: 'Fields.startsAt', defaultMessage: 'Starts At' })}
                      labelProps={LABEL_PROPS}
                    >
                      {({ field }) => <StyledInput {...field} />}
                    </StyledInputFormikField>
                    <StyledInputFormikField
                      name="endsAt"
                      type="datetime-local"
                      label={intl.formatMessage({ id: 'Fields.endsAt', defaultMessage: 'Ends At' })}
                      labelProps={LABEL_PROPS}
                    >
                      {({ field }) => <StyledInput {...field} />}
                    </StyledInputFormikField>
                    <StyledInputFormikField
                      name="timezone"
                      label={intl.formatMessage({ id: 'Fields.timezone', defaultMessage: 'Timezone' })}
                      labelProps={LABEL_PROPS}
                    >
                      {({ field }) => <StyledInput maxLength={140} {...field} />}
                    </StyledInputFormikField>
                    <StyledInputFormikField
                      name="privateInstructions"
                      labelProps={LABEL_PROPS}
                      label={intl.formatMessage({
                        id: 'event.privateInstructions.label',
                        defaultMessage: 'Private instructions',
                      })}
                      hint={intl.formatMessage({
                        id: 'event.privateInstructions.description',
                        defaultMessage: 'These instructions will be provided by email to the participants.',
                      })}
                    >
                      {({ field }) => <StyledTextarea maxLength={10000} {...field} />}
                    </StyledInputFormikField>
                  </React.Fragment>
                )}
                <StyledInputFormikField
                  name="currency"
                  label={intl.formatMessage({ id: 'Fields.currency', defaultMessage: 'Currency' })}
                  labelProps={LABEL_PROPS}
                >
                  {({ field }) => (
                    <StyledCurrencyPicker
                      inputId={field.id}
                      name={field.name}
                      availableCurrencies={Currency}
                      onChange={currency => field.onChange({ target: { value: currency, name: field.name } })}
                      value={field.value}
                    />
                  )}
                </StyledInputFormikField>
                <StyledInputFormikField
                  name="tags"
                  label={intl.formatMessage({ id: 'Fields.tags', defaultMessage: 'Tags' })}
                  labelProps={LABEL_PROPS}
                >
                  {({ field }) => (
                    <CollectiveTagsInput
                      {...field}
                      defaultValue={field.value}
                      onChange={entries =>
                        setFieldValue(
                          'tags',
                          entries.map(e => e.value),
                        )
                      }
                    />
                  )}
                </StyledInputFormikField>
                <StyledInputFormikField
                  name="socialLinks"
                  label={intl.formatMessage({ id: 'Fields.socialLinks', defaultMessage: 'Social Links' })}
                  labelProps={LABEL_PROPS}
                >
                  {({ field, meta }) => (
                    <SocialLinksFormField
                      value={field.value}
                      touched={meta.touched}
                      onChange={items => setFieldValue(field.name, items)}
                    />
                  )}
                </StyledInputFormikField>
                {!isUser && (
                  <StyledInputFormikField
                    name="location"
                    isPrivate
                    label={intl.formatMessage({ id: 'Fields.location', defaultMessage: 'Location' })}
                    labelProps={LABEL_PROPS}
                  >
                    {({ field }) => (
                      <StyledInputLocation
                        location={field.value}
                        onChange={value => setFieldValue('location', value)}
                      />
                    )}
                  </StyledInputFormikField>
                )}
                {applicableTaxes.includes(TaxType.VAT) && (
                  <React.Fragment>
                    {(account.isHost || AccountTypesWithHost.includes(account.type)) && (
                      <StyledInputFormikField
                        name="settings.VAT.type"
                        label={intl.formatMessage({ id: 'EditCollective.VAT', defaultMessage: 'VAT settings' })}
                        labelProps={LABEL_PROPS}
                      >
                        {({ field }) => (
                          <VATTypeSelect
                            inputId={field.id}
                            isHost={account.isHost}
                            value={field.value}
                            onChange={value => setFieldValue(field.name, value)}
                          />
                        )}
                      </StyledInputFormikField>
                    )}
                    {(account.isHost || get(values, 'settings.VAT.type') !== VAT_OPTIONS.HOST) && (
                      <StyledInputFormikField
                        name="settings.VAT.number"
                        label={intl.formatMessage({ id: 'EditCollective.VATNumber', defaultMessage: 'VAT number' })}
                        labelProps={LABEL_PROPS}
                      >
                        {({ field }) => <StyledInput placeholder="FRXX999999999" maxLength={30} {...field} />}
                      </StyledInputFormikField>
                    )}
                  </React.Fragment>
                )}
                {applicableTaxes.includes(TaxType.GST) && (
                  <StyledInputFormikField
                    name="settings.GST.number"
                    label={intl.formatMessage({ id: 'EditCollective.GSTNumber', defaultMessage: 'GST number' })}
                    labelProps={LABEL_PROPS}
                  >
                    {({ field }) => <StyledInput placeholder="9429037631147" maxLength={140} {...field} />}
                  </StyledInputFormikField>
                )}
              </div>
              <div className="mt-8 flex flex-col items-center">
                <StyledButton buttonStyle="primary" type="submit" disabled={!dirty}>
                  <FormattedMessage id="save" defaultMessage="Save" />
                </StyledButton>
                <StyledLink
                  as={Link}
                  data-cy="edit-collective-back-to-profile"
                  fontSize="14px"
                  mt={3}
                  href={
                    account.type === 'EVENT' ? `/${account.parent.slug}/events/${account.slug}` : `/${account.slug}`
                  }
                >
                  <FormattedMessage defaultMessage="View profile page" />
                </StyledLink>
              </div>
            </Form>
          </WarnIfUnsavedChanges>
        );
      }}
    </Formik>
  );
};
