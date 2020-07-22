import React from 'react';
import _cs from 'classnames';
import { IoMdDownload } from 'react-icons/io';

import Translate from '#components/Translate';
import FormattedDate from '#components/formatted-date';

import Container from './Container';
import Card from './Card';
import styles from './styles.module.scss';

function DocumentDetails(p) {
  const {
    file,
    date,
    title,
    className,
  } = p;

  return (
    <div className={_cs(className, styles.documentDetails)}>
      <div className={styles.title}>
        { title }
      </div>
      <FormattedDate
        className={styles.date}
        value={date}
      />
      <a
        className={styles.fileDownloadLink}
        href={file}
        target="_blank"
      >
        <IoMdDownload />
      </a>
    </div>
  );
}

function KeyDocuments(p) {
  const {
    className,
    data,
  } = p;

  const groupedDocuments = React.useMemo(() => {
    const groups = [...new Set(data.map(d => d.group))].reduce((acc, val) => {
      const items = data.filter(d => d.group === val);
      acc[val] = {
        title: items[0]?.group_display,
        documents: items,
      };

      return acc;
    }, {});

    return groups;
  }, [data]);

  return (
    <Container
      className={_cs(className, styles.keyDocuments)}
      heading={<Translate stringId='countryProfileKeyDocumentsTitle'/>}
      contentClassName={styles.content}
    >
      { Object.keys(groupedDocuments).map(groupKey => (
        <Card
          className={styles.documentGroup}
          key={groupKey}
          heading={groupedDocuments[groupKey].title}
          hideSource
        >
          { groupedDocuments[groupKey].documents.map(d => (
            <DocumentDetails
              key={d.id}
              file={d.file}
              title={d.title}
              date={d.date}
            />
          ))}
        </Card>
      ))}
    </Container>
  );
}

export default KeyDocuments;
