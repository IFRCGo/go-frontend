import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';
import { isNotDefined } from '@togglecorp/fujs';
import {
  IoShareSocialOutline,
  IoDownload,
} from 'react-icons/io5';

import Container from '#components/Container';
import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import languageContext from '#root/languageContext';
import { useRequest } from '#utils/restRequest';
import BlockLoading from '#components/block-loading';
import Button, { useButtonFeatures, ButtonFeatureProps } from '#components/Button';
import DateOutput from '#components/DateOutput';

import { FlashUpdateAPIResponseFields } from '../FlashUpdateApplicationForm/common';

import styles from './styles.module.scss';

function ButtonLikeLink(props: ButtonFeatureProps & {
  to: string;
}) {
  const {
    to,
    ...buttonFeatureProps
  } = props;
  const linkProps = useButtonFeatures(buttonFeatureProps);

  return (
    <Link
      to={to}
      {...linkProps}
    />
  );
}

interface Props {
  match: Match<{ id?: string }>
  history: History;
  location: Location;
}

function FlashUpdateReport(props: Props) {
  const {
    location,
    match: {
      params: {
        id
      }
    }
  } = props;
  const { strings } = useContext(languageContext);
  const {
    pending,
    response,
  } = useRequest<FlashUpdateAPIResponseFields>({
    skip: isNotDefined(id),
    // FIXME: update URL
    url: `api/v2/informal-update/${id}/`,
  });

  const crumbs = useMemo(() => [
    {
      link: strings.flashUpdateNumber,
      name: `${strings.flashUpdateNumber}${response && response.id + 1}`
    },
    {
      link: location?.pathname,
      name: response?.title
    },
    {
      link: '/emergencies',
      name: strings.breadCrumbEmergencies
    },
    {
      link: '/',
      name: strings.breadCrumbHome
    },
  ], [strings, location, response]);

  return (
    <Page
      className={styles.flashUpdate}
      title={response?.title}
      heading={response?.title}
      description={(
        <div className={styles.countryList}>
          {response?.country_district?.map((c) => (
            <Link to={`/countries/${c.country}/`}>
              {c.country_details?.name}
            </Link>
          ))}
        </div>
      )}
      breadCrumbs={
        <BreadCrumb
          crumbs={crumbs}
          compact
        />
      }
      actions={(
        <>
          <Button
            variant="secondary"
            name={undefined}
            icons={<IoShareSocialOutline />}
            disabled
            // TODO: Implement share
          >
            Share
          </Button>
          {response && (
            <ButtonLikeLink
              variant="primary"
              to={`/flash-update/${response.id}/edit/`}
            >
              Edit
            </ButtonLikeLink>
          )}
        </>
      )}
      mainSectionClassName={styles.mainContent}
    >
      {pending && <BlockLoading />}
      {!pending && response && (
        <>
          <Container
            heading={strings.flashUpdateMapTitle}
            contentClassName={styles.maps}
          >
              {response?.map_files?.map((item) => (
                <div
                  className={styles.mapItem}
                  key={item.id}
                >
                  <img
                    className={styles.image}
                    src={item.file}
                    alt=""
                  />
                  <div className={styles.caption}>
                    {item.caption}
                  </div>
                </div>
              ))}
          </Container>
          <Container
            heading={strings.flashUpdateImageTitle}
            contentClassName={styles.graphics}
          >
            {response?.graphics_files?.map((item) => (
              <div
                key={item.id}
                className={styles.graphicItem}
              >
                <img
                  className={styles.image}
                  src={item.file}
                  alt=""
                />
                <div className={styles.caption}>
                  {item.caption}
                </div>
              </div>
            ))}
          </Container>
          <Container
            heading={strings.flashUpdateActionTakenTitle}
            contentClassName={styles.actionsTaken}
          >
            {response.actions_taken.map((at) => (
              <Container
                sub
                heading={at.organization_display}
                headingSize="small"
                hideHeaderBorder
                contentClassName={styles.actionTakenContent}
                key={at.id}
              >
                {at.summary && (
                  <div className={styles.summary}>
                    {at.summary}
                  </div>
                )}
                <div className={styles.actionList}>
                  {at.action_details.map((ad) => (
                    <div
                      key={ad.id}
                      className={styles.action}
                    >
                      {ad.name}
                    </div>
                  ))}
                </div>
              </Container>
            ))}
          </Container>
          <Container heading={strings.flashUpdateResourcesTitle}>
            {response.references.map((r) => (
              <div
                className={styles.reference}
                key={r.id}
              >
                <div className={styles.date}>
                  <DateOutput
                    value={r.date}
                  />
                </div>
                <div className={styles.description}>
                  {r.source_description}
                </div>
                <a
                  target="_blank"
                  href={r.url}
                  className={styles.url}
                >
                  {r.url}
                </a>
                {r.document_details?.file && (
                  <ButtonLikeLink
                    variant="secondary"
                    to={r.document_details?.file}
                    className={styles.downloadLink}
                    icons={<IoDownload />}
                  >
                    Download document
                  </ButtonLikeLink>
                )}
              </div>
            ))}
          </Container>
        </>
      )}
    </Page>
  );
}

export default FlashUpdateReport;
