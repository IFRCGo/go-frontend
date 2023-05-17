import React from 'react';
import * as localStorage from 'local-storage';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

import {
  ALL_COUNTRIES_STORAGE_KEY,
  ALL_REGIONS_STORAGE_KEY,
} from '#utils/store';

function ClearInitCache() {
  React.useEffect(() => {
    localStorage.remove(ALL_COUNTRIES_STORAGE_KEY);
    localStorage.remove(ALL_REGIONS_STORAGE_KEY);
  }, []);

  return (
    <div className={styles.clearInitCache}>
      All cache cleared, <Link to='/'>goto Home</Link>
    </div>
  );
}

export default ClearInitCache;
