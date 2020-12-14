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

  if (!fetched || data.results?.length === 0) {
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
    <Fold
      title={strings.deploymentsOverviewByEmergencies}
      foldWrapperClass="fold--main fold-deployments-overview-emergencies"
      navLink=<Link className='fold__title__link' to='/deployments/personnel/all'>{strings.deploymentsOverviewEmergenciesLink}</Link>>
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
          { data.results.map(d => (
            <tr>
              <td className='table__cell--deploy-emergency-name'>
                <Link to={`/emergencies/${d.id}`} className='link--table'>
                  { d.name }
                </Link>
              </td>
              <td>
                { d.organizations_from.join(', ') }
              </td>
              <td>
                {strings.deploymentsRapidResponse}
              </td>
              <td className='table__cell--deploy-emergency-no'>
                { d.personnel_count }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fold>
  );

  /*

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
