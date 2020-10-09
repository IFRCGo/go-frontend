import React from 'react';
import Translate from '#components/Translate';

class GlobalHeaderBanner extends React.PureComponent {
  render () {
    return (
      // // COVID banner
      // <div className='global__banner global__banner--danger text-center'>
      //   <Translate
      //     stringId='globalHeaderBannerTitle'
      //     params={{
      //       link: (
      //         <a href='https://go.ifrc.org/emergencies/3972'>
      //           <Translate stringId='globalHeaderBannerHere'/>
      //         </a>
      //       )
      //     }}
      //   />
      // </div>
      // // Survey banner
      <div className='global__banner global__banner--danger text-center'>
        <Translate
          stringId='globalHeaderBannerSurveyTitle'
          params={{
            link: (
              <a href='https://forms.gle/AWzRXKLyfzM6Tnmi9'>
                <Translate stringId='globalHeaderBannerSurveyLink'/>
              </a>
            )
          }}
        />
      </div>
    );
  }
}

export default GlobalHeaderBanner;
