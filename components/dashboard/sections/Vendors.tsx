import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { isNil, omitBy, pick } from 'lodash';
import { Archive, MoreHorizontal, Pencil } from 'lucide-react';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

import { API_V2_CONTEXT } from '../../../lib/graphql/helpers';
import { DashboardVendorsQuery } from '../../../lib/graphql/types/v2/graphql';
import { cn } from '../../../lib/utils';

import Avatar from '../../Avatar';
import Container from '../../Container';
import { DataTable } from '../../DataTable';
import { Drawer } from '../../Drawer';
import LoadingPlaceholder from '../../LoadingPlaceholder';
import MessageBoxGraphqlError from '../../MessageBoxGraphqlError';
import SearchBar from '../../SearchBar';
import StyledTabs from '../../StyledTabs';
import { Button } from '../../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/DropdownMenu';
import { TableActionsButton } from '../../ui/Table';
import { setVendorArchiveMutation, vendorFieldFragment, VendorFieldsFragment } from '../../vendors/queries';
import VendorDetails, { VendorContactTag } from '../../vendors/VendorDetails';
import VendorForm from '../../vendors/VendorForm';
import DashboardHeader from '../DashboardHeader';

enum VendorsTab {
  ALL = 'ALL',
  ARCHIVED = 'ARCHIVED',
}

const TAB_VALUES = {
  [VendorsTab.ALL]: { isArchived: false },
  [VendorsTab.ARCHIVED]: { isArchived: true },
};

const dashboardVendorsQuery = gql`
  query DashboardVendors($slug: String!, $searchTerm: String, $isArchived: Boolean) {
    account(slug: $slug) {
      id
      name
      legalName
      slug
      type

      ... on Host {
        expensePolicy
        settings
        currency
        features {
          id
          MULTI_CURRENCY_EXPENSES
        }
        location {
          id
          address
          country
        }
        transferwise {
          id
          availableCurrencies
        }
        supportedPayoutMethods
        isTrustedHost
      }

      vendors(searchTerm: $searchTerm, isArchived: $isArchived) {
        id
        ...VendorFields
      }
    }
  }
  ${vendorFieldFragment}
`;

const getColumns = ({ editVendor, openVendor, handleSetArchive }) => {
  return [
    {
      accessorKey: 'vendor',
      cell: ({ row }) => {
        const vendor = row.original;
        const contact = vendor.vendorInfo?.contact;
        return (
          <div className="flex">
            <button className="flex max-w-[200px] cursor-pointer items-center" onClick={() => openVendor(vendor)}>
              <Avatar size={24} collective={vendor} mr={2} />
              {vendor.name}
            </button>
            {contact && (
              <VendorContactTag className="ml-2">
                <span className="font-normal">
                  <FormattedMessage defaultMessage="Contact:" />
                </span>
                <a href={`mailto:${contact.email}`}>{contact.name}</a>
              </VendorContactTag>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'actions',
      meta: { className: 'flex justify-end' },
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TableActionsButton>
                <MoreHorizontal className="relative h-3 w-3  " aria-hidden="true" />
              </TableActionsButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer" onClick={() => editVendor(vendor)}>
                <Pencil className="mr-2" size="16" />
                <FormattedMessage id="actions.edit" defaultMessage="Edit" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleSetArchive(vendor)}>
                <Archive className="mr-2" size="16" />
                {vendor.isArchived ? (
                  <FormattedMessage id="actions.unarchive" defaultMessage="Unarchive" />
                ) : (
                  <FormattedMessage id="actions.archive" defaultMessage="Archive" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

const QUERY_FILTERS = ['searchTerm'];

const pickQueryFilters = query => omitBy(pick(query, QUERY_FILTERS), isNil);

const Vendors = ({ accountSlug }) => {
  const router = useRouter();
  const intl = useIntl();
  const [tab, setTab] = React.useState<VendorsTab>(VendorsTab.ALL);
  const queryValues = pickQueryFilters(router.query);
  const {
    data,
    refetch,
    loading: queryLoading,
    error: queryError,
  } = useQuery<DashboardVendorsQuery>(dashboardVendorsQuery, {
    variables: {
      slug: accountSlug,
      ...TAB_VALUES[tab],
      ...queryValues,
    },
    fetchPolicy: 'cache-and-network',
    context: API_V2_CONTEXT,
  });

  const [archiveVendor] = useMutation(setVendorArchiveMutation, {
    context: API_V2_CONTEXT,
    refetchQueries: ['DashboardVendors'],
    awaitRefetchQueries: true,
  });
  const [createEditVendor, setCreateEditVendor] = React.useState<VendorFieldsFragment | boolean>(false);
  const [vendorDetail, setVendorDetail] = React.useState(null);

  const closeModal = () => {
    setCreateEditVendor(false);
    setVendorDetail(null);
  };
  const handleSetArchive = async vendor =>
    archiveVendor({ variables: { vendor: pick(vendor, ['id']), archive: !vendor.isArchived } });
  const updateFilters = props =>
    router.replace({ pathname: router.asPath.split('?')[0], query: pickQueryFilters({ ...router.query, ...props }) });
  const handleTabUpdate = tab => {
    setTab(tab);
    updateFilters({ offset: null });
  };

  const tabs = [
    {
      id: VendorsTab.ALL,
      label: 'All',
    },
    {
      id: VendorsTab.ARCHIVED,
      label: 'Archived',
    },
  ];

  const isModalOpen = Boolean(createEditVendor || vendorDetail);
  const loading = queryLoading;
  const error = queryError;
  const columns = getColumns({
    editVendor: setCreateEditVendor,
    openVendor: setVendorDetail,
    handleSetArchive,
  });

  return (
    <Container>
      <DashboardHeader
        title={<FormattedMessage id="Vendors" defaultMessage="Vendors" />}
        description={
          <FormattedMessage
            id="Vendors.Description"
            defaultMessage="Manage all the external organizations acting as vendors for the Collectives you host."
          />
        }
      />

      <div className="mt-2 flex flex-grow flex-row gap-4">
        <SearchBar
          placeholder={intl.formatMessage({ defaultMessage: 'Search...', id: 'search.placeholder' })}
          defaultValue={router.query.searchTerm}
          height="40px"
          onSubmit={searchTerm => updateFilters({ searchTerm, offset: null })}
          className="flex-grow"
        />
        <Button className="rounded-full" onClick={() => setCreateEditVendor(true)}>
          + <FormattedMessage id="Vendors.Create" defaultMessage="Create vendor" />
        </Button>
      </div>
      <div className="my-6">
        <StyledTabs tabs={tabs} selectedId={tab} onChange={handleTabUpdate} />
      </div>
      <div className="flex flex-col gap-4">
        {error && <MessageBoxGraphqlError error={error} />}
        {loading && <LoadingPlaceholder height="250px" width="100%" borderRadius="16px" />}
        {!error && !loading && (
          <DataTable
            columns={columns}
            data={data.account.vendors}
            emptyMessage={() => <FormattedMessage id="NoVendors" defaultMessage="No vendors" />}
            loading={loading}
            mobileTableView
            hideHeader
          />
        )}
      </div>
      <Drawer
        open={isModalOpen}
        onClose={closeModal}
        className={cn(vendorDetail && 'max-w-2xl')}
        showActionsContainer
        showCloseButton
      >
        {createEditVendor && (
          <VendorForm
            host={data?.account}
            vendor={typeof createEditVendor === 'boolean' ? undefined : createEditVendor}
            onSuccess={() => {
              setCreateEditVendor(false);
              refetch();
            }}
            onCancel={() => setCreateEditVendor(false)}
          />
        )}
        {vendorDetail && (
          <VendorDetails
            vendor={vendorDetail}
            editVendor={() => {
              setCreateEditVendor(vendorDetail);
              setVendorDetail(null);
            }}
            onCancel={() => setVendorDetail(null)}
          />
        )}
      </Drawer>
    </Container>
  );
};

export default Vendors;