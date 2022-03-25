import React from 'react';
import Map, {
  MapContainer,
  MapBounds,
  MapChildContext,
} from '@togglecorp/re-map';
import {
  _cs,
  listToMap,
} from '@togglecorp/fujs';
import turfBbox from '@turf/bbox';
import {
  IoCaretDown,
  IoCaretUp,
} from 'react-icons/io5';

import useReduxState from '#hooks/useReduxState';
import {
  defaultMapStyle,
  defaultMapOptions,
  COLOR_LIGHT_GREY,
  COLOR_WHITE,
  COLOR_TEXT,
} from '#utils/map';
import { EmergencyProjectResponse } from '#types';
import Container from '#components/Container';
import DateOutput from '#components/DateOutput';
import TextOutput from '#components/TextOutput';
import Button from '#components/Button';

import { getPeopleReachedInActivity } from '../useProjectStats';
import { reduceListDisplay } from '../projectTableColumns';

import styles from './styles.module.scss';

const SEVERITY_SMALL = 2;
const SEVERITY_MEDIUM = 5;
const SEVERITY_LARGE = 10;


const getColorForValue = (value: number) => {
  if (value >= SEVERITY_LARGE) {
    return '#344b67';
  }

  if (value >= SEVERITY_MEDIUM) {
    return '#67788d';
  }

  if (value >= SEVERITY_SMALL) {
    return '#99a5b4';
  }

  if (value > 0) {
    return '#ccd2d9';
  }

  return COLOR_LIGHT_GREY;
};

const legendItems = [
  { color: '#ccd2d9', label: `less than ${SEVERITY_SMALL}` },
  { color: '#99a5b4', label: `${SEVERITY_SMALL} to ${SEVERITY_MEDIUM-1}` },
  { color: '#67788d', label: `${SEVERITY_MEDIUM} to ${SEVERITY_LARGE-1}` },
  { color: '#344b67', label: `${SEVERITY_LARGE} or more` },
];

interface ChoroplethProps {
  projectCountByDistrict: Record<number, number>;
}

function Choropleth(props: ChoroplethProps) {
  const { projectCountByDistrict } = props;
  const mc = React.useContext(MapChildContext);

  if (!mc || !mc.map || !mc.map.isStyleLoaded() || !projectCountByDistrict) {
    return null;
  }

  const colorProperty: (string | number | string[])[] = [
    'match',
    ['get', 'district_id'],
  ];

  const labelColorProperty: (string | number | string[])[] = [
    'match',
    ['get', 'district_id'],
  ];

  const labelHaloWidthProperty: (string | number | string[])[] = [
    'match',
    ['get', 'district_id'],
  ];

  const districtKeys = Object.keys(projectCountByDistrict) as string[];

  if (districtKeys.length === 0) {
    mc.map.setPaintProperty(
      'admin-1-highlight',
      'fill-color',
      COLOR_LIGHT_GREY,
    );

    mc.map.setPaintProperty(
      'admin-1-label',
      'text-color',
      COLOR_TEXT,
    );

    mc.map.setPaintProperty(
      'admin-1-label',
      'text-halo-width',
      1,
    );

    return null;
  }

  districtKeys.forEach((dk) => {
    colorProperty.push(+dk);
    colorProperty.push(
      getColorForValue(projectCountByDistrict[+dk])
    );

    if (projectCountByDistrict[+dk] >= SEVERITY_SMALL) {
      labelColorProperty.push(+dk);
      labelColorProperty.push(COLOR_WHITE);
    }

    labelHaloWidthProperty.push(+dk);
    labelHaloWidthProperty.push(0);
  });

  colorProperty.push(COLOR_LIGHT_GREY);
  labelColorProperty.push(COLOR_TEXT);
  labelHaloWidthProperty.push(1);

  mc.map.setPaintProperty(
    'admin-1-highlight',
    'fill-opacity',
    1,
  );

  mc.map.setPaintProperty(
    'admin-1-highlight',
    'fill-color',
    colorProperty,
  );

  mc.map.setPaintProperty(
    'admin-1-label',
    'text-color',
    labelColorProperty,
  );

  mc.map.setPaintProperty(
    'admin-1-label',
    'text-halo-width',
    labelHaloWidthProperty,
  );

  mc.map.setLayoutProperty(
    'admin-1-highlight',
    'visibility',
    'visible',
  );

  return null;
}

interface ActivityDetailProps {
  className?: string;
  sectorDetails: EmergencyProjectResponse['activities'][number]['sector_details'];
  projects: EmergencyProjectResponse[];
  showDetails?: boolean;
  onClick?: (sectorId: number) => void;
}

function ActivityDetail(props: ActivityDetailProps) {
  const {
    className,
    sectorDetails,
    projects,
    showDetails,
    onClick,
  } = props;

  const [activeProject, setActiveProject] = React.useState<number | undefined>();

  const projectCount = projects.length;
  const completeProjectCount = projects.filter(p => p.status === 'complete').length;
  const completion = projectCount === 0 ? 100 : 100 * completeProjectCount / projectCount;

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick(sectorDetails.id);
    }
  }, [onClick, sectorDetails.id]);

  return (
    <div className={_cs(styles.activityDetail, className)}>
      <div
        className={styles.header}
        onClick={handleClick}
      >
        <div className={styles.heading}>
          <div className={styles.title}>
            {sectorDetails.title}
          </div>
          {showDetails ? <IoCaretUp className={styles.icon} /> : <IoCaretDown className={styles.icon} />}
        </div>
        <div className={styles.progressBarWithCount}>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${completion}%` }}
            />
          </div>
          <div className={styles.count}>
            {projectCount}
          </div>
        </div>
      </div>
      {showDetails && (
        <div className={styles.details}>
          {projects.map((p) => {
            const nsName = p.activity_lead === 'national_society'
              ? p.reporting_ns_details?.society_name
              : p.deployed_eru_details?.eru_owner_details?.national_society_country_details?.society_name;

            const relatedActivities = p.activities.filter(a => a.sector === sectorDetails.id);

            return (
              <div
                key={p.id}
                className={styles.project}
              >
                <div className={styles.projectHeading}>
                  <div className={styles.nsName}>
                    {nsName}
                  </div>
                  <div className={styles.status}>
                    {p.status_display}
                  </div>
                </div>
                {p.districts_details && (
                  <div className={styles.districtList}>
                    {reduceListDisplay(p.districts_details.map(d => d.name))}
                  </div>
                )}
                <div className={styles.startEndDate}>
                  <DateOutput value={p.start_date} />
                  <DateOutput value={p.end_date} />
                </div>
                {p.id === activeProject && (
                  <div className={styles.relatedActivityList}>
                    {relatedActivities.map((a) => (
                      <div
                        key={a.id}
                        className={styles.relatedActivity}
                      >
                        <div className={styles.action}>
                          {a.action_details?.title ?? a.custom_action}
                        </div>
                        <TextOutput
                          className={styles.peopleReached}
                          label="People reached"
                          value={getPeopleReachedInActivity(a)}
                          strongValue
                        />
                        {a.details && (
                          <div className={styles.activityDetails}>
                            {a.details}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.actions}>
                  {p.id === activeProject ? (
                    <Button
                      className={styles.moreLessButton}
                      name={undefined}
                      onClick={setActiveProject}
                      variant="transparent"
                    >
                      Less
                    </Button>
                  ) : (
                    <Button
                      className={styles.moreLessButton}
                      name={p.id}
                      onClick={setActiveProject}
                      variant="transparent"
                    >
                      More
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface Props {
  className?: string;
  countryIdList: number[];
  projectCountByDistrict: Record<number, number>;
  sectorGroupedProjectList: Record<
    number,
    {
      sectorDetails: EmergencyProjectResponse['activities'][number]['sector_details'];
      projects: EmergencyProjectResponse[];
    }
  >;
}

function ActivityMap(props: Props) {
  const {
    className,
    countryIdList = [],
    projectCountByDistrict,
    sectorGroupedProjectList,
  } = props;

  const [activeSector, setActiveSector] = React.useState<number | undefined>();
  const allCountries = useReduxState('allCountries');
  const activityBounds= React.useMemo(() => {
    const countryIdMap = listToMap(countryIdList, d => d, d => true);
    const coordinateList = allCountries?.data.results
      .filter(c => !!countryIdMap[c.id])
      .map(c => c.bbox)
      .map(b => b.coordinates);

    const bbox = turfBbox({
      type: 'MultiPolygon',
      coordinates: coordinateList.filter(Boolean),
    });

    return bbox as [number, number, number, number];
  }, [allCountries, countryIdList]);

  const sectorKeys = React.useMemo(
    () => Object.keys(sectorGroupedProjectList) as unknown as number[],
    [sectorGroupedProjectList],
  );

  const handleSectorClick = React.useCallback((sectorId: number) => {
    setActiveSector((prevSectorId) => {
      if (prevSectorId === sectorId) {
        return undefined;
      }

      return sectorId;
    });
  }, []);

  return (
    <div className={_cs(styles.activityMap, className)}>
      <Map
        mapStyle={defaultMapStyle}
        mapOptions={defaultMapOptions}
        navControlShown
        navControlPosition="top-right"
      >
        <MapContainer className={styles.mapContainer} />
        <MapBounds
          bounds={activityBounds}
        />
        <Choropleth
          projectCountByDistrict={projectCountByDistrict}
        />
      </Map>
      <Container
        sub
        className={styles.sectorGroupedActivities}
        contentClassName={styles.activityList}
        heading="Activities by Sector"
        headingSize="small"
      >
        {sectorKeys.map((sector) => {
          const sectorGroup = sectorGroupedProjectList[sector];

          return (
            <ActivityDetail
              showDetails={activeSector === sectorGroup.sectorDetails.id}
              onClick={handleSectorClick}
              key={sectorGroup.sectorDetails.id}
              sectorDetails={sectorGroup.sectorDetails}
              projects={sectorGroup.projects}
            />
          );
        })}
      </Container>
      <div className={styles.legend}>
        <div className={styles.legendTitle}>
          Number of Projects:
        </div>
        {legendItems.map((li) => (
          <div
            key={li.label}
            className={styles.legendItem}
          >
            <div
              className={styles.color}
              style={{ backgroundColor: li.color }}
            />
            <div className={styles.label}>
              {li.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityMap;
