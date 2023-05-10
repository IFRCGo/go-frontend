import React from 'react';
import {
  EntriesAsList,
  PartialForm,
  SetBaseValueArg,
  useForm
} from '@togglecorp/toggle-form';
import { _cs } from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';
import { ListResponse, useRequest } from '#utils/restRequest';
import { assessmentSchema } from '../usePerFormOptions';
import { Area, Component } from '../common';
import Container from '#components/Container';
import ComponentsList from './ComponentList';

import Button from '#components/Button';
import { createStringColumn } from '#components/Table/predefinedColumns';
import Table from '#components/Table';
import TextInput from '#components/TextInput';

import styles from './styles.module.scss';

type Value = PartialForm<Component>;

export interface Props {
  className?: string;
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
  onValueSet?: (value: SetBaseValueArg<Value>) => void;
  perId?: string;
  onSubmitSuccess?: (result: Component) => void;
}

function prioritizationKeySelector(prioritization: Value) {
  return prioritization.id;
}

interface AreaProps {
  className?: string;
  data: Component[] | undefined;
}

function Prioritization(props: AreaProps) {
  const {
    className,
    data,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const {
    value,
    setFieldValue,
    setValue: onValueSet,
  } = useForm(assessmentSchema, { value: {} });

  const {
    pending: fetchingAreas,
    response: areaResponse,
  } = useRequest<ListResponse<Area>>({
    url: 'api/v2/per-formarea/',
  });

  const showComponent = () => {
    return (
      <>
        {areaResponse?.results?.map((item) => (
          <ComponentsList
            key={item.area_num}
            id={item.id}
            onValueChange={setFieldValue}
            value={value}
          />
        ))}
      </>
    );
  };

  const showText = () => {
    return (
      <TextInput
        name={undefined}
        value={undefined}
      >
      </TextInput>
    );
  };

  const columns = [
    createStringColumn<Component, string | number>(
      'component',
      'Component',
      showComponent,
    ),
    createStringColumn<Component, string | number>(
      'ranking',
      'Ranking',
      (prioritization) => prioritization.id,
    ),
    createStringColumn<Component, string | number>(
      'code',
      'Justification',
      showText,
    ),
  ];

  /*
  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();

    const isCurrentTabValid = validateCurrentTab(['orientation_document']);
    if (!isCurrentTabValid) {
      return;
    }

    if (currentStep === 'overview') {
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'workPlan'>]: Exclude<StepTypes, 'overview'>;
      } = {
        overview: 'assessment',
        assessment: 'prioritization',
        prioritization: 'workPlan',
      };

      handleTabChange(nextStepMap[currentStep]);
    }
  }, []);
  */

  return (
    <Container
      className={_cs(styles.prioritizationTable, className)}
      contentClassName={styles.content}
    >
      <Table
        data={data}
        columns={columns}
        keySelector={prioritizationKeySelector}
        variant="large"
      />
      {areaResponse?.results?.map((item) => (
        <ComponentsList
          key={item.area_num}
          id={item.id}
          onValueChange={setFieldValue}
          value={value}
        />
      ))}
      <div className={styles.actions}>
        <Button
          name={undefined}
          variant="secondary"
          onClick={undefined}
        >
          {strings.perSelectAndAddToWorkPlan}
        </Button>
      </div>
    </Container>
  );
}

export default Prioritization;
