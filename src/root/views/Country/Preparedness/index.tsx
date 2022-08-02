import React, {
  useContext,
} from 'react';
import { Link } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';

import {
  PartialForm,
  Error,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Card from '#components/Card';
import Container from '#components/Container';
import LanguageContext from '#root/languageContext';
import { useButtonFeatures } from '#components/Button';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import ListView from '#components/ListView';
import Heading from '#components/Heading';

import { EapFormFields } from './EapApplication/common';

import styles from './styles.module.scss';

type PreparednessValue = PartialForm<EapFormFields, 'id'>;

interface PreparednessItemProps {
  preparednessValue: PreparednessValue;
}

function PreparednessItem(props: PreparednessItemProps) {
  const { strings } = useContext(LanguageContext);
  const viewEapDetails = useButtonFeatures({
    variant: 'primary',
    children: 'View Eap Details',
  });

  const {
    preparednessValue,
  } = props;

  return (
    <div className={styles.preparednessCard}>
      <Card>
        <div className={styles.eapTab}>
          <Heading>{preparednessValue?.disaster_type}</Heading>
          <Link
            to="/country-preparedness/new"
            {...viewEapDetails}
          />
        </div>
        <div>
          Last Updated: oct 1.2018
        </div>
        <div className={styles.eapApproveTab}>
          <div>
            <Heading>
              {preparednessValue?.status}
            </Heading>
            {strings.eapsFormStatus}
          </div>
          <div>
            <Heading>
              {preparednessValue?.approval_date}
            </Heading>
            {strings.eapsFormDateofApproval}
          </div>
        </div>
        <div className={styles.eapTab}>
          <Heading>
            1
          </Heading>
        </div>
        <div className={styles.eapActivationTab}>
          <div>{preparednessValue?.status}</div>
          <div className={styles.link}>
            {preparednessValue?.country} - {preparednessValue?.district}
          </div>
        </div>
      </Card>
    </div>
  );
}

function preparednessKeySelector(value: EapFormFields) {
  return value.id;
}

interface Props {
  preparednessData: PreparednessValue[];
  error: Error<PreparednessValue> | undefined;
}

function Preparedness(props: Props) {
  const { strings } = useContext(LanguageContext);

  const {
    error: formError,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError],
  );

  const preparednessRendererParams = (_: number, datum: PreparednessValue) => ({ preparednessValue: datum });

  const {
    pending: fetchingEapDetails,
    response: eapDetailsResponse,
  } = useRequest<ListResponse<EapFormFields>>({
    url: `api/v2/eap/`,
  });

  const addPreparedness = useButtonFeatures({
    variant: 'secondary',
    icons: <IoAdd />,
    children: 'Add',
  });

  return (
    <Container
      className={styles.preparedness}
      contentClassName={styles.content}
      heading={strings.countryPreparednessHeading}
      subHeading={strings.countryPreparednessSubHeading}
      actions={(
        <Link
          to="/country-preparedness/new"
          {...addPreparedness}
        />
      )}
    >
      <ListView
        data={eapDetailsResponse?.results}
        renderer={PreparednessItem}
        keySelector={preparednessKeySelector}
        rendererParams={preparednessRendererParams}
        errored={!!error}
        pending={fetchingEapDetails}
        emptyMessage="No data to display"
        pendingMessage="Loading data"
      />
    </Container>
  );
}

export default Preparedness;
