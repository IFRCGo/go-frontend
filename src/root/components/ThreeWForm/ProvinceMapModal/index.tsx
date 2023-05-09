import React from 'react';
import { _cs, listToMap } from '@togglecorp/fujs'; import { bbox as turfBbox } from '@turf/turf';
import { BoundingBox } from '@mapbox/geo-viewport';
import Map, {
  MapContainer,
  MapBounds,
} from '@togglecorp/re-map';
import { IoChevronBack } from 'react-icons/io5';

import { defaultMapStyle, defaultMapOptions } from '#utils/map';
import { ListResponse, useRequest } from '#utils/restRequest';
import BasicModal from '#components/BasicModal';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import SelectInput from '#components/SelectInput';
import Button from '#components/Button';
import { Admin2, Country, District } from '#types';
import useInputState from '#hooks/useInputState';

import FilterOutput from './FilterOutput';
import MapDistrictSelect from './MapDistrictSelect';
import MapAdmin2Select from './MapAdmin2Select';
import styles from './styles.module.scss';

const mapPadding = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

const mapOptions = {
  ...defaultMapOptions,
  scrollZoom: false,
  pitchWithRotate: false,
  dragRotate: false,
  doubleClickZoom: false,
  navControlShown: true,
  displayControlsDefault: false,
};

interface Props {
  className: string;
  onCloseButtonClick?: () => void;
  countryDetails: Country;
}


function ProvinceMapModal(props: Props) {
  const {
    className,
    onCloseButtonClick,
    countryDetails,
  } = props;

  const [selectedDistricts, setSelectedDistricts] = useInputState<number[]>([]);
  const [selectedAdmin2s, setSelectedAdmin2s] = useInputState<string[]>([]);
  const [doubleClickedDistrict, setDoubleClickedDistrict] = useInputState<number | undefined>(undefined);

  const handleDistrictClick = React.useCallback((districtId: number) => {
    setSelectedDistricts((prevDistricts) => {
      const existingDistrictIndex = prevDistricts.findIndex(
        (prevDistrict) => prevDistrict === districtId
      );

      if (existingDistrictIndex === -1) {
        return [
          ...prevDistricts,
          districtId,
        ];
      }

      const newDistricts = [...prevDistricts];
      newDistricts.splice(existingDistrictIndex, 1);

      return newDistricts;
    });
  }, [setSelectedDistricts]);

  const handleAdmin2Click = React.useCallback((admin2Id: string) => {
    setSelectedAdmin2s((prevAdmin2s) => {
      const existingDistrictIndex = prevAdmin2s.findIndex((prevAdmin2) => prevAdmin2 === admin2Id);

      if (existingDistrictIndex === -1) {
        return [
          ...prevAdmin2s,
          admin2Id,
        ];
      }

      const newDistricts = [...prevAdmin2s];
      newDistricts.splice(existingDistrictIndex, 1);

      return newDistricts;
    });
  }, [setSelectedAdmin2s]);

  const handleDistrictDoubleClick = React.useCallback((districtId: number) => {
    setDoubleClickedDistrict(districtId);
    setSelectedDistricts((prevDistricts) => {
      const existingDistrictIndex = prevDistricts.findIndex(
        (prevDistrict) => prevDistrict === districtId
      );

      if (existingDistrictIndex === -1) {
        return [
          ...prevDistricts,
          districtId,
        ];
      }

      return prevDistricts;
    });
  }, [setSelectedDistricts, setDoubleClickedDistrict]);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<District>>({
    url: 'api/v2/district/',
    query: {
      country: countryDetails.id,
    },
  });

  const districtOptions = React.useMemo(() => {
    if (!districtsResponse) {
      return [];
    }

    return districtsResponse.results.filter(
      (district) => !district.is_deprecated
    ).map(
      (district) => ({
        value: district.id,
        label: district.name,
      })
    );
  }, [districtsResponse]);

  const districtIdToNameMap = React.useMemo(() => {
    return listToMap(
      districtsResponse?.results ?? [],
      (d) => d.id,
      (d) => d.name,
    );
  }, [districtsResponse]);

  const {
    pending: fetchingAdmin2,
    response: admin2Response,
  } = useRequest<ListResponse<Admin2>>({
    url: 'api/v2/admin2/',
    query: {
      admin1__country__iso3: countryDetails.iso3,
      limit: 10000,
    },
  });

  const hasAdmin2s = (admin2Response?.results ?? []).length > 0;

  const admin2IdToLabelMap = React.useMemo(() => {
    return listToMap(
      admin2Response?.results ?? [],
      (admin2) => admin2.name,
      (admin2) => admin2.name,
    );
  }, [admin2Response]);

  const admin2ToDistrictMap = React.useMemo(() => {
    return listToMap(
      admin2Response?.results ?? [],
      (admin2) => admin2.name,
      (admin2) => admin2.district_id,
    );
  }, [admin2Response]);

  const bounds = React.useMemo(
    () => {
      if (doubleClickedDistrict && districtsResponse) {
        const selectedDistrict = districtsResponse.results.find((d) => d.id === doubleClickedDistrict);
        if (selectedDistrict) {
          return turfBbox(selectedDistrict.bbox) as BoundingBox;
        }
      }
      return turfBbox(countryDetails.bbox) as BoundingBox;
    }, [doubleClickedDistrict, districtsResponse, countryDetails],
  );

  const pending = fetchingAdmin2 && fetchingDistricts;

  return (
    <BasicModal
      className={_cs(styles.modal, className)}
      onCloseButtonClick={onCloseButtonClick}
      heading={countryDetails.name}
      bodyClassName={styles.modalBody}
    >
      {pending && <BlockLoading />}
      {!pending &&(
        <Container
          heading={doubleClickedDistrict ? districtIdToNameMap[doubleClickedDistrict] : "Select affected areas"}
          headingSize="superSmall"
          className={styles.modalContent}
          headerClassName={styles.secondaryHeader}
          description="Click on Admin 1 to select it. Double click to zoom into Admin 2"
          icons={doubleClickedDistrict && (
            <Button
              icons={<IoChevronBack />}
              name={undefined}
              onClick={setDoubleClickedDistrict}
              variant="tertiary"
            >
              Back to Country
            </Button>
          )}
          descriptionClassName={styles.mapDescription}
          contentClassName={styles.mainContent}
          compact
          sub
        >
          <div className={styles.mapContainer}>
            <Map
              mapStyle={defaultMapStyle}
              mapOptions={mapOptions}
            >
              <MapContainer className={styles.mapContent} />
              <GoMapDisclaimer className={styles.mapDisclaimer} />
              {doubleClickedDistrict && countryDetails.iso3 && (
                <MapAdmin2Select
                  countryIso={countryDetails.iso3}
                  districtId={doubleClickedDistrict}
                  selectedAdmin2s={selectedAdmin2s}
                  onClick={handleAdmin2Click}
                />
              )}
              {!doubleClickedDistrict && (
                <MapDistrictSelect
                  selectedDistricts={selectedDistricts}
                  onClick={handleDistrictClick}
                  countryId={countryDetails.id}
                  onDoubleClick={hasAdmin2s ? handleDistrictDoubleClick : undefined}
                />
              )}
              {bounds &&
                <MapBounds
                  padding={mapPadding}
                  bounds={bounds}
                />
              }
            </Map>
          </div>
          <div className={styles.sideBar}>
            <SelectInput<"districts", number>
              placeholder="Select Districts"
              name="districts"
              options={districtOptions}
              value={selectedDistricts}
              onChange={setSelectedDistricts}
              hideValue
              isMulti
            />
            <FilterOutput
              districtOptions={districtOptions}
              districts={selectedDistricts}
              onDistrictsChange={setSelectedDistricts}
              admin2s={selectedAdmin2s}
              admin2IdToLabelMap={admin2IdToLabelMap}
              onAdmin2sChange={setSelectedAdmin2s}
              admin2ToDistrictMap={admin2ToDistrictMap}
              doubleClickedDistrict={doubleClickedDistrict}
            />
          </div>
        </Container>
      )}
    </BasicModal>
  );
}

export default ProvinceMapModal;


