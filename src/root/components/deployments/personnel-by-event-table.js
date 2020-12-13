import React from 'react';
import ErrorPanel from '#components/error-panel';
import LanguageContext from '#root/languageContext';


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

}

export default PersonnelByEventTable;
