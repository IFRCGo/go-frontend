
import React from 'react';
import { Link } from 'react-router-dom';
import { environment } from '#config';
import { PropTypes } from 'prop-types';

import { formatDate, percent, round, commaSeparatedNumber as n } from '#utils/format';
import FormattedNumber from '#components/formatted-number';
import Tooltip from '#components/common/tooltip';
import Progress from './../progress-labeled';
import Translate from '#components/Translate';

const OperationCard = ({
  operationId,
  operationName,
  appeals,
  lastUpdate,
  showFollow,
  isFollowing,
  followOperation,
  unfollowOperation,
  countryList,
  activeDeployment,
}) => {
  const beneficiaries = appeals.reduce((acc, curr) => acc + curr.num_beneficiaries, 0);
  const requested = appeals.reduce((acc, curr) => acc + Number(curr.amount_requested), 0);
  const funded = appeals.reduce((acc, curr) => acc + Number(curr.amount_funded), 0);

  function toggleFollow (event) {
    event.preventDefault();
    if (isFollowing) {
      unfollowOperation(operationId);
    } else {
      followOperation(operationId);
    }
  }

  return (
    <div className='key-emergencies-item col col-6-sm col-4-mid' key={operationId}>
      <Link to={`/emergencies/${operationId}`}>
        <div className="card_box card_box_left card_box_title">
          <div className='row flex'>
            <div className='card__title__wrap col col-7 col-8-mid'>
              <h2 className='card__title'>
                <Tooltip title={operationName} />
                {operationName?.length > 60 ? operationName?.slice(0, 60) + '...' : operationName}
              </h2>
            </div>
            {showFollow ? (
              <div className='button--key-emergencies__wrap col col-5 col-4-mid'>
                <div onClick={toggleFollow} className={`button button--capsule button--xsmall button--key-emergencies ${isFollowing ? 'button--primary-filled' : 'button--primary-bounded'}`}>
                  {
                    isFollowing ? (
                      <Translate stringId='operationCardFollowing' />
                    ) : (
                      <Translate stringId='operationCardFollow' />
                    )
                  }
                </div>
              </div>
            ) : null
            }
          </div>
          <small className='last_updated'>
            <Translate stringId='operationCardLastUpdated'/>
            &nbsp;
            {formatDate(lastUpdate)}
          </small>
        </div>

        <div className='card_box_container card_box_container--op'>
          <div className='card_box card_box_left card_box--op'>
            <div className="card_box_no">
              <FormattedNumber
                className='tc-value'
                value={beneficiaries}
                normalize
                fixedTo={1}
              />
            </div>
            <span className='affected_population_icon'></span>
            <small className='heading-tiny'>
              <Translate stringId='operationCardTargetedPopulation' />
            </small>
          </div>
          <div className='card_box card_box_left card_box--op'>
            <div className="card_box_no">
              <FormattedNumber
                className='tc-value'
                value={beneficiaries}
                normalize
                fixedTo={1}
              />
            </div>
            <small className='heading-tiny'>
              <Translate stringId='operationCardFunding'/>
            </small>
            <Progress value={requested ? percent(funded, requested) : percent(0.1, 10)} max={100} />
            <div className='card_box_full card_box_container card_box_container--op'>
              <div className="heading-tiny-progress">
                <div className="card_box_fc">{requested ? round(percent(funded, requested)) : 0}%</div>
                <Translate stringId='operationCardFundingCoverage' />
              </div>
            </div>
          </div>
        </div>

        <div className='card_box_container card_box_container--op'>
          <div className='card_box card_box_left card_box--op'>
            <div className="card_box_no">
              <FormattedNumber
                className='tc-value'
                value={activeDeployment}
                normalize
                fixedTo={1}
              />
            </div>
            <small className='heading-tiny'>
              <Translate stringId='operationCardIFRCSurgePersonnel' />
            </small>
          </div>
          <div className='card_box card_box_left card_box--op'>
            <span className='deployed_personnel_icon'></span>
            <div className="card_box_no">
              <FormattedNumber
                className='tc-value'
                value={countryList}
                normalize
                fixedTo={1}
              />
            </div>
            <small className='heading-tiny'>
              <Translate stringId='operationCardNSReportingActivities'/>
            </small>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OperationCard;

if (environment !== 'production') {
  OperationCard.propTypes = {
    operationId: PropTypes.number,
    showFollow: PropTypes.bool,
    isFollowing: PropTypes.bool,
    followOperation: PropTypes.func,
    unfollowOperation: PropTypes.func,
    operationName: PropTypes.string,
    emergencyDeployments: PropTypes.shape({
      deployedErus: PropTypes.number,
      deployedPersonnel: PropTypes.number,
    }),
    lastUpdate: PropTypes.string,
    appeals: PropTypes.array,
    countryList: PropTypes.number,
    activeDeployment: PropTypes.number,
  };
}
