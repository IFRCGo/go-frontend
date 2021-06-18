import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ThreeWForm from '#components/ThreeWForm';
import { FormType } from '#components/ThreeWForm/useThreeWOptions';
import BasicModal from '#components/BasicModal';
import Translate from '#components/Translate';
import Button, { Props as ButtonProps } from '#components/Button';

import styles from './styles.module.scss';

interface BaseProps {
  className?: string;
  onCloseButtonClick?: ButtonProps<void>['onClick'];
  onSubmitSuccess?: () => void;
}

type Props = BaseProps & ({
  projectId?: number;
  countryId?: never;
  reportingNsId?: never;
  initialValue?: never;
} | {
  countryId?: number;
  reportingNsId?: number;
  projectId?: never;
  initialValue?: never;
} | {
  initialValue: FormType;
  countryId?: never;
  reportingNsId?: never;
  projectId?: never;
})

function ProjectFormModal(props: Props) {
  const {
    className,
    projectId,
    onCloseButtonClick,
    countryId,
    reportingNsId,
    onSubmitSuccess,
    initialValue,
  } = props;

  const projectData = React.useMemo(() => {
    if (initialValue) {
      return initialValue;
    }

    if (!countryId && !reportingNsId) {
      return undefined;
    }

    return {
      project_country: countryId,
      reporting_ns: reportingNsId,
    };
  }, [initialValue, countryId, reportingNsId]);

  return (
    <BasicModal
      className={_cs(styles.projectFormModal, className)}
      hideCloseButton
      heading={<Translate stringId='projectFormModalTitle'/>}
      headingSize="extraLarge"
      headerActions={(
        <Button
          variant="secondary"
          onClick={onCloseButtonClick}
        >
          Close
        </Button>
      )}
    >
      <ThreeWForm
        projectId={projectId}
        initialValue={projectData}
        onSubmitSuccess={onSubmitSuccess}
      />
    </BasicModal>
  );
}

export default ProjectFormModal;
