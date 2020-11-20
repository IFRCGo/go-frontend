
import React from 'react';
import Carousel from '@brainhubeu/react-carousel';

import LanguageContext from '#root/languageContext';

export default class VideoCarousel2 extends React.Component {
  render () {
    const { strings } = this.context;
    const videoLinks = [
      {
        'id': 1,
        'embedID': 'https://www.youtube.com/embed/RzP9jZqt-Zk',
        'heading': strings.videoCarouselHeadingTranslations,
        'subHeading': strings.videoCarouselSubHeadingTranslations
      },
      {
        'id': 2,
        'embedID': 'https://www.youtube.com/embed/E1TuUEEMBRM',
        'heading': strings.videoCarouselHeading3W,
        'subHeading': strings.videoCarouselSubHeading3W,
      },
      {
        'id': 3,
        'embedID': 'https://www.youtube.com/embed/QiDwKVr5pxg',
        'heading': strings.videoCarouselHeading3WInstructional,
        'subHeading': strings.videoCarouselSubHeading3WInstructional,
      },
      {
        'id': 4,
        'embedID': 'https://www.youtube.com/embed/adBR-U26XZs',
        'heading': strings.videoCarouselHeadingFieldReport,
        'subHeading': strings.videoCarouselSubHeadingFieldReport,
      },
      {
        'id': 5,
        'embedID': 'https://www.youtube.com/embed/JAQ_yixX57A',
        'heading': strings.videoCarouselHeadingPER,
        'subHeading': strings.videoCarouselSubHeadingPER,
      },
      {
        'id': 6,
        'embedID': 'https://www.youtube.com/embed/wEz70tcwWx8',
        'heading': strings.videoCarouselHeadingSubscribe,
        'subHeading': strings.videoCarouselSubHeadingSubscribe,
      }
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

VideoCarousel2.contextType = LanguageContext;
