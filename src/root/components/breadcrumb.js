import React from 'react';
import { PropTypes as T } from 'prop-types';
import { BreadcrumbsItem, Breadcrumbs } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';

export default function BreadCrumb ({crumbs, breadcrumbContainerClass}) {
  return (
    <div className={`container-lg ${breadcrumbContainerClass ? breadcrumbContainerClass : ''}`}>
      <div className='breadcrumb__block'>
        {crumbs.map((crumb, i) => (
          <BreadcrumbsItem order={i} key={crumb.name} to={crumb.link} className='breadcrumb'>{crumb.name}</BreadcrumbsItem>
        ))}
        <Breadcrumbs
          separator={<span className="breadcrumb__next"> > </span>}
          breadcrumbContainerClass={breadcrumbContainerClass}
          item={NavLink}
          compare={(a,b) => b.order - a.order}
          finalItem={'b'}
        />
      </div>
    </div>
  );
}

BreadCrumb.propTypes = {
  crumbs: T.array,
  breadcrumbContainerClass: T.string
};
