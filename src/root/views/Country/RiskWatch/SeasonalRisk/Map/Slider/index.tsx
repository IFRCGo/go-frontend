import React from 'react';
import styles from './styles.module.scss';

export const Slider = () => {
  return (
    <div className={styles.content}>
      <div className={styles.monthSliderWrapper}>
        <div id="month-slider" className={styles.slider}></div>
      </div>
    </div>
  );
};
export default Slider;