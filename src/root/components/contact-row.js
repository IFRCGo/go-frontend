import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';
import {
  separateUppercaseWords as separate
} from '#utils/format';
import languageContext from '#root/languageContext';

const ContactRow = ({contact}) => {
  const { strings } = React.useContext(languageContext);
  return (
    <tr>
      <td><span className='base-font-semi-bold'>{contact.name}</span></td>
      <td>{contact.title}</td>
      <td>{separate(contact.ctype)}</td>
      <td>
        {contact.email.indexOf('@') !== -1 ? (
          <a
            className="link-underline"
            href={`mailto:${contact.email}`}
            title={strings.emergencyContactTitle}
          >
            {contact.email}
          </a>
        ) : (
          <a
            className="link-underline"
            href={`tel:${contact.email}`}
            title={strings.emergencyContactTitle}
          >
            {contact.email}
          </a>
        )}
      </td>
    </tr>                                
  );
};

if (environment !== 'production') {
  ContactRow.propTypes = {
    contact: T.object
  };
}

export default ContactRow;