import React from 'react';
import _cs from 'classnames';
import { IoMdDownload } from 'react-icons/io';
import { getTrigramSimilarity } from '@togglecorp/fujs';
import { IoMdSearch } from 'react-icons/io';

import Translate from '#components/Translate';
import FormattedDate from '#components/formatted-date';
import DateFilterHeader from '#components/common/filters/date-filter-header';
import RawInput from '#components/form-elements/raw-input';

import languageContext from '#root/languageContext';

import { dateOptions } from '#utils/utils';

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

  const { strings } = React.useContext(languageContext);

  const [date, setDate] = React.useState({
    startDate: undefined,
    endDate: undefined,
  });
  const [search, setSearch] = React.useState(undefined);

  const groupedDocuments = React.useMemo(() => {
    let filteredData = search ? data.filter(d => getTrigramSimilarity(d.title || '', search)) : data;
    const {
      startDate,
      endDate,
    } = date;

    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      filteredData = filteredData.filter((d) => {
        const date = new Date(d.date).getTime();
        if (date >= start && date <= end) {
          return true;
        }

        return false;
      });
    }

    const groups = [...new Set(filteredData.map(d => d.group))].reduce((acc, val) => {
      const items = filteredData.filter(d => d.group === val);
      acc[val] = {
        title: items[0]?.group_display,
        documents: items,
      };

      return acc;
    }, {});

    return groups;
  }, [data, search, date]);

  return (
    <Container
      className={_cs(className, styles.keyDocuments)}
      heading={<Translate stringId='countryProfileKeyDocumentsTitle'/>}
      contentClassName={styles.content}
    >
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <IoMdSearch className={styles.icon} />
          <RawInput
            className={styles.search}
            type="search"
            value={search}
            onChange={setSearch}
            placeholder={strings.countryProfileSearchPlaceholder}
          />
        </div>
        <DateFilterHeader
          id='date'
          title={strings.countryProfileDateRange}
          options={dateOptions}
          filter={date}
          featureType='map'
          onSelect={setDate}
        />
      </div>
      <div className={styles.cards}>
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
      </div>
    </Container>
  );
}

export default KeyDocuments;
