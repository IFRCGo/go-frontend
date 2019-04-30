import React from 'react';

class A3OperationCapacity extends React.Component {
  constructor (props) {
    super(props);
    this.sendForm = this.sendForm.bind(this);
    this.chooseLanguage = this.chooseLanguage.bind(this);
    this.setLanguageToSpanish = this.setLanguageToSpanish.bind(this);
    this.setLanguageToEnglish = this.setLanguageToEnglish.bind(this);
    this.setLanguageToFrench = this.setLanguageToFrench.bind(this);
    this.state = englishForm;
  }

  chooseLanguage (e) {
    if (e.target.value === 'english') {
      this.setLanguageToEnglish();
    } else if (e.target.value === 'spanish') {
      this.setLanguageToSpanish();
    } else if (e.target.value === 'french') {
      this.setLanguageToFrench();
    }
  }

  setLanguageToEnglish () {
    this.setState(englishForm);
  }

  setLanguageToSpanish () {
    this.setState(spanishForm);
  }

  setLanguageToFrench () {
    this.setState(frenchForm);
  }

  render () {
    const forms = [];

    this.state.components.forEach(component => {
      const namespaces = [];

      component.namespaces.forEach(namespace => {
        const answers = [];

        namespace.nsAnswers.forEach(answer => {
          answers.push(<React.Fragment>
            <input type='radio' name='q11' value={answer} /> {answer}<br />
          </React.Fragment>);
        });

        namespaces.push(<React.Fragment>
          <div className='per_form_ns'>{namespace.nsTitle}</div>
          <div className='per_form_question'>{namespace.nsQuestion}</div>
          {answers}
          <div className='per_form_question'>{namespace.feedbackTitle}</div>
          {typeof namespace.feedbackDescription !== 'undefined' && namespace.feedbackDescription !== null && namespace.feedbackDescription.trim() !== '' ? (<React.Fragment>{namespace.feedbackDescription}<br /></React.Fragment>) : null}
          <input type='text' name='q11f' /><br /><br />
        </React.Fragment>);
      });

      forms.push(<React.Fragment>
        <div className='per_form_area'>{component.componentTitle}</div>
        {component.componentDescription}<br /><br />
        {namespaces}
      </React.Fragment>);
    });

    return (
      <div className='fold'>
        <div className='inner'>
          <select onChange={this.chooseLanguage}>
            <option value='english'>English</option>
            <option value='spanish'>Spanish</option>
            <option value='french'>French</option>
          </select>

          <div className="fold__header">
            <h2 className="fold__title">{this.state.title}</h2>
          </div>

          <div className='per_form_area'>{this.state.areaTitle}</div>
          <div className='per_form_question'>{this.state.areaQuestion}</div>
          <input type='radio' name='a1' value={this.state.areaOptions[0]} /> {this.state.areaOptions[0]} <br />
          <input type='radio' name='a1' value={this.state.areaOptions[1]} /> {this.state.areaOptions[1]}

          {forms}

          <input type='checkbox' name='' value='' /> Save as Draft<br />
          <button onClick={this.sendForm}>Submit</button>

        </div>
      </div>
    );
  }

  sendForm () {
    const q11 = document.querySelector('input[name="q11"]:checked') !== null ? document.querySelector('input[name="q11"]:checked').value : 0;
    const q12 = document.querySelector('input[name="q12"]:checked') !== null ? document.querySelector('input[name="q12"]:checked').value : 0;
    const q13 = document.querySelector('input[name="q13"]:checked') !== null ? document.querySelector('input[name="q13"]:checked').value : 0;
    const q14 = document.querySelector('input[name="q14"]:checked') !== null ? document.querySelector('input[name="q14"]:checked').value : 0;
    const q1 = document.querySelector('input[name="q1"]:checked') !== null ? document.querySelector('input[name="q1"]:checked').value : 0;
    const q21 = document.querySelector('input[name="q21"]:checked') !== null ? document.querySelector('input[name="q21"]:checked').value : 0;
    const q22 = document.querySelector('input[name="q22"]:checked') !== null ? document.querySelector('input[name="q22"]:checked').value : 0;
    const q23 = document.querySelector('input[name="q23"]:checked') !== null ? document.querySelector('input[name="q23"]:checked').value : 0;
    const q2 = document.querySelector('input[name="q2"]:checked') !== null ? document.querySelector('input[name="q2"]:checked').value : 0;
    const q31 = document.querySelector('input[name="q31"]:checked') !== null ? document.querySelector('input[name="q31"]:checked').value : 0;
    const q32 = document.querySelector('input[name="q32"]:checked') !== null ? document.querySelector('input[name="q32"]:checked').value : 0;
    const q33 = document.querySelector('input[name="q33"]:checked') !== null ? document.querySelector('input[name="q33"]:checked').value : 0;
    const q34 = document.querySelector('input[name="q34"]:checked') !== null ? document.querySelector('input[name="q34"]:checked').value : 0;
    const q3 = document.querySelector('input[name="q3"]:checked') !== null ? document.querySelector('input[name="q3"]:checked').value : 0;
    const q41 = document.querySelector('input[name="q41"]:checked') !== null ? document.querySelector('input[name="q41"]:checked').value : 0;
    const q42 = document.querySelector('input[name="q42"]:checked') !== null ? document.querySelector('input[name="q42"]:checked').value : 0;
    const q43 = document.querySelector('input[name="q43"]:checked') !== null ? document.querySelector('input[name="q43"]:checked').value : 0;
    const q44 = document.querySelector('input[name="q44"]:checked') !== null ? document.querySelector('input[name="q44"]:checked').value : 0;
    const q45 = document.querySelector('input[name="q45"]:checked') !== null ? document.querySelector('input[name="q45"]:checked').value : 0;
    const q4 = document.querySelector('input[name="q4"]:checked') !== null ? document.querySelector('input[name="q4"]:checked').value : 0;
    const q51 = document.querySelector('input[name="q51"]:checked') !== null ? document.querySelector('input[name="q51"]:checked').value : 0;
    const q52 = document.querySelector('input[name="q52"]:checked') !== null ? document.querySelector('input[name="q52"]:checked').value : 0;
    const q53 = document.querySelector('input[name="q53"]:checked') !== null ? document.querySelector('input[name="q53"]:checked').value : 0;
    const q54 = document.querySelector('input[name="q54"]:checked') !== null ? document.querySelector('input[name="q54"]:checked').value : 0;
    const q55 = document.querySelector('input[name="q55"]:checked') !== null ? document.querySelector('input[name="q55"]:checked').value : 0;
    const q56 = document.querySelector('input[name="q56"]:checked') !== null ? document.querySelector('input[name="q56"]:checked').value : 0;
    const q57 = document.querySelector('input[name="q57"]:checked') !== null ? document.querySelector('input[name="q57"]:checked').value : 0;
    const q58 = document.querySelector('input[name="q58"]:checked') !== null ? document.querySelector('input[name="q58"]:checked').value : 0;
    const q59 = document.querySelector('input[name="q59"]:checked') !== null ? document.querySelector('input[name="q59"]:checked').value : 0;
    const q5 = document.querySelector('input[name="q5"]:checked') !== null ? document.querySelector('input[name="q5"]:checked').value : 0;

    const data = JSON.stringify({
      code: 'A1',
      name: 'Nemo',
      language: 1,
      data: [
        {id: '1.1', op: q11, nt: 'no ti'},
        {id: '1.2', op: q12, nt: 'no ti'},
        {id: '1.3', op: q13, nt: 'no ti'},
        {id: '1.4', op: q14, nt: 'no ti'},
        {id: '1', op: q1, nt: 'no ti'},
        {id: '2.1', op: q21, nt: 'no ti'},
        {id: '2.2', op: q22, nt: 'no ti'},
        {id: '2.3', op: q23, nt: 'no ti'},
        {id: '2', op: q2, nt: 'no ti'},
        {id: '3.1', op: q31, nt: 'no ti'},
        {id: '3.2', op: q32, nt: 'no ti'},
        {id: '3.3', op: q33, nt: 'no ti'},
        {id: '3.4', op: q34, nt: 'no ti'},
        {id: '3', op: q3, nt: 'no ti'},
        {id: '4.1', op: q41, nt: 'no ti'},
        {id: '4.2', op: q42, nt: 'no ti'},
        {id: '4.3', op: q43, nt: 'no ti'},
        {id: '4.4', op: q44, nt: 'no ti'},
        {id: '4.5', op: q45, nt: 'no ti'},
        {id: '4', op: q4, nt: 'no ti'},
        {id: '5.1', op: q51, nt: 'no ti'},
        {id: '5.2', op: q52, nt: 'no ti'},
        {id: '5.3', op: q53, nt: 'no ti'},
        {id: '5.4', op: q54, nt: 'no ti'},
        {id: '5.5', op: q55, nt: 'no ti'},
        {id: '5.6', op: q56, nt: 'no ti'},
        {id: '5.7', op: q57, nt: 'no ti'},
        {id: '5.8', op: q58, nt: 'no ti'},
        {id: '5.9', op: q59, nt: 'no ti'},
        {id: '5', op: q5, nt: 'no ti'}
      ]
    });

    fetch('https://dsgocdnapi.azureedge.net/sendperform', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: data
    });
  }
}

export default A3OperationCapacity;

export const englishForm = {
  title: 'WELCOME TO THE PREPAREDNESS FOR EFFECTIVE RESPONSE TOOL',
  areaTitle: 'Area 3: Operational capacity',
  areaQuestion: 'Do you want to assess the preparedness of your National Society for Epidemics and pandemics?',
  areaOptions: [
    'yes',
    'no'
  ],
  components: [
    {
      componentTitle: 'Component 15: Mapping of NS capacities',
      componentDescription: 'A list of the NS capacities including HR (staff, response teams and volunteers) and equipment that are available for disaster/crisis response. Teams could include branch and national response teams. This should be defined by technical speciality where relevant.',
      namespaces: [
        {
          nsTitle: '15.1 A focal point is identified and available for each NS specific area of intervention and services to provide technical guidance and support.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '15.2 Staff and volunteers are trained and kept up to date in the specific areas of intervention and services.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '15.3 Response materials and equipment database is up to date and gaps are noted and being addressed.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '15.4 Resources (HR and equipment) are available and sufficient to cover the initial response needs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '15.5 Capacities are mapped in line with the different levels of response (Green - Yellow - Red).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '15.6 Mechanisms are in place to share resources amongst branches/regions and with sister NSs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 15 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 16: Early Action Mechanisms',
      componentDescription: 'Designed to translate warnings into anticipatory actions to help reduce the impact of specific disaster or crisis events. They focus on consolidating available forecasting information and putting procedures in place to ensure that a NS can act ahead of any disaster/crisis. Forecast-based financing is included within the scope of this area.',
      namespaces: [
        {
          nsTitle: '16.1 NS\'s early warning early action system - inclusive of Forecast-based Financing and disease surveillance - is an integral and accepted part of the national Early Warning Early Action strategies and preparedness system.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '16.2 NS has a clear methodology to decide when and where early action should be taken based on a combination of vulnerability, exposure and triggers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '16.3 NS has mechanisms to anticipate and respond to major hazards in coordination with the national system.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '16.4 NS tests and makes use of new technologies appropriate for the context and audiences for sending alert messages related to early action (e.g: text, twitter, email, sms).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '16.5 NS has procedures and personnel permanently available to communicate alerts and initiate early action to all levels of the NS: governance, branches, technical units.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '16.6 Branches have functioning local networks to inform communities of potential threats and activate early action (respecting mandates of public authorities).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 16 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 17: Cash Based Intervention (CBI)',
      componentDescription: 'An effective and flexible way, including all forms of cash and voucher-based assistance, to support people affected by emergencies, maintaining their dignity and choice, while fostering local economies. Cash should also be mainstreamed into other sectors (including Relief, shelter, livelihoods) and services (Logistics, Finance, etc.)',
      namespaces: [
        {
          nsTitle: '17.1 NS has a CBI preparedness plan, properly budgeted and resourced with clear activities and outputs, based on analysis and discussion with key stakeholders.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '17.2 CBI preparedness plan is tailored to address NS opportunities and barriers to be ready to provide scalable emergency CBI.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '17.3 NS has an up-to-date database of CBI trained and experienced staff and volunteers at headquarter and branch levels across sectors and support services to implement CBI within the response cycle.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '17.4 NS has pre-disaster feasibility cash analysis and baseline about market systems, prices and seasonality, mapping of other actors and coordination structures.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '17.5 NS has regularly revised CBI SOPs with clear roles and responsibilities outlined at each stage of the response process, based on lessons learned from previous responses.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '17.6 NS has mapped CBI delivery mechanisms, service providers and has in place agreements including activation mechanism with money transfer providers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '17.7 NS has an up-to-date, approved CBI toolkit that adapts CiE tools to the NS specific contexts.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '17.8 NS routinely uses the CBI toolkit which is revised and updated based on feedback from preparedness and response actions.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '17.9 NS leads CBI coordination mechanism both internally within the Movement and externally with other CBI actors in the country (public authorities, UN, NGOs, etc...).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 17 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 18: Emergency Needs Assessment',
      componentDescription: 'Assess the extent and impact of the damage caused by the disaster/crisis and the degree of vulnerability of the affected population. The first step in any emergency response, such an assessment will identify the needs that require external intervention and the gaps to be filled. It is a vital component of the programme-planning process.',
      namespaces: [
        {
          nsTitle: '18.1 NS has standardised templates used for primary and secondary data collection and reporting.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '18.2 NS has a trained multi-sectorial emergency assessment team available to deploy in a timely manner.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '18.3 NS emergency plans of actions are based on emergency needs assessment results.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '18.4 Information is disaggregated according to gender, age groups and others.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '18.5 Emergency needs assessment analyses accessibility, availability, quality, use and awareness of goods and services.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '18.6 Emergency needs assessment takes into consideration existing capacities and analyses the national and international capacities, responses and gaps.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '18.7 Emergency needs assessment should analyse secondary risk, specific needs/concerns of vulnerable people/coping mechanisms/early and self-recovery.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 18 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 19: Affected population selection',
      componentDescription: 'Identification and selection of target Affected population for interventions, using a pre-defined set of criteria based on need and vulnerability. This includes consideration of specific vulnerabilities such as disability, age and gender.',
      namespaces: [
        {
          nsTitle: '19.1 NS communicates selection criteria to the affected population using preferred communication channels and involves community leaders/representatives.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '19.2 NS identifies appropriate selection criteria based on existing vulnerability and taking into consideration gender, diversity, age and disabilities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '19.3 NS protects data collected from affected population.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '19.4 Responders have been trained in data collection including the standardised templates.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '19.5 NS cross-checks affected populations\' lists with community leaders, other agencies, authority, etc… to verify inclusion/exclusion issues (considering protection of sensitive data).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 19 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 20: Emergency Operations Centre (EOC)',
      componentDescription: 'A central command and control facility responsible for carrying out disaster/crisis management functions at a strategic level in an emergency situation. The common functions are to collect and analyze data; facilitate decision making that protects life and livelihoods; and disseminate those decisions to all concerned agencies and individuals. Generally located at the headquarter level of an organization.',
      namespaces: [
        {
          nsTitle: '20.1 NS has a formally appointed focal point for EOC.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.2 NS has up-to-date EOC SOPs which are consistent with other NS documents and are followed in a response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.3 EOC is activated according to defined response levels and activation is communicated.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.4 Relevant staff and volunteers know their roles and responsibilities and are trained on SOPs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.5 All technical sectors and support services have procedures that integrate with the EOC SOPs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.6 EOC has intended space with sufficient equipment to manage information and coordination that does not affect other NS activities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.7 EOC facilities are self-sufficient with at least power, water and telecommunications with functioning back-up means.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.8 NS has an alternative location if the EOC space is not accessible.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.9 NS has full and updated contact details for relevant personnel.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.10 NS has legal access and use of designated emergency frequencies which link with other stakeholders in response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.11 EOC staff manages and displays regular updated information (maps, operational details, etc...).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.12 Strategic decisions are made based on the situational analysis to address operational gaps and needs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.13 Clear levels of authority exist between the strategic and management levels of the EOC.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.14 EOC is operational 24/7 however operational period of staff does not exceed 12 hrs/shift.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '20.15 Information is collected, validated and analyzed to provide updated standardized situation reports.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 20 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 21: Information Management (IM)',
      componentDescription: 'Ability to manage information including requesting, receiving, analyzing and disseminating as per its procedures and partner requirements (IFRC and public authorities in particular). There should be a clear digital/paper trail that documents what, when and how the NS has acted and provides key information for the development of Emergency Plan of Actions. Includes IM between levels, between departments and Situational Reports, mapping, visualisation of data, DMIS/GO platform (IFRC).',
      namespaces: [
        {
          nsTitle: '21.1 Key staff at headquarters and branch level are familiar with IM templates (from NS or IFRC), methodology and procedures.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '21.2 NS has access to equipment to compile, visualise and share information (e.g. printers, cartridges, scanners and battery powered projectors).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '21.3 NS has a system to store and share files with emergency personnel.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '21.4 NS has access to updated data on high-risk areas (demographic, socio-economic) disaggregated by age, gender and disability.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '21.5 Information and specifically decisions are documented and filed.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '21.6 NS has a standardised Situation Report format that includes information on situation, NS response, other actors\' response, challenges, achievements and gaps.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '21.7 The Situation Reports are analysed to adapt response plans.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '21.8 NS has mechanisms to share information across levels, sectors and support services.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 21 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 22: Testing and Learning',
      componentDescription: 'Drills and Simulations allow the organization to test, identify and learn from the results of these type of exercises and incorporate learning into future preparedness and response planning.',
      namespaces: [
        {
          nsTitle: '22.1 NS regularly tests its early action and response system through simulation and drills.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '22.2 Lessons drawn from drills, simulations and responses inform revisions in the emergency procedures.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '22.3 Branches in high-risk areas test their response system, including early action, through drills and simulations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '22.4 NS includes access, acceptance, security and the practical application of the Fundamental Principles in their simulations and drills.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '22.5 NS conducts cross-border simulations in relevant contexts..',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '22.6 Simulations and drills are conducted with national authorities and other organisations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 22 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Component 23: Activation of regional and international support',
      componentDescription: 'Procedures for requesting and accepting regional and international support in operations, including triggering coordination mechanisms for funding, materials and human resources deployments.',
      namespaces: [
        {
          nsTitle: '23.1 Key staff are familiar with the available IFRC/ICRC support (technical, financial, material and HR).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '23.2 SOPs and contacts to coordinate response with respective IFRC offices are available.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '23.3 NS SOPs include procedures to request and incorporate regional and global support/teams into their response system, including prior to imminent crisis/disaster.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '23.4 NS informs IFRC within 24 hours for which assistance may be required .',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '23.5 NS is familiar with the IFRC emergency funding mechanisms (Emergency Appeals, DREF and Forecast-based Financing by DREF), their procedures and required supporting documents (EPoA).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '23.6 NS request bilateral assistance in accordance with established coordination frameworks.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '23.7 NS has an assigned focal point to act as counterpart to regional/international responders.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 23 performance',
          nsQuestion: 'Status:',
          nsAnswers: [
            'Not Reviewed',
            'Does not exist',
            'Partially exists',
            'Need improvements',
            'Exist, could be strengthened',
            'High performance'
          ],
          feedbackTitle: 'Notes related to the component:',
          feedbackDescription: ''
        }
      ]
    }
  ]
};

export const frenchForm = {
  title: 'BIENVENUE À L\'OUTIL DE PRÉPARATION POUR UN OUTIL DE RÉPONSE EFFICACE',
  areaTitle: 'Domaine 3: Capacité opérationnelle',
  areaQuestion: 'Voulez-vous évaluer l\'état de préparation de votre Société Nationale pour les épidémies et les pandémies?',
  areaOptions: [
    'Oui',
    'Non'
  ],
  components: [
    {
      componentTitle: 'Catégorie 15: Cartographie des capacités de la SN',
      componentDescription: 'Une liste des capacités de la SN, comprenant les RH (personnel, équipes d\'intervention et bénévoles) et les équipements disponibles pour l\'intervention en cas de catastrophe/crise. Les équipes peuvent inclure les unités d\'intervention nationales et des branches. Ceci doit être défini par spécialités techniques lorsque cela est pertinent.',
      namespaces: [
        {
          nsTitle: '15.1 Un point focal est identifié et disponible pour chaque domaine d\'intervention de la SN, pour fournir des directives et un soutien technique.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '15.2 Le personnel et les bénévoles sont formés et mis à jour sur les domaines d\'intervention spécifiques.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '15.3 La base de données recensant les équipements d\'intervention est à jour et les lacunes sont identifiées et comblées.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '15.4 Des ressources (RH et équipement) sont disponibles et suffisantes pour couvrir les besoins d\'intervention initiaux.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '15.5 Les capacités sont identifiées selon les différents niveaux d\'intervention (vert – jaune – rouge).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '15.6 Des mécanismes sont en place et permettent de partager des ressources entre branches/régions et SN sœurs.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: 'Résumé de la catégorie 15',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 16: Mécanismes d\'action précoce',
      componentDescription: 'Conçus pour traduire les avertissements en actions préventives, de manière à réduire l\'impact des catastrophes ou des crises spécifiques. Ils se concentrent sur la consolidation des informations de prévision disponibles et sur la mise en place de procédures, afin de garantir qu\'une SN puisse agir en amont d\'une catastrophe/crise. Un financement basé sur les prévisions est inclus à ce secteur.',
      namespaces: [
        {
          nsTitle: '16.1 Le système d\'alerte précoce de la SN – comprenant le financement basé sur les prévisions et la surveillance des maladies – est en lien direct avec le système national.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '16.2 La SN dispose de processus permettant de mettre en place des alertes et des actions précoces à l\'aide de déclencheurs.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '16.3 La SN dispose de mécanismes pour répondre à des menaces majeures en coordination avec le système national.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '16.4 La SN utilise les nouvelles technologies adaptées au contexte pour l\'envoi de messages d\'alerte (ex. SMS, Twitter, e-mail, téléphone portable), et les messages sont testés sur plusieurs publics cibles pour garantir leur bonne compréhension.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '16.5 La SN dispose de procédures et de personnel disponibles en permanence pour diffuser les alertes à tous les niveaux de la SN : gouvernance, branches, unités techniques.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '16.6 Les branches disposent de réseaux locaux fonctionnels pour informer les communautés des menaces potentielles (conformément aux mandats des départements du gouvernement).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 16',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 17: Programme de transfert monétaire (PTM)',
      componentDescription: 'Une manière efficace et flexible – incluant toute forme d\'assistance basée sur les transferts monétaires et les coupons – de soutenir les individus affectés par les catastrophes, en maintenant leur dignité et leur pouvoir de décision, tout en stimulant les économies locales. De l\'argent devrait également être injecté dans d\'autres secteurs (dont les secours, les abris, les moyens de subsistance) et services (logistiques, finance, etc.).',
      namespaces: [
        {
          nsTitle: '17.1 La SN dispose d\'un plan de préparation pour les PTM, reposant sur un budget et des ressources appropriées, avec des activités et des résultats clairement définis, et basé sur une analyse et des discussions avec les principaux acteurs concernés.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '17.2 Le plan de préparation du PTM doit traiter des opportunités et des obstacles rencontrés par la SN de manière à fournir un PTM d\'urgence de grande ampleur.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '17.3 La SN entretient une base de données mise à jour du personnel et des bénévoles formés aux PTM au niveau du siège et des branches. Les différents secteurs et services support ont la capacité de mettre en œuvre un PTM dans le cycle d\'intervention.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '17.4 Une analyse de faisabilité financière pré-catastrophe sur les systèmes de marché, les prix et la saisonnalité, ainsi qu\'une cartographie des autres acteurs et structures de coordination existent.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '17.5 La SN développe, met en place, utilise de manière régulière et révisé les PON concernant les PTM en attribuant des rôles et des responsabilités clairs, définis à chaque étape du processus d\'intervention et basé sur les enseignements tirés des interventions passées.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '17.6 Les mécanismes et les fournisseurs de services clés de PTM sont cartographiés, et des accords préalables sont formalisés avec des fournisseurs de services financiers avec un mécanisme d\'activation concerté.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '17.7 La SN développe une boîte à outil de PTM mise à jour et approuvée, à même d\'adapter les outils de transferts monétaires en situation d\'urgence (CiE) aux contextes spécifiques de la SN.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '17.8 La SN développe une boîte à outil de PTM mise à jour et approuvée, à même d\'adapter les outils de transferts monétaires en situation d\'urgence (CiE) aux contextes spécifiques de la SN.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '17.9 La SN coordonne les PTM à l\'intérieur du Mouvement et à l\'extérieur auprès d\'autres acteurs de PTM dans le pays (gouvernement, ONU, ONG, etc.).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 17',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 18: Évaluation des besoins d\'urgence',
      componentDescription: 'Évaluer l\'ampleur et l\'impact des dommages causés par la catastrophe/crise et le degré de vulnérabilité des populations affectées. Première étape de toute intervention d\'urgence, l\'évaluation consiste à identifier les besoins nécessitant une intervention externe ainsi que les lacunes à combler. C\'est un élément vital du processus de programmation et de planification.',
      namespaces: [
        {
          nsTitle: '18.1 Des modèles sont disponibles pour la collecte de données primaires et secondaires ainsi que pour le signalement.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '18.2 Une équipe d\'urgence multisectorielle est formée et prête à être déployée de manière rapide.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '18.3 La méthodologie d\'évaluation d\'urgence inclut des secteurs prioritaires (secours, santé, moyens de subsistance, abris, eau et assainissement, nourriture, protection, autres) et des infrastructures, dont l\'accessibilité et l\'accès.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '18.4 Les procédures de collecte de données prennent en considération la diversité des sources, et les informations sont désagrégées selon des considérations de genre, de handicap, de protection et de violence.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '18.5 L\'évaluation analyse les risques secondaires, ainsi que l\'impact sur le capital social et économique local.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '18.6 L\'évaluation analyse la capacité des communautés à répondre et à fournir de l\'assistance à ses habitants.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '18.7 L\'évaluation analyse de manière stratégique les actions d\'autres acteurs. La SN participe à des évaluations inter-agences lorsque cela est possible, et partage ses résultats avec d\'autres acteurs.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 18',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 19: Sélection des bénéficiaires',
      componentDescription: 'Identification et sélection de la population cible pour les interventions, selon une série de critères prédéfinis basés sur les besoins et la vulnérabilité. Cela implique de prendre en compte des vulnérabilités spécifiques telles que le handicap, l\'âge et le genre.',
      namespaces: [
        {
          nsTitle: '19.1 La SN communique les critères de sélection à la population affectée en utilisant les canaux de communication privilégiés, et implique les leaders/représentants de la communauté.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '19.2 La SN identifie des critères de sélection appropriés en utilisant les vulnérabilités existantes et en prenant en considération le genre, la diversité, l\'âge et les handicaps.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '19.3 La SN protège les données collectées auprès des populations affectées.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '19.4 Les intervenants sont formés pour la collecte de données, y compris pour l\'utilisation de modèles standardisés.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '19.5 La SN recoupe les listes de bénéficiaires pour éviter les problèmes d\'inclusion/exclusion.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 19',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 20: Centre d\'opérations d\'urgence (COU)',
      componentDescription: 'Un centre de commande et de contrôle en charge des fonctions de gestion de la catastrophe/crise à un niveau stratégique dans une situation d\'urgence. Les fonctions habituelles consistent à collecter et analyser des données, faciliter le processus de décision protégeant la vie et les moyens de subsistance, et communiquer ces décisions à toutes les agences et individus concernés. Généralement situé au niveau central d\'une organisation.',
      namespaces: [
        {
          nsTitle: '20.1 Un point focal est nommé de manière formelle pour le COU.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.2 NS has up-to-date EOC SOPs which are consistent with other NS documents, including technical sectors and support services.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.3 EOC is activated according to defined response levels and activation is communicated.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.4 Relevant staff and volunteers know their roles and responsibilities and are trained on SOPs.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.5 Tous les secteurs techniques et les services d\'appui disposent de procédures intégrant les PON des COU.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.6 Les bénévoles et le personnel connaissent leurs rôles et leurs responsabilités.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.7 Le COU fonctionne dans un espace dédié, et son fonctionnement n\'affecte pas les autres activités de la SN.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.8 L\'installation abritant le COU est au minimum autonome en électricité, en eau et en télécommunications.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.9 La SN dispose d\'un lieu de remplacement si le lieu dédié au COU n\'est pas accessible.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.10 L\'espace abriant le COU dispose de suffisamment d\'équipements de base pour la gestion des informations, la prise de décision, et le contrôle des opérations d\'urgence.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.11 Le COU dispose de moyens de communication et d\'appareils de remplacement (téléphone/radio ou autres moyens), et est géré par des personnes qualifiées.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.12 Le COU et ses équipements sont maintenus en état de marche.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.13 La SN dispose des coordonnées actualisées de tous ses intervenants.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.14 La SN dispose d\'un accès légal aux fréquences d\'urgence, qui permettent d\'entrer en contact avec d\'autres intervenants d\'urgence.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '20.15 Le personnel du COU gère et diffuse des informations régulièrement mises à jour (cartes).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 20',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 21: Gestion de l\'information (GI)',
      componentDescription: 'La capacité à gérer des informations, et notamment à les solliciter, recevoir, analyser et diffuser conformément aux procédures et aux exigences des partenaires (la FICR et les autorités publiques en particulier). Une trace écrite/numérique doit exister et indiquer quand et où la SN a fourni des informations clés pour le développement du Plan d\'Urgence. Cela inclut la GI entre les niveaux et entre les départements, des rapports situationnels, des plans, une visualisation des données, une plateforme DMIS/Go (FICR).',
      namespaces: [
        {
          nsTitle: '21.1 Le personnel travaillant au siège et dans les branches connaissent les modèles de GI (réalisés par la SN ou la FICR), la méthodologie et les procédures.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '21.2 Les points focaux en charge de la GI ont accès aux équipements nécessaires pour compiler, visualiser et partager les informations (imprimantes, cartouches, scanners et projecteurs avec batterie).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '21.3 La SN dispose d\'un système (ex. stockage de données) permettant au personnel de l\'intervention d\'urgence de partager des documents tels que des modèles, des rapports de situation ou tout autre type de document.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '21.4 La SN dispose de données de référence disponibles et à jour sur les zones à risque élevé (démographique, socio-économique) ventilées en fonction de l\'âge, du genre et du handicap.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '21.5 Les informations et les décisions spécifiques sont documentées et archivées.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '21.6 La SN dispose d\'un rapport standardisé (RapSt) qui inclut des informations sur l\'impact, l\'intervention de la SN, l\'intervention d\'autres acteurs, les défis et les lacunes identifiées).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '21.7 Le rapport fournit suffisamment d\'analyses pour informer les preneurs de décision.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '21.8 La SN dispose de mécanismes de partage de l\'information entre les secteurs et les services support, et entre les régions, les branches et le siège.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 21',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégorie 22: Test et apprentissage',
      componentDescription: 'Les exercices et les simulations permettent à l\'organisation de tester, d\'identifier et de tirer des enseignements des résultats de ce type d\'exercices, et d\'intégrer ces enseignements aux futurs plans d\'intervention et de préparation.',
      namespaces: [
        {
          nsTitle: '22.1 La SN teste régulièrement son système d\'intervention, et notamment ses actions précoces, à travers des simulations et des exercices (exercices annuels et simulations tous les trois ans dans un contexte de faible risque).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '22.2 Les enseignements tirés des exercices, des simulations et des interventions, entraînent la révision des procédures.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '22.3 La SN inclut l\'accès, l\'acceptation et l\'application pratique des Principes Fondamentaux à ses simulations et ses exercices.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '22.4 Les branches localisées dans les régions à haut risque testent leur système d\'intervention, et notamment les actions précoces, à travers des exercices et des simulations.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '22.5 Les tests incluent la problématique d\'accès sécurisé (accès, perception, acceptation et sécurité).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '22.6 Lorsque le contexte le nécessite, des simulations et des exercices transfrontaliers sont réalisés.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 22',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Catégrie 23: Activation du support régional et international',
      componentDescription: 'Des procédures visant à solliciter et accepter un appui régional et international lors des opérations, incluant le déclenchement de mécanismes de coordination pour le financement et le déploiement de matériel et de ressources humaines.',
      namespaces: [
        {
          nsTitle: '23.1 Le personnel concerné connaît le support disponible auprès de la FICR/CICR (technique, financier, matériel et RH).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '23.2 Des PON et des contacts sont disponibles pour coordonner l\'intervention avec les bureaux respectifs de la FICR.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '23.3 Les PON de la SN incluent des procédures permettant de solliciter et d\'intégrer un appui/des équipes régionales et internationales (RDRTs, FACT, ERU, DOU) au système d\'intervention, y compris avant une crise/catastrophe imminente.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '23.4 En cas d\'assistance nécessaire, la SN en informe la FICR dans un délai de 24 heures (DMIS)',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '23.5 La SN connaît les procédures PAU, les critères du DREF et le processus d\'Appel d\'Urgence, y compris pour une crise/catastrophe imminente.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '23.6 La SN sollicite une assistance bilatérale conformément aux cadres de coordination établis.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '23.7 Un point focal nommé par la SN agit en tant qu\'homologue de l\'intervenant régional/international.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 23',
          nsQuestion: 'Résumé de la catégorie:',
          nsAnswers: [
            'Pas évalué',
            'N\'existe pas',
            'Existe partiellement',
            'Nécessite une amélioration',
            'Existe, peut être renforcé',
            'Performance élevée'
          ],
          feedbackTitle: 'Notes relatives à la catégorie:',
          feedbackDescription: ''
        }
      ]
    }
  ]
};

export const spanishForm = {
  title: 'BIENVENIDOS A LA PREPARACIÓN PARA UNA HERRAMIENTA DE RESPUESTA EFECTIVA',
  areaTitle: 'Area 3: Capacidad Operacional',
  areaQuestion: '¿Desea evaluar la preparación de su Sociedad Nacional de Epidemias y pandemias?',
  areaOptions: [
    'Si',
    'No'
  ],
  components: [
    {
      componentTitle: 'Componente 15. Mapeo de las capacidades de la SN',
      componentDescription: 'Una lista de las capacidades de la SN, incluyendo los RRHH (personal, equipos de respuesta y voluntarios) y el equipo disponible para la respuesta ante desastres / crisis. Los equipos podrían incluir equipos de respuesta nacionales y de las filiales. Cuando sea pertinente, esto deberá definirse por especialidad técnica.',
      namespaces: [
        {
          nsTitle: '15.1 Se identifica y se dispone de un punto focal para cada área específica de intervención de la SN para proporcionar orientación y apoyo técnico.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '15.2 El personal y los voluntarios están capacitados y actualizados en las áreas específicas de intervención.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '15.3 La base de datos de materiales y equipos de respuesta está actualizada, y las brechas son detectadas y abordadas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '15.4 Se dispone de recursos (humanos y equipo), y estos son suficientes para cubrir las necesidades iniciales de respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '15.5 Las capacidades se mapean en línea con los diferentes niveles de respuesta (Verde - Amarillo - Rojo).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '15.6 Se encuentran establecidos mecanismos para compartir recursos entre filiales / regiones y con las SN hermanas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 15',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 16. Mecanismos de Acción Temprana',
      componentDescription: 'Diseñado para traducir las alertas en acciones anticipatorias para ayudar a reducir el impacto de eventos específicos de desastre o crisis. Estos se centran en la consolidación de la información disponible sobre los pronósticos y la puesta en marcha de procedimientos que garanticen que una SN pueda actuar con antelación a cualquier desastre / crisis. El financiamiento basado en pronósticos se incluye dentro del alcance de esta área.',
      namespaces: [
        {
          nsTitle: '16.1 El sistema de alerta temprana de la SN - incluyendo el Financiamiento basado en Pronósticos y la vigilancia de enfermedades - está formalmente vinculado al sistema nacional.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '16.2 La SN cuenta con procesos de decisión sobre cuándo se realizarán las alertas y las acciones tempranas, en base a los detonantes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '16.3 La SN tiene mecanismos para responder a peligros importantes en coordinación con el sistema nacional.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '16.4 La SN hace uso de tecnologías nuevas y adecuadas para su contexto para enviar mensajes de alerta (por ejemplo: mensaje de texto, Twitter, correo electrónico, teléfono móvil), y la mensajería se prueba con distintos públicos para garantizar su comprensión.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '16.5 La SN cuenta con procedimientos y personal permanentemente disponibles para difundir alertas a todos los niveles de la SN: órganos de gobierno, filiales, unidades técnicas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '16.6 Las filiales tienen redes locales funcionando para notificar a las comunidades sobre posibles peligros (respetando los mandatos de las instancias gubernamentales).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 16',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 17. Programación de Transferencia de Efectivo (PTE)',
      componentDescription: 'Una forma eficaz y flexible, que incluye todas las formas de asistencia mediante transferencia de efectivo y cupones, para apoyar a las personas afectadas por emergencias, manteniendo su dignidad y su poder de elección al tiempo que se fomentan las economías locales. La transferencia de dinero en efectivo también deberá transversalizarse a otros sectores (incluyendo Socorro, Alojamiento, Medios de Vida) y servicios (Logística, Finanzas, etc.)',
      namespaces: [
        {
          nsTitle: '17.1 La SN cuenta con un plan de preparación para PTE, debidamente presupuestado, dotado de recursos y con actividades y productos claros, basado en análisis y discusiones con los actores clave.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '17.2 El plan de preparación para el PTE está adaptado para abordar las oportunidades y las barreras que tiene la SN para poder estar preparada para proporcionar un PTE ampliable durante una emergencia.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '17.3 La SN tiene una base de datos actualizada de personal y voluntarios capacitados y con experiencia en PTE, a nivel de la sede y de las filiales en todos los sectores y servicios de apoyo, para implementar un PTE dentro del ciclo de respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '17.4 Previo al desastre, la SN ya cuenta con un análisis de la factibilidad del efectivo y una línea de base acerca de los sistemas, precios y estacionalidad del mercado, así como un mapeo de otros actores y estructuras de coordinación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '17.5 Basándose en las lecciones aprendidas de respuestas anteriores, la SN ha modificado periódicamente los POE del PTE, los cuales tienen funciones y responsabilidades claras descritas para cada etapa del proceso de respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '17.6 La SN ha mapeado los mecanismos de entrega y los prestadores de servicios de PTE, y se formalizan los acuerdos con los proveedores de servicios de transferencia de dinero con un mecanismo acordado para la activación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '17.7 La SN tiene una caja de herramientas de PTE, actualizada y aprobada, que adapta las herramientas de CiE al contexto específico de la SN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '17.8 La SN utiliza rutinariamente la caja de herramientas de PTE, la cual se modifica y actualiza en base a la retroalimentación extraída de las acciones de preparación y respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '17.9 La SN dirige el mecanismo de coordinación del PTE tanto al interno del Movimiento como externamente con otros actores del PTE en el país (gobierno, ONU, ONG, etc.).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 17',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 18. Evaluación de Necesidades de Emergencia',
      componentDescription: 'Evaluar el alcance y el impacto de los daños causados por el desastre / crisis y el grado de vulnerabilidad de la población afectada. Como el primer paso en cualquier respuesta a emergencias, tal evaluación identificará las necesidades que requieren una intervención externa y las brechas a cerrarse. Es un componente vital del proceso de la planificación de programas.',
      namespaces: [
        {
          nsTitle: '18.1 La SN dispone de plantillas estandarizadas para la recopilación de datos primarios y secundarios y para la presentación de informes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '18.2 La SN tiene un equipo multisectorial de evaluación de emergencia capacitado y disponible para su despliegue de manera oportuna.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '18.3 La metodología de evaluación de emergencias incluye sectores prioritarios (socorro, salud, medios de vida, alojamiento, agua y saneamiento, alimentos, protección, otros) e infraestructura, incluyendo la accesibilidad y el acceso.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '18.4 Los procedimientos de recopilación de datos reconocen la diversidad de las fuentes, y la información se desglosa según cuestiones de género, discapacidad, protección y violencia.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '18.5 La evaluación de emergencia analiza los riesgos secundarios, así como el impacto en el capital social y de mercado local.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '18.6 La evaluación de emergencia analiza la capacidad de las comunidades para responder y de proporcionar asistencia ellas mismas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '18.7 La evaluación de emergencia analiza estratégicamente las acciones de otros actores, la SN participa en evaluaciones interinstitucionales, y comparte los resultados de la evaluación con otros actores.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 18',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 19. Selección de beneficiarios',
      componentDescription: 'Identificación y selección de la población afectada objetivo de las intervenciones, utilizando un conjunto predefinido de criterios basados en las necesidades y en la vulnerabilidad. Esto incluye la consideración de vulnerabilidades específicas tales como la discapacidad, la edad y el sexo.',
      namespaces: [
        {
          nsTitle: '19.1 La SN transmite los criterios de selección a la población afectada usando los canales de comunicación preferidos, e involucra a los líderes / representantes de la comunidad.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '19.2 La SN identifica los criterios de selección adecuados en base a la vulnerabilidad existente y tomando en cuenta el sexo, la diversidad, la edad y las discapacidades.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '19.3 La SN protege los datos recabados de la población afectada.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '19.4 Los respondedores han sido capacitados en recopilación de datos, incluyendo las plantillas estandarizadas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '19.5 La SN coteja las listas de población afectada para verificar cuestiones de inclusión / exclusión.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 19',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 20. Centro de Operaciones de Emergencia (COE)',
      componentDescription: 'Una central de mando y control encargada de llevar a cabo las funciones de gestión de desastres / crisis a nivel estratégico durante una situación de emergencia. Las funciones comunes son recolectar y analizar datos; facilitar la toma de decisiones que protegen las vidas y los medios de vida; y diseminar esas decisiones a todos los organismos e individuos a quienes compete. Generalmente se encuentra ubicado a nivel de la sede de una organización.',
      namespaces: [
        {
          nsTitle: '20.1 La SN ha nombrado formalmente al punto focal para el COE.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.2 La SN tiene POE actualizados para el COE, los cuales son coherentes con otros documentos de la SN y son seguidos durante una respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.3 El COE es activado según los procedimientos, y tiene mecanismos establecidos para informar al personal pertinente a otros.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.4 El personal y los voluntarios pertinentes están capacitados en los POE del COE.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.5 Todos los sectores técnicos y los servicios de apoyo tienen procedimientos que se integran con los POE del COE.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.6 Los voluntarios y el personal conocen sus funciones y responsabilidades.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.7 El COE opera en un espacio destinado para este fin, y su uso no afecta a otras actividades importantes de la SN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.8 Las instalaciones del COE son autosuficientes al menos en cuanto a suministro de energía eléctrica, agua y telecomunicaciones.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.9 La SN tiene una ubicación alternativa si el espacio para el COE no estuviese accesible.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.10 El espacio físico para el COE tiene suficiente equipo básico para la gestión de la información, la toma de decisiones y el control de las operaciones de emergencia.El espacio físico para el COE tiene suficiente equipo básico para la gestión de la información, la toma de decisiones y el control de las operaciones de emergencia.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.11 El COE cuenta con los medios de comunicación y respaldos (p.ej. teléfono/radio), y son operados por personal o voluntarios calificados.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.12 El COE y su equipo se mantienen en buenas condiciones de funcionamiento.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.13 La SN tiene los detalles de contacto completos y actualizados de todos sus respondedores.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.14 La SN tiene acceso legal y al uso de las frecuencias de emergencia designadas que se vinculan con otros actores participando en la respuesta',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '20.15 El personal del COE maneja y presenta información actualizada periódicamente (mapas).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 20',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 21. Gestión de la Información (IM)',
      componentDescription: 'Capacidad para gestionar la información, incluyendo la solicitud, recepción, análisis y diseminación de la misma según sus procedimientos y los requisitos de los socios (en particular la FICR y las autoridades públicas). Debe existir un rastro digital / documental claro que documente qué, cuándo y cómo ha actuado la SN, y que proporcione información clave para el desarrollo del Plan de Acción de Emergencia. Esto incluye el MI entre niveles, entre departamentos e Informes Situacionales, mapeos, visualización de datos, plataforma DMIS / GO (FICR).',
      namespaces: [
        {
          nsTitle: '21.1 El personal clave en la sede y a nivel de las filiales está familiarizado con las plantillas (ya sea de la SN o de la FICR), metodología y procedimientos de MI.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '21.2 Los puntos focales de MI tienen acceso al equipo necesario para compilar, visualizar y compartir información (impresoras, cartuchos, escáneres y proyectores con baterías).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '21.3 La SN tiene un sistema (por ejemplo, almacén de datos) que permite el intercambio de documentos basados en archivos, tales como como plantillas, informes de situación o cualquier otro tipo de documento, entre los miembros del personal de respuesta a emergencias.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '21.4 La SN tiene datos de línea de base disponibles y actualizados sobre las zonas de alto riesgo (demográficos, socioeconómicos), desagregados por edad, sexo y discapacidad.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '21.5 Se documenta y se archiva la información, específicamente las decisiones.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '21.6 La SN cuenta con un formato estandarizado para los Informes Situacionales (SitRep), que incluye información sobre el impacto, la respuesta de la SN, la respuesta de otros actores, los desafíos y las brechas identificadas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '21.7 Los Informes de Situación proporcionan análisis suficiente para mantener informados a los tomadores de decisiones.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '21.8 La SN tiene mecanismos para compartir información entre sectores y servicios de apoyo, y entre regiones, filiales y la sede.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 21',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 22. Pruebas y Aprendizaje',
      componentDescription: 'Los ejercicios y los simulacros permiten a la organización probar, identificar y aprender de los resultados de este tipo de ejercicios, e incorporar el aprendizaje en futuras planificaciones de preparación y de respuesta.',
      namespaces: [
        {
          nsTitle: '22.1 La SN evalúa regularmente su sistema de respuesta, incluyendo para la acción temprana, a través de simulaciones y simulacros (ejercicios y simulacros anuales, y cada tres años en contextos de bajo riesgo).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '22.2 Las modificaciones a los procedimientos se basan en las lecciones extraídas de ejercicios, simulacros y respuestas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '22.3 La SN incluye el acceso, la aceptación, la seguridad y la aplicación práctica de los Principios Fundamentales en sus simulaciones y simulacros.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '22.4 Las filiales en las zonas de alto riesgo ponen a prueba su sistema de respuesta, incluyendo la acción temprana, a través de simulaciones y simulacros.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '22.5 Las pruebas incluyen cuestiones de acceso seguro (acceso, percepción, aceptación y seguridad).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '22.6 La SN realiza simulacros transfronterizos en contextos pertinentes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 22',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    },
    {
      componentTitle: 'Componente 23. Activación de apoyo regional e internacional',
      componentDescription: 'Los procedimientos para solicitar y aceptar apoyo regional e internacional en las operaciones, incluyendo la activación de mecanismos de coordinación para la financiación y el despliegue de recursos materiales y humanos',
      namespaces: [
        {
          nsTitle: '23.1 El personal clave está familiarizado con el apoyo disponible de parte de la FICR / CICR (técnico, financiero, material y de recursos humanos).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '23.2 Se dispone de POE y de contactos para coordinar la respuesta con las respectivas oficinas de la FICR.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '23.3 Los POE de la SN incluyen procedimientos para solicitar e incorporar equipos/apoyos regionales y globales (RDRT, FACT, ERU, HEOps) en su sistema de respuesta, incluso antes de una crisis / desastre inminente.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '23.4 La SN informa a la FICR de la posible necesidad de asistencia (DMIS) dentro de un plazo de 24 horas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '23.5 La SN está familiarizada con los procedimientos del PdAE, los criterios DREF y el proceso del Llamamiento de Emergencia, incluso para crisis / desastres inminentes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '23.6 La SN solicita asistencia bilateral de acuerdo con los marcos de coordinación establecidos',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '23.7 La SN ha asignado un punto focal para fungir como contraparte de los respondedores regionales / internacionales.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 23',
          nsQuestion: 'Resumen del componente:',
          nsAnswers: [
            'No revisado',
            'No existe',
            'Existe parcialmente',
            'Necesita mejoras',
            'Existir, se podría fortalecer.',
            'Alto rendimiento'
          ],
          feedbackTitle: 'Notas relacionadas con el componente.',
          feedbackDescription: ''
        }
      ]
    }
  ]
};
