import { connect } from 'react-redux';
// import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import Translate from '#components/Translate';

import DisplayTable from '#components/display-table';

function PerTable ({regionId, countries}) {
  // Must pass headings to DisplayTable for the columns to show up at all
  // TODO: change phone number to area name - date - user
  const headings = [
    {
      id: 'phone_number',
      label: ''
    }, {
      id: 'view_link',
      label: ''
    }
  ];

  return Object.keys(countries).map((countryName, index) => {
      const rows = countries[countryName].map(form => {
        return {
          id: form.id,
          phone_number: form.phone_number,
          view_link: {
            value: (
              <Link className='button button--xsmall button--secondary-bounded' to={'/view-per-forms/' + form.id}>
                <Translate stringId='perdocumentView'/>
              </Link>
            ),
            className: 'right-align'
          }
        };
      });

      return (
        <React.Fragment>
          <h3 className='tc-heading'>{countryName}</h3>
          <DisplayTable
            className='table table--border-bottom table--box-shadow table--per-table margin-half-t'
            headings={headings}
            rows={rows}
            showHeader={false}
            noPaginate={true}
          />
        </React.Fragment>
      );
    });
}

const selector = (state, ownProps) => ({
//   user: state.user,
  // perForm: state.perForm,
//   perOverviewForm: state.perForm.getPerOverviewForm,
//   regionsById: regionsByIdSelector(state),
});

const dispatcher = (dispatch) => ({
//   _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args))
});

export default connect(selector, dispatcher)(PerTable);
