import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';
import { isNotDefined } from '@togglecorp/fujs';
import { IoShareSocialOutline } from 'react-icons/io5';

import Container from '#components/Container';
import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import languageContext from '#root/languageContext';
import { useRequest } from '#utils/restRequest';
import BlockLoading from '#components/block-loading';
import Button from '#components/Button';
import ViewSection from './ViewSection';
import {
  ActionsTaken,
  InformalUpdateAPIFields
} from '../InformalUpdateApplicationForm/common';

import styles from './styles.module.scss';

interface Props {
  match: Match<{ id?: string }>
  history: History;
  location: Location;
}

function InformalUpdateReport(props: Props) {
  const {
    location,
    //history,
    match: {
      params: {
        id
      }
    }
  } = props;
  const { strings } = useContext(languageContext);
  const {
    pending: projectPending,
    response: reportResponse,
  } = useRequest<InformalUpdateAPIFields>({
    skip: isNotDefined(id),
    url: `api/v2/informal-update/${id}/`,
  });

  const crumbs = useMemo(() => [
    {
      link: strings.informalUpdateNumber,
      name: `${strings.informalUpdateNumber}${reportResponse && reportResponse.id + 1}`
    },
    {
      link: location?.pathname,
      name: reportResponse?.title
    },
    {
      link: '/emergencies',
      name: strings.breadCrumbEmergencies
    },
    {
      link: '/',
      name: strings.breadCrumbHome
    },
  ], [strings, location, reportResponse]);

  const renderActionTaken = (org: string) => {
    const actions: ActionsTaken | undefined = reportResponse?.actions_taken.find(d => d.organization === org);
    return (
      <ViewSection title='Actions taken by' data={actions} />
    );
  };

  const countryTitle = useMemo(() => (
    reportResponse?.country_district?.map((item) => (item?.country_details?.name)).join('-')
  ), [reportResponse]);

  const situationalData = useMemo(() => [
    {
      name: 'Magnitude',
      value: 'Mw 5.7'
    },
    {
      name: 'Region',
      value: 'Pakistan, balochistan'
    },
    {
      name: 'Date time',
      value: '07 Oct 2021 03:01 Local - 06 Oct 2021 22:01 UTC'
    },
    {
      name: 'Location',
      value: '30.20 N ; 68.06 E'
    },
    {
      name: 'Depth',
      value: '10 km'
    },
    {
      name: 'Distances',
      value: `102 km ENE of Quetta, Pakistan / pop: 733,000 
              16 km NE of Harnai, Pakistan / pop: 11,000 / local time: 03:01:08.7 2021-10-07`
    },
    {
      description: 'The 5.7 magnitude earthquake hit at 03 o’clock in the morning local time as people were sleeping. At least 20 persons are reported dead and 150 injured with many rushed to the hospital in critical condition and fractures. Approximately a hundred mud houses have reported collapsed leaving hundreds of persons without shelter. Much of the damage seems to have taken place in Hernai district according to local authority interviewed in news report. Hernai is a fairly remote, mountainous city and the area hosts a lot of coal mines. Health workers and rescue efforts were hampered by a power cut caused by the earthquake – hospital workers reported having to do with torches for light - and by a lack of paved roads and mobile phone coverage. The tremor caused also a lot of landslides according to Al Jazeera report, blocking roads that need to be opened for rescuers to get to the area.'
    }
  ], []);

  const renderSituationalOverview = useMemo(() => (
    <div>
      {situationalData.map((item, i) => (
        <div key={i}>
          <div className={styles.overviewContainer}>
            <div className={styles.overviewLabel}>
              {item.name}
            </div>
            <div className={styles.overviewValue}>
              {item.value}
            </div>
          </div>
          <div className={styles.overviewDescription}>
            {item.description}
          </div>
        </div>
      ))}
    </div>
  ), [situationalData]);

  return (
    <>
      <Page
        className={styles.situational}
        title={reportResponse?.title}
        heading={reportResponse?.title}
        description={
          <Link
            to={location?.pathname}
          >
            <span className='link--with-icon-text'>
              {countryTitle}
            </span>
            <span className='collecticon-chevron-right link--with-icon-inner'></span>
          </Link>
        }
        breadCrumbs={
          <BreadCrumb
            crumbs={crumbs}
            compact={undefined}
          />
        }
        actions={
          //--TODO--
          <Button
            variant='secondary'
            name={undefined}
            icons={<IoShareSocialOutline />}
          >
            Share
          </Button>
        }
      >
        {projectPending ?
          <BlockLoading />
          : (
            <>
              <Container
                heading={strings.informalUpdateSituationalOverviewTitle}
              >
                <ViewSection>
                  {renderSituationalOverview}
                </ViewSection>
              </Container>
              <Container
                heading={strings.informalUpdateMapTitle}
              >
                <div className={styles.graphic}>
                  <div className={styles.card}>
                    {reportResponse?.map?.map((item) => (
                      <img
                        key={item?.id}
                        src={item?.file} alt=""
                      />
                    ))}
                  </div>
                </div>
              </Container>
              <Container
                heading={strings.informalUpdateImageTitle}
              >
                <div className={styles.image}>
                  {reportResponse?.graphics?.map((item) => (
                    <div
                      key={item.id}
                      className={styles.imageWithCaption}
                    >
                      <img
                        src={item?.file}
                        alt=""
                      />
                      <div>
                        {item?.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </Container>
              <Container
                heading={strings.informalUpdateActionTakenTitle}
                className={styles.actionTaken}
              >
                {renderActionTaken('NTLS')}
              </Container>
              <Container className={styles.actionTaken}>
                {renderActionTaken('GOV')}
              </Container>
              <Container
                heading={strings.informalUpdateResourcesTitle}
              >
                {reportResponse?.references?.map((item) => (
                  <div className={styles.resources}>
                    <div>
                      {item?.date}
                    </div>
                    <div>
                      {item?.source_description}
                    </div>
                    <div>
                      {item?.url}
                    </div>
                  </div>
                ))}

              </Container>
            </>
          )}
      </Page>
    </>
  );
}

export default InformalUpdateReport;
