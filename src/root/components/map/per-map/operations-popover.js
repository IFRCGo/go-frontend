
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { getPerProcessType } from '#utils/get-per-process-type';
// import { commaSeparatedNumber as n } from '#utils/format';
// import { DateTime } from 'luxon';
// import { get } from '#utils/utils';
import React from 'react';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class OperationsPopover extends React.Component {
  render () {
    const { pageId, navigate, title, onCloseClick, deployments, phase, overviewData } = this.props;
    const filteredOverviewData = overviewData.data.results.filter(overview => overview.country.id === parseInt(pageId));
    const { strings } = this.context;
    return (
      <article className='popover'>
        <div className='popover__contents__preparedness'>
          <header className='popover__header'>
            <div className='popover__headline'>
              {deployments ? title : <a className='link--primary' onClick={e => { e.preventDefault(); navigate(`/countries/${pageId}#per`); }}>{title}</a>}
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li>
                  <button type='button' className='actions__menu-item poa-xmark' title={strings.operationsPopoverClose} onClick={onCloseClick}>
                    <span>
                      <Translate stringId='operationsPopoverDismiss'/>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </header>
          <div className='popover__body'>
            <div style={{width: '50%', float: 'left', fontWeight: 'bold', marginBottom: '10px'}}>
              <Translate stringId='operationsPopoverCurrentPerPhase'/>
            </div>
            <div style={{width: '50%', float: 'left', fontWeight: 'bold', marginBottom: '10px'}}>
              <Translate stringId='operationsPopoverCurrentPerPhase'/>
            </div>
            <div style={{width: '50%', float: 'left'}}>
              <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                <div style={{width: '20%', float: 'left'}}>
                  {phase.phase > 0 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' /> : null}
                  &nbsp;
                </div>
                <div style={{width: '80%', float: 'left'}}>
                  <Translate stringId='operationsPopoverOrientation'/>
                </div>
              </div>

              <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                <div style={{width: '20%', float: 'left'}}>
                  {phase.phase > 1 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' /> : null}
                  &nbsp;
                </div>
                <div style={{width: '80%', float: 'left'}}>
                  <Translate stringId='operationsPopoverAssessment'/>
                </div>
              </div>

              <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                <div style={{width: '20%', float: 'left'}}>
                  {phase.phase > 2 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' /> : null}
                  &nbsp;
                </div>
                <div style={{width: '80%', float: 'left'}}>
                  <Translate stringId='operationsPopoverPrioritization'/>
                </div>
              </div>

              <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                <div style={{minWidth: '20%', width: '20%', float: 'left'}}>
                  {phase.phase > 3 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' /> : null}
                  &nbsp;
                </div>
                <div style={{width: '80%', float: 'left'}}>
                  <Translate stringId='operationsPopoverPlan'/>
                </div>
              </div>

              <div style={{marginBottom: '5px', float: 'left', width: '100%'}}>
                <div style={{width: '20%', float: 'left'}}>
                  {phase.phase > 4 ? <img src='/assets/graphics/layout/tick.png' alt='phase ticked' /> : null}
                  &nbsp;
                </div>
                <div style={{width: '80%', float: 'left'}}>
                  <Translate stringId='operationsPopoverAction'/>
                </div>
              </div>
            </div>
            <div style={{width: '50%', float: 'left'}}>
              {
                !overviewData.fetched || filteredOverviewData.length === 0
                  ? (
                    <React.Fragment>
                      <div style={{marginBottom: '10px'}}>
                        <Translate stringId='operationsPopoverNoData'/>
                      </div>
                      <div style={{fontWeight: 'bold', marginBottom: '10px'}}>
                        <Translate stringId='operationsPopoverDate'/>
                      </div>
                      <div>
                        <Translate stringId='operationsPopoverNoData'/>
                      </div>
                    </React.Fragment>)
                  : (<React.Fragment>
                    <div style={{marginBottom: '10px'}}>{ getPerProcessType(filteredOverviewData[0].type_of_capacity_assessment) }</div>
                    <div style={{fontWeight: 'bold', marginBottom: '10px'}}>
                      <Translate stringId='operationsPopoverDate'/>
                    </div>
                    <div>{filteredOverviewData[0].date_of_current_capacity_assessment.substring(0, 10)}</div>
                  </React.Fragment>)
              }
            </div>
          </div>
        </div>
      </article>
    );
  }
}

if (environment !== 'production') {
  OperationsPopover.propTypes = {
    onCloseClick: T.func,
    phase: T.object,
    title: T.string,
    pageId: T.number,
    operations: T.array,
    deployments: T.array,
    navigate: T.func,
    overviewData: T.object
  };
}
OperationsPopover.contextType = LanguageContext;
export default OperationsPopover;
