import React from 'react';
import { PropTypes as T } from 'prop-types';
import { BreadcrumbsItem, Breadcrumbs } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';

export default function BreadCrumb ({
  crumbs,
  breadcrumbContainerClass,
  compact,
}) {
  return (
    <div
      className={_cs(
        !compact && 'container-lg',
        breadcrumbContainerClass,
      )}
    >
      <div className='breadcrumb__block'>
        {crumbs.map((crumb, i) => (
          <BreadcrumbsItem order={i} key={crumb.name} to={crumb.link} className='breadcrumb'>{crumb.name}</BreadcrumbsItem>
        ))}
        <Breadcrumbs
          separator={<span className="breadcrumb__next"> &gt; </span>}
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
