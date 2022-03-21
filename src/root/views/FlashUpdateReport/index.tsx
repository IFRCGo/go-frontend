import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';
import {
  isNotDefined,
  isDefined,
} from '@togglecorp/fujs';
import { IoDownload } from 'react-icons/io5';

import { useRequest } from '#utils/restRequest';
import Container from '#components/Container';
import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import languageContext from '#root/languageContext';
import BlockLoading from '#components/block-loading';
import DateOutput from '#components/DateOutput';
import {
  useButtonFeatures,
  ButtonFeatureProps
} from '#components/Button';

import { FlashUpdateAPIResponseFields } from '#views/FlashUpdateApplicationForm/common';

import ShareButton from './ShareButton';

import styles from './styles.module.scss';

function ButtonLikeLink(props: ButtonFeatureProps & {
  to: string;
  external?: boolean;
}) {
  const {
    external,
    to,
    ...buttonFeatureProps
  } = props;

  const linkProps = useButtonFeatures(buttonFeatureProps);

  if (external) {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={to}
        {...linkProps}
      />
    );
  }

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
    url: `api/v2/flash-update/${id}/`,
  });

  const crumbs = useMemo(() => {
    if (location && location.pathname && response && isDefined(response.id)) {
      return [
        /*
        {
          link: '#',
          name: resolveToString(strings.flashUpdateNumber, {
            number: response.id,
          }),
        },
        */
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
      ];
    }

    return [];
  }, [strings, location, response]);

  const hasActions = response?.actions_taken?.some(
    (at) => (at.actions.length !== 0 || at.summary)
  );

  return (
    <Page
      className={styles.flashUpdate}
      title={response?.title}
      heading={response?.title}
      description={(
        <div className={styles.countryList}>
          {response?.country_district?.map((c) => (
            <Link
              key={c.id}
              to={`/countries/${c.country}/`}
            >
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
      actions={response && (
        <>
            <ShareButton
              flashUpdateId={response.id}
            />
            <ButtonLikeLink
              variant="primary"
              to={`/flash-update/${response.id}/edit/`}
            >
              Edit
            </ButtonLikeLink>
        </>
      )}
      mainSectionClassName={styles.mainContent}
    >
      {pending && <BlockLoading />}
      {!pending && response && (
        <Container
          contentClassName={styles.reportDetails}
        >
          {response.situational_overview && (
            <Container
              heading="Situational Overview"
              sub
            >
              <div
                className={styles.overviewContent}
                dangerouslySetInnerHTML={{
                  __html: response.situational_overview
                }}
              />
            </Container>
          )}
          {response.map_files && response.map_files.length > 0 && (
            <Container
              sub
              heading={strings.flashUpdateMapTitle}
              contentClassName={styles.maps}
            >
                {response.map_files.map((item) => (
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
          )}
          {response.graphics_files && response.graphics_files.length > 0 && (
            <Container
              sub
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
          )}
          {hasActions && (
            <Container
              sub
              heading={strings.flashUpdateActionTakenTitle}
              contentClassName={styles.actionsTaken}
            >
              {response.actions_taken.map((at) => (
                (at?.actions?.length !== 0 || isDefined(at?.summary)) && (
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
                        <div className={styles.title}>
                          Description
                        </div>
                        <div className={styles.text}>
                          {at.summary}
                        </div>
                      </div>
                    )}
                    <div className={styles.actions}>
                      <div className={styles.title}>
                        Actions
                      </div>
                      <div className={styles.list}>
                        {at.action_details.map((ad) => (
                          <div
                            key={ad.id}
                            className={styles.action}
                          >
                            {ad.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Container>
                )
              ))}
            </Container>
          )}
          {response.references && response.references.length > 0 && (
            <Container
              heading={strings.flashUpdateResourcesTitle}
              sub
            >
              {response.references.map((r) => (
                <div
                  className={styles.reference}
                  key={r.id}
                >
                  <div className={styles.date}>
                    <DateOutput value={r.date} />
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
                      external
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
          )}
        </Container>
      )}
    </Page>
  );
}

export default FlashUpdateReport;
