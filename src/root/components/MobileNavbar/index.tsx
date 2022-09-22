import React from 'react';
import { _cs } from '@togglecorp/fujs';
import AsyncSelect from 'react-select/async';
import {
  Link,
  NavLink,
  withRouter,
} from 'react-router-dom';
import {
  IoMenu,
  IoClose,
} from 'react-icons/io5';

import useReduxState from '#hooks/useReduxState';
import {
  getElasticSearchOptions,
  getSelectInputNoOptionsMessage,
} from '#utils/utils';
import { isIfrcUser } from '#utils/common';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import UserMenu from '#components/connected/user-menu';
import Button from '#components/Button';
import DropdownMenu from '#components/dropdown-menu';
import DropdownMenuItem from '#components/DropdownMenuItem';

import styles from './styles.module.scss';

const noFilter = options => options;

interface Props {
  className?: string;
  history: {
    push: (url: string) => void;
  },
}

function MobileNavbar(props: Props) {
  const {
    className,
    history,
  } = props;

  const user = useReduxState('me');
  const ifrcUser = React.useMemo(() => isIfrcUser(user?.data), [user]);
  const { strings } = React.useContext(LanguageContext);

  // const [searchText, setSearchText] = React.useState<string | undefined>('');
  const [showMenu, setShowMenu] = React.useState(false);
  const debounceTimeoutRef = React.useRef<number | undefined>();

  const ns = user?.data?.profile?.country?.id;
  const orgType = (user?.data?.is_superuser === true) ? '*' :
                   user?.data?.profile?.org_type;

  const handleSelect = React.useCallback(
    ({ value }: { value: string }) => {
      history.push(value);
    },
    [history],
  );

  const loadOptionsWithDebouncing = React.useCallback((input, callback) => {
    window.clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = window.setTimeout(() => {
      getElasticSearchOptions(input, orgType, ns, callback);
    }, 500);

    return false;
  }, [orgType, ns]);

  return (
    <nav
      className={_cs(styles.mobileNavbar, className)}
      role='banner'
    >
        <div className={styles.topSection}>
          <Button
            name={true}
            onClick={setShowMenu}
            variant="action"
          >
            <IoMenu className={styles.menuIcon} />
          </Button>
          <Link
            to='/'
            title={strings.mobileHeaderVisitHome}
          >
            <img
              className={styles.goLogo}
              src='/assets/graphics/layout/go-logo-2020.svg'
              alt='IFRC GO logo'
            />
          </Link>
        </div>
        <div className={styles.bottomSection}>
          <AsyncSelect
            placeholder={strings.headerSearchPlaceholder}
            onChange={handleSelect}
            filterOptions={noFilter}
            autoload={false}
            noOptionsMessage={getSelectInputNoOptionsMessage}
            cache={false}
            loadOptions={loadOptionsWithDebouncing}
          />
        </div>
      {showMenu && (
        <div className={styles.menu}>
          <div className={styles.menuTopSection}>
            <Button
              name={false}
              onClick={setShowMenu}
              variant="action"
            >
              <IoClose />
            </Button>
            <Link
              to='/'
              title={strings.mobileHeaderVisitHome}
            >
              <img
                className={styles.goLogo}
                src='/assets/graphics/layout/go-logo-2020.svg'
                alt='IFRC GO logo'
              />
            </Link>
          </div>
          <DropdownMenu
            activeClassName='active'
            label={strings.headerCreateAReportLabel}
          >
            <DropdownMenuItem
              href="/reports/new"
              label={strings.headerDropdownNewFieldReport}
            />
            <DropdownMenuItem
              href='https://eenew.ifrc.org/single/y300V3lY?returnURL=https://go.ifrc.org/emergencies/3972#actions'
              label={strings.headerDropdownCovid19IndicatorTracking}
            />
            <DropdownMenuItem
              href='https://eenew.ifrc.org/single/VmcTHDMh?returnURL=https://go.ifrc.org/emergencies/3972#actions'
              label={strings.headerDropdownCovid19NSFinancialOverview}
            />
            <DropdownMenuItem
              href='/three-w/new'
              label={strings.headerDropdownNew3WActivity}
            />
            {ifrcUser && (
              <DropdownMenuItem
                href='/flash-update/new'
                label={strings.headerDropdownNewFlashUpdate}
              />
            )}
            <DropdownMenuItem
                href='/dref-application/new'
                label={strings.headerDropdownNewDrefApplication}
            />
          </DropdownMenu>
          <div className={styles.menuItems}>
            <NavLink
              className={styles.menuItem}
              activeClassName={styles.active}
              to='/'
              title={strings.mobileHeaderVisitHome}
              exact
            >
              {strings.mobileHeaderHome}
            </NavLink>
            <NavLink
              className={styles.menuItem}
              activeClassName={styles.active}
              to='/emergencies'
              title={strings.mobileHeaderVisitEmergencies}
              exact
            >
                <Translate stringId='mobileHeaderEmergencies'/>
            </NavLink>
            <div className={styles.regionMenuItem}>
              <div className={styles.menuItem}>
                {strings.mobileHeaderRegion}
              </div>
              <div className={styles.regions}>
                <NavLink
                  className={styles.menuItem}
                  activeClassName={styles.active}
                  to='/regions/0'
                  title={strings.mobileHeaderVisitAfrica}
                >
                  <Translate stringId='mobileHeaderAfrica'/>
                </NavLink>
                <NavLink
                  className={styles.menuItem}
                  activeClassName={styles.active}
                  to='/regions/1'
                  title={strings.mobileHeaderVisitAmerica}
                >
                  <Translate stringId='mobileHeaderAmerica'/>
                </NavLink>
                <NavLink
                  className={styles.menuItem}
                  activeClassName={styles.active}
                  to='/regions/2'
                  title={strings.mobileHeaderVisitAsia}
                >
                  <Translate stringId='mobileHeaderAsia'/>
                </NavLink>
                <NavLink
                  className={styles.menuItem}
                  activeClassName={styles.active}
                  to='/regions/3'
                  title={strings.mobileHeaderVisitEurope}
                >
                  <Translate stringId='mobileHeaderEurope'/>
                </NavLink>
                <NavLink
                  className={styles.menuItem}
                  activeClassName={styles.active}
                  to='/regions/4'
                  title={strings.mobileHeaderVisitMiddleEast}
                >
                  <Translate stringId='mobileHeaderMiddleEast'/>
                </NavLink>
              </div>
            </div>
            <NavLink
              className={styles.menuItem}
              activeClassName={styles.active}
              to='/deployments'
              title={strings.mobileHeaderVisitDeployments}
            >
              <Translate stringId='mobileHeaderDeployments'/>
            </NavLink>
            <NavLink
              className={styles.menuItem}
              activeClassName={styles.active}
              to='/three-w/'
              title={strings.mobileHeaderVisitThreeW}
            >
              <Translate stringId='mobileHeaderThreeW'/>
            </NavLink>
            <NavLink
              className={styles.menuItem}
              activeClassName={styles.active}
              to='/about'
              title={strings.mobileHeaderVisitResources}
            >
              <Translate stringId='mobileHeaderResources'/>
            </NavLink>
            <NavLink
              className={styles.menuItem}
              activeClassName={styles.active}
              to='/account'
              title={strings.mobileHeaderVisitAccount}
            >
              <Translate stringId='mobileHeaderAccount'/>
            </NavLink>
            <UserMenu />
          </div>
        </div>
      )}
    </nav>
  );
}

export default withRouter(MobileNavbar);
