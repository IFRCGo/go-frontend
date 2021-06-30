import React from 'react';
import {
  _cs,
  isNotDefined,
} from '@togglecorp/fujs';

import BasicModal from '#components/BasicModal';
import ThreeWDetails from '#components/ThreeWDetails';
import Button, { Props as ButtonProps } from '#components/Button';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  projectId: number;
  headerActions?: React.ReactNode;
  onCloseButtonClick?: ButtonProps<void>['onClick'];
}

function ProjectDetail(props: Props) {
  const {
    className,
    projectId,
    headerActions,
    onCloseButtonClick,
  } = props;

  if (isNotDefined(projectId)) {
    return null;
  }

  return (
    <BasicModal
      className={_cs(styles.projectDetailModal, className)}
      hideCloseButton
    >
      <ThreeWDetails
        projectId={projectId}
        headerActions={(
          <>
            { headerActions }
            <Button
              variant="secondary"
              onClick={onCloseButtonClick}
            >
              Close
            </Button>
          </>
        )}
      />
    </BasicModal>
  );
}

export default ProjectDetail;
