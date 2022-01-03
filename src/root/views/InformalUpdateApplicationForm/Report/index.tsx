import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';

import Container from '#components/Container';
import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import languageContext from '#root/languageContext';
import { get } from '#utils/utils';
import ViewSection from './ViewSection';

import styles from './styles.module.scss';

interface Props {
  match: Match<{ id: string }>
  history: History;
  location: Location;
}

function InformalUpdateReport(props: Props) {
  const {
    //history,
    match
  } = props;
  //const { id } = match.params;
  const { strings } = useContext(languageContext);
  const data = undefined;
  const crumbs = [
    { link: '/flash update 1', name: get(data, 'summary', 'Flash Update #1') },
    // {link: this.props.location.state, name: strings.breadCrumbEmergency},
    { link: '/Pakistan', name: '5.7 Earthquake in Pakistan' },
    { link: '/emergencies', name: strings.breadCrumbEmergencies },
    { link: '/', name: strings.breadCrumbHome }
  ];
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
  const actionTakenByIfrc = useMemo(() => [{
    description: 'IFRC CD is in close contact with PRCS on the situation and monitoring the situation. ',
    actions: ['Others', 'Food and Security']
  }], []);

  const actionTakenByRcrc = useMemo(() => [{
    description: `As soon as reports emerged in Media about the EQ in early hours, PRCS NHQ contacted the provincial HQ and started mobilising their resources, PRCS PHQ has deployed a 
        team consisting of Doctor, Paramedic and Provincial Disaster Management Manager (PDMM) and Volunteers, 3 Ambulances along with basic medicines on their way to the 
        affected areas. The team is led by Chairman of PRCS Balochistan Branch. Apart from medicines some basic NFIs are also on the way to Harnai district to assist the affected 
        families. The team will also assess the situation and needs of the affected population. PRCS Balochistan Branch is ready with more stocks in the warehouses if required to be 
        dispatched.
       
        PRCS NHQ is closely monitoring the situation and in contact with the Provincial Branch Balochistan.
        
        PRCS NHQ is waiting for Primary Incident Report (PIR) from the Branch on the basis of that PRCS NHQ will assess the needs to decide on whether they will request for DREF.`,
    actions: ['Others', 'Food and Security']
  }], []);

  const actionTakenByGovernment = useMemo(() => [{
    description: `As per Chief Minister of the Province, all assistance and evacuations are underway for the affected areas, Medical, local administration and disaster management teams are on high alert and mobilized, emergency services had been dispatched to the area.

        Rescue operations are still underway.
        
        There has been quite a lot of land sliding, and the teams are currently working to clear the roads to the area.`,
    actions: ['Others', 'Food and Security']
  }], []);

  return (
    <>
      <Page
        className={styles.situational}
        title='informal report'
        heading='5.7 Earthquake in Pakistan (Flash Update #1)'
        description={
          <Link to='/'>
            <span className='link--with-icon-text'>
              Pakistan
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
        <Container heading="SITUATIONAL OVERVIEW">
          <ViewSection>
            <div>
              {situationalData.map((item) => (
                <>
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
                </>
              ))}
            </div>
          </ViewSection>
        </Container>

        <Container
          heading='MAPS'
        >
          <div className={styles.graphic}>
            <div className={styles.card}>
              <img src="https://www.geosp.com/wp-content/uploads/2019/10/2.jpg" alt="" />
            </div>
          </div>
        </Container>

        <Container
          heading='IMAGES'
        >
          <div className={styles.image}>
            <div>
              <img src="https://nepal24hours.com/wp-content/uploads/2021/10/earthquakes.jpg" alt="" />
            </div>
            <div>
              <img src="https://nepal24hours.com/wp-content/uploads/2021/10/earthquakes.jpg" alt="" />
            </div>
          </div>
        </Container>

        <Container heading='ACTIONS TAKEN' className={styles.actionTaken}>
          <ViewSection title='Actions taken by IFRC' data={actionTakenByIfrc} />
        </Container>

        <Container className={styles.actionTaken}>
          <ViewSection title='Actions taken by RCRC' data={actionTakenByRcrc} />
        </Container>

        <Container className={styles.actionTaken}>
          <ViewSection title='Actions taken by Government' data={actionTakenByGovernment} />
        </Container>
      </Page>
    </>
  );
}

export default InformalUpdateReport;
