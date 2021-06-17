import React from 'react';
import {
  IoClipboardOutline,
  IoPencil,
  IoTrash,
  IoEllipsisVertical,
} from 'react-icons/io5';

import DropdownMenu from '#components/dropdown-menu';
import LanguageContext from '#root/languageContext';
import ConfirmModal from '#components/confirm-modal';
import DropdownMenuItem from '#components/DropdownMenuItem';
import useBooleanState from '#hooks/useBooleanState';

import ProjectFormModal from '../ProjectFormModal';
import ProjectDetailModal from '../ProjectDetailModal';

import styles from './styles.module.scss';

interface Props {
  projectId: number;
  onProjectFormSubmitSuccess?: () => void;
}

function ProjectTableActions(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    projectId,
    onProjectFormSubmitSuccess,
  } = props;

  const [
    showProjectDetails,
    setShowProjectDetailsTrue,
    setShowProjectDetailsFalse,
  ] = useBooleanState(false);

  const [
    showProjectEdit,
    setShowProjectEditTrue,
    setShowProjectEditFalse,
  ] = useBooleanState(false);

  const [
    showProjectDeleteConfirmation,
    setShowProjectDeleteConfirmationTrue,
    setShowProjectDeleteConfirmationFalse,
  ] = useBooleanState(false);


  const handleDeleteProjectConfirmModalClose = React.useCallback((ok) => {
    setShowProjectDeleteConfirmationFalse();
    console.info(ok);
  }, [setShowProjectDeleteConfirmationFalse]);

  return (
    <>
      <DropdownMenu label={<IoEllipsisVertical />}>
        <DropdownMenuItem
          name={projectId}
          onClick={setShowProjectDetailsTrue}
          label="View Details"
          icon={<IoClipboardOutline />}
        />
        <DropdownMenuItem
          name={projectId}
          icon={<IoPencil />}
          onClick={setShowProjectEditTrue}
          label="Edit"
        />
        <DropdownMenuItem
          name={projectId}
          icon={<IoTrash />}
          onClick={setShowProjectDeleteConfirmationTrue}
          label="Delete"
        />
      </DropdownMenu>
      {showProjectDetails && (
        <ProjectDetailModal
          onCloseButtonClick={setShowProjectDetailsFalse}
          className={styles.projectDetailModal}
          projectId={projectId}
        />
      )}
      {showProjectEdit && (
        <ProjectFormModal
          onSubmitSuccess={onProjectFormSubmitSuccess}
          onCloseButtonClick={setShowProjectEditFalse}
          className={styles.projectFormModal}
          projectId={projectId}
        />
      )}
      {showProjectDeleteConfirmation && (
        <ConfirmModal
          title={strings.threeWDeleteProject}
          message={strings.threeWDeleteProjectMessage}
          onClose={handleDeleteProjectConfirmModalClose}
        />
      )}
    </>
  );
}

export default ProjectTableActions;
