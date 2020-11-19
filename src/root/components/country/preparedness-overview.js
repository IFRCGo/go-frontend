import React from 'react';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPerProcessType } from '#utils/get-per-process-type';
import Fold from './../fold';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import { getFullMonthNameList } from '#utils/utils';

// FIXME: FIX ME
class PreparednessOverview extends React.Component {
  render () {
    const NO_DATA = '--';
    const { strings } = this.context;
    if (!this.props.getPerNsPhase.fetched || !this.props.perOverviewForm.fetched || !this.props.user.username) return null;
    if (typeof this.props.getPerNsPhase.data.results !== 'undefined' && this.props.getPerNsPhase.data.results[0].phase === 0 &&
      typeof this.props.perOverviewForm.data.count !== 'undefined' && this.props.perOverviewForm.data.count === 0) return null;

    const months = getFullMonthNameList(strings);

    const phase = {phase: this.props.getPerNsPhase.data.results[0].phase};
    const overviewForm = this.props.perOverviewForm.data.results[0];
    const dateOfAssessment = typeof overviewForm !== 'undefined' ? new Date(overviewForm.date_of_current_capacity_assessment.substring(0, 10)) : null;
    const dateOfAssessmentString = dateOfAssessment !== null ? months[dateOfAssessment.getMonth()] + ' ' + dateOfAssessment.getFullYear() : NO_DATA;
    const perProcessTypeString = typeof overviewForm !== 'undefined' ? getPerProcessType(overviewForm.type_of_capacity_assessment) : NO_DATA;
    const focusString = typeof overviewForm !== 'undefined' ? overviewForm.focus : NO_DATA;
    const focalPointNameString = typeof overviewForm !== 'undefined' ? overviewForm.focal_point_name : NO_DATA;
    const focalPointEmailString = typeof overviewForm !== 'undefined' ? overviewForm.focal_point_email : NO_DATA;
    return (
      <section className='inpage'>
      <div className='container-full'>
        <section className='inpage__body'>
          <div className='inner'>
            <Fold id='per' title={strings.preparednessOverviewTitle} foldWrapperClass='fold--main float-left' foldTitleClass='margin-reset'>
              <div style={{float: 'left', width: '33%'}}>

                <div style={{float: 'left', width: '30%', textTransform: 'uppercase', fontSize: '13px'}}>
                  <div style={{marginBottom: '5px'}}>
                    <Translate stringId='preparednessOverviewCurrent'/>
                  </div>
                  <div style={{marginBottom: '5px'}}>
                    <Translate stringId='preparednessOverviewProcessPhase'/>
                  </div>
                </div>
                <div style={{float: 'left', width: '70%'}}>
                  <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                    <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                      <Translate stringId='preparednessOverviewOrientation'/>
                    </div>
                    <div style={{width: '20%', float: 'left'}}>
                      {phase.phase > 0 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
                    </div>
                  </div>

                  <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                    <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                      <Translate stringId='preparednessOverviewAssessment'/>
                    </div>
                    <div style={{width: '20%', float: 'left'}}>
                      {phase.phase > 1 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
                    </div>
                  </div>

                  <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                    <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                      <Translate stringId='preparednessOverviewPrioritization'/>
                    </div>
                    <div style={{width: '20%', float: 'left'}}>
                      {phase.phase > 2 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
                    </div>
                  </div>

                  <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                    <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                      <Translate stringId='preparednessOverviewPlanAction'/>
                    </div>
                    <div style={{width: '20%', float: 'left'}}>
                      {phase.phase > 3 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
                    </div>
                  </div>

                  <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                    <div style={{width: '80%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                      <Translate stringId='preparednessOverviewAction'/>
                    </div>
                    <div style={{width: '20%', float: 'left'}}>
                      {phase.phase > 4 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' style={{width: '10px', height: '10px'}} /> : null}
                    </div>
                  </div>
                </div>

              </div>
              <div style={{float: 'left', width: '34%'}}>

                <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontSize: '13px'}}>
                  <div style={{marginBottom: '5px'}}>
                    <Translate stringId='preparednessOverviewAssessmentDate'/>
                  </div>
                  <div style={{marginBottom: '5px'}}>
                    <Translate stringId='preparednessOverviewPerProcessType'/>
                  </div>
                  <div style={{marginBottom: '5px'}}>
                    <Translate stringId='preparednessOverviewFocus'/>
                  </div>
                </div>
                <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px'}}>
                  <div style={{marginBottom: '5px'}}>{dateOfAssessmentString}</div>
                  <div style={{marginBottom: '5px'}}>{perProcessTypeString}</div>
                  <div style={{marginBottom: '5px'}}>{focusString}</div>
                </div>

              </div>
              <div style={{float: 'left', width: '33%'}}>

                <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontSize: '13px'}}>
                  <div style={{marginBottom: '5px'}}>
                    <Translate stringId='preparednessOverviewFocalPoint'/>
                  </div>
                  <div style={{marginBottom: '5px'}}>
                    <Translate stringId='preparednessOverviewEmail'/>
                  </div>
                </div>
                <div style={{width: '50%', float: 'left', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px', overflowWrap: 'break-word'}}>
                  <div style={{marginBottom: '5px'}}>{focalPointNameString}</div>
                  <div style={{marginBottom: '5px'}}>{focalPointEmailString}</div>
                </div>
              </div>

              <div style={{float: 'left', width: '100%', textAlign: 'center', marginTop: '25px'}}>
                {/* <div style={{float: 'left', width: '50%'}}>
                  <a href='https://dsgocdnapi.azureedge.net/admin/per/nsphase/' target='_blank' className='button button--medium button--primary-filled'>Set phase</a>
                </div> */}
                <div style={{float: 'left', width: '50%'}}>
                  <a href='mailto:PER.Team@ifrc.org' className='button button--medium button--primary-filled'>
                    <Translate stringId="preparednessOverviewContactLabel" />
                  </a>
                </div>
              </div>
            </Fold>
          </div>
        </section>
      </div>
      </section>
    );
  }
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

const dispatcher = (dispatch) => ({
  _test: (...args) => dispatch('test')
});

PreparednessOverview.contextType = LanguageContext;
export default withRouter(connect(selector, dispatcher)(PreparednessOverview));
