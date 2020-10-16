import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import Translate from '#components/Translate';
import LanguageContext from '#root/languageContext';

function PerFormQuestion ({question}) {
  const { strings } = useContext(LanguageContext);

  // TODO: construct question
  return (
    <React.Fragment>
      <h3>{question}</h3>
    </React.Fragment>
  );
}

if (environment !== 'production') {
    PerFormQuestion.propTypes = {
    question: T.object,
  };
}

const selector = (state, ownProps) => ({});

const dispatcher = (dispatch) => ({});

export default connect(selector, dispatcher)(PerFormQuestion);
