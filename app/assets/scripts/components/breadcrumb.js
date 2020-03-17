import React from 'react';
import { BreadcrumbsItem, Breadcrumbs } from 'react-breadcrumbs-dynamic';
import { NavLink } from 'react-router-dom';

export default function BreadCrumb ({crumbs}) {
  return (
    <React.Fragment>
      {crumbs.map(crumb => (
        <BreadcrumbsItem to={crumb.link}>{crumb.name}</BreadcrumbsItem>
      ))}
      <Breadcrumbs
        separator={<span> / </span>}
        item={NavLink}
        finalItem={'b'}
        finalProps={{
          style: {color: '#C02C2C'}
        }}
      />
    </React.Fragment>
  );
}
