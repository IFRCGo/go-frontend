import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';
import { isNotDefined } from '@togglecorp/fujs';

import Container from '#components/Container';
import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import languageContext from '#root/languageContext';
import { useRequest } from '#utils/restRequest';

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

  const [informalUpdateData, setInformalUpdateData] = React.useState<InformalUpdateAPIFields | undefined>();
  const [breadCrumbReportTitle, setBreadCrumbReportTitle] = React.useState<string | undefined>();
  const [breadCrumbFlashUpdateNo, setBreadCrumbFlashUpdateNo] = React.useState<number | undefined>();
  const crumbs = React.useMemo(() => [
    { link: strings.informalUpdateNumber, name: `${strings.informalUpdateNumber}${breadCrumbFlashUpdateNo}` },
    { link: location?.pathname, name: breadCrumbReportTitle },
    { link: '/emergencies', name: strings.breadCrumbEmergencies },
    { link: '/', name: strings.breadCrumbHome }
  ], [strings, breadCrumbFlashUpdateNo, breadCrumbReportTitle, location]);

  const {
    pending: projectPending,
    response: DataResponse,
  } = useRequest<InformalUpdateAPIFields>({
    skip: isNotDefined(id),
    url: `api/v2/informal-update/${id}/`,
    onSuccess: (response) => {
      setInformalUpdateData(response);
    }
  });

  const renderActionTaken = (org: string) => {
    const actions: ActionsTaken | undefined = informalUpdateData?.actions_taken.find(d => d.organization === org);
    return (
      <ViewSection title='Actions taken by' data={actions} />
    );
  };

  React.useMemo(() => {
    setBreadCrumbReportTitle(informalUpdateData?.title);
    setBreadCrumbFlashUpdateNo(informalUpdateData && informalUpdateData?.id + 1);
  }, [informalUpdateData]);

  const situationalData = [
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
  ];

  return (
    <>
      <Page
        className={styles.situational}
        title={breadCrumbReportTitle}
        heading={informalUpdateData?.title}
        description={
          <Link
            to={location?.pathname}
          >
            <span className='link--with-icon-text'>
              {informalUpdateData?.country_district?.map((item) => (item?.country_details?.name)).join('-')}
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
      >
        <Container heading={strings.informalUpdateSituationalOverviewLabel} >
          <ViewSection>
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
          </ViewSection>
        </Container>
        <Container
          heading={strings.informalUpdateMapLabel}
        >
          <div className={styles.graphic}>
            <div className={styles.card}>
              {informalUpdateData?.map?.map((item) => (
                <img
                  key={item?.id}
                  src={item?.file} alt=""
                />
              ))}
            </div>
          </div>
        </Container>

        <Container
          heading='IMAGES'
        >
          <div className={styles.image}>
            {informalUpdateData?.graphics?.map((item) => (
              <div key={item?.id}>
                <img src={item?.file} alt="" />
              </div>
            ))}
          </div>
        </Container>
        <Container heading={strings.informalUpdateActionTakenLabel} className={styles.actionTaken}>
          {renderActionTaken('NTLS')}
        </Container>
        <Container className={styles.actionTaken}>
          {renderActionTaken('GOV')}
        </Container>
      </Page>
    </>
  );
}

export default InformalUpdateReport;
