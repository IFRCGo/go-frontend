import React from 'react';
import { Link } from 'react-router-dom';
import { environment } from '#config';
import { PropTypes } from 'prop-types';
import { formatDate, percent, round, commaSeparatedNumber as n } from '#utils/format';
import Progress from './../progress-labeled';

const OperationCard = ({operationId, operationName, emergencyDeployments, appeals, lastUpdate}) => {
  const beneficiaries = appeals.reduce((acc, curr) => acc + curr.num_beneficiaries, 0);
  const requested = appeals.reduce((acc, curr) => acc + Number(curr.amount_requested), 0);
  const funded = appeals.reduce((acc, curr) => acc + Number(curr.amount_funded), 0);

  return (
    <div className='key-emergencies-item' key={operationId}>
      <Link to={`/emergencies/${operationId}`}>
        <div className="card_box card_box_left">
          <h2 className='card__title'>{ operationName.length > 30 ? operationName.slice(0, 30) + '...' : operationName }</h2>
          <small className='last_updated'>Last updated: {formatDate(lastUpdate)}</small>
        </div>

        <div className='card_box_container card_box_container--op'>
          <div className='card_box card_box_left card_box--op'>
            <div className="card_box_no">{beneficiaries && beneficiaries !== 0 ? n(beneficiaries) : '--'}</div>
            <span className='affected_population_icon'></span>
            <small className='heading-tiny'>Targeted Population</small>
          </div>
          <div className='card_box card_box_left card_box--op'>
            <span className='affected_population_icon'></span>
            <div className="card_box_no">{n(emergencyDeployments.deployedErus)}</div>
            <small className='heading-tiny'>Deployed Emergency Response Units</small>
          </div>
        </div>

        <div className='card_box_container card_box_container--op'>
          <div className='card_box card_box_left card_box--op'>
            <div className="card_box_no">{requested && requested !== 0 ? `${n(requested)} CHF` : '--'}</div>
            <small className='heading-tiny'>Funding Requirements</small>
          </div>
          <div className='card_box card_box_left card_box--op'>
            <span className='deployed_personnel_icon'></span>
            <div className="card_box_no">{n(emergencyDeployments.deployedPersonnel)}</div>
            <small className='heading-tiny'>Deployed Surge Personnel</small>
          </div>
        </div>

        <div className='card_box_full card_box_container card_box_container--op'>
          <div className="heading-tiny">Funding Coverage</div>
          <div className="card_box_fc">{requested ? round(percent(funded, requested)) : 0}%</div>
        </div>
        <div className="card_box_footer">
          <Progress value={requested ? percent(funded, requested) : percent(0.1, 10)} max={100} />
        </div>
      </Link>
    </div>
  );
};

export default OperationCard;

if (environment !== 'production') {
  OperationCard.propTypes = {
    operationId: PropTypes.number,
    operationName: PropTypes.string,
    emergencyDeployments: PropTypes.shape({
      deployedErus: PropTypes.number,
      deployedPersonnel: PropTypes.number,
    }),
    lastUpdate: PropTypes.string,
    appeals: PropTypes.array,

  };
}
