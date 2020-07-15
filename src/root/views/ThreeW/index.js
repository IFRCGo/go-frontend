import React, { useContext } from 'react';
import _cs from 'classnames';
import { saveAs } from 'file-saver';
import { connect } from 'react-redux';

import {
  deleteProject as deleteProjectAction,
  getMe as getMeAction,
  getProjects as getProjectsAction,
} from '#actions';

import {
  countryProjectSelector,
  meSelector,
  projectFormSelector,
  projectDeleteSelector,
} from '#selectors';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import ConfirmModal from '#components/confirm-modal';
import BlockLoading from '#components/block-loading';
import ExportableView from '#components/ExportableView';
import ExportContainer from '#components/ExportableView/ExportContainer';
import ExportButton from '#components/ExportableView/ExportButton';
import ExportHeader from '#components/ExportableView/ExportHeader';


import {
  getResultsFromResponse,
  getDataFromResponse,
} from '#utils/request';
import { convertJsonToCsv } from '#utils/utils';

import Summary from './stats/summary';
import SectorActivity from './stats/sector-activity';
import StatusOverview from './stats/status-overview';
import RegionOverview from './stats/region-overview';
import Filter from './filter';
import Table from './table';
import Map from './map';

import ProjectFormModal from './project-form-modal';
import ProjectDetails from './project-details';

import exportHeaders from './export-headers';

const exportProjects = (projectList) => {
  const resolveToValues = (headers, data) => {
    const resolvedValues = [];
    headers.forEach(header => {
      const el = header.modifier ? header.modifier(data) || '' : data[header.key] || '';
      resolvedValues.push(el);
    });
    return resolvedValues;
  };

  const csvHeaders = exportHeaders.map(d => d.title);
  const resolvedValueList = projectList.map(project => (
    resolveToValues(exportHeaders, project)
  ));

  const csv = convertJsonToCsv([
    csvHeaders,
    ...resolvedValueList,
  ]);

  const blob = new Blob([csv], { type: 'text/csv' });
  const timestamp = (new Date()).getTime();
  const fileName = `projects-export-${timestamp}.csv`;

  saveAs(blob, fileName);
};

function ThreeW (p) {
  const {
    countryId,
    projectListResponse,
    meResponse,
    projectFormResponse,
    deleteProjectResponse,
    getProjects,
    getMe,
    deleteProject,
  } = p;

  const prevProjectFormResponse = React.useRef(projectFormResponse);
  const prevDeleteProjectResponse = React.useRef(deleteProjectResponse);

  const pending = projectListResponse.fetching ||
    projectFormResponse.fetching ||
    deleteProjectResponse.fetching ||
    meResponse.fetching;

  const { strings } = useContext(LanguageContext);

  const projectList = React.useMemo(() => (
    getResultsFromResponse(projectListResponse)
  ), [projectListResponse]);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = React.useState(false);
  const [filters, setFilters] = React.useState({});
  const [showProjectFormModal, setShowProjectFormModal] = React.useState(false);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = React.useState(false);
  const [projectToEdit, setProjectToEdit] = React.useState(undefined);
  const [projectToShowDetails, setProjectToShowDetails] = React.useState(undefined);
  const [projectToDelete, setProjectToDelete] = React.useState(undefined);
  const [shouldRefetch, setShouldRefetch] = React.useState(false);

  React.useEffect(() => {
    const { fetching, error } = projectFormResponse;
    const { current: prevFetching } = prevProjectFormResponse;
    const projectFormRequestSuccess = (prevFetching && !fetching) && !error;

    if (projectFormRequestSuccess) {
      setShowProjectFormModal(false);
      setShouldRefetch(true);
    }
    prevProjectFormResponse.current = projectFormResponse;
  }, [projectFormResponse, setShowProjectFormModal, setShouldRefetch]);

  React.useEffect(() => {
    const { fetching, error } = deleteProjectResponse;
    const { current: prevFetching } = prevDeleteProjectResponse;
    const deleteProjectRequestSuccess = (prevFetching && !fetching) && !error;

    if (deleteProjectRequestSuccess) {
      setShouldRefetch(true);
    }
    prevDeleteProjectResponse.current = deleteProjectResponse;
  }, [deleteProjectResponse, setShowProjectFormModal, setShouldRefetch]);

  React.useEffect(() => {
    getMe();
  }, [getMe]);

  React.useEffect(() => {
    getProjects(countryId, filters);
  }, [countryId, getProjects, filters]);

  React.useEffect(() => {
    if (shouldRefetch) {
      getProjects(countryId, filters);
      setShouldRefetch(false);
    }
  }, [countryId, getProjects, filters, shouldRefetch, setShouldRefetch]);

  const isCountryAdmin = React.useMemo(() => {
    const userDetails = getDataFromResponse(meResponse);
    return userDetails && userDetails.id;
  }, [meResponse]);

  const handleExportButtonClick = React.useCallback(() => {
    exportProjects(projectList);
  }, [projectList]);

  const handleEditButtonClick = React.useCallback((project) => {
    setShowProjectFormModal(true);
    setProjectToEdit(project);
  }, [setShowProjectFormModal, setProjectToEdit]);

  const handleCloneButtonClick = React.useCallback((project) => {
    const {
      id,
      ...otherDetails
    } = project;

    setShowProjectFormModal(true);
    setProjectToEdit({ ...otherDetails });
  }, [setShowProjectFormModal, setProjectToEdit]);

  const handleDetailsButtonClick = React.useCallback((project) => {
    setShowProjectDetailsModal(true);
    setProjectToShowDetails(project);
  }, [setShowProjectDetailsModal, setProjectToShowDetails]);

  const handleDeleteButtonClick = React.useCallback((project) => {
    setShowDeleteConfirmationModal(true);
    setProjectToDelete(project);
  }, [setShowDeleteConfirmationModal, setProjectToDelete]);

  const handleDeleteProjectConfirmModalClose = React.useCallback((isOk) => {
    if (isOk && projectToDelete) {
      deleteProject(projectToDelete.id);
    }

    setShowDeleteConfirmationModal(false);
  }, [projectToDelete, deleteProject]);

  const handleAddButtonClick = React.useCallback(() => {
    setShowProjectFormModal(true);
  }, [setShowProjectFormModal]);

  const disabled = pending;
  const shouldDisableExportButton = disabled || !projectList || projectList.length === 0;

  return (
    <div className='three-w-container'>
      { pending && (
        <BlockLoading />
      )}
      <header className='fold__header__block'>
        <h2 className='fold__title fold__title--inline'>
          <Translate
            stringId="rcActivities"
          />
        </h2>
        <div className='fold__title__linkwrap'>
          { isCountryAdmin && (
            <button
              className={_cs(
                'add-button button button--primary-bounded',
                disabled && 'disabled',
              )}
              onClick={handleAddButtonClick}
              disabled={disabled}
            >
              <Translate stringId="threeWAdd" />
            </button>
          )}
          <button
            className={_cs(
              'export-button button button--secondary-bounded',
              shouldDisableExportButton && 'disabled',
            )}
            onClick={handleExportButtonClick}
            disabled={shouldDisableExportButton}
          >
            <Translate stringId="threeWExport" />
          </button>
        </div>
      </header>
      <div className='content'>
        <Filter
          projectList={projectList}
          className='three-w-filters row-sm'
          onFilterChange={setFilters}
        />
        <div className="three-w-map-vis">
          <div className='three-w-map-container'>
            <Map
              countryId={countryId}
              projectList={projectList}
            />
            <RegionOverview
              projectList={projectList}
            />
          </div>
          <div className='three-w-map-bottom-details'>
            <Summary projectList={projectList} />
            <SectorActivity projectList={projectList} />
            <StatusOverview projectList={projectList} />
          </div>
        </div>
        <div className='three-w-project-list-table-container'>
          <Table
            projectList={projectList}
            onEditButtonClick={handleEditButtonClick}
            onCloneButtonClick={handleCloneButtonClick}
            onDetailsButtonClick={handleDetailsButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
            isCountryAdmin={isCountryAdmin}
          />
        </div>
      </div>
      { showDeleteConfirmationModal && (
        <ConfirmModal
          title={strings.threeWDeleteProject}
          message={strings.threeWDeleteProjectMessage}
          onClose={handleDeleteProjectConfirmModalClose}
        />
      )}
      { showProjectFormModal && (
        <ProjectFormModal
          countryId={countryId}
          projectData={projectToEdit}
          onCloseButtonClick={() => { setShowProjectFormModal(false); }}
        />
      )}
      { showProjectDetailsModal && (
        <ProjectDetails
          onCloseButtonClick={() => { setShowProjectDetailsModal(false); }}
          data={projectToShowDetails}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  projectListResponse: countryProjectSelector(state, props.countryId),
  meResponse: meSelector(state),
  deleteProjectResponse: projectDeleteSelector(state),
  projectFormResponse: projectFormSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getProjects: (...args) => dispatch(getProjectsAction(...args)),
  getMe: (...args) => dispatch(getMeAction(...args)),
  deleteProject: (...args) => dispatch(deleteProjectAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(ThreeW));
