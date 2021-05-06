import React from 'react';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';
import _cs from 'classnames';

import { getResultsFromResponse } from '#utils/request';
import { convertJsonToCsv } from '#utils/utils';
import { getRegionalProjects as getRegionalProjectsAction } from '#actions';
import { regionalProjectsSelector } from '#selectors';

import exportHeaders from '../ThreeW/export-headers';
import Translate from '#components/Translate';

function ExportButton (p) {
  const {
    regionId,
    filters,
    getRegionalProjects,
    projectsResponse,
  } = p;

  const [shouldStartRequest, setShouldStartRequest] = React.useState(false);

  React.useEffect(() => {
    if (shouldStartRequest) {
      getRegionalProjects(regionId, filters);
      setShouldStartRequest(false);
    }
  }, [shouldStartRequest, regionId, filters, getRegionalProjects]);

  const [
    pending,
    requestComplete,
    projectList,
  ] = React.useMemo(() => [
    projectsResponse.fetching,
    projectsResponse.fetched,
    getResultsFromResponse(projectsResponse),
  ], [projectsResponse]);

  React.useEffect(() => {
    if (!pending && requestComplete && projectList.length > 0) {
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
    }
  }, [pending, requestComplete, projectList]);

  const handleClick = React.useCallback(() => {
    setShouldStartRequest(true);
  }, [setShouldStartRequest]);

  return (
    <button
      onClick={handleClick}
      className={ _cs(
        'regional-export-button button button--secondary-bounded button--small',
        pending && 'disabled',
      )}
      disabled={pending}
    >
      <span className='f-icon-download font-size-sm spacing-half-r'></span>
      { pending ?
        <Translate stringId='exportButtonExporting'/> :
        <Translate stringId='exportButtonExport'/>
      }
    </button>
  );
}

const mapStateToProps = (state, props) => ({
  projectsResponse: regionalProjectsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getRegionalProjects: (...args) => dispatch(getRegionalProjectsAction(...args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportButton);
