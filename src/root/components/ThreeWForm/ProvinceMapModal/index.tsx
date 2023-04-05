import React from 'react';
import Map, { MapContainer, MapShapeEditor } from '@togglecorp/re-map';
import { isNotDefined, _cs } from '@togglecorp/fujs';
import { bbox as turfBbox } from '@turf/turf';
import { BoundingBox, viewport } from '@mapbox/geo-viewport';

import { defaultMapOptions, defaultMapStyle } from '#utils/map';
import BasicModal from '#components/BasicModal';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import Container from '#components/Container';
import ExportButton from '#components/ExportableView/ExportButton';
import { ProvinceResponse } from '#types/project';
import { useRequest } from '#utils/restRequest';
import MapEaseTo from '#components/MapEaseTo';
import BlockLoading from '#components/block-loading';

import styles from './styles.module.scss';
import { GeoJSONSourceRaw } from 'mapbox-gl';
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
    point: true,
    polygon: true,
    trash: true,
  },
});

interface Props {
  className: string;
  onCloseButtonClick?: () => void;
  countryId?: number;
}

function ProvinceMapModal(props: Props) {
  const {
    className,
    onCloseButtonClick,
    countryId,
  } = props;

  const [drawGeoJSON, setDrawGeoJSON] = React.useState<GeoJSONSourceRaw>();

  const {
    pending: provinceDetailsPending,
    response: provinceResponse,
  } = useRequest<ProvinceResponse>({
    skip: isNotDefined(countryId),
    url: `api/v2/admin2/${countryId}/`,
    // onSuccess: (provinceResponse) => {
    // const formValue = transformResponseFieldsToFormFields(projectResponse);
    // onValueSet(formValue);
    // },
  });

  const boundsBoxPoints = React.useMemo(
    () => {
      if (provinceResponse?.bbox) {
        const bounds = turfBbox(provinceResponse.bbox) as BoundingBox;
        const viewPort = viewport(bounds, [600, 400]);
        return viewPort;
      }
    }, [ provinceResponse ],
  );

  const handleMapDraw = React.useCallback(
    (data, draw) => {
      console.log(data,"----", draw);
      setDrawGeoJSON(data);
    }, []);

  console.log("state", drawGeoJSON);

  return (
    <BasicModal
      className={_cs(styles.modal, className)}
      onCloseButtonClick={onCloseButtonClick}
      headerActions={<ExportButton>Export</ExportButton>}
    >
      {provinceDetailsPending && <BlockLoading />}
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
            mapOptions={defaultMapOptions}
            navControlShown
            navControlPosition="top-left"
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
              onCreate={handleMapDraw}
            />
            { boundsBoxPoints &&
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

