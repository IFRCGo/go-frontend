import React from 'react';
import { _cs, listToMap, isNotDefined } from '@togglecorp/fujs'; import { bbox as turfBbox } from '@turf/turf';
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
import { Admin2, District } from '#types';
import useInputState from '#hooks/useInputState';
import useReduxState from '#hooks/useReduxState';
import useBooleanState from '#hooks/useBooleanState';
import { SetValueArg } from '#utils/common';

import FilterOutput from './FilterOutput';
import MapDistrictSelect from './MapDistrictSelect';
import MapAdmin2Select from './MapAdmin2Select';
import styles from './styles.module.scss';

const mapPadding = {
  left: 20,
  top: 20,
  right: 20,
  bottom: 20,
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

interface Props<DN, DV extends number[], AN, AV extends number[]> {
  className?: string;
  countryId?: number;
  districtsInputName: DN;
  districtsInputValue: DV | undefined | null;
  onDistrictsChange: (newValue: SetValueArg<DV>, name: DN) => void;
  admin2sInputName: AN;
  admin2sInputValue: AV | undefined | null;
  onAdmin2sChange: (newValue: SetValueArg<AV>, name: AN) => void;
}

function RegionSelectionInput<DN, DV extends number[], AN, AV extends number[]>(props: Props<DN, DV, AN, AV>) {
  const {
    className,
    countryId,
    districtsInputName,
    districtsInputValue,
    onDistrictsChange,
    admin2sInputName,
    admin2sInputValue,
    onAdmin2sChange,
  } = props;

  const [
    showModal,
    setShowModalTrue,
    setShowModalFalse,
  ] = useBooleanState(false);
  const [doubleClickedDistrict, setDoubleClickedDistrict] = useInputState<number | undefined>(undefined);
  const allCountries = useReduxState('allCountries');
  const countryDetails = allCountries.data.results.find((c) => c.id === countryId);

  const handleDistrictClick = React.useCallback((districtId: number) => {
    onDistrictsChange((prevDistricts) => {
      const existingDistrictIndex = prevDistricts.findIndex(
        (prevDistrict) => prevDistrict === districtId
      );

      if (existingDistrictIndex === -1) {
        return [
          ...prevDistricts,
          districtId,
        ] as DV;
      }

      const newDistricts = [...prevDistricts];
      newDistricts.splice(existingDistrictIndex, 1);

      return newDistricts as DV;
    }, districtsInputName);
  }, [onDistrictsChange, districtsInputName]);

  const handleAdmin2Click = React.useCallback((admin2Id: number) => {
    onAdmin2sChange((prevAdmin2s) => {
      const existingDistrictIndex = prevAdmin2s.findIndex((prevAdmin2) => prevAdmin2 === admin2Id);

      if (existingDistrictIndex === -1) {
        return [
          ...prevAdmin2s,
          admin2Id,
        ] as AV;
      }

      const newDistricts = [...prevAdmin2s];
      newDistricts.splice(existingDistrictIndex, 1);

      return newDistricts as AV;
    }, admin2sInputName);
  }, [onAdmin2sChange, admin2sInputName]);

  const handleDistrictDoubleClick = React.useCallback((districtId: number) => {
    setDoubleClickedDistrict(districtId);
    onDistrictsChange((prevDistricts) => {
      const existingDistrictIndex = prevDistricts.findIndex(
        (prevDistrict) => prevDistrict === districtId
      );

      if (existingDistrictIndex === -1) {
        return [
          ...prevDistricts,
          districtId,
        ] as DV;
      }

      return prevDistricts;
    }, districtsInputName);
  }, [onDistrictsChange, setDoubleClickedDistrict, districtsInputName]);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<District>>({
    url: 'api/v2/district/',
    query: {
      country: countryId,
    },
    skip: !showModal && isNotDefined(countryId),
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
    skip: !showModal && isNotDefined(countryId),
    query: {
      admin1__country: countryId,
      limit: 10000,
    },
  });

  const hasAdmin2s = (admin2Response?.results ?? []).length > 0;

  const admin2IdToLabelMap = React.useMemo(() => {
    return listToMap(
      admin2Response?.results ?? [],
      (admin2) => admin2.id,
      (admin2) => admin2.name,
    );
  }, [admin2Response]);

  const admin2ToDistrictMap = React.useMemo(() => {
    return listToMap(
      admin2Response?.results ?? [],
      (admin2) => admin2.id,
      (admin2) => admin2.district_id,
    );
  }, [admin2Response]);

  const bounds = React.useMemo(
    () => {
      if (!countryDetails) {
        return undefined;
      }

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
    <>
      <Button
        className={_cs(styles.provinceButton, className)}
        name="district"
        onClick={setShowModalTrue}
        disabled={!countryId}
        variant="tertiary"
      >
        {!districtsInputValue || districtsInputValue.length === 0 ?
          'Select Province/Region' : 'Edit Province/Region'}
      </Button>
      {showModal && countryDetails && (
        <BasicModal
          className={styles.modal}
          onCloseButtonClick={setShowModalFalse}
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
                      selectedAdmin2s={admin2sInputValue}
                      onClick={handleAdmin2Click}
                    />
                  )}
                  {!doubleClickedDistrict && countryId && (
                    <MapDistrictSelect
                      selectedDistricts={districtsInputValue}
                      onClick={handleDistrictClick}
                      countryId={countryId}
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
                <SelectInput<typeof districtsInputName, number>
                  placeholder="Select Districts"
                  name={districtsInputName}
                  options={districtOptions}
                  value={districtsInputValue}
                  onChange={onDistrictsChange}
                  hideValue
                  isMulti
                />
                <FilterOutput
                  districtsInputName={districtsInputName}
                  districtOptions={districtOptions}
                  districts={districtsInputValue}
                  onDistrictsChange={onDistrictsChange}
                  admin2sInputName={admin2sInputName}
                  admin2s={admin2sInputValue}
                  admin2IdToLabelMap={admin2IdToLabelMap}
                  onAdmin2sChange={onAdmin2sChange}
                  admin2ToDistrictMap={admin2ToDistrictMap}
                  doubleClickedDistrict={doubleClickedDistrict}
                />
              </div>
            </Container>
          )}
        </BasicModal>
      )}
    </>
  );
}

export default RegionSelectionInput;


