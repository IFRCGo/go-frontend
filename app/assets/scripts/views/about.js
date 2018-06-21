'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';

import App from './app';

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
                <h1 className='inpage__title'>About</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='fold'>
                <div className='inner'>
                  <h3>What is Go?</h3>
                  <p>With Go we aim to create a team of multifunctional information and data professionals within the IFRC who operate with a set of common design principles. This team will support internal change around data services and catalyze collaboration with technology partners, humanitarian organizations, governments, and civil society organizations, individuals and communities on this journey. The team will work with all parts of the IFRC and ICRC where possible to create analyze and share relevant data.</p>
                  <h3>Go Work Streams</h3>
                  <p>The Go Team will deliver three major streams of work focusing on i) Data literacy - building the basic organizational foundations of better data services, ii) Single-context situational awareness (small/medium size disaster information) - improving information management within a specific small to medium crisis response including ongoing global overview, and iii) Multi-context complex awareness (major disaster information) - to establish an emergency center that provides Federation leaders with processes, systems and products to increase informational coherence and decision-making during multiple large global crisis response operations.</p>
                  <h3>Go Products and Services</h3>
                  <p>Within these work streams, the Go Platform will deliver a suite of solutions that make disaster information universally available and useful for IFRC responders. Examples of these solutions include programs to create good data habits; analytics; data visualizations; trend analysis; hazard mapping; response mapping; gap analysis; and an innovation lab to liaise with and build on existing partnerships with key private sector, United Nations, Non Governmental Organizations.</p>
                  <section className='logo__group'>
                    <p className='logo__title'>Go has received dedicated personnel and funding support from:</p>
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
                    </ul>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}
