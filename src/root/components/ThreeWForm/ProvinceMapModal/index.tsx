import React from 'react';
import Map, { MapContainer } from '@togglecorp/re-map';
import { _cs } from '@togglecorp/fujs';

import { defaultMapOptions, defaultMapStyle } from '#utils/map';
import BasicModal from '#components/BasicModal';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import Container from '#components/Container';
import ExportButton from '#components/ExportableView/ExportButton';

import styles from './styles.module.scss';

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
  console.log({countryId});

  return (
    <BasicModal
      className={_cs(styles.modal, className)}
      onCloseButtonClick={onCloseButtonClick}
      headerActions={<ExportButton>Export</ExportButton>}
    >
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
        </Map>
      </Container>
    </BasicModal>
  );
}

export default ProvinceMapModal;

