import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { environment } from '#config';

export default class Fold extends React.Component {
  renderHeader () {
    if (React.isValidElement(this.props.header)) {
      return this.props.header;
    } else if (typeof this.props.header === 'function') {
      return (
        <div className={c('fold__header', this.props.foldHeaderClass)}>
          {this.props.header()}
        </div>
      );
    } else {
      return (
        <div className={c('fold__header', this.props.foldHeaderClass)}>
          <div className="fold__header__block">
            <h2 className={c('fold__title', this.props.foldTitleClass)}>{this.props.title}</h2>
            {this.props.navLink ? <div className="fold__title__linkwrap"><span>{this.props.navLink}</span> <span className="collecticon-chevron-right"></span> </div> : null}
          </div>
          {this.props.description && <p className='fold__description'>{this.props.description}</p>}
        </div>
      );
    }
  }

  renderFooter () {
    if (React.isValidElement(this.props.footer)) {
      return this.props.footer;
    } else if (typeof this.props.footer === 'function') {
      return (
        <div className={c('fold__footer', this.props.footerClass)}>
          {this.props.footer()}
        </div>
      );
    } else {
      return null;
    }
  }

  render () {

    // default should be to show the header
    let showHeader;
    if (!this.props.hasOwnProperty('showHeader')) {
      showHeader = true;
    } else {
      showHeader = this.props.showHeader;
    }
    return (
      <div className={c('fold', this.props.foldWrapperClass)} id={this.props.id}>
        <div className={c('container-lg', this.props.foldContainerClass)}>
          {showHeader ? this.renderHeader() : null}
          <div className={c('fold__body', this.props.bodyClass)}>
            {this.props.children}
          </div>
          {this.renderFooter()}
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  Fold.propTypes = {
    id: T.string,
    title: T.string,
    navLink: T.element,
    foldTitleClass: T.string,
    foldContainerClass: T.oneOfType(T.string),
    description: T.string,
    showHeader: T.bool,
    header: T.oneOfType([T.element, T.func]),
    footer: T.oneOfType([T.element, T.func]),
    foldWrapperClass: T.string,
    foldHeaderClass: T.string,
    bodyClass: T.string,
    footerClass: T.string,
    children: T.node
  };
}
