import React from 'react';
import ErrorPanel from '#components/error-panel';
import LanguageContext from '#root/languageContext';
import Fold from '#components/fold';
import { Link } from 'react-router-dom';



function PersonnelByEventTable (props) {
  const {
    fetched,
    error,
    data
  } = props.data;
  const { strings } = React.useContext(LanguageContext);

  return (
    <Fold
      title={strings.deploymentsOverviewByEmergencies}
      foldWrapperClass="fold--main fold-deployments-overview-emergencies"
      navLink=<Link className='fold__title__link' to=''>{strings.deploymentsOverviewEmergenciesLink}</Link>>
      <table className='responsive-table table table--border-bottom table--box-shadow'>
        <thead>
          <th>
          {strings.deploymentsOverviewTableHeaderEmergency}
          </th>
          <th>
          {strings.deploymentsOverviewTableHeaderOrg}
          </th>
          <th>
          {strings.deploymentsOverviewTableHeaderSurge}
          </th>
          <th className='table__cell--deploy-emergency-no'>
          {strings.deploymentsOverviewTableHeaderNo}
          </th>
        </thead>
        <tbody>
          <tr>
            <td className='table__cell--deploy-emergency-name'><a className='link--table'>Philippines: Measles Outbreak</a></td>
            <td>Typhoon SIM</td>
            <td>Test</td>
            <td className='table__cell--deploy-emergency-no'>4</td>
          </tr>
          <tr>
            <td className='table__cell--deploy-emergency-name'><a className='link--table'>Mozambique: Operation 1</a></td>
            <td>Test Emergency - Non-Covid</td>
            <td>Assessment Coordinator, Volcano Eruption, Indonesia</td>
            <td className='table__cell--deploy-emergency-no'>9</td>
          </tr>
        </tbody>
      </table>
    </Fold>
  );

  /*if (!fetched || data.results?.length === 0) {
    return null;
  }

  if (error) {
    return (
      <ErrorPanel
        title={strings.deploymentsOverviewByEmergencies}
        errorMessage={strings.deploymentsOverviewError}
      />
    );
  }

  return (
    <div>
      {
        data.results.map(d => {
          return (
            <div>
              { d.name }
            </div>
          );
        })
      }
    </div>
  );
  */
}

export default PersonnelByEventTable;
