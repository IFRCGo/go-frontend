import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ThreeWForm from '#components/ThreeWForm';
import BasicModal from '#components/BasicModal';
import Header from '#components/Header';
import Translate from '#components/Translate';
import Button, { Props as ButtonProps } from '#components/Button';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  projectId: number;
  onCloseButtonClick?: ButtonProps<void>['onClick'];
}

function ProjectEditModal(props: Props) {
  const {
    className,
    projectId,
    onCloseButtonClick,
  } = props;

  return (
    <BasicModal
      className={_cs(styles.projectEditModal, className)}
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
      />
    </BasicModal>
  );
}

export default ProjectEditModal;
