import React from 'react';
import { environment } from '#root/config';
import { PropTypes as T } from 'prop-types';

const BasicTable = ({tableContents, tableTitle}) => {
  return (
    <section>
      <h3 className='table__basic--header'>{tableTitle.toUpperCase()}</h3>
      <table className='table__basic'>
        <tbody>
          {tableContents.map(content =>
            <tr key={content.title}>
              <td className='table__basic--title'>{content.title.toUpperCase()}</td>
              <td className='table__basic--value'>{content.value.toUpperCase()}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default BasicTable;
if (environment !== 'production') {
  BasicTable.propTypes = {
    tableContents: T.array,
    tableTitle: T.string,
  };
}
