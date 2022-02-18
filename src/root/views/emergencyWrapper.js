import React, { lazy } from 'react';
import { withRouter } from 'react-router-dom';
import { withLanguage } from '#root/languageContext';
import { useRequest } from '#utils/restRequest';
import Translate from '#components/Translate';

const Emergency = lazy(() => import('../views/emergency'));

function EmergencyWrapper(props) {
  const { pending, response } = useRequest({url: 'api/v2/event/' + props.match.params.slug});
  if (!pending && response) {
    props.match.params.id = response.id;
  }
  return !pending && response ?
    <Emergency/> :
    <div className='container-mid'><br/>
    <Translate stringId='fieldReportFormActionDataLoadingMessage'/></div>;
    // instead of uhohPageDescription ^ FIXME
}

export default withLanguage(withRouter(EmergencyWrapper));
