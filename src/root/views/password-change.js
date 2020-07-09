import React from 'react';
import { Helmet } from 'react-helmet';

import App from '#views/app';
import NewPassword from '#components/connected/new-password';
import languageContext from '#root/languageContext';

function PasswordChange() {
  const { strings } = React.useContext(languageContext);

  return (
    <App className='page--passwordchange'>
      <Helmet>
        <title>
          { strings.passwordChangePageTitle }
        </title>
      </Helmet>
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>
                { strings.passwordChangeHeading }
              </h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <div className='prose prose--responsive'>
              <NewPassword verifyOldPassword={true} />
            </div>
          </div>
        </div>
      </section>
    </App>
  );
}

export default PasswordChange;
