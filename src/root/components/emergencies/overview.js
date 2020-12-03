import React from 'react';
import LanguageContext from '#root/languageContext';
import { formatDate, yesno } from '#utils/format';

function EmergencyOverview(props) {
  const { strings } = React.useContext(LanguageContext);
  const { data, disasterTypes } = props;
  const severityLevelToClass = {
    0: 'low',
    1: 'mid',
    2: 'high'
  };
  const severityClass = severityLevelToClass[data.ifrc_severity_level];
  const disasterType = disasterTypes.hasOwnProperty(data.dtype) ? disasterTypes[data.dtype] : '';
  const hasFieldReports = data.field_reports.length > 0;
  const firstFieldReport = hasFieldReports ? data.field_reports[0] : null;
  return (
    <div className='container-mid'>
      <div className='box__global emergency__overview'>
        <div className='heading__title heading__title--emergency'>{strings.emergencyOverviewBoxTitle}</div>
          <div className='row-sm flex'>
            <div className='col-sm col-12 col-6-sm'>
              <div className='flex row emergency__overview-row'>
                <div className='col emergency__overview-col-cat'>{strings.emergencyDisasterCat}</div>
                <div className='col emergency__overview-col-desc'>
                  <div className='state-block row-sm'>
                    <div className='col-sm'>
                      <div className='state-name'>{data.ifrc_severity_level_display}</div>
                    </div>
                    <div className='col-sm'>
                      <div className={`state state--severity-${severityClass}`}></div>
                    </div>
                  </div>
                </div>
              </div> 

              <div className='flex row emergency__overview-row'>
                <div className='col emergency__overview-col-cat'>{strings.emergencyDisasterType}</div>
                <div className='col emergency__overview-col-desc'>
                  <div className='emergency__overview-desc'>
                    {disasterType}
                  </div>
                </div>
              </div> 

              <div className='flex row emergency__overview-row'>
                <div className='col emergency__overview-col-cat'>{strings.globalStartDate}</div>
                <div className='col emergency__overview-col-desc'>
                  <div className='emergency__overview-desc'>
                    {formatDate(data.disaster_start_date)}
                  </div>
                </div>
              </div> 
            </div>
            <div className='col-sm col-12 col-6-sm'>
              <div className='flex row emergency__overview-row'>
                <div className='col emergency__overview-col-cat'>{strings.emergencyGovtReqIntlAsst}</div>
                <div className='col emergency__overview-col-desc'>
                  <div className='emergency__overview-desc'>
                    { hasFieldReports ? yesno(firstFieldReport.request_assistance) : '-' }
                  </div>
                </div>
              </div> 

              <div className='flex row emergency__overview-row'>
                <div className='col emergency__overview-col-cat'>{strings.emergencyNSReqIntlAsst}</div>
                <div className='col emergency__overview-col-desc'>
                  <div className='emergency__overview-desc'>
                    { hasFieldReports ? yesno(firstFieldReport.ns_request_assistance) : '-' }
                  </div>
                </div>
              </div> 
            </div>
          </div>
      </div>
    </div>
  );
}

export default EmergencyOverview;