import React from 'react';
import { NavLink } from 'react-router-dom';
import Breadcrumbs from '#goui/components/Breadcrumbs';
import Heading from '#goui/components/Heading';

import styles from './styles.module.scss';


function BreadcrumbsExample() {
  return (
    <div className={styles.breadcrumbsExample}>
      <Heading level={3}>
        Breadcrumbs
      </Heading>
      <div className={styles.breadcrumb}>
        <Breadcrumbs>
          <NavLink to="/">
            Home
          </NavLink>
          <NavLink to="/about">
            About
          </NavLink>
          <div>
            Contact
          </div>
        </Breadcrumbs>
      </div>
      <div className={styles.breadcrumb}>
        <Breadcrumbs separator="/">
          <NavLink to="/">
            Home
          </NavLink>
          <NavLink to="/about">
            About
          </NavLink>
          <div>
            Contact
          </div>
        </Breadcrumbs>
      </div>
      <div className={styles.breadcrumb}>
        <Breadcrumbs>
          <div>
            Home
          </div>
        </Breadcrumbs>
      </div>
    </div>
  );
}

export default BreadcrumbsExample;
