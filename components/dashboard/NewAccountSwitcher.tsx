import * as React from 'react';
import { cx } from 'class-variance-authority';
import { useCommandState } from 'cmdk';
import { flatten, groupBy, uniqBy } from 'lodash';
import { Bookmark, Check, ChevronsUpDown, PlusCircle, Star } from 'lucide-react';
import memoizeOne from 'memoize-one';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

import { CollectiveType } from '../../lib/constants/collectives';
import useLoggedInUser from '../../lib/hooks/useLoggedInUser';
import formatCollectiveType from '../../lib/i18n/collective-type';
import { cn } from '../../lib/utils';

import Avatar from '../Avatar';
import { Button } from '../ui/Button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import DividerIcon from '../DividerIcon';
import clsx from 'clsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/Tooltip';

const CREATE_NEW_BUTTONS = {
  [CollectiveType.COLLECTIVE]: {
    linkLabel: <FormattedMessage id="home.create" defaultMessage="Create Collective" />,
    getRoute: () => '/create',
  },
  [CollectiveType.ORGANIZATION]: {
    linkLabel: <FormattedMessage id="host.organization.create" defaultMessage="Create Organization" />,
    getRoute: () => '/organizations/new',
  },
  [CollectiveType.EVENT]: {
    linkLabel: <FormattedMessage defaultMessage="Create Event" />,
    getRoute: slug => `/${slug}/events/create`,
  },
  [CollectiveType.PROJECT]: {
    linkLabel: <FormattedMessage defaultMessage="Create Project" />,
    getRoute: slug => `/${slug}/projects/create`,
  },
};

const AccountItem = ({ account, active, isChild, setOpen, activeAccount, defaultSlug, setDefaultSlug, selected }) => {
  const router = useRouter();
  return (
    <CommandItem
      key={account.slug}
      onSelect={() => {
        router.push(`/dashboard/${account.slug}`);
        setOpen(false);
      }}
      value={account.slug}
      className={cn(
        'group flex items-center justify-between',
        selected && !active && !isChild && 'bg-slate-200',
        active ? 'aria-selected:bg-slate-100' : 'aria-selected:bg-transparent',
      )}
    >
      <div className="flex items-center gap-2 truncate">
        <Avatar collective={account} radius={16} />
        <span className="truncate">{account.name}</span>
      </div>
      <div className="flex items-center gap-1">
        {!isChild && (
          <Tooltip>
            <TooltipTrigger>
              <Star
                onClick={e => {
                  const isDefault = defaultSlug === account.slug;
                  if (!isDefault) {
                    e.stopPropagation();
                    setDefaultSlug(account.slug);
                  }
                }}
                size={16}
                className={clsx(
                  'text-muted-foreground transition-colors hover:text-foreground',
                  defaultSlug !== account.slug && 'hidden text-slate-400 group-hover:block',
                )}
              />
            </TooltipTrigger>
            {defaultSlug !== account.slug && <TooltipContent side="right">Set as default</TooltipContent>}
          </Tooltip>
        )}
        {activeAccount?.slug === account.slug && <Check className={'h-4 w-4'} />}
      </div>
    </CommandItem>
  );
};

const AccountsCommand = ({
  active,
  isChild,
  setActive,
  selectedValue,
  setSelectedValue,
  hasInitialized,
  setHasInitialized,
  inputPlaceholder,
  groupedAccounts,
  setOpen,
  activeAccount,
  loggedInUserCollective,
  archivedAccounts,
  selectedParentSlug,
  setDefaultSlug,
  defaultSlug,
}) => {
  const intl = useIntl();
  const router = useRouter();

  const HiddenGroup = ({ accounts }) => {
    const search = useCommandState(state => state.search);
    // or if not search matches "archived"
    if (!search && !activeAccount.isArchived) {
      return null;
    }
    return (
      <CommandGroup key={'archived'} heading={'Archived'} value="Archived">
        {accounts.map(account => (
          <CommandItem
            key={`${account.slug} archived`}
            onSelect={() => {
              router.push(`/dashboard/${account.slug}`);
              setOpen(false);
            }}
            value={`${account.slug} archived`}
            className={cn(
              'flex items-center justify-between rounded-lg',
              activeAccount?.slug === account?.slug && 'bg-slate-200 aria-selected:bg-slate-200',
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <Avatar collective={account} radius={16} />
              <span className="truncate">{account.name}</span>
            </div>
            {activeAccount?.slug === account.slug && <Check className={cn('mr-2 h-4 w-4')} />}
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  return (
    <Command
      className={cn('w-60', isChild && 'border-l', active ? 'bg-white' : 'bg-slate-50')}
      onMouseOver={() => setActive(true)}
      onFocus={e => {
        if (e.relatedTarget instanceof HTMLInputElement) {
          setActive(true);
        }
      }}
      value={active ? selectedValue : ''}
      onValueChange={v => {
        if (hasInitialized) {
          setSelectedValue(v);
        } else {
          setHasInitialized(true);
        }
      }}
    >
      <CommandInput placeholder={inputPlaceholder} autoFocus={active} />
      <CommandEmpty>
        <FormattedMessage defaultMessage="No account found." />
      </CommandEmpty>
      {/* TODO: include in Grouped Accounts */}
      {!isChild && (
        <CommandGroup heading={intl.formatMessage({ defaultMessage: 'Personal Account' })} hidden>
          <AccountItem
            account={loggedInUserCollective}
            activeAccount={activeAccount}
            setOpen={setOpen}
            active={active}
            selected={selectedValue === loggedInUserCollective.slug}
            isChild={isChild}
            defaultSlug={defaultSlug}
            setDefaultSlug={setDefaultSlug}
          />
        </CommandGroup>
      )}
      {Object.entries(groupedAccounts).map(([collectiveType, accounts]) => {
        return (
          <CommandGroup key={collectiveType} heading={formatCollectiveType(intl, collectiveType, 2)}>
            {accounts.map(account => {
              return (
                <AccountItem
                  key={account.slug}
                  account={account}
                  activeAccount={activeAccount}
                  setOpen={setOpen}
                  active={active}
                  selected={selectedValue === account.slug}
                  isChild={isChild}
                  defaultSlug={defaultSlug}
                  setDefaultSlug={setDefaultSlug}
                />
              );
            })}
            <CommandItem
              value={`${collectiveType}-create`}
              onSelect={() => {
                const route = CREATE_NEW_BUTTONS[collectiveType].getRoute(selectedParentSlug);
                router.push(route);
              }}
              className={cn(
                'flex items-center gap-2 text-muted-foreground hover:text-foreground',
                active ? 'aria-selected:bg-slate-100' : 'aria-selected:bg-transparent',
              )}
            >
              <PlusCircle strokeWidth={1} absoluteStrokeWidth size={16} className="text-slate-500" />{' '}
              <span className="truncate">{CREATE_NEW_BUTTONS[collectiveType].linkLabel}</span>
            </CommandItem>
          </CommandGroup>
        );
      })}
      {archivedAccounts.length > 0 && <HiddenGroup accounts={archivedAccounts} />}
    </Command>
  );
};

const getGroupedAdministratedAccounts = memoizeOne(loggedInUser => {
  let administratedAccounts =
    loggedInUser?.memberOf.filter(m => m.role === 'ADMIN' && !m.collective.isIncognito).map(m => m.collective) || [];

  // Filter out accounts if the user is also an admin of the parent of that account (since we already show the parent)
  const childAccountIds = flatten(administratedAccounts.map(a => a.children)).map((a: { id: number }) => a.id);
  administratedAccounts = administratedAccounts.filter(a => !childAccountIds.includes(a.id));
  administratedAccounts = uniqBy([...administratedAccounts], a => a.id).filter(Boolean);

  // Filter out Archived accounts and group it separately
  const archivedAccounts = administratedAccounts.filter(a => a.isArchived);
  const activeAccounts = administratedAccounts.filter(a => !a.isArchived);

  const groupedAccounts = {
    [CollectiveType.COLLECTIVE]: [],
    [CollectiveType.ORGANIZATION]: [],
    ...groupBy(activeAccounts, a => a.type),
  };
  // if (archivedAccounts?.length > 0) {
  //   groupedAccounts.archived = archivedAccounts;
  // }
  return { groupedAccounts, archivedAccounts };
});

const getGroupedChildAccounts = memoizeOne(accounts => {
  // Filter out Archived accounts and group it separately
  const archivedAccounts = accounts.filter(a => a.isArchived);
  const activeAccounts = accounts.filter(a => !a.isArchived);

  const groupedAccounts = {
    [CollectiveType.PROJECT]: [],
    [CollectiveType.EVENT]: [],
    ...groupBy(activeAccounts, a => a.type),
  };
  // if (archivedAccounts?.length > 0) {
  //   groupedAccounts.archived = archivedAccounts;
  // }
  return { groupedAccounts, archivedAccounts };
});

export default function AccountSwitcher({ activeSlug, defaultSlug, setDefaultSlug }) {
  const { LoggedInUser } = useLoggedInUser();
  const intl = useIntl();
  const [hasInitialized, setHasInitialized] = React.useState(false);
  const [hasInitializedChild, setHasInitializedChild] = React.useState(false);

  const loggedInUserCollective = LoggedInUser?.collective;
  const { groupedAccounts, archivedAccounts } = getGroupedAdministratedAccounts(LoggedInUser);
  const rootAccounts = flatten(Object.values({ ...groupedAccounts, archived: archivedAccounts }));
  const allAdministratedAccounts = [
    ...rootAccounts,
    ...flatten(
      rootAccounts.map(a =>
        a.children.map(c => ({
          ...c,
          parentCollective: { id: a.id, slug: a.slug, name: a.name, imageUrl: a.imageUrl },
        })),
      ),
    ),
  ];
  const allAdministratedAccountIds = allAdministratedAccounts.map(a => a.id);
  const activeAccount = allAdministratedAccounts.find(a => a.slug === activeSlug) || loggedInUserCollective;
  const parentExistsAndIsAdministrated =
    activeAccount?.parentCollective?.id && allAdministratedAccountIds.includes(activeAccount?.parentCollective?.id);
  const defaultRootSlug = parentExistsAndIsAdministrated ? activeAccount?.parentCollective?.slug : activeSlug;
  const [selectedValue, setSelectedValue] = React.useState(defaultRootSlug);
  const [selectedValueChild, setSelectedValueChild] = React.useState(activeSlug);

  const [open, setOpen] = React.useState(false);

  const [rootActive, setRootActive] = React.useState(true);

  if (!loggedInUserCollective || !activeSlug) {
    return null;
  }

  let parentAccount;
  if (parentExistsAndIsAdministrated) {
    parentAccount = allAdministratedAccounts.find(a => a.slug === activeAccount?.parentCollective?.slug);
  }
  const selectedAccount = rootAccounts.find(a => a.slug === selectedValue);
  const childAccounts = selectedAccount?.children || [];

  const { groupedAccounts: childGroupedAccounts, archivedAccounts: childArchivedAccounts } =
    getGroupedChildAccounts(childAccounts);
  const showChildAccounts = ['ORGANIZATION', 'COLLECTIVE'].includes(selectedAccount?.type);

  return (
    <Popover
      open={open}
      onOpenChange={open => {
        setOpen(open);
        setHasInitialized(false);
        setSelectedValue(defaultRootSlug);
        setHasInitializedChild(false);
        setRootActive(parentExistsAndIsAdministrated ? false : true);
      }}
    >
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2.5">
          {parentAccount && (
            <div className="hidden items-center gap-2.5 md:flex">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={clsx(
                  'group h-8 justify-between gap-1.5 whitespace-nowrap rounded-full border-transparent px-2 hover:border-border',
                  parentExistsAndIsAdministrated ? 'max-w-[14rem]' : 'w-auto',
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Avatar collective={parentAccount} radius={20} />
                  <div className="truncate">{parentAccount.name}</div>
                </div>
                <ChevronsUpDown size={16} className="shrink-0 text-slate-500 group-hover:text-slate-900" />
              </Button>
              <DividerIcon size={32} className="-mx-4 text-slate-300" />
            </div>
          )}

          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={clsx(
              'group h-8 max-w-[10rem] justify-between gap-1.5 whitespace-nowrap rounded-full px-2 sm:max-w-[14rem]',
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <Avatar collective={activeAccount} radius={20} />
              <div className="truncate">{activeAccount?.name}</div>
            </div>
            <ChevronsUpDown size={16} className="shrink-0 text-slate-500 group-hover:text-slate-900" />
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cx('grid w-auto overflow-hidden rounded-xl p-0', showChildAccounts ? 'grid-cols-2' : 'grid-cols-1')}
      >
        <AccountsCommand
          active={rootActive}
          isChild={false}
          setActive={setRootActive}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          hasInitialized={hasInitialized}
          setHasInitialized={setHasInitialized}
          inputPlaceholder={intl.formatMessage({ defaultMessage: 'Search accounts...' })}
          groupedAccounts={groupedAccounts}
          setOpen={setOpen}
          activeAccount={activeAccount}
          loggedInUserCollective={loggedInUserCollective}
          archivedAccounts={archivedAccounts}
          defaultSlug={defaultSlug}
          setDefaultSlug={setDefaultSlug}
        />

        {showChildAccounts && (
          <AccountsCommand
            active={!rootActive}
            isChild={true}
            selectedParentSlug={selectedValue}
            setActive={active => setRootActive(!active)}
            selectedValue={selectedValueChild}
            setSelectedValue={setSelectedValueChild}
            hasInitialized={hasInitializedChild}
            setHasInitialized={setHasInitializedChild}
            inputPlaceholder={intl.formatMessage({ defaultMessage: 'Search projects and events...' })}
            groupedAccounts={childGroupedAccounts}
            setOpen={setOpen}
            activeAccount={activeAccount}
            loggedInUserCollective={loggedInUserCollective}
            archivedAccounts={childArchivedAccounts}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}