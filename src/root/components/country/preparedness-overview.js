import React, { useContext, useMemo } from 'react';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Fold from '#components/fold';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import ErrorPanel from '#components/error-panel';

function PreparednessOverview (props) {
  const { strings } = useContext(LanguageContext);

  const phase = useMemo(() => {
    if (props.getPerNsPhase.data?.results) {
      return props.getPerNsPhase.data.results[0].phase;
    }
    return 0;
  }, [props.getPerNsPhase]);

  let hasData = true;
  const NO_DATA = '--';

  if (!props.getPerNsPhase.fetched || !props.perOverviewForm.fetched || !props.user.username) {
    hasData = false;
  }

  const ovCount = props.perOverviewForm.data?.count || 0;
  if (phase === 0 && ovCount === 0) {
    hasData = false;
  }

  let ov = null;
  let tickIcons = [];
  if (hasData) {
    ov = props.perOverviewForm.data.results[0];
    
    for (let i = 0; i < phase; i++) {
      tickIcons.push(<p key={`phase${i}`}>
        <img src='/assets/graphics/layout/tick.png' alt='phase ticked' className='tick-icon' />
      </p>);
    }
  }

  return !hasData
    ? (
      <div className='container-lg'>
        <ErrorPanel title={strings.countryPreparednessTitle} errorMessage={strings.noDataMessage} />
        </div>
    )
    : (
      <Fold title={strings.preparednessOverviewTitle} foldWrapperClass='fold--main' foldTitleClass='margin-reset'>
        <div className='flex-sm text-uppercase'>
          <div className='col-2-sm'>
            <Translate stringId='preparednessOverviewCurrent'/>
          </div>
          <div className='col-2-sm text-bold'>
            <div className='flex-sm'>
              <div className='col-10-sm'>
                <p><Translate stringId='preparednessOverviewOrientation'/></p>
                <p><Translate stringId='preparednessOverviewAssessment'/></p>
                <p><Translate stringId='preparednessOverviewPrioritization'/></p>
                <p><Translate stringId='preparednessOverviewPlanAction'/></p>
                <p><Translate stringId='preparednessOverviewAction'/></p>
              </div>
              <div className='col-2-sm'>
                { tickIcons }
              </div>
            </div>
          </div>
          { ov
            ? (
              <React.Fragment>
                <div className='col-2-sm'>
                  <p><Translate stringId='preparednessOverviewAssessmentDate'/></p>
                  <p><Translate stringId='preparednessOverviewPerProcessType'/></p>
                  <p><Translate stringId='preparednessOverviewCycle'/></p>
                </div>
                <div className='col-2-sm text-bold'>
                  <p>{ov.date_of_assessment.substring(0, 10)}</p>
                  <p>{ov.type_of_assessment?.name}</p>
                  <p>{ov.assessment_number}</p>
                </div>
                <div className='col-2-sm'>
                  <p><Translate stringId='overviewFormFocalPoint'/></p>
                  <p><Translate stringId='overviewFormFocalPointEmail'/></p>
                  <p><Translate stringId='overviewFormPartnerFocalPoint'/></p>
                  <p><Translate stringId='overviewFormPartnerFocalPointEmail'/></p>
                </div>
                <div className='col-2-sm text-bold'>
                  <p>{ov.ns_focal_point_name || NO_DATA}</p>
                  <p>{ov.ns_focal_point_email || NO_DATA}</p>
                  <p>{ov.partner_focal_point_name || NO_DATA}</p>
                  <p>{ov.partner_focal_point_email || NO_DATA}</p>
                </div>
              </React.Fragment>
            ) : null }
        </div>

        <div className='text-center'>
          {/* <div style={{float: 'left', width: '50%'}}>
            <a href='https://dsgocdnapi.azureedge.net/admin/per/nsphase/' target='_blank' className='button button--medium button--primary-filled'>Set phase</a>
          </div> */}
          <a href='mailto:PER.Team@ifrc.org' className='button button--medium button--primary-filled'>
            <Translate stringId="preparednessOverviewContactLabel" />
          </a>
        </div>
      </Fold>
    );
}

if (environment !== 'production') {
  PreparednessOverview.propTypes = {
    getPerNsPhase: T.object,
    perOverviewForm: T.object,
    user: T.object
  };
}

const selector = (state) => ({
  user: state.user.data
});

export default withRouter(connect(selector)(PreparednessOverview));
