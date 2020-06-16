import React from 'react';
import { PropTypes as T } from 'prop-types';
import { BreadcrumbsItem, Breadcrumbs } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';

export default function BreadCrumb ({crumbs}) {
  return (
    <div className='row row--centered'>
      <div className='breadcrumb__block'>
        {crumbs.map((crumb, i) => (
          <BreadcrumbsItem order={i} key={crumb.name} to={crumb.link} className='breadcrumb'>{crumb.name}</BreadcrumbsItem>
        ))}
        <Breadcrumbs
          separator={<span className="breadcrumb__next"> > </span>}
          item={NavLink}
          compare={(a,b) => b.order - a.order}
          finalItem={'b'}
        />
      </div>
    </div>
  );
}

BreadCrumb.propTypes = {
  crumbs: T.array
};
