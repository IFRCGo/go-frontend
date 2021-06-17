import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ThreeWForm from '#components/ThreeWForm';
import BasicModal from '#components/BasicModal';
import Translate from '#components/Translate';
import Button, { Props as ButtonProps } from '#components/Button';

import styles from './styles.module.scss';

interface BaseProps {
  className?: string;
  // projectId: number;
  // countryId?: number;
  // reportingNsId?: number
  onCloseButtonClick?: ButtonProps<void>['onClick'];
  onSubmitSuccess?: () => void;
}

type Props = BaseProps & ({
  projectId?: number;
  countryId?: never;
  reportingNsId?: never;
} | {
  countryId?: number;
  reportingNsId?: number;
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
  } = props;

  const projectData = React.useMemo(() => {
    if (!countryId && !reportingNsId) {
      return undefined;
    }

    return {
      project_country: countryId,
      reporting_ns: reportingNsId,
    };
  }, [countryId, reportingNsId]);

  return (
    <BasicModal
      className={_cs(styles.projectFormModal, className)}
      hideCloseButton
      heading={<Translate stringId='projectFormModalTitle'/>}
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
