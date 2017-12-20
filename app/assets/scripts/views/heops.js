'use strict';
import React from 'react';

import App from './app';

export default class HeOps extends React.Component {
  render () {
    return (
      <App className='page--about'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>HeOps Deployments</h1>
                <div className='inpage__headline-charts'>
                  <h1 className='visually-hidden'>HeOps over time</h1>
                  <figure className='chart'>
                    <figcaption>Heops Deployments by Year</figcaption>
                    <div className='chart__container'>
                     
                    </div>
                  </figure>
                  <figure className='chart'>
                    <figcaption>Heops Deployments by Emergency Type</figcaption>
                    <div className='chart__container'>
                      
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='fold'>
                <div className='inner'>
                  <table className='table table--zebra responsive-table'>
                    <thead>
                      <tr>
                      <th><a className='table__sort table__sort--none'>Start Date</a></th>
                      <th><a className='table__sort table__sort--none'>End Date</a></th>
                      <th>Emergency</th>
                      <th>Country</th>
                      <th><a className='table__filter'>Region</a></th>
                      <th><a className='table__filter'>Name</a></th>
                      <th>Deployed Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                       <td>2017-03-27</td>
                       <td>2017-05-12</td>
                       <td><a href='' className='link--primary'>Food Insecurity</a></td>
                       <td><a href='' className='link--primary'>Keyna</a></td>
                       <td><a href='' className='link--primary'>Africa</a></td>
                       <td>Florent Del Pinto</td>
                       <td>HeOps</td>
                      </tr>
                      <tr>
                       <td>2017-03-27</td>
                       <td>2017-05-12</td>
                       <td><a href='' className='link--primary'>Food Insecurity</a></td>
                       <td><a href='' className='link--primary'>Keyna</a></td>
                       <td><a href='' className='link--primary'>Africa</a></td>
                       <td>Florent Del Pinto</td>
                       <td>HeOps</td>
                      </tr>
                      <tr>
                       <td>2017-03-27</td>
                       <td>2017-05-12</td>
                       <td><a href='' className='link--primary'>Food Insecurity</a></td>
                       <td><a href='' className='link--primary'>Keyna</a></td>
                       <td><a href='' className='link--primary'>Africa</a></td>
                       <td>Florent Del Pinto</td>
                       <td>HeOps</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}
