import React from 'react';
import { Link } from 'react-router-dom';
import { environment } from '#config';
import { PropTypes } from 'prop-types';
import { formatDate, percent, round, commaSeparatedNumber as n } from '#utils/format';
import Progress from './../progress-labeled';
import Translate from '#components/Translate';

const OperationCard = ({operationId, operationName, emergencyDeployments, appeals, lastUpdate, showFollow, isFollowing, followOperation, unfollowOperation}) => {
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
        <div className="card_box card_box_left">
          <div className='row flex'>
            <div className='card__title__wrap col col-6 col-8-mid'>
              <h2 className='card__title truncated'>{operationName}</h2>
              <small className='last_updated'>
                <Translate stringId='operationCardLastUpdated'/>
                &nbsp;
                {formatDate(lastUpdate)}
              </small>
            </div>
            {showFollow ? (
              <div className='button--key-emergencies__wrap col col-6 col-4-mid'>  
                <div onClick={toggleFollow} className={`button button--capsule button--xsmall button--key-emergencies ${isFollowing ? 'button--primary-bounded' : 'button--primary-filled'}`}>
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
        </div>

        <div className='card_box_container card_box_container--op'>
          <div className='card_box card_box_left card_box--op'>
            <div className="card_box_no">{beneficiaries && beneficiaries !== 0 ? n(beneficiaries) : '--'}</div>
            <span className='affected_population_icon'></span>
            <small className='heading-tiny'>
              <Translate stringId='operationCardTargetedPopulation'/>
            </small>
          </div>
          <div className='card_box card_box_left card_box--op'>
            <span className='affected_population_icon'></span>
            <div className="card_box_no">{n(emergencyDeployments.deployedErus)}</div>
            <small className='heading-tiny'>
              <Translate stringId='operationCardDepoloyedUnits'/>
            </small>
          </div>
        </div>

        <div className='card_box_container card_box_container--op'>
          <div className='card_box card_box_left card_box--op'>
            <div className="card_box_no">{requested && requested !== 0 ? `${n(requested)}` : '--'}</div>
            <small className='heading-tiny'>
              <Translate stringId='operationCardFunding'/> (CHF)
            </small>
          </div>
          <div className='card_box card_box_left card_box--op'>
            <span className='deployed_personnel_icon'></span>
            <div className="card_box_no">{n(emergencyDeployments.deployedPersonnel)}</div>
            <small className='heading-tiny'>
              <Translate stringId='operationCardDeployed'/>
            </small>
          </div>
        </div>

        <div className="card_box_footer">
          <Progress value={requested ? percent(funded, requested) : percent(0.1, 10)} max={100} />
          <div className='card_box_full card_box_container card_box_container--op'>
            <div className="heading-tiny">
              <Translate stringId='operationCardFundingCoverage'/>
            </div>
            <div className="card_box_fc">{requested ? round(percent(funded, requested)) : 0}%</div>
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

  };
}
