import { Link } from 'react-router-dom';
import React from 'react';

/**
 * Renders the breadcrumb component
 * @param {Object} props
 * @param {Array<Object>} props.crumbs
 * @param {String} props.crumbs[].title - Title for breadcrumb 
 * @param {String} props.crumbs[].link? - (Optional) Link for breadcrumb
 */
export default function Breadcrumb(props) {
  const { crumbs } = props;
  return (
    <div className='breadcrumb-block row row--centered'>
      { crumbs.map(renderCrumb) }
    </div>
  )
}

function renderCrumb(crumb) {
  if (crumb.link) {
    return (
      <Link to={crumb.link} className='breadcrumb'>
        { crumb.title }
      </Link>
    );
  } else {
    return (
      <span className='breadcrumb'>
        { crumb.title }
      </span>      
    );
  }
}