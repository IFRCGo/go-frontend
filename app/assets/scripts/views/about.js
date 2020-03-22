'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import BreadCrumb from '../components/breadcrumb';

import App from './app';

export default class About extends React.Component {
  render () {
    return (
      <App className='page--about'>
        <Helmet>
          <title>IFRC Go - About</title>
        </Helmet>
        <BreadCrumb crumbs={[
          {link: '/about', name: 'About'},
          {link: '/', name: 'Home'}
        ]} />
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>About</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='fold'>
                <div className='inner'>
                  <center>
                    <p><strong>GO is a Red Cross Red Crescent platform to connect information on emergency needs with the right response.</strong></p>
                    <p>&nbsp;</p>
                    <iframe width="604" height="340" src="https://www.youtube.com/embed/dwPsQzla9A4" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    <p>&nbsp;</p>
                    <p>User and administrator <a href="https://drive.google.com/open?id=1F3YQ17AKOvCUvvE4EGgy5pZ0L55_xy2d">guides</a>:</p>
                    <p><a href="https://drive.google.com/open?id=1C6PU6wd5KRDpwyLoDcb1GFLWFHyf65Xp"><img src="/assets/graphics/content/usr.jpg" alt="user-guide"/></a>
                      &nbsp;&nbsp;
                      <a href="https://drive.google.com/open?id=1Hm5q6hcudJaCSqSIIf0uaMfTboMJlfkL"><img src="/assets/graphics/content/adm.jpg" alt="admin-guide"/></a>
                    </p>
                    <p>&nbsp;</p>
                    <p>For any further information, please contact <a href="mailto:IM@ifrc.org">IM@ifrc.org</a></p>
                    <section className='logo__group'>
                      <p className='logo__title'>GO has received dedicated personnel and funding support from:</p>
                      <ul className='logo__list'>
                        <li className='logo__item'>
                          <a href='http://www.redcross.org/' target='_blank'>
                            <img src='/assets/graphics/content/arc_logo.png' alt='Visit American Red Cross Page'/>
                          </a>
                        </li>
                        <li className='logo__item'>
                          <a href='http://www.redcross.org.uk/' target='_blank'>
                            <img src='/assets/graphics/content/brc_logo.png' alt='Visit British Red Cross Page'/>
                          </a>
                        </li>
                        <li className='logo__item'>
                          <a href='http://www.jrc.or.jp/english/' target='_blank'>
                            <img src='/assets/graphics/content/jrc_logo.png' alt='Visit Japanese Red Cross Page'/>
                          </a>
                        </li>
                        <li className='logo__item'>
                          <a href='http://www.redcross.ca/' target='_blank'>
                            <img src='/assets/graphics/content/crc_logo.png' alt='Visit Canadian Red Cross Page'/>
                          </a>
                        </li>
                        <li className='logo__item'>
                          <a href='https://www.rodekruis.nl/' target='_blank'>
                            <img src='/assets/graphics/content/nlrc_logo.jpg' alt='Visit Netherlands Red Cross Page'/>
                          </a>
                        </li>
                        <li className='logo__item'>
                          <a href='https://www.cruzroja.es/' target='_blank'>
                            <img src='/assets/graphics/content/esp_logo.jpg' alt='Visit Spanish Red Cross Page'/>
                          </a>
                        </li>
                        <li className='logo__item'>
                          <a href='https://www.ericsson.com/en' target='_blank'>
                            <img src='/assets/graphics/content/ericsson_logo.png' alt='Visit Ericsson Page'/>
                          </a>
                        </li>
                        <li className='logo__item'>
                          <a href='https://www.redcross.org.au/' target='_blank'>
                            <img src='/assets/graphics/content/aurc_logo.jpg' alt='Visit Australian Red Cross Page'/>
                          </a>
                        </li>
                      </ul>
                    </section>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}
