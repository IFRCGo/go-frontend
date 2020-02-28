import React from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { Route } from 'react-router-dom';

export const HomeBreadcrumb = (props) => (
  <div>
    <BreadcrumbsItem to='/'>Main Page</BreadcrumbsItem>
    {props.children}
    <Route exact path="/emergencies" component={Emergencies} />
  </div>

);

export const EmergencyBreadcrumb = (props) => (
  <BreadcrumbsItem to='/emergencies'>Emergencies</BreadcrumbsItem>
);

export const AllEmergenciesBreadcrumb = (props) => (
  <BreadcrumbsItem to='/emergencies/all'>Emergencies List</BreadcrumbsItem>
);
