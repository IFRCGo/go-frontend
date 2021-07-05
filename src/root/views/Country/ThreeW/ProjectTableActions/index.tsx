import React from 'react';
import url from 'url';
import {
  MdContentCopy,
  MdSearch,
  MdEdit,
  MdHistory,
  MdDeleteForever,
  MdMoreHoriz,
} from 'react-icons/md';

import { useLazyRequest } from '#utils/restRequest';
import Button from '#components/Button';
import GlobalLoading from '#components/NewGlobalLoading';
import DropdownMenu from '#components/dropdown-menu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import LanguageContext from '#root/languageContext';
import ConfirmModal from '#components/confirm-modal';
import { transformResponseFieldsToFormFields } from '#components/ThreeWForm/useThreeWOptions';
import useBooleanState from '#hooks/useBooleanState';
import useAlert from '#hooks/useAlert';
import { adminUrl } from '#config';
import { Project } from '#types';

import ProjectFormModal from '../ProjectFormModal';
import ProjectDetailModal from '../ProjectDetailModal';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  onProjectFormSubmitSuccess?: () => void;
  onProjectDeletionSuccess?: () => void;
  project: Project;
}

function ProjectTableActions(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const alert = useAlert();
  const {
    className,
    project,
    onProjectFormSubmitSuccess,
    onProjectDeletionSuccess,
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
    showDuplicateProject,
    setShowDuplicateProjectTrue,
    setShowDuplicateProjectFalse,
  ] = useBooleanState(false);

  const [
    showProjectDeleteConfirmation,
    setShowProjectDeleteConfirmationTrue,
    setShowProjectDeleteConfirmationFalse,
  ] = useBooleanState(false);

  const projectFormFields = React.useMemo(() => (
    transformResponseFieldsToFormFields(project)
  ), [project]);

  const {
    pending: projectDeletionPending,
    trigger: requestProjectDeletion,
  } = useLazyRequest({
    url: `api/v2/project/${project.id}/`,
    method: 'DELETE',
    body: ctx => ctx,
    onSuccess: onProjectDeletionSuccess,
    onFailure: ({ value: { messageForNotification, errors }}) => {
      console.error(errors);
      alert.show(
        'Failed to delete the project',
        { variant: 'danger', }
      );
    },
  });

  const handleDeleteProjectConfirmModalClose = React.useCallback((ok: boolean) => {
    setShowProjectDeleteConfirmationFalse();
    if (ok) {
      requestProjectDeletion(null);
    }
  }, [requestProjectDeletion, setShowProjectDeleteConfirmationFalse]);

  const handleEditProjectButtonClick = React.useCallback(() => {
    setShowProjectDetailsFalse();
    setShowProjectEditTrue();
  }, [setShowProjectDetailsFalse, setShowProjectEditTrue]);

  return (
    <>
      {projectDeletionPending && <GlobalLoading />}
      <DropdownMenu
        className={className}
        label={<MdMoreHoriz className={styles.overflowIcon} />}
      >
        <DropdownMenuItem
          onClick={setShowProjectDetailsTrue}
          label={strings.projectListTableViewDetails}
          icon={<MdSearch />}
        />
        <DropdownMenuItem
          icon={<MdEdit />}
          onClick={setShowProjectEditTrue}
          label={strings.projectListTableEdit}
        />
        <DropdownMenuItem
          icon={<MdContentCopy />}
          onClick={setShowDuplicateProjectTrue}
          label={strings.projectListTableDuplicate}
        />
        <DropdownMenuItem
          icon={<MdHistory />}
          label={strings.projectListTableHistory}
          href={url.resolve(adminUrl, `deployments/project/${project.id}/history/`)}
        />
        <hr className={styles.optionsSeparator} />
        <DropdownMenuItem
          className={styles.deleteOption}
          icon={<MdDeleteForever />}
          onClick={setShowProjectDeleteConfirmationTrue}
          label={strings.projectListTableDelete}
        />
      </DropdownMenu>
      {showProjectDetails && (
        <ProjectDetailModal
          onCloseButtonClick={setShowProjectDetailsFalse}
          className={styles.projectDetailModal}
          projectId={project.id}
          headerActions={(
            <Button
              variant="primary"
              onClick={handleEditProjectButtonClick}
            >
              {strings.projectListTableEdit}
            </Button>
          )}
        />
      )}
      {showProjectEdit && (
        <ProjectFormModal
          onSubmitSuccess={onProjectFormSubmitSuccess}
          onCloseButtonClick={setShowProjectEditFalse}
          className={styles.projectFormModal}
          projectId={project.id}
        />
      )}
      {showDuplicateProject && (
        <ProjectFormModal
          onSubmitSuccess={onProjectFormSubmitSuccess}
          onCloseButtonClick={setShowDuplicateProjectFalse}
          className={styles.projectFormModal}
          initialValue={projectFormFields}
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
