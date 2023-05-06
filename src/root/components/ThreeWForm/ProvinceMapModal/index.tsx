import React from 'react';
import { isDefined, _cs } from '@togglecorp/fujs';
import { bbox as turfBbox } from '@turf/turf';
import { BoundingBox, viewport } from '@mapbox/geo-viewport';
import Map, {
  MapChildContext,
  MapContainer,
  MapShapeEditor,
} from '@togglecorp/re-map';

import { defaultMapStyle } from '#utils/map';
import { ListResponse, useRequest } from '#utils/restRequest';
import BasicModal from '#components/BasicModal';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import Container from '#components/Container';
import ExportButton from '#components/ExportableView/ExportButton';
import { ProvinceResponse } from '#types/project';
import MapEaseTo from '#components/MapEaseTo';
import BlockLoading from '#components/block-loading';
import { Country } from '#types/country';

import styles from './styles.module.scss';

const mapPadding = {
  left: 0,
  top: 0,
  right: 320,
  bottom: 50,
};

const MAP_BOUNDS_ANIMATION_DURATION = 1800;
const defaultDrawOptions = ({
  displayControlsDefault: false,
  controls: {
    point: false,
    polygon: false,
    trash: true,
    line_string: true,
  },
  touchEnabled: false,
});

const mapOptions = {
  logoPosition: 'top-left' as const,
  scrollZoom: false,
  pitchWithRotate: false,
  dragRotate: false,
  attributionControl: false,
  doubleClickZoom: false,
  navControlShown: true,
  navControlPosition: 'top-left',
  displayControlsDefault: false,
};

interface Props {
  className: string;
  onCloseButtonClick?: () => void;
  countryDetails?: Country;
}

interface ChoroplethProps {
  data?: ProvinceResponse[];
}

function Choropleth(props:ChoroplethProps) {
  const {data} = props;
  const mc = React.useContext(MapChildContext);

  if (!mc || !mc.map || !mc.map.isStyleLoaded() || !data) {
    return null;
  }

  mc.map.on('click', (e) => {
    const selectedFeatures = mc.map?.queryRenderedFeatures(e.point);
    const districtId = selectedFeatures?.map((feature) => feature?.properties?.district_id).filter(el => isDefined(el));

    if(isDefined(districtId) && districtId?.length > 0){
      //eslint-disable-next-line
      mc.map?.setPaintProperty('admin-1-highlight', 'fill-color', [
        'match',
        ['get', 'district_id'],
        districtId,
        '#ff0000',
        '#fefefe'
      ]);

      //eslint-disable-next-line
      mc.map?.setLayoutProperty('admin-1-highlight', 'visibility', 'visible');
    }
  });

  return null;
}

function ProvinceMapModal(props: Props) {
  const {
    className,
    onCloseButtonClick,
    countryDetails,
  } = props;

  // const [drawGeoJSON, setDrawGeoJSON] = React.useState<GeoJSONSourceRaw>();

  const {
    pending: provinceDetailsPending,
    response: provinceResponse,
  } = useRequest<ListResponse<ProvinceResponse>>({
    url: `api/v2/admin2/?${countryDetails?.id}/`,
    // onSuccess: (provinceResponse) => {
    // const formValue = transformResponseFieldsToFormFields(projectResponse);
    // onValueSet(formValue);
    // },
  });
  // console.info("province response", provinceResponse);

  const boundsBoxPoints = React.useMemo(
    () => {
      if (countryDetails) {
        const bounds = turfBbox(countryDetails.bbox) as BoundingBox;
        const viewPort = viewport(bounds, [640, 480]);
        return viewPort;
      }
    }, [countryDetails],
  );

  /* const handleMapDraw = React.useCallback(
  (data, draw) => {
  console.log(data,"----", draw);
  setDrawGeoJSON(data);
  }, []); */

  /* const handleMode = React.useCallback (
    (mode, draw) => {
    console.log("mode chande callback", mode, draw);

    },[]
  ); */

  /* const handleDoubleClick = (
    feature: mapboxgl.MapboxGeoJSONFeature, lngLat: mapboxgl.LngLat, point: mapboxgl.Point, map: mapboxgl.Map
      ) => {
      console.log("double click", feature);
      return false;
  }; */

  /* const polygonGeoJson = React.useMemo(() => {
  if (isNotDefined(countryDetails && countryDetails.bbox)) {
      return {
      type: 'FeatureCollection' as const,
      features: [
      {
      type: "Feature" as const,
      properties: {},
      geometry: {
      type: "Polygon" as const,
      coordinates: [],
      }
      }
      ]
      };
      }
      return {
      type: 'FeatureCollection' as const,
      features: [
      {
      type: "Feature" as const,
      properties: {},
      geometry: {
      type: "Polygon" as const,
      coordinates: countryDetails?.bbox.coordinates,
      }
      }
      ]
      };
}, [countryDetails]); */

  // console.log("geojson", polygonGeoJson);
  // console.info("new geo", geojsonNew);
  // console.info('map loaded', mc.map);

  return (
    <BasicModal
      className={_cs(styles.modal, className)}
      onCloseButtonClick={onCloseButtonClick}
      headerActions={<ExportButton>Export</ExportButton>}
    >
      {(provinceDetailsPending) && <BlockLoading />}
      {!provinceDetailsPending &&(
        <Container
          heading="AFFECTED AREAS - PHILIPPINES"
          className={styles.modalContent}
          description={
            <div>
              Cick on Admin 1 to select it. Double click to zoom into Admin 2.
            </div>
          }
          descriptionClassName={styles.mapDescription}
          contentClassName={styles.mainContent}
          sub
        >
          <Map
            mapStyle={defaultMapStyle}
            mapOptions={mapOptions}
            navControlShown
            navControlPosition="top-right"
            scaleControlPosition="top-left"
          >
            <div className={styles.mapContainer}>
              <div className={styles.wrapperForSidebar}>
                <MapContainer className={styles.map} />
                <GoMapDisclaimer className={styles.mapDisclaimer} />
              </div>
            </div>
            <MapShapeEditor
              drawOptions={defaultDrawOptions}
              // onModeChange={handleMapDraw}
              // onCreate={handleMapDraw}
              // onModeChange={handleMode}
            />

            <Choropleth data={provinceResponse?.results} />
            {boundsBoxPoints &&
              <MapEaseTo
                padding={mapPadding}
                center={boundsBoxPoints.center}
                zoom={boundsBoxPoints.zoom}
                duration={MAP_BOUNDS_ANIMATION_DURATION}
              />
            }
          </Map>
        </Container>
      )}
    </BasicModal>
  );
}

export default ProvinceMapModal;


