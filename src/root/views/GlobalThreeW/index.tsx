import React, {
  useMemo,
  useState,
  useCallback,
  useContext,
} from 'react';
import { IoAdd } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Page from '#components/Page';
import {
  _cs,
  listToMap,
  isDefined,
} from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapSource,
  MapLayer,
  MapTooltip
} from '@togglecorp/re-map';
import type { Location } from 'history';

import MapTooltipContent from '#components/MapTooltipContent';
import BlockLoading from '#components/block-loading';
import { useButtonFeatures } from '#components/Button';
import Card from '#components/Card';
import TextOutput from '#components/TextOutput';
import KeyFigure from '#components/KeyFigure';
import Container from '#components/Container';
import BreadCrumb from '#components/breadcrumb';
import ExportProjectsButton from '#components/ExportProjectsButton';
import LanguageContext from '#root/languageContext';
import { useRequest, ListResponse } from '#utils/restRequest';
import { max } from '#utils/common';
import {
  defaultMapStyle,
  defaultMapOptions,
  getPointCirclePaint,
  getPointCircleHaloPaint,
  COLOR_RED,
} from '#utils/map';
import useReduxState from '#hooks/useReduxState';

import {
  ThreeWBarChart,
  ThreeWPieChart,
} from './Charts';
import Filters, { FilterValue } from './Filters';

import styles from './styles.module.scss';

// TODO:
// 1. DONE: mapboxgl.setRTLTextPlugin()
// 2. map.dragRotate.disable()
// 3. map.touchZoomRotate.disableRotation()
// 4. Hide .mapbox-ctrl .mapbox-ctrl-compass

const tooltipOptions: mapboxgl.PopupOptions = {
  closeButton: false,
  offset: 8,
};

const sourceOption: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};

interface ClickedPoint {
  feature: GeoJSON.Feature<GeoJSON.Point, GeojsonProps>;
  lngLat: mapboxgl.LngLatLike;
}

interface GeojsonProps {
  countryId: number;
  total: number;
}

type NsProjectStatsGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, GeojsonProps>;

interface NsOngoingProjectStats {
  id: number;
  iso3: string;
  ongoing_projects: number;
  target_total: number;
  society_name: string;
  name: string;
  projects_per_sector: {
    primary_sector: number;
    primary_sector_display: string;
    count: number;
  }[];
}

interface ProjectPerProgrammeType {
  programme_type: number;
  programme_type_display: string;
  count: number;
}

interface ProjectPerSector {
  count: number;
  primary_sector: number;
  primary_sector_display: string;
}

interface ProjectPerSecondarySector {
  count: number;
  secondary_sector: number;
  secondary_sector_display: string;
}

interface GlobalProjectsOverview {
  total_ongoing_projects: number;
  ns_with_ongoing_activities: number;
  target_total: number;
  projects_per_sector: ProjectPerSector[];
  projects_per_programme_type: ProjectPerProgrammeType[];
  projects_per_secondary_sectors: ProjectPerSecondarySector[];
}

const pointCirclePaint = getPointCirclePaint(COLOR_RED);

interface Props {
  className?: string;
  location: Location;
}

function GlobalThreeW(props: Props) {
  const {
    className,
    location,
  } = props;

  const { strings } = useContext(LanguageContext);

  const [
    clickedPointProperties,
    setClickedPointProperties,
  ] = useState<ClickedPoint| undefined>();

  const allCountries = useReduxState('allCountries');

  const [filters, setFilters] = React.useState<FilterValue>({
    reporting_ns: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });

  const {
    pending: nsProjectsPending,
    response: nsProjectsResponse,
  } = useRequest<ListResponse<NsOngoingProjectStats>>({
    url: 'api/v2/global-project/ns-ongoing-projects-stats/',
    query: {
      ...filters,
    }
  });

  const {
    pending: projectsOverviewPending,
    response: projectsOverviewResponse,
  } = useRequest<GlobalProjectsOverview>({
    url: 'api/v2/global-project/overview/',
  });

  const numActiveSocieties = projectsOverviewResponse?.ns_with_ongoing_activities;
  const numOngoingProjects = projectsOverviewResponse?.total_ongoing_projects;
  const numTargetedPopulation = projectsOverviewResponse?.target_total;

  const countries = allCountries?.data?.results;

  const maxProjectCount = useMemo(() => (
    max(nsProjectsResponse?.results ?? [], d => d.ongoing_projects)
  ), [nsProjectsResponse]);

  const nsProjectsMap = useMemo(
    () => listToMap(
      nsProjectsResponse?.results ?? [],
      item => item.id,
      (item) => ({
        countryId: item.id,
        total: item.ongoing_projects,
      }),
    ),
    [nsProjectsResponse?.results],
  );

  const geo: NsProjectStatsGeoJson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: countries.map((country) => {
        const nsProject = nsProjectsMap[country.id];
        if (!nsProject) {
          return undefined;
        }
        return {
          id: country.id,
          type: 'Feature' as const,
          properties: nsProject,
          geometry: {
            type: 'Point' as const,
            coordinates: country.centroid?.coordinates ?? [0, 0],
          },
        };
      }).filter(isDefined),
    }),
    [countries, nsProjectsMap],
  );

  const maxScaleValue = Math.min(maxProjectCount ?? 0, 2);

  const pointHaloCirclePaint = useMemo(
    () => getPointCircleHaloPaint(COLOR_RED, 'total', maxScaleValue),
    [maxScaleValue],
  );

  const selectedNsProjectStats = useMemo(
    () => {
      if (!clickedPointProperties) {
        return undefined;
      }
      const item = nsProjectsResponse?.results?.find(
        (item) => item.id === clickedPointProperties.feature.id
      );
      if (!item) {
        return undefined;
      }
      // FIXME: we may not need maxScaleValue
      return {
        ...item,
        maxScaleValue: max(item.projects_per_sector, (item) => item.count),
      };
    },
    [clickedPointProperties, nsProjectsResponse?.results],
  );

  const crumbs = useMemo(() => [
    { link: location?.pathname, name: 'Global 3W' },
    { link: '/', name: strings.breadCrumbHome },
  ], [strings.breadCrumbHome, location]);

  const handlePointClick = useCallback(
    (feature: mapboxgl.MapboxGeoJSONFeature, lngLat: mapboxgl.LngLat) => {
      setClickedPointProperties({
        feature: feature as unknown as ClickedPoint['feature'],
        lngLat,
      });
      return true;
    },
    [setClickedPointProperties],
  );

  const handlePointClose = useCallback(
    () => {
      setClickedPointProperties(undefined);
    },
    [setClickedPointProperties],
  );

  const linkProps = useButtonFeatures({
    variant: "secondary",
    icons: <IoAdd />,
    children: "Add 3W Project",
  });

  const [
    projectPerSectorChartData,
    projectPerSecondarySectorChartData,
    projectPerProgrammeTypeChartData,
  ] = useMemo(() => {
    if (!projectsOverviewResponse) {
      return [[], [], []];
    }

    const {
      projects_per_sector,
      projects_per_secondary_sectors,
      projects_per_programme_type,
    } = projectsOverviewResponse;

    return [
      projects_per_sector.map((p) => ({
        key: p.primary_sector,
        value: p.count,
        name: p.primary_sector_display,
      })),
      projects_per_secondary_sectors.map((p) => ({
        key: p.secondary_sector,
        value: p.count,
        name: p.secondary_sector_display,
      })),
      projects_per_programme_type.map((p) => ({
        key: p.programme_type,
        value: p.count,
        name: p.programme_type_display,
      })),
    ];
  }, [projectsOverviewResponse]);

  const selectedProjectsPerSectorChartData = useMemo(
    () => selectedNsProjectStats?.projects_per_sector.map((p) => ({
      key: p.primary_sector,
      value: p.count,
      name: p.primary_sector_display,
    })) ?? [],
    [selectedNsProjectStats?.projects_per_sector]
  );

  return (
    <Page
      className={_cs(styles.globalThreeW, className)}
      title="IFRC Go - Global 3W Response"
      heading="Global 3W Response"
      actions={(
        <Link
          to="/three-w/new"
          {...linkProps}
        />
      )}
      description="Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ligula sem, tempus et iaculis quis, auctor ut elit. Ut vitae eros quis nunc fringilla ultrices."
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
      infoContainerClassName={styles.infoContainer}
      withMainContentBackground
      info={projectsOverviewPending ? (
        <BlockLoading />
      ) : (
        <>
          <Card>
            <KeyFigure
              value={numOngoingProjects}
              description="Ongoing Projects"
              footerIcon={<div className="collecticon-book" />}
              inline
            />
          </Card>
          <Card>
            <KeyFigure
              value={numActiveSocieties}
              description="Active National Societies"
              footerIcon={<div className="collecticon-rc-block" />}
              inline
            />
          </Card>
          <Card>
            <KeyFigure
              value={numTargetedPopulation}
              description="Targeted Population"
              footerIcon={<div className="collecticon-affected-population" />}
              inline
            />
          </Card>
        </>
      )}
    >
      <Container
        contentClassName={styles.chartsContainer}
      >
        {projectsOverviewPending ? (
          <BlockLoading />
        ) : (
          <>
            <Card
              title="Project Per Sector"
              className={styles.projectPerSectorChart}
            >
              <ThreeWBarChart data={projectPerSectorChartData} />
            </Card>
            <Card
              className={styles.programmeTypeChart}
              title="Programme Type"
            >
              <ThreeWPieChart data={projectPerProgrammeTypeChartData} />
            </Card>
            <Card
              className={styles.topTagsChart}
              title="Top Tags"
            >
              <ThreeWBarChart
                data={projectPerSecondarySectorChartData}
              />
            </Card>
          </>
        )}
      </Container>
      <Container
        className={styles.nsWithOngoingProjects}
        heading="NS with ongoing projects"
        actions={(
          <ExportProjectsButton
            label="Export"
            fileNameSuffix="All projects"
          />
        )}
        descriptionClassName={styles.filtersContainer}
        description={(
          <Filters
            disabled={nsProjectsPending}
            value={filters}
            onChange={setFilters}
          />
        )}
      >
        {nsProjectsPending && <BlockLoading className={styles.mapLoading} />}
        <Map
          mapStyle={defaultMapStyle}
          mapOptions={defaultMapOptions}
          navControlShown
          navControlPosition="top-right"
          debug={false}
        >
          <MapContainer className={styles.mapContainer} />
          <MapSource
              sourceKey="points"
              sourceOptions={sourceOption}
              geoJson={geo}
          >
            <MapLayer
              layerKey="points-halo-circle"
              onClick={handlePointClick}
              layerOptions={{
                type: 'circle',
                paint: pointHaloCirclePaint,
              }}
            />
            <MapLayer
              layerKey="points-circle"
              layerOptions={{
                type: 'circle',
                paint: pointCirclePaint,
              }}
            />
          </MapSource>
          {clickedPointProperties?.lngLat && selectedNsProjectStats && (
            <MapTooltip
              coordinates={clickedPointProperties.lngLat}
              tooltipOptions={tooltipOptions}
              onHide={handlePointClose}
            >
              <MapTooltipContent
                title={selectedNsProjectStats.name}
                href={`/countries/${selectedNsProjectStats.id}/#3w`}
                onCloseButtonClick={handlePointClose}
                className={styles.mapTooltip}
              >
                <div className={styles.meta}>
                  <TextOutput
                    value={selectedNsProjectStats.ongoing_projects}
                    description="Ongoing Projects"
                    valueType="number"
                    displayType="table"
                    strongValue
                  />
                  <TextOutput
                    value={selectedNsProjectStats.target_total}
                    description="Targeted Population"
                    valueType="number"
                    displayType="table"
                    strongValue
                  />
                </div>
                <Container
                  heading="Top Project Sectors"
                  headingSize="small"
                  hideHeaderBorder
                  sub
                >
                  <ThreeWBarChart
                    className={styles.topProjectSectorsChart}
                    data={selectedProjectsPerSectorChartData}
                    limitHeight
                    hideLabel
                  />
                </Container>
              </MapTooltipContent>
            </MapTooltip>
          )}
        </Map>
      </Container>
    </Page>
  );
}
export default GlobalThreeW;
