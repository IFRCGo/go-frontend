import React from 'react';
import { Helmet } from 'react-helmet';
import App from './app';
import VideoCarousel from '#components/about/video-carousel';
import BreadCrumb from '#components/breadcrumb';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

export default class About extends React.Component {
  render () {
    const { strings } = this.context;
    return (
      <App className='page--about'>
        <Helmet>
          <title>
            {strings.aboutTitle}
          </title>
        </Helmet>
        <BreadCrumb crumbs={[
          {link: this.props.location.pathname, name: 'Resources'},
          {link: '/', name: 'Home'}
        ]} />
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>
                  <Translate stringId='aboutResources' />
                </h1>
                <p className='inpage__introduction'>
                  <Translate stringId='aboutDescription' />
                </p>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='fold fold--about-iframe-video'>
                <div className='row row--centered'>
                  <div className='inner'>
                    <div className='iframe__about__block'>
                      <div className='iframe__embed'>
                        <iframe width="604" height="340" className='iframe__embed__video' src="https://www.youtube.com/embed/dwPsQzla9A4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                      </div>
                    </div>
                    <section className='section__about__guides__ref row'>
                      <div className='text-center'>
                        <div className='line-brand-deco-border-top-wrap'>
                          <div className='line-brand-deco-border-top'></div>
                          <h2 className='fold__title text-center'>
                            <Translate stringId='aboutUserGuidance' />
                          </h2>
                        </div>
                      </div>

                      <div className='box__global__wrap__about clearfix'>
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
                            <div className='clearfix'>
                              <a href='https://github.com/IFRCGo/go-frontend/files/4415370/GoUserGuide_MediumRes.pdf' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>EN</span>
                                </span>
                                <span>GO user guide</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>

                              <a href='https://github.com/IFRCGo/go-frontend/files/4415371/GoAdminGuide_MediumRes.pdf' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>EN</span>
                                </span>
                                <span>Administrative Guides</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>

                              <div className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>FR</span>
                                </span>
                                <span>Guides d'Utilisation</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </div>

                              <div className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>FR</span>
                                </span>
                                <span>Guides Administratifs</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </div>

                              <a href='https://drive.google.com/file/d/1FnmBm_8K52eTKWa8xWK52eebhgOz60SO/view' target='_blank' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>ES</span>
                                </span>
                                <span>Guías de Usuario</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>

                              <div className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>ES</span>
                                </span>
                                <span>Guías Administrativas</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </div>

                              <a href='https://github.com/IFRCGo/go-frontend/files/4818646/GoUserGuide_MediumRes_AR.pdf.pdf' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>AR</span>
                                </span>
                                <span>أدلة المستخدم</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>

                              <a href='https://github.com/IFRCGo/go-frontend/files/4818648/GoAdminGuide_MediumRes_AR.pdf.pdf' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>AR</span>
                                </span>
                                <span>أدلة إدارية</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>
                            </div>
                          </div>
                        </div>

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
                            <div className='box__global__content--ref clearfix'>
                              <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/EX2saJXpnKRNtez_YFsTyAABZkv63odVuBlH7XLYtxgEgQ?e=lTm6ID' target='_blank' className='box__global__content--ref__link'>
                                <Translate stringId='aboutVisualGuidelines'/>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>
                              <a href='https://company-190156.frontify.com/d/zFf8DVC7Q8Uq/go-visual-identity' target='_blank' className='box__global__content--ref__link'>
                                <Translate stringId='aboutVisualIdentity'/>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>
                              <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/EUV7xJOyEZtDmecIH6uS9SIBwl3gv1cbxVjwS6m79gx7TQ?e=b2AgU3' target='_blank' className='box__global__content--ref__link'>
                                <Translate stringId='aboutUserStudy'/>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>
                              <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/ESX7S_-kp-FAuPP_yXIcLQkB6zE6t2hVhKxGgWbSXZXOFg?e=RsWNSa' target='_blank' className='box__global__content--ref__link'>
                                <Translate stringId='aboutInformationArchitecture'/>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>
                              <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/Eaje4wKVk5pFlqfNSv9HTSMBz-wABgwmlDraa3CtN8I33g?e=zlCAfG' target='_blank' className='box__global__content--ref__link'>
                                <Translate stringId='about3WGuidance'/>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>
                              <a href='https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/EUqbJHWGW8xLjFJgwG-x4GABfUD5UCS3DS6uwW74tufs9Q?e=pHcyLH' target='_blank' className='box__global__content--ref__link'>
                                <Translate stringId='about3WLessonLearned'/>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </a>
                              <div className='box__global__content--ref__link'>
                                <Translate stringId='aboutPresentation'/>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </div>
                              <div className='box__global__content--ref__link'>
                                <Translate stringId='aboutImStrategy'/>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
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
                <div className='row row--centered'>
                  <VideoCarousel />
                </div>
              </div>
              <section className='about__resources__block'>
                <div className='row row--centered'>
                  <div className='text-center'>
                    <div className='line-brand-deco-border-top-wrap'>
                      <div className='line-brand-deco-border-top'></div>
                      <h2 className='fold__title text-center'>
                        <Translate stringId='aboutIfrcResources'/>
                      </h2>
                    </div>
                  </div>
                  <div className='about__resources row'>
                    <div className='about__resources__row clearfix'>
                      <div className='box__global box__global--resources'>
                        {/* <span className='collecticon-circle-information icon__about__resources'></span> */}
                        <div className='box__global__heading'>
                          <div className='base-font-semi-bold'>
                            <Translate stringId='aboutSurgeServices'/>
                          </div>
                        </div>
                        <div className='box__global__content'>
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
                  <p className='about__contact__info__block clearfix'>
                    <span className='about__contact__info'>
                      <strong>
                        <Translate stringId='aboutFurtherInfo'/>
                      </strong>
                    </span>
                    <span className='about__contact__link'>
                      <a href='mailto:im@ifrc.org' className='button button--primary-filled button--small'>im@ifrc.org</a>
                    </span>
                  </p>
                  <div className='clearfix'>
                    <div className='about__contact__col about__contact__region'>
                      <Translate stringId='aboutAfricaRegion'/>
                    </div>
                    <div className='about__contact__col about__contact__name'>Ted BOLTON</div>
                    <a href='mailto:rrim.africa@ifrc.org' className='about__contact__col about__contact__email'>rrim.africa@ifrc.org</a>
                    <div className='about__contact__col about__contact__region'>
                      <Translate stringId='aboutAmericaRegion'/>
                    </div>
                    <div className='about__contact__col about__contact__name'>Luis FANOVICH</div>
                    <a href='mailto:luis.fanovich@ifrc.org' className='about__contact__col about__contact__email'>luis.fanovich@ifrc.org</a>
                    <div className='about__contact__col about__contact__region'>
                      <Translate stringId='aboutAsiaPacificRegion'/>
                    </div>
                    <div className='about__contact__col about__contact__name'>Dedi JUNADI</div>
                    <a href='mailto:dedi.junadi@ifrc.org' className='about__contact__col about__contact__email'>dedi.junadi@ifrc.org</a>
                    <div className='about__contact__col about__contact__region'>
                      <Translate stringId='aboutEuropeRegion'/>
                    </div>
                    <div className='about__contact__col about__contact__name'>Anssi ANONEN</div>
                    <a href='mailto:anssi.anonen@ifrc.org' className='about__contact__col about__contact__email'>anssi.anonen@ifrc.org</a>
                    <div className='about__contact__col about__contact__region'>
                      <Translate stringId='aboutMenaRegion'/>
                    </div>
                    <div className='about__contact__col about__contact__name'>Ahmad AL JAMAL</div>
                    <a href='mailto:ahmad.aljamal@ifrc.org' className='about__contact__col about__contact__email'>ahmad.aljamal@ifrc.org</a>
                  </div>
                </div>
              </section>

              <section className='logo__group'>
                <div className='row--centered row-fold'>
                  <p className='logo__title text-center'>
                    <Translate stringId='aboutGoFunding'/>
                  </p>
                  <ul className='logo__list clearfix'>
                    <li className='logo__item'>
                      <a href='http://www.redcross.org/' target='_blank'>
                        <img src='/assets/graphics/content/arc_logo.png' alt='Visit American Red Cross Page' width='160' />
                      </a>
                    </li>
                    <li className='logo__item'>
                      <a href='http://www.redcross.org.uk/' target='_blank'>
                        <img src='/assets/graphics/content/brc_logo.png' alt='Visit British Red Cross Page' width='170'/>
                      </a>
                    </li>
                    <li className='logo__item'>
                      <a href='http://www.jrc.or.jp/english/' target='_blank'>
                        <img src='/assets/graphics/content/jrc_logo.png' alt='Visit Japanese Red Cross Page' width='154'/>
                      </a>
                    </li>
                    <li className='logo__item'>
                      <a href='http://www.redcross.ca/' target='_blank'>
                        <img src='/assets/graphics/content/crc_logo.png' alt='Visit Canadian Red Cross Page' width='120'/>
                      </a>
                    </li>
                    <li className='logo__item'>
                      <a href='https://www.rodekruis.nl/' target='_blank'>
                        <img src='/assets/graphics/content/nlrc_logo.jpg' alt='Visit Netherlands Red Cross Page' width='160'/>
                      </a>
                    </li>
                    <li className='logo__item'>
                      <a href='https://www.cruzroja.es/' target='_blank'>
                        <img src='/assets/graphics/content/esp_logo.jpg' alt='Visit Spanish Red Cross Page' width='180'/>
                      </a>
                    </li>
                    <li className='logo__item'>
                      <a href='https://www.redcross.org.au/' target='_blank'>
                        <img src='/assets/graphics/content/aurc_logo.jpg' alt='Visit Australian Red Cross Page' width='200'/>
                      </a>
                    </li>
                    <li className='logo__item'>
                      <a href='https://www.ericsson.com/en' target='_blank'>
                        <img src='/assets/graphics/content/ericsson_logo.png' alt='Visit Ericsson Page' width='140'/>
                      </a>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

About.contextType = LanguageContext;

