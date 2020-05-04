'use strict';

import React from 'react';
import Carousel from '@brainhubeu/react-carousel';

export default class VideoCarousel2 extends React.Component {
  render () {
    return (
      <Carousel
        arrows
        offset={30}
        slidesPerPage={3}
        slidesPerScroll={3}
        centered={false}
        breakpoints={{
          1000: {
            slidesPerPage: 2,
            slidesPerScroll: 2,
          },
          600: {
            slidesPerPage: 1,
            slidesPerScroll: 1,
          }
        }}
        className='about__video__carousel'>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/E1TuUEEMBRM" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>3W - Who does What, Where. (EN)</div>
          <div className='about__video__carousel__each__subheading'>GO platform tool to enhance coordination, improve disaster analysis, and elevate the speed and quality of Red Cross Red Crescent emergency response.</div>
        </div>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/Z1UZ4ZlkOeE" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>3W - Who does What, Where. (FR)</div>
          <div className='about__video__carousel__each__subheading'>GO platform tool to enhance coordination, improve disaster analysis, and elevate the speed and quality of Red Cross Red Crescent emergency response.</div>
        </div>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/ojEZM5SU66I" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>3W - Who does What, Where. (ES)</div>
          <div className='about__video__carousel__each__subheading'>GO platform tool to enhance coordination, improve disaster analysis, and elevate the speed and quality of Red Cross Red Crescent emergency response.</div>
        </div>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/ApN4cptAcM0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>3W - Who does What, Where. (AR)</div>
          <div className='about__video__carousel__each__subheading'>GO platform tool to enhance coordination, improve disaster analysis, and elevate the speed and quality of Red Cross Red Crescent emergency response.</div>
        </div>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/QiDwKVr5pxg" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>How to use and navigate through the IFRC's GO platform (EN)</div>
          <div className='about__video__carousel__each__subheading'>Find out how to use and navigate through the IFRC’s GO platform.</div>
        </div>
      </Carousel>
    );
  }
}
