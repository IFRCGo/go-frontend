import React from 'react';
import Map, { MapChildContext, MapContainer, MapLayer, MapShapeEditor, MapSource } from '@togglecorp/re-map';
import { isNotDefined, noOp, _cs } from '@togglecorp/fujs';
import { bbox as turfBbox } from '@turf/turf';
import { BoundingBox, viewport } from '@mapbox/geo-viewport';

import { defaultMapOptions, defaultMapStyle } from '#utils/map';
import BasicModal from '#components/BasicModal';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import Container from '#components/Container';
import ExportButton from '#components/ExportableView/ExportButton';
import { ProvinceResponse } from '#types/project';
import { ListResponse, useRequest } from '#utils/restRequest';
import MapEaseTo from '#components/MapEaseTo';
import BlockLoading from '#components/block-loading';

import styles from './styles.module.scss';
import { GeoJSONSourceRaw } from 'mapbox-gl';
import { Country } from '#types/country';
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

interface Props {
  className: string;
  onCloseButtonClick?: () => void;
  countryDetails?: Country;
}

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

const geojsonNew ={
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {},
      geometry: {
        coordinates: [
          [
            [
              60.503889000065236,
              29.377476867128088
            ],
            [
              74.87943118675915,
              29.377476867128088
            ],
            [
              74.87943118675915,
              38.48893683918417
            ],
            [
              60.503889000065236,
              38.48893683918417
            ],
            [
              60.503889000065236,
              29.377476867128088
            ]
          ]
        ],
        type: "Polygon" as const,
      }
    }
  ]
};

const testData = [
  {
    name:'abc',
    iso3:'NPL',
    value:32,
    "alpha-2": 'NP-P3'
  }
];
interface ChoroplethProps {
  data?: ProvinceResponse[];
}
function Choropleth(props:ChoroplethProps) {
  const {data} = props;
  const mc = React.useContext(MapChildContext);

  if (!mc || !mc.map || !mc.map.isStyleLoaded() || !data) {
    return null;
  }
  const colorProperty = testData.reduce((acc, rd) => {
    acc.push(rd['alpha-2']);
    const color = "#00dd00";
    acc.push(color);

    return acc;
  }, [
      'match',
      ['get', 'alpha-2'],
    ]);
  colorProperty.push('#c7c7c7');

  console.log("color props", colorProperty);

  mc.map.on('click', (e) => {
    console.log('A click event has occurred at', e);
  });

  mc.map.setPaintProperty(
    'admin-1-highlight',
    'fill-color',
    colorProperty,
  );

  mc.map.setLayoutProperty(
    'admin-1-highlight',
    'visibility',
    'visible',
  );
  mc.map.setLayoutProperty(
    'admin-1-boundary',
    'visibility',
    'visible',
  );
  console.log('data choropleth', data);
  return null;
}

function ProvinceMapModal(props: Props) {
  const {
    className,
    onCloseButtonClick,
    countryDetails,
  } = props;
  const mc = React.useContext(MapChildContext);

  const [drawGeoJSON, setDrawGeoJSON] = React.useState<GeoJSONSourceRaw>();

  const {
    // pending: countryPending,
    response: countryResponse,
  } = useRequest<ListResponse<Country>>({
    skip: !countryDetails,
    url: `api/v2/country/?search=${countryDetails?.name}`,
  });

  console.info("country response ", countryResponse, countryDetails);
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

  const handleMapDraw = React.useCallback(
    (data, draw) => {
      console.log(data,"----", draw);
      setDrawGeoJSON(data);
    }, []);

  const handleMode = React.useCallback (
    (mode, draw) => {
      console.log("mode chande callback", mode, draw);

    },[]
  );

  const handleDoubleClick = (
    feature: mapboxgl.MapboxGeoJSONFeature, lngLat: mapboxgl.LngLat, point: mapboxgl.Point, map: mapboxgl.Map
  ) => {
    console.log("double click", feature);
    return false;
  };

  const polygonGeoJson = React.useMemo(() => {
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
  }, [countryDetails]);

  console.log("geojson", polygonGeoJson);
  console.info("new geo", geojsonNew);
  console.info('map loaded', mc.map);

  const mapLoaded = !mc || !mc.map || !mc.map.isStyleLoaded();
  console.info("load--------", mapLoaded);
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


