'use strict';

import React from 'react';
import Carousel from '@brainhubeu/react-carousel';

export default class VideoCarousel2 extends React.Component {
  render () {
    return (
      <Carousel
        arrows
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
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/5QSFGJN5Tpo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>How to Create Field Reports</div>
          <div className='about__video__carousel__each__subheading'>Description of the Video</div>
        </div>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/fZgWHWt46pA" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>How to Create Field Reports</div>
          <div className='about__video__carousel__each__subheading'>Description of the Video</div>
        </div>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/uc098C2t2ps" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>How to Create Field Reports</div>
          <div className='about__video__carousel__each__subheading'>Description of the Video</div>
        </div>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/5QSFGJN5Tpo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>How to Create Field Reports</div>
          <div className='about__video__carousel__each__subheading'>Description of the Video</div>
        </div>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/fZgWHWt46pA" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>How to Create Field Reports</div>
          <div className='about__video__carousel__each__subheading'>Description of the Video</div>
        </div>
        <div>
          <div className='iframe__embed'>
            <iframe width="560" height="315" className='iframe__embed__video' src="https://www.youtube.com/embed/uc098C2t2ps" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          <div className='about__video__carousel__each__heading'>How to Create Field Reports</div>
          <div className='about__video__carousel__each__subheading'>Description of the Video</div>
        </div>
      </Carousel>
    );
  }
}
