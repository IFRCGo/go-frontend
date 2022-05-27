import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';

import Translate from '#components/Translate';
import Button from '#components/Button';
import Tabs from '#components/Tabs';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import TabList from '#components/Tabs/TabList';

import LanguageContext from '#root/languageContext';
import useBooleanState from '#hooks/useBooleanState';
import {
  Country,
  User,
} from '#types';
import useReduxState, { ReduxResponse } from '#hooks/useReduxState';

import ProjectFormModal from './ProjectFormModal';
import InCountryProjects from './InCountryProjects';
import NSProjects from './NSProjects';

import styles from './styles.module.scss';
import store from '#utils/store';

interface Props {
  className?: string;
  country: Country | undefined;
}

function ThreeW(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    className,
    country,
  } = props;

  const [projectsUpdatedOn, setProjectsUpdatedOn] = React.useState<number | undefined>();
  const { data: userDetails } = useReduxState('me') as ReduxResponse<User>;
  const [activeTab, setActiveTab] = React.useState<'projectsIn' | 'nsProjects'>('projectsIn');
  const [
    showProjectFormModal,
    setShowProjectFormModalTrue,
    setShowProjectFormModalFalse,
  ] = useBooleanState(false);

  const handleProjectFormSubmitSuccess = React.useCallback(() => {
    setShowProjectFormModalFalse();
    setProjectsUpdatedOn((new Date()).getTime());
  }, [setShowProjectFormModalFalse, setProjectsUpdatedOn]);

  const currentLanguage = store.getState().lang.current;

  return (
    <div className={_cs(styles.threeW, className)} style={{paddingTop: '1px'}}>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="secondary"
      >
        {isDefined(userDetails?.id) && (
          
          <>
          {
          strings.wikiJsLinkCountry3W !== undefined && strings.wikiJsLinkCountry3W.length>0 ?
          <div style={{display: 'flex', justifyContent:'flex-end', paddingBottom:'8px'}}>
            <a href={strings.wikiJsLinkGOWiki+'/'+currentLanguage +'/'+ strings.wikiJsLinkCountry3W} title='GO Wiki' target='_blank' ><img className='' src='/assets/graphics/content/wiki-help-section.svg' alt='IFRC GO logo'/></a>
          </div> : null
          }
          <div className={styles.headerActions}>           
            <Button
              onClick={setShowProjectFormModalTrue}
              name={undefined}
            >
              { strings.threeWAddProject }
            </Button>
          </div>
          </>
        )}
        <TabList className={styles.tabList}>
          <Tab name="projectsIn">
            <Translate
              stringId="threeWInCountryTabLabel"
              params={{ countryName: country?.name }}
            />
          </Tab>
          <Tab name="nsProjects">
            <Translate
              stringId="threeWNSProjectTabLabel"
              params={{ societyName: country?.society_name }}
            />
          </Tab>
        </TabList>
        <TabPanel name="projectsIn">
          <InCountryProjects
            country={country}
            projectsUpdatedOn={projectsUpdatedOn}
          />
        </TabPanel>
        <TabPanel name="nsProjects">
          <NSProjects
            country={country}
            projectsUpdatedOn={projectsUpdatedOn}
          />
        </TabPanel>
      </Tabs>
      {showProjectFormModal && (
        <ProjectFormModal
          onCloseButtonClick={setShowProjectFormModalFalse}
          countryId={activeTab === 'projectsIn' ? country?.id : undefined}
          reportingNsId={activeTab === 'nsProjects' ? country?.id : undefined}
          onSubmitSuccess={handleProjectFormSubmitSuccess}
        />
      )}
    </div>
  );
}

export default ThreeW;
