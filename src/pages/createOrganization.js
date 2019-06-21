import React from 'react';
import PropTypes from 'prop-types';

import CreateOrganization from '../components/CreateOrganization';
import ErrorPage from '../components/ErrorPage';

import withIntl from '../lib/withIntl';
import { withUser } from '../components/UserProvider';

class CreateOrganizationPage extends React.Component {
  static propTypes = {
    LoggedInUser: PropTypes.object,
    loadingLoggedInUser: PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { LoggedInUser, loadingLoggedInUser } = this.props;

    if (loadingLoggedInUser) {
      return <ErrorPage loading />;
    }

    return (
      <div>
        <CreateOrganization LoggedInUser={LoggedInUser} />
      </div>
    );
  }
}

export default withIntl(withUser(CreateOrganizationPage));
