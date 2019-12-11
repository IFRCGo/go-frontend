import React from 'react';
import { get } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { environment } from '../../config';
import { PropTypes } from 'prop-types';
import { formatDate, percent, round, commaSeparatedNumber as n } from '../../utils/format';
import Progress from './../progress-labeled';

const OperationCard = ({operation, calculateDeployedPersonnel}) => {
  const { id, name } = operation;
  const appeals = get(operation, 'appeals', []);
  const beneficiaries = appeals.reduce((acc, curr) => acc + curr.num_beneficiaries, 0);
  const requested = appeals.reduce((acc, curr) => acc + Number(curr.amount_requested), 0);
  const funded = appeals.reduce((acc, curr) => acc + Number(curr.amount_funded), 0);
  const emergencyDeployments = calculateDeployedPersonnel(operation);

  return (
    <div className='key-emergencies-item' key={id}>
      <Link to={`/emergencies/${id}`}>
        <div className="card_box card_box_left">
          <h2 className='card__title'>{ name.length > 30 ? name.slice(0, 30) + '...' : name }</h2>
          <small className='last_updated'>Last updated: {formatDate(operation.updated_at)}</small>
        </div>

        <div className='card_box_container card_box_container--op'>
          <div className='card_box card_box_left card_box--op'>
            <div className="card_box_no">{n(beneficiaries)}</div>
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
            <div className="card_box_no">{requested !== null ? n(requested) : 0} CHF</div>
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
    operation: PropTypes.object,
    calculateDeployedPersonnel: PropTypes.func
  };
}
