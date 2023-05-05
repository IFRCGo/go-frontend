import React from 'react';
import LanguageContext from '#root/languageContext';

import ExpandableContainer from '#components/ExpandableContainer';
import Container from '#components/Container';
import { _cs } from '@togglecorp/fujs';
import TextInput from '#components/TextInput';
import ComponentsInput from '../Assessment/CustomActivityInput';
import { Area, Component, PerOverviewFields } from '../common';
import { EntriesAsList, PartialForm, SetBaseValueArg, useForm } from '@togglecorp/toggle-form';
import { ListResponse, useLazyRequest, useRequest } from '#utils/restRequest';

import styles from './styles.module.scss';
import { prioritizationSchema } from '../usePerFormOptions';
import ComponentsList from './ComponentList';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  className?: string;
  initialValue: Value;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  perId?: string;
  onSubmitSuccess?: (result: Component) => void;
}

function Prioritization(props: Props) {
  const {
    className,
    perId,
    onSubmitSuccess,
    initialValue,
  } = props;

  const {
    value,
    setFieldValue: onValueChange,
    setValue: onValueSet,
  } = useForm(prioritizationSchema, { value: {} });

  const {
    pending: fetchingAreas,
    response: areaResponse,
  } = useRequest<ListResponse<Area>>({
    url: 'api/v2/per-formarea/',
  });

  const { strings } = React.useContext(LanguageContext);

  return (
    <Container>
      <div className={styles.componentTitle}>
        <h5>Component</h5>
        <h5>Ranking</h5>
        <h5>Justification</h5>
      </div>
      {areaResponse?.results?.map((item) => (
        <ComponentsList
          id={item.id}
          onValueChange={onValueChange}
          value={value}
        />
      ))}
    </Container>
  );
}

export default Prioritization;
