import React from 'react';
import { PropTypes as T } from 'prop-types';
import { BreadcrumbsItem, Breadcrumbs } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';

export default function BreadCrumb ({crumbs}) {
  return (
    <div className='breadcrumb__block'>
      {crumbs.map(crumb => (
        <BreadcrumbsItem key={crumb.name} to={crumb.link} className='breadcrumb'>{crumb.name}</BreadcrumbsItem>
      ))}
      <Breadcrumbs
        separator={<span className="breadcrumb__next"> > </span>}
        item={NavLink}
        finalItem={'b'}
        finalProps={{
          style: {color: '#C02C2C'}
        }}
      />
    </div>
  );
}

BreadCrumb.propTypes = {
  crumbs: T.array
};
