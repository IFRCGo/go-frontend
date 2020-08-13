import React from 'react';
import _cs from 'classnames';
import { IoMdDownload } from 'react-icons/io';

import ExportableView from '#components/ExportableView';
import ExportButton from '#components/ExportableView/ExportButton';
import ExportContainer from '#components/ExportableView/ExportContainer';
import ExportHiddenContent from '#components/ExportableView/ExportHiddenContent';

import styles from './styles.module.scss';

function Container(p) {
  const {
    className,
    contentClassName,
    heading,
    headerContentClassName,
    headerContent,
    children,
    exportable,
    exportClassName,
  } = p;

  return (
    <ExportableView>
      <ExportContainer
        className={_cs(className, styles.container)}
        exportClassName={exportClassName}
      >
        <header className={styles.header}>
          <h3 className={styles.heading}>
            { heading }
          </h3>
          { headerContent && (
            <div className={_cs(headerContentClassName, styles.headerContent)}>
              { headerContent }
            </div>
          )}
          {exportable && (
            <ExportHiddenContent className={styles.exportButtonContainer}>
              <ExportButton className={_cs(styles.exportButton, 'button button--xsmall button--primary-bounded')}>
                <IoMdDownload />
                Export
              </ExportButton>
            </ExportHiddenContent>
          )}
        </header>
        <div className={_cs(contentClassName, styles.content)}>
          { children }
        </div>
      </ExportContainer>
    </ExportableView>
  );
}

export default Container;
