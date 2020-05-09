'use strict';

import React from 'react';
import Carousel from '@brainhubeu/react-carousel';

export default class VideoCarousel2 extends React.Component {
  render () {
    const videoLinks = [
      {
        'id': 1,
        'embedID': 'https://www.youtube.com/embed/E1TuUEEMBRM',
        'heading': '3W - Who does What, Where.',
        'subHeading': 'The "Who does What, Where", or 3W, is a GO platform tool to enhance coordination, improve disaster analysis, and elevate the speed and quality of Red Cross Red Crescent emergency response.',
      },
      {
        'id': 2,
        'embedID': 'https://www.youtube.com/embed/QiDwKVr5pxg',
        'heading': 'GO Platform Training Series: 3W Instructional',
        'subHeading': 'View this video tutorial on how to manage the 3W tool data  (Who, What, Where) and generate useful and visually pleasant information products on the GO Platform - International Federation of Red Cross Red Crescent (IFRC).',
      },
      {
        'id': 3,
        'embedID': 'https://www.youtube.com/embed/adBR-U26XZs',
        'heading': 'GO Platform Training Series: Field Report COVID-19',
        'subHeading': 'View this video tutorial on how to create a "Field Report" COVID-19 on the GO Platform - International Federation of Red Cross Red Crescent (IFRC).',
      },
      {
        'id': 4,
        'embedID': 'https://www.youtube.com/embed/JAQ_yixX57A',
        'heading': 'GO Platform Training Series: Preparedness for Effective Response Module',
        'subHeading': 'View this video tutorial on how to navigate on the Preparedness for Effective Response (PER) module on the GO Platform - International Federation of Red Cross Red Crescent (IFRC).',
      },
      {
        'id': 5,
        'embedID': 'https://www.youtube.com/embed/wEz70tcwWx8',
        'heading': 'GO Platform Training Series: Subscriptions to User Notifications',
        'subHeading': 'View this video tutorial on how to "Subscribe to User Notifications" on the GO Platform - International Federation of Red Cross Red Crescent (IFRC).',
      },
    ];

    const videoLinkItems = videoLinks.map((videoLink) =>
      <div key={videoLink.id}>
        <div className='iframe__embed'>
          <iframe width="560" height="315" className='iframe__embed__video' src={videoLink.embedID} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
        <div className='about__video__carousel__each__heading'>{videoLink.heading}</div>
        <div className='about__video__carousel__each__subheading'>{videoLink.subHeading}</div>
      </div>
    );

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
        {videoLinkItems}
      </Carousel>
    );
  }
}
