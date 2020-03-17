import React from 'react';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { Route } from 'react-router-dom';
import Emergencies from '../views/emergencies';
import Emergency from '../views/emergency';

export const HomeBreadcrumb = (props) => (
  <div>
    <BreadcrumbsItem to='/'>Main Page</BreadcrumbsItem>
    {props.children}
    <Route exact path="/emergencies" component={Emergencies} />
  </div>

);

export const EmergenciesBreadcrumb = (props) => (
  <div>
    <BreadcrumbsItem to='/emergencies'>Emergencies</BreadcrumbsItem>
    {props.children}
    <Route exact path="/emergencies/all" component={Emergencies} />
  </div>
);

export const EmergencyBreadcrumb = ({children, id}) => (
  <div>
    <BreadcrumbsItem to='/emergencies/all'>Emergency</BreadcrumbsItem>
    {children}
    <Route exact path={`/emergencies/${id}`} component={Emergency}/>
  </div>
);
