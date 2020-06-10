
import React from 'react';

export default class ContactPer extends React.Component {
  render () {
    return (
      <div className='inner' style={{textAlign: 'center'}}>
        <a href='mailto:PER.Team@ifrc.org' className='button button--medium button--primary-filled global-margin-t'>Contact PER team</a>
        <p style={{marginTop: '10px'}}>
          Click on the button to contact PER team if you have any questions regarding the PER process.
        </p>
      </div>
    );
  }
}
