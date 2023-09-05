import React from 'react';
import { MenuIcon } from 'lucide-react';

import { useWindowResize, VIEWPORTS } from '../../lib/hooks/useWindowResize';
import { cn } from '../../lib/utils';

import LoadingPlaceholder from '../LoadingPlaceholder';
import { DrawerMenu } from '../navigation/DrawerMenu';
import StyledRoundButton from '../StyledRoundButton';

import Menu from './Menu';
import AccountSwitcher from './NewAccountSwitcher';

interface AdminPanelSideBarProps {
  isLoading?: boolean;
  selectedSection?: string;
  isAccountantOnly?: boolean;
  onRoute?: (...args: any[]) => void;
  activeSlug?: string;
}

const AdminPanelSideBar = ({
  activeSlug,
  isAccountantOnly,
  isLoading,
  selectedSection,
  onRoute: _onRoute,
  ...props
}: AdminPanelSideBarProps) => {
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const { viewport } = useWindowResize();
  const isMobile = [VIEWPORTS.XSMALL, VIEWPORTS.SMALL].includes(viewport);

  const onRoute = isMobile
    ? (...args) => {
        setMenuOpen(false);
        _onRoute?.(...args);
      }
    : _onRoute;

  const content = React.useMemo(
    () => (
      <div>
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className={cn('py-1.5', i === 0 ? 'mb-4' : 'mb-2')}>
              <LoadingPlaceholder height={24} borderRadius={100} maxWidth={'70%'} />
            </div>
          ))
        ) : (
          <Menu {...{ selectedSection, onRoute, isAccountantOnly }} />
        )}
      </div>
    ),
    [isLoading, viewport],
  );

  return (
    <div
      className={cn(' w-full flex-shrink-0 flex-grow-0 md:w-64', isMobile && 'sticky top-0 z-[1000] bg-white py-2.5')}
      {...props}
    >
      <div className="sticky top-8 z-10">
        <div className="flex flex-row-reverse gap-4 sm:flex-auto md:flex-col">
          <AccountSwitcher activeSlug={activeSlug} />
          {isMobile && (
            <React.Fragment>
              <StyledRoundButton size={50} onClick={() => setMenuOpen(true)} data-cy="mobile-menu-trigger">
                <MenuIcon size={24} />
              </StyledRoundButton>

              <React.Fragment>
                <DrawerMenu anchor="left" open={isMenuOpen} onClose={() => setMenuOpen(false)} p="16px">
                  {content}
                </DrawerMenu>
              </React.Fragment>
            </React.Fragment>
          )}
          {!isMobile && <React.Fragment>{content}</React.Fragment>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelSideBar;
