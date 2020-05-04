'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import App from './app';
import VideoCarousel from '../components/about/video-carousel';

export default class About extends React.Component {
  render () {
    return (
      <App className='page--about'>
        <Helmet>
          <title>IFRC Go - About</title>
        </Helmet>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Resources</h1>
                <p className='text-center'>GO is a Red Cross Red Crescent platform to connect information on emergency needs with the right response.</p>
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
                    <section className='section__about__guides__ref'>
                      <div className='text-center'>
                        <div className='line-brand-deco-border-top-wrap'>
                          <div className='line-brand-deco-border-top'></div>
                          <h2 className='fold__title text-center'>Go user guidance</h2>
                        </div>
                      </div>

                      <div className='box__global__wrap__about clearfix'>
                        <div className='box__global box__global--about-guides'>
                          <div className='box__global__heading'>
                            <div className='base-font-semi-bold'>GO User and Administrative Guides</div>
                            <p className='font-size-sm margin-reset'>User guides help to explain the different functions and features of GO. Administrator guides include also back-end functions aimed at people who are helping to manage the site.</p>
                          </div>
                          <div className='box__global__content'>
                            <div className='clearfix'>
                              <Link to='#' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>EN</span>
                                </span>
                                <span>GO user guide</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>

                              <Link to='#' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>FR</span>
                                </span>
                                <span>Guides d'Utilisation</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>

                              <Link to='#' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>SP</span>
                                </span>
                                <span>Guías de Usuario</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>

                              <Link to='#' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>AR</span>
                                </span>
                                <span>Text in Arabic</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>

                              <Link to='#' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>EN</span>
                                </span>
                                <span>Administrative Guides</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>

                              <Link to='#' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>FR</span>
                                </span>
                                <span>Guides Administratifs</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>

                              <Link to='#' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>SP</span>
                                </span>
                                <span>Guías Administrativas</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>

                              <Link to='#' className='box__global__content--ref__link'>
                                <span className='icon__circle'>
                                  <span className='icon__circle__content'>AR</span>
                                </span>
                                <span>Text in Arabic</span>
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>
                            </div>
                          </div>
                        </div>

                        <div className='box__global box__global--about-ref'>
                          <div className='box__global__heading'>
                            <div className='base-font-semi-bold'>GO Reference Materials</div>
                            <p className='font-size-sm margin-reset'>These materials provide more information on how and why GO does what it does.</p>
                          </div>
                          <div className='box__global__content'>
                            <div className='box__global__content--ref clearfix'>
                              <Link to='#' className='box__global__content--ref__link'>
                                GO Visual Guidelines
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>
                              <Link to='#' className='box__global__content--ref__link'>
                                GO Visual Guidelines
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>
                              <Link to='#' className='box__global__content--ref__link'>
                                GO User Studies
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>
                              <Link to='#' className='box__global__content--ref__link'>
                                GO User Studies
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>
                              <Link to='#' className='box__global__content--ref__link'>
                                Reference Materials
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>
                              <Link to='#' className='box__global__content--ref__link'>
                                Reference Materials
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>
                              <Link to='#' className='box__global__content--ref__link'>
                                3W Lessons Learned
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>
                              <Link to='#' className='box__global__content--ref__link'>
                                3W Lessons Learned
                                <span className='collecticon-chevron-right icon-about-ref'></span>
                              </Link>
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
                      <h2 className='fold__title text-center'>IFRC Resources</h2>
                    </div>
                  </div>
                  <div className='about__resources'>
                    <div className='about__resources__row clearfix'>
                      <div className='box__global box__global--resources'>
                        {/* <span className='collecticon-circle-information icon__about__resources'></span> */}
                        <div className='box__global__heading'>
                          <div className='base-font-semi-bold'>IFRC Surge Services</div>
                        </div>
                        <div className='box__global__content'>
                          <Link to='#' className='box__global__content--ref__link'>
                            <span>Catalogue of surge services</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>

                          <Link to='#' className='box__global__content--ref__link'>
                            <span>Catalogue of surge services</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>

                          <Link to='#' className='box__global__content--ref__link'>
                            <span>Catalogue of surge services</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>
                        </div>
                      </div>

                      <div className='box__global box__global--resources'>
                        {/* <span className='collecticon-circle-information icon__about__resources'></span> */}
                        <div className='box__global__heading'>
                          <div className='base-font-semi-bold'>IFRC Guidance Material</div>
                        </div>
                        <div className='box__global__content'>
                          <Link to='#' className='box__global__content--ref__link'>
                            <span>Cash Hub</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>

                          <Link to='#' className='box__global__content--ref__link'>
                            <span>CEA hub</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>

                          <Link to='#' className='box__global__content--ref__link'>
                            <span>PrepareCentre</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>
                        </div>
                      </div>

                      <div className='box__global box__global--resources'>
                        {/* <span className='collecticon-circle-information icon__about__resources'></span> */}
                        <div className='box__global__heading'>
                          <div className='base-font-semi-bold'>Other IFRC Resources</div>
                        </div>
                        <div className='box__global__content'>
                          <Link to='#' className='box__global__content--ref__link'>
                            <span>Missing Maps</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>

                          <Link to='#' className='box__global__content--ref__link'>
                            <span>FDRS</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>

                          <Link to='#' className='box__global__content--ref__link'>
                            <span>Learning Platform</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>

                          <Link to='#' className='box__global__content--ref__link'>
                            <span>Forecasts in Context</span>
                            <span className='collecticon-chevron-right icon-about-ref'></span>
                          </Link>
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
                    <h2 className='fold__title text-center'>Go Contacts</h2>
                  </div>
                </div>
                <div className='about__contact'>
                  <p className='about__contact__info__block clearfix'>
                    <span className='about__contact__info'><strong>For any further information, please contact</strong></span>
                    <span className='about__contact__link'>
                      <a href='mailto:im@ifrc.org' className='button button--primary-filled button--small'>im@ifrc.org</a>
                    </span>
                  </p>
                  <div className='clearfix'>
                    <div className='about__contact__col about__contact__region'>Africa Region</div>
                    <div className='about__contact__col about__contact__name'>Ted Bolton</div>
                    <a href='mailto:RRIM.Africa@ifrc.org' className='about__contact__col about__contact__email'>RRIM.Africa@ifrc.org</a>
                    <div className='about__contact__col about__contact__region'>Americas Region</div>
                    <div className='about__contact__col about__contact__name'>Luis Fanovich</div>
                    <a href='mailto:Luis.FANOVICH@ifrc.org' className='about__contact__col about__contact__email'>Luis.FANOVICH@ifrc.org</a>
                    <div className='about__contact__col about__contact__region'>Asia Pacific Region</div>
                    <div className='about__contact__col about__contact__name'>Dedi Junadi</div>
                    <a href='mailto:Dedi.JUNADI@ifrc.org' className='about__contact__col about__contact__email'>Dedi.JUNADI@ifrc.org</a>
                    <div className='about__contact__col about__contact__region'>Europe Region</div>
                    <div className='about__contact__col about__contact__name'>Anssi Anonen</div>
                    <a href='mailto:Anssi.ANONEN@ifrc.org' className='about__contact__col about__contact__email'>Anssi.ANONEN@ifrc.org</a>
                    <div className='about__contact__col about__contact__region'>MENA Region</div>
                    <div className='about__contact__col about__contact__name'>Ahmad Al Jamal</div>
                    <a href='mailto:Ahmad.ALJAMAL@ifrc.org' className='about__contact__col about__contact__email'>Ahmad.ALJAMAL@ifrc.org</a>
                  </div>
                </div>
              </section>

              <section className='logo__group'>
                <div className='row--centered row-fold'>
                  <p className='logo__title text-center'>GO has received dedicated personnel and funding support from:</p>
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
