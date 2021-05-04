import React from 'react';
import _cs from 'classnames';

import styles from './styles.module.scss';

function EnvironmentBanner({
  className,
}) {
  const { NODE_ENV: currentEnv } = process.env;

  if(currentEnv === 'production' || currentEnv === 'development') {
    return null;
  }

  const bannerDescription = currentEnv === 'staging' ? 'Staging site' : 'Testing (Surge) site';

   return (
     <div
       className={_cs(
         'sticky-banner staging-footer',
         styles.environmentBanner,
         className,
       )}
     >
       { bannerDescription }
     </div>
   );
}

export default EnvironmentBanner;
