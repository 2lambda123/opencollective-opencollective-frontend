import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import expenseStatus from '../../../lib/constants/expense-status';
import { i18nExpenseStatus } from '../../../lib/i18n/expense';

import { StyledSelectFilter } from '../../StyledSelectFilter';

const ExpenseStatusFilter = ({ value, onChange, ...props }) => {
  const intl = useIntl();
  const getOption = value => ({ label: i18nExpenseStatus(intl, value), value });

  return (
    <StyledSelectFilter
      data-cy="expenses-filter-status"
      options={[getOption('ALL'), ...Object.values(expenseStatus).map(getOption)]}
      onChange={({ value }) => onChange(value)}
      value={getOption(value || 'ALL')}
      {...props}
    />
  );
};

ExpenseStatusFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOf(Object.values(expenseStatus)),
};

export default ExpenseStatusFilter;
