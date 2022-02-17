import React, { lazy } from 'react';
import { withRouter } from 'react-router-dom';
import { withLanguage } from '#root/languageContext';
import { useRequest } from '#utils/restRequest';

const Emergency = lazy(() => import('../views/emergency'));

function EmergencyWrapper(props) {
  const { pending, response } = useRequest({url: 'api/v2/event/' + props.match.params.slug});
  if (!pending && response) {
    props.match.params.id = response.id;
  }
  return !pending && response ? <Emergency/> : <></>;
}

export default withLanguage(withRouter(EmergencyWrapper));
