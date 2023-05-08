import React from 'react';
import {
  EntriesAsList,
  PartialForm,
  SetBaseValueArg,
  useForm
} from '@togglecorp/toggle-form';
import LanguageContext from '#root/languageContext';
import { ListResponse, useRequest } from '#utils/restRequest';
import { Area, Component, PerOverviewFields } from '../common';
import { assessmentSchema } from '../usePerFormOptions';

import Container from '#components/Container';
import ComponentsList from './ComponentList';

import styles from './styles.module.scss';
import Button from '#components/Button';

type Value = PartialForm<PerOverviewFields>;

interface Props {
  className?: string;
  onValueChange?: (...entries: EntriesAsList<Value>) => void;
  onValueSet?: (value: SetBaseValueArg<Value>) => void;
  perId?: string;
  onSubmitSuccess?: (result: Component) => void;
}

function Prioritization(props: Props) {
  const {
    className,
  } = props;

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

  const { strings } = React.useContext(LanguageContext);
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
    <Container>
      <div className={styles.componentTitle}>
        <h5>Component</h5>
        <h5>Ranking</h5>
        <h5>Justification</h5>
      </div>
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
