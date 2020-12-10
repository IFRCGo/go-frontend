import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { countriesSelector } from '../../selectors';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import {
  getPerOverviews,
  deletePerOverview,
  exportPerToCsv
} from '#actions';

import Select from 'react-select';
import { FormError } from '#components/form-elements/';
// include , { SortHeader, FilterHeader } if needed
import DisplayTable from '#components/display-table';
import ConfirmModal from '#components/confirm-modal';
import { isoDate } from '#utils/format';
import { showAlert } from '#components/system-alerts';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
function PerAccount (props) {
  const { strings } = useContext(LanguageContext);

  const [modalReveal, setModalReveal] = useState(false);
  const [idToDelete, setIdToDelete] = useState();
  const [country, setCountry] = useState();
  const [formList, setFormList] = useState([]);
  const {
    _getPerOverviews,
    _deletePerOverview,
    _exportPerToCsv
  } = props;

  const handleDelete = useCallback((formId) => {
    _deletePerOverview(formId);
    showGlobalLoading();
    setIdToDelete(null);
  }, [_deletePerOverview, setIdToDelete]);

  const handleDeleteConfirmed = useCallback((isOk) => {
    if (isOk) {
      handleDelete(idToDelete);
      showGlobalLoading(); // if not here too, it's not showing...
    }
    setModalReveal(false);
  }, [handleDelete, idToDelete]);

  const handleExport = useCallback((formId) => {
    _exportPerToCsv(formId);
  }, [_exportPerToCsv]);

  // PER Overviews variables
  const [ovFetching, ovFetched, overviewFormList] = useMemo(() => [
    props.perOverviewForm.fetching,
    props.perOverviewForm.fetched,
    props.perOverviewForm.data,
  ], [props.perOverviewForm]);

  useEffect(() => {
    // const blob = new Blob([csv], { type: 'text/csv' });
    // const fileName = `projects-export-${timestamp}.csv`;

    // saveAs(blob, fileName);
  }, []);

  useEffect(() => {
    if (!ovFetching && ovFetched){
      if (!country) {
        setFormList(overviewFormList.results);
      } else {
        setFormList(overviewFormList.results.filter(form => form.country?.id === country));
      }
    }
  }, [country, ovFetching, ovFetched, overviewFormList]);

  const headings = [
    {
      id: 'country',
      label: strings.projectFormCountryLabel
    },
    {
      id: 'updatedDate',
      label: strings.perTableDate
    },
    {
      id: 'assessmentNumber',
      label: strings.perTableAssessmentNumber
    },
    {
      id: 'formsIncluded',
      label: strings.perTableFormsIncluded
    },
    {
      id: 'link',
      label: ''
    }
  ];

  const rows = !ovFetching && ovFetched
    ? formList.map(form => ({
      id: form.id,
      country: form.country?.name,
      updatedDate: isoDate(form.updated_at),
      assessmentNumber: form.assessment_number,
      formsIncluded: form.included_forms,
      link: {
        value: (
          <React.Fragment>
            {/* FIXME: will need logic once we have clear permissions */}
            { !form.is_finalized
              ? (
                <React.Fragment>
                  <Link
                    className='button button--xsmall button--primary-bounded per__list__button'
                    to={`/per-assessment/${form.id}/edit#overview`}
                  >
                    <Translate stringId='perDraftEdit' />
                  </Link>
                  { form.user.id === props.user.data.id
                    ? (
                      <button
                        className='button button--xsmall button--primary-filled per__list__button'
                        onClick={() => {
                          setModalReveal(true);
                          setIdToDelete(form.id);
                        }}
                      >
                        <Translate stringId='perDraftDelete' />
                      </button>
                    )
                    : null }
                </React.Fragment>
              ) 
              : (
                <React.Fragment>
                  <Link
                    className='button button--xsmall button--primary-bounded per__list__button'
                    to={`/per-assessment/${form.id}#overview`}
                  >
                    <Translate stringId='perdocumentView' />
                  </Link>
                  <button
                    className='button button--xsmall button--primary-bounded per__list__button'
                    onClick={() => handleExport(form.id)}
                  >
                    <Translate stringId='threeWExport' />
                  </button>
                </React.Fragment>
              )}
          </React.Fragment>
        ),
        className: 'right-align'
      }
    }))
    : null;

  useEffect(() => {
    const dpo = props.perForm.deletePerOverview;
    if (!dpo.fetching && dpo.fetched && dpo.data) {
      hideGlobalLoading();
      if (dpo.data.status === 'ok') {
        showAlert('success', <p><Translate stringId="perOverviewAlertDeleted" /></p>, true, 2000);
        _getPerOverviews();
      } else if (dpo.error) {
        showAlert('danger', <p><Translate stringId="perOverviewAlertDeleted" /></p>, true, 2000);
      }
    }
  }, [props.perForm.deletePerOverview, _getPerOverviews]);
  
  return (
    <React.Fragment>
      <div className='container-lg new-assessment-button'>
        <div className='text-center'>
          <Link
            to={'/per-assessment/create#overview'}
            className='button button--medium button--primary-filled'
          >
            <Translate stringId='perAccountNewAssessment'/>
          </Link>
        </div>
      </div>

      <div className='container-lg'>
        <figure className='chart'>
          <figcaption>
            <h2 className='fold__title'><Translate stringId='perAccountCompletedAssessments' /></h2>
          </figcaption>
          { !ovFetching && ovFetched
            ? (
              <React.Fragment>
                <div className='col col-4-sm mt-gs'>
                  <div className='form__group'>
                    <Select
                      name='country'
                      value={country}
                      placeholder={strings.perAccountSelectCountryPlaceholder}
                      onChange={(e) => setCountry(e?.value)}
                      options={props.countries.map(country => ({ value: country.value, label: country.label }))}
                    />
                    <FormError
                      errors={[]}
                      property='country'
                    />
                  </div>
                </div>
                <DisplayTable
                  headings={headings}
                  rows={rows}
                  showHeader={true}
                  noPaginate={true}
                  className='table per-table--border-bottom'
                />
              </React.Fragment>
            )
            : null }
        </figure>
      </div>

      { modalReveal
        ? (
          <ConfirmModal
            title={strings.perDraftDelete}
            message={strings.perAssessmentModalDelete}
            onClose={handleDeleteConfirmed}
            okText={strings.perDraftDelete}
          />
        )
        : null }
    </React.Fragment>
  );
}

if (environment !== 'production') {
  PerAccount.propTypes = {
    perForm: T.object,
    perOverviewForm: T.object,
    countries: T.array,
    _getPerOverviews: T.func,
    _deletePerOverview: T.func,
    _exportPerToCsv: T.func
  };
}

const selector = (state, ownProps) => ({
  perForm: state.perForm,
  perOverviewForm: state.perForm.getPerOverviewForm,
  countries: countriesSelector(state),
  user: state.user
});

const dispatcher = (dispatch) => ({
  _getPerOverviews: () => dispatch(getPerOverviews()),
  _deletePerOverview: (payload) => dispatch(deletePerOverview(payload)),
  _exportPerToCsv: (payload) => dispatch(exportPerToCsv(payload))
});

export default connect(selector, dispatcher)(PerAccount);
