import React from 'react';
import App from './app';
import PreparednessHeader from '#components/preparedness/preparedness-header';
import { connect } from 'react-redux';
import BreadCrumb from '#components/breadcrumb';
import { Helmet } from 'react-helmet';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TabContent from '#components/tab-content';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class Preparedness extends React.Component {
  constructor (props, context) {
    super(props);

    this.tabDetails = [
      { title: context.strings.prepGlobalTrendsTab, hash: '#global-trends' },
      { title: context.strings.prepGlobalPerformanceTab, hash: '#global-performance' },
      { title: context.strings.prepResourceCatalogueTab, hash: '#resources-catalogue' },
      { title: context.strings.prepOpLearningTab, hash: '#operational-learning' },
    ];
  }
  

  render () {
    const { strings } = this.context;

    const handleTabChange = index => {
      const tabHashArray = this.tabDetails.map(({ hash }) => hash);
      const url = this.props.location.pathname;
      this.props.history.replace(`${url}${tabHashArray[index]}`);
    };

    const iFrames = [
      'https://app.powerbi.com/view?r=eyJrIjoiYzliMzU5MzAtMjQ1ZC00YzY3LTg2MTgtNTI5NTI4MDNjZDM2IiwidCI6IjIyMmM0ZDE1LTA3ZmMtNDZhNi04ZTJjLTk0NDY0OTIxNmVjZCIsImMiOjN9',
      'https://app.powerbi.com/view?r=eyJrIjoiYzliMzU5MzAtMjQ1ZC00YzY3LTg2MTgtNTI5NTI4MDNjZDM2IiwidCI6IjIyMmM0ZDE1LTA3ZmMtNDZhNi04ZTJjLTk0NDY0OTIxNmVjZCIsImMiOjN9',
      'https://app.powerbi.com/view?r=eyJrIjoiNzRhMWFkMmItODA1OC00NzdiLTk2NTItZDM5NjA1Y2ViOWQ1IiwidCI6IjIyMmM0ZDE1LTA3ZmMtNDZhNi04ZTJjLTk0NDY0OTIxNmVjZCIsImMiOjN9',
      'https://app.powerbi.com/view?r=eyJrIjoiMTM4Y2ZhZGEtNGZmMS00ODZhLWFjZjQtMTE2ZTIyYTI0ODc4IiwidCI6ImEyYjUzYmU1LTczNGUtNGU2Yy1hYjBkLWQxODRmNjBmZDkxNyIsImMiOjh9&pageName=ReportSectionfa0be9512521e929ae4a'
    ];

    return (
      <App className='page--homepage'>
        <section className='inpage'>
          <Helmet>
            <title>{strings.preparednessTitle}</title>
          </Helmet>
          <BreadCrumb crumbs={[
            {link: '/preparedness', name: strings.breadCrumbPreparedness},
            {link: '/', name: strings.breadCrumbHome}
          ]} />
          <header className='inpage__header'>
            <div className='inner container-lg'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>
                  <Translate stringId='preparednessHeading' />
                </h1>
                <p className='inpage__introduction container-lg'>
                  <Translate stringId='preparednessDescription' />
                </p>
              </div>
            </div>
          </header>

          <div className='inpage__body'>
            <PreparednessHeader />

            <div className='tab__wrap'>
              <Tabs
                selectedIndex={this.tabDetails.map(({ hash }) => hash).indexOf(this.props.location.hash)}
                onSelect={index => handleTabChange(index)}
              >
                <TabList>
                  {this.tabDetails.map(tab => (
                    <Tab key={tab.title}>{tab.title}</Tab>
                  ))}
                </TabList>

                <div className='inpage__body'>
                  <div className='inner'>
                    <TabPanel title={strings.prepGlobalTrendsTab}>
                      <TabContent>
                      <div className='container-lg'>
                        <iframe
                          src={iFrames[0]}
                          title={strings.prepGlobalTrendsTab}
                          frameBorder='0'
                          width='100%'
                          height='800px'
                        />
                      </div>
                      </TabContent>
                    </TabPanel>
                    <TabPanel title={strings.prepGlobalPerformanceTab}>
                      <TabContent>
                      <div className='container-lg'>
                        <iframe
                          src={iFrames[1]}
                          title={strings.prepGlobalPerformanceTab}
                          frameBorder='0'
                          width='100%'
                          height='800px'
                        />
                      </div>
                      </TabContent>
                    </TabPanel>
                    <TabPanel title={strings.prepResourceCatalogueTab}>
                      <TabContent>
                        <div className='container-lg'>
                          <iframe
                            src={iFrames[2]}
                            title={strings.prepResourceCatalogueTab}
                            frameBorder='0'
                            width='100%'
                            height='800px'
                          />
                        </div>
                      </TabContent>
                    </TabPanel>
                    <TabPanel title={strings.prepOpLearningTab}>
                      <TabContent>
                        <div className='container-lg'>
                          <iframe
                            src={iFrames[3]}
                            title={strings.prepOpLearningTab}
                            frameBorder='0'
                            width='100%'
                            height='800px'
                          />
                        </div>
                      </TabContent>
                    </TabPanel>
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </section>
      </App>);
  }
}

if (environment !== 'production') {
  Preparedness.propTypes = {
    user: T.object,
  };
}

const selector = (state) => ({
  user: state.user
});

Preparedness.contextType = LanguageContext;
export default connect(selector)(Preparedness);
