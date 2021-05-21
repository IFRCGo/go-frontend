import React, { useContext, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import App from './app';
import VideoCarousel from '#components/about/video-carousel';
import BreadCrumb from '#components/breadcrumb';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import { getMainContacts } from '#actions';

function About (props) {
  const { strings } = useContext(LanguageContext);

  const { _getMainContacts } = props;

  useEffect(() => {
    if (!props.mainContacts || (!props.mainContacts.fetched && !props.mainContacts.fetching)) {
      _getMainContacts();
    }
  }, [_getMainContacts, props.mainContacts]);

  const contacts = useMemo(() => {
    if (props.mainContacts && props.mainContacts.fetched && !props.mainContacts.fetching) {
      return props.mainContacts.data.results;
    }
    return [];
  }, [props.mainContacts]);

  return (
    <App className='page--about'>
      <Helmet>
        <title>
          {strings.aboutTitle}
        </title>
      </Helmet>
      <BreadCrumb crumbs={[
        {link: props.location.pathname, name: strings.breadCrumbResources},
        {link: '/', name: strings.breadCrumbHome}
      ]} />
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>
                <Translate stringId='aboutResources' />
              </h1>
              <div className='inpage__introduction container-sm'>
                <p><Translate stringId='aboutDescription' /></p>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <div className='fold fold--about-iframe-video'>
              <div>
                <div className='inner'>
                  <div className='iframe__about__block'>
                    <div className='iframe__embed'>
                      <iframe width="604" height="340" className='iframe__embed__video' src="https://www.youtube.com/embed/dwPsQzla9A4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                  </div>
                  <section className='section__about__guides__ref'>
                    <div className='container-lg'>
                      <div className='text-center'>
                        <div className='line-brand-deco-border-top-wrap'>
                          <div className='line-brand-deco-border-top'></div>
                          <h2 className='fold__title text-center'>
                            <Translate stringId='aboutUserGuidance' />
                          </h2>
                        </div>
                      </div>

                      <div className='box__global__wrap__about row flex-mid'>
                        <div className='col col-6-mid flex'>
                          <div className='box__global box__global--about-guides'>
                            <div className='box__global__heading'>
                              <div className='base-font-semi-bold'>
                                <Translate stringId='aboutUserAdministrativeGuide'/>
                              </div>
                              <p className='font-size-sm margin-reset'>
                                <Translate stringId='aboutUserAdministrativeGuideDescription'/>
                              </p>
                            </div>
                            <div className='box__global__content'>
                              <div className='row flex-xs'>
                                <a href='https://github.com/IFRCGo/go-frontend/files/4415370/GoUserGuide_MediumRes.pdf' className='box__global__content--ref__link col col-6-xs'>
                                  <span className='icon__circle'>
                                    <span className='icon__circle__content'>EN</span>
                                  </span>
                                  <span>GO user guide</span>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>

                                <a href='https://github.com/IFRCGo/go-frontend/files/4415371/GoAdminGuide_MediumRes.pdf' className='box__global__content--ref__link col col-6-xs'>
                                  <span className='icon__circle'>
                                    <span className='icon__circle__content'>EN</span>
                                  </span>
                                  <span>Administrative Guides</span>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>

                                <div className='box__global__content--ref__link col col-6-xs'>
                                  <span className='icon__circle'>
                                    <span className='icon__circle__content'>FR</span>
                                  </span>
                                  <span>Guides d'Utilisation</span>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </div>

                                <div className='box__global__content--ref__link col col-6-xs'>
                                  <span className='icon__circle'>
                                    <span className='icon__circle__content'>FR</span>
                                  </span>
                                  <span>Guides Administratifs</span>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </div>

                                <a href='https://drive.google.com/file/d/1FnmBm_8K52eTKWa8xWK52eebhgOz60SO/view' target='_blank' className='box__global__content--ref__link col col-6-xs'>
                                  <span className='icon__circle'>
                                    <span className='icon__circle__content'>ES</span>
                                  </span>
                                  <span>Guías de Usuario</span>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>

                                <div className='box__global__content--ref__link col col-6-xs'>
                                  <span className='icon__circle'>
                                    <span className='icon__circle__content'>ES</span>
                                  </span>
                                  <span>Guías Administrativas</span>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </div>

                                <a href='https://github.com/IFRCGo/go-frontend/files/4818646/GoUserGuide_MediumRes_AR.pdf.pdf' className='box__global__content--ref__link col col-6-xs'>
                                  <span className='icon__circle'>
                                    <span className='icon__circle__content'>AR</span>
                                  </span>
                                  <span>أدلة المستخدم</span>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>

                                <a href='https://github.com/IFRCGo/go-frontend/files/4818648/GoAdminGuide_MediumRes_AR.pdf.pdf' className='box__global__content--ref__link col col-6-xs'>
                                  <span className='icon__circle'>
                                    <span className='icon__circle__content'>AR</span>
                                  </span>
                                  <span>أدلة إدارية</span>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='col col-6-mid flex'>
                          <div className='box__global box__global--about-ref'>
                            <div className='box__global__heading'>
                              <div className='base-font-semi-bold'>
                                <Translate stringId='aboutReferenceMaterials'/>
                              </div>
                              <p className='font-size-sm margin-reset'>
                                <Translate stringId='aboutReferenceMaterialsDescription'/>
                              </p>
                            </div>
                            <div className='box__global__content'>
                              <div className='box__global__content--ref row flex-xs'>
                                <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/EX2saJXpnKRNtez_YFsTyAABZkv63odVuBlH7XLYtxgEgQ?e=lTm6ID' target='_blank' className='box__global__content--ref__link col col-6-xs'>
                                  <Translate stringId='aboutVisualGuidelines'/>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>
                                <a href='https://company-190156.frontify.com/d/zFf8DVC7Q8Uq/go-visual-identity' target='_blank' className='box__global__content--ref__link col col-6-xs'>
                                  <Translate stringId='aboutVisualIdentity'/>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>
                                <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/EUV7xJOyEZtDmecIH6uS9SIBwl3gv1cbxVjwS6m79gx7TQ?e=b2AgU3' target='_blank' className='box__global__content--ref__link col col-6-xs'>
                                  <Translate stringId='aboutUserStudy'/>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>
                                <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/ESX7S_-kp-FAuPP_yXIcLQkB6zE6t2hVhKxGgWbSXZXOFg?e=RsWNSa' target='_blank' className='box__global__content--ref__link col col-6-xs'>
                                  <Translate stringId='aboutInformationArchitecture'/>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>
                                <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/Eaje4wKVk5pFlqfNSv9HTSMBz-wABgwmlDraa3CtN8I33g?e=zlCAfG' target='_blank' className='box__global__content--ref__link col col-6-xs'>
                                  <Translate stringId='about3WGuidance'/>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>
                                <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/EUqbJHWGW8xLjFJgwG-x4GABfUD5UCS3DS6uwW74tufs9Q?e=pHcyLH' target='_blank' className='box__global__content--ref__link col col-6-xs'>
                                  <Translate stringId='about3WLessonLearned'/>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </a>
                                <div className='box__global__content--ref__link col col-6-xs'>
                                  <Translate stringId='aboutPresentation'/>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </div>
                                <div className='box__global__content--ref__link col col-6-xs'>
                                  <Translate stringId='aboutImStrategy'/>
                                  <span className='collecticon-chevron-right icon-about-ref'></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <div className='text-center'>
              <div className='line-brand-deco-border-top-wrap'>
                <div className='line-brand-deco-border-top'></div>
                <h2 className='fold__title text-center'>Reference Videos</h2>
              </div>
            </div>

            <div className='fold fold__about__video__carousel'>
              <div className='row'>
                <VideoCarousel />
              </div>
            </div>
            <section className='about__resources__block'>
              <div className='container-lg'>
                <div className='text-center'>
                  <div className='line-brand-deco-border-top-wrap'>
                    <div className='line-brand-deco-border-top'></div>
                    <h2 className='fold__title text-center'>
                      <Translate stringId='aboutIfrcResources'/>
                    </h2>
                  </div>
                </div>
                <div className='about__resources'>
                  <div className='about__resources__row row flex-mid'>
                    <div className='col col-4-mid'>
                      <div className='box__global box__global--resources'>
                        {/* <span className='collecticon-circle-information icon__about__resources'></span> */}
                        <div className='box__global__heading'>
                          <div className='base-font-semi-bold'>
                            <Translate stringId='aboutSurgeServices'/>
                          </div>
                        </div>
                        <div className='box__global__content'>
                          <a href='https://docs.google.com/spreadsheets/d/1F-78qDc8vdh5hli5FLFeyTvlFQgw19OqZXMR50TQ1C0/edit?usp=sharing' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutSurgeEvents'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>

                          <a href='https://ifrcgo.org/global-services/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutSurgeCatalogue'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>

                          <a href='http://rcrcsims.org/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutSurgeNetwork'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>

                          <a href='https://www.cbsrc.org/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutCommunitySurveillance'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className='col col-4-mid'>
                      <div className='box__global box__global--resources'>
                        {/* <span className='collecticon-circle-information icon__about__resources'></span> */}
                        <div className='box__global__heading'>
                          <div className='base-font-semi-bold'>
                            <Translate stringId='aboutGuidanceMaterial'/>
                          </div>
                        </div>
                        <div className='box__global__content'>
                          <a href='https://www.cash-hub.org/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutCashHub'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>

                          <a href='https://www.communityengagementhub.org/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutCommunityHub'/>
                              </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>

                          <a href='https://www.preparecenter.org/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutDisasterPreparednessCenter'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>

                          <a href='https://www.preparecenter.org/toolkit/data-playbook-toolkit/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutDataPlaybook'/>                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>
                        </div>
                      </div>
                    </div>    

                    <div className='col col-4-mid'>
                      <div className='box__global box__global--resources'>
                        {/* <span className='collecticon-circle-information icon__about__resources'></span> */}
                        <div className='box__global__heading'>
                          <div className='base-font-semi-bold'>
                            <Translate stringId='aboutOtherResources'/>
                          </div>
                        </div>
                        <div className='box__global__content'>
                          <a href='https://media.ifrc.org/ifrc/what-we-do/reference-centres/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutReferenceCenters'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>

                          <a href='https://www.missingmaps.org/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutMissingMaps'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>

                          <a href='https://data.ifrc.org/fdrs/' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutReportingSystem'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>

                          <a href='https://ifrc.csod.com/client/ifrc/default.aspx' target='_blank' className='box__global__content--ref__link'>
                            <span>
                              <Translate stringId='aboutLearningPlatform'/>
                            </span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className='about__contact__block'>
              <div className='text-center'>
                <div className='line-brand-deco-border-top-wrap'>
                  <div className='line-brand-deco-border-top'></div>
                  <h2 className='fold__title text-center'>
                    <Translate stringId='aboutContacts'/>
                  </h2>
                </div>
              </div>
              <div className='about__contact'>
                <p className='about__contact__info__block row flex'>
                  <span className='about__contact__info col col-8'>
                    <strong>
                      <Translate stringId='aboutFurtherInfo'/>
                    </strong>
                  </span>
                  <span className='about__contact__link col col-4'>
                    <a href='mailto:im@ifrc.org' className='button button--primary-filled button--small'>im@ifrc.org</a>
                  </span>
                </p>
                <div className='row flex-mid'>
                  { contacts.map(contact => {
                    return (
                      <React.Fragment>
                        <div className='about__contact__col about__contact__region'>
                          {contact.extent}
                        </div>
                        <div className='about__contact__col about__contact__name'>{contact.name}</div>
                        <a href='mailto:rrim.africa@ifrc.org' className='about__contact__col about__contact__email'>{contact.email}</a>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className='logo__group'>
              <div className='container-lg'>
                <p className='logo__title text-center'>
                  <Translate stringId='aboutGoFunding'/>
                </p>
                <div className='donor-logo-container'>
                  <a href='http://www.redcross.org/' target='_blank'>
                    <img src='/assets/graphics/content/arc_logo.png' alt='Visit American Red Cross Page' width='160' />
                  </a>
                  <a href='https://www.redcross.org.au/' target='_blank'>
                    <img src='/assets/graphics/content/aurc_logo.jpg' alt='Visit Australian Red Cross Page' width='200'/>
                  </a>
                  <a href='http://www.redcross.org.uk/' target='_blank'>
                    <img src='/assets/graphics/content/brc_logo.png' alt='Visit British Red Cross Page' width='170'/>
                  </a>
                  <a href='http://www.redcross.ca/' target='_blank'>
                    <img src='/assets/graphics/content/crc_logo.png' alt='Visit Canadian Red Cross Page' width='120'/>
                  </a>
                  <a href='http://www.redcross.fi/' target='_blank'>
                    <img src='/assets/graphics/content/frc_logo.png' alt='Visit Finnish Red Cross Page' width='200'/>
                  </a>
                  <a href='http://www.jrc.or.jp/english/' target='_blank'>
                    <img src='/assets/graphics/content/jrc_logo.png' alt='Visit Japanese Red Cross Page' width='154'/>
                  </a>
                  <a href='https://www.rodekruis.nl/' target='_blank'>
                    <img src='/assets/graphics/content/nlrc_logo.jpg' alt='Visit Netherlands Red Cross Page' width='160'/>
                  </a>
                  <a href='https://www.cruzroja.es/' target='_blank'>
                    <img src='/assets/graphics/content/esp_logo.jpg' alt='Visit Spanish Red Cross Page' width='180'/>
                  </a>
                  <a href='https://www.ericsson.com/en' target='_blank'>
                    <img src='/assets/graphics/content/ericsson_logo.png' alt='Visit Ericsson Page' width='140'/>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </App>
  );
}

About.contextType = LanguageContext;
const selector = (state, ownProps) => ({
  mainContacts: state.mainContacts
});

const dispatcher = (dispatch) => ({
  _getMainContacts: () => dispatch(getMainContacts())
});

export default connect(selector, dispatcher)(About);
