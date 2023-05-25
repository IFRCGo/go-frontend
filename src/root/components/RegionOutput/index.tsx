import React from 'react';
import {
  _cs,
  isNotDefined,
  listToMap,
  listToGroupList,
} from '@togglecorp/fujs';

import { ListResponse, useRequest } from '#utils/restRequest';
import ReducedListDisplay from '#components/ReducedListDisplay';
import { Admin2, District } from '#types';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  districts: number[] | undefined | null;
  admin2s: number[] | undefined | null;
  countryId?: number;
}

function RegionOutput(props: Props) {
  const {
    className,
    districts,
    admin2s,
    countryId,
  } = props;

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<District>>({
    url: 'api/v2/district/',
    query: {
      country: countryId,
    },
    skip: isNotDefined(countryId),
  });

  const districtLabelMap = React.useMemo(() => {
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
    skip: isNotDefined(countryId),
    query: {
      admin1__country: countryId,
      limit: 10000,
    },
  });

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

  const admin2sForSelectedDistricts = React.useMemo(() => {
    return listToGroupList(
      admin2s ?? [],
      (admin2) => admin2ToDistrictMap[admin2],
      (admin2) => admin2,
    );
  }, [admin2ToDistrictMap, admin2s]);

  const pending = fetchingDistricts && fetchingAdmin2;
  if (pending) {
    return null;
  }

  return (
    <div className={_cs(styles.regionOutput, className)}>
      {districts?.map((district) => (
        <div
          className={styles.district}
          key={district}
        >
          <div className={styles.districtLabel}>
            {districtLabelMap[district]}
          </div>
          {admin2sForSelectedDistricts[district] && (
            <div className={styles.adminTwoList}>
                <ReducedListDisplay
                  maxItems={8}
                  minItems={6}
                  title="Selected admin 2"
                  value= {admin2sForSelectedDistricts[district].map(
                    (admin2) => admin2IdToLabelMap[admin2])}
                />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default RegionOutput;
