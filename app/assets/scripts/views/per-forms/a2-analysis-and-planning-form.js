import React from 'react';

class A2AnalysisAndPlanning extends React.Component {
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

export default A2AnalysisAndPlanning;

export const englishForm = {
  title: 'WELCOME TO THE PREPAREDNESS FOR EFFECTIVE RESPONSE TOOL',
  areaTitle: 'Area 2: Analysis and planning',
  areaQuestion: 'Do you want to assess the preparedness of your National Society for Epidemics and pandemics?',
  areaOptions: [
    'yes',
    'no'
  ],
  components: [
    {
      componentTitle: 'Component 6: Hazard, Context and Risk Analysis, Monitoring and Early Warning',
      componentDescription: 'Describes how the NS monitors and maps past, present and potential hazards, disasters and crises (e.g. hazard, vulnerability assessments, gathering information from communities and government authorities) and systematically evaluates the damage that could be caused by a potential disaster/crisis, the frequency, severity of the impact, and the alert the relevant areas to scale the preparedness actions to reduce population vulnerability.',
      namespaces: [
        {
          nsTitle: '6.1 A risk monitoring system (including a focal point) is formally established and linked to preparedness and early action.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '6.2 NS has the capacity to collect and analyse primary and secondary data (including sectorial specific information) on risk factors, emerging political, social and economic trends that could influence humanitarian action.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '6.3 The current/likely gaps, barriers, risks and challenges to NS acceptance, security and access have been identified.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '6.4 Early warning system is established, and includes thresholds (including for slow on-set disasters) and required mechanisms to communicate and activate early action.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '6.5 Updated national multi-hazard risk analysis and maps (including changing risks patterns) are shared with all branches at least once every 2 years.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '6.6 Communities and local volunteers contribute to the regular update of the multi-hazard risk mapping and Vulnerability and capacity assessments (VCA).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '6.7 Risk assessments at community level include the analysis of the potential connectors and dividers within a community.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '6.8 For at-risk areas, primary and secondary data on vulnerabilities and capacities of communities is broken down by age, gender, disability, income and other context-specific diversity and cultural factors and include potential protection-related consequences on affected populations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '6.9 For cross-border high risk areas, NSs coordinate risk monitoring, are familiar with each other\'s capacities and procedures, and have a mechanism in place to share information.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 6 performance',
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
      componentTitle: 'Component 7: Scenario planning',
      componentDescription: 'A set of practical operation plans that closely mirror the generic disaster or crisis response plan but are tailored to a specific hazard type (e.g. earthquake, dengue epidemic, floods, cyclone) and a specific scenario (i.e. number of people affected, their locations and other important factors).',
      namespaces: [
        {
          nsTitle: '7.1 Analysis of scenarios is multi-sectoral (e.g. health, livelihood, protection) and includes identification of drivers (root causes of risks) and assumptions to inform potential impact.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '7.2 NS has developed humanitarian scenarios for each high-risk area in the country and contingency plans are aligned with those of the public authorities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '7.3 A response strategy is available for each scenario and branches are involved in development of the response strategy affecting their area.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '7.4 A response strategy is available for each scenario and branches are involved in development of the response strategy affecting their area.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '7.5 A response strategy is available for each scenario and branches are involved in development of the response strategy affecting their area.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '7.6 A response strategy is available for each scenario and branches are involved in development of the response strategy affecting their area.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '7.7 A response strategy is available for each scenario and branches are involved in development of the response strategy affecting their area.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 7 performance',
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
      componentTitle: 'Component 8: Risk management',
      componentDescription: 'A mapping of the potential risks in every area, along with its related mitigation measures. Including financial, reputational, organizational risks etc.',
      namespaces: [
        {
          nsTitle: '8.1 Responsibility for risk management is assigned to a trained staff within the NS, and overall accountability for risk management is identified.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '8.2 NS systematically identifies, evaluates and mitigates any potential operational and reputational risks, including risks of responding in insecure contexts.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '8.3 Risk management is done holistically across technical sectors, with mitigation measures identified and operationalised.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '8.4 NS identifies key stakeholders and develops engagement strategies to increase acceptance by them.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '8.5 NS identifies key stakeholders and develops engagement strategies to increase acceptance by them.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '8.6 NS identifies key stakeholders and develops engagement strategies to increase acceptance by them.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '8.7 NS identifies key stakeholders and develops engagement strategies to increase acceptance by them.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 8 performance',
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
      componentTitle: 'Component 9: Preparedness plans and budgets',
      componentDescription: 'Plans identifying organisational resources, determining roles and responsibilities, and developing policies, procedures and activities in order to reach a level of preparedness to be able to respond effectively to a disaster or crisis. Budgets ensure that the necessary financial support is secured to allow capacities to be built and readiness maintained.',
      namespaces: [
        {
          nsTitle: '9.1 NS has a nominated, trained focal point for disaster preparedness.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '9.2 Preparedness gaps are identified based on risk analysis and response strategy, and take into account the strengthening of support units.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '9.3 Remedial actions for preparedness gaps are being implemented.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '9.4 Financial gaps for preparedness and early actions are identified and the NS actively seeks resources and support to address these gaps.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '9.5 Preparedness actions are updated at least every two years and revised every six months or after every major disaster.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '9.6 Policies and procedures exist to allocate emergency or development budgets for preparedness capacity strengthening.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 9 performance',
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
      componentTitle: 'Component 10: Business continuity',
      componentDescription: 'A strategy to counter any potential or anticipated obstacles to effective functioning of the NS, with an eye to ensuring that personnel and assets are protected and able to function in the event of a disaster/crisis.',
      namespaces: [
        {
          nsTitle: '10.1 NS has an up-to-date, approved business continuity plan for major emergency/crisis situation that would affect its ability to operate.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '10.2 NS has an up-to-date, approved procedure in place to communicate with donors to repurpose funds for unexpected or emerging needs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 10 performance',
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
      componentTitle: 'Component 11: Emergency Response Procedures (SOPs)',
      componentDescription: 'Written guidelines that describe duties and rights of personnel, command structures, coordination with other organizations, and reporting requirements, etc. Includes detailed organogram, decision-making flow chart, and defined roles and responsibilities.',
      namespaces: [
        {
          nsTitle: '11.1 NS has up-to-date, approved SOPs for all specific areas of intervention and support services to respond to disasters and crises.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '11.2 SOPs have been disseminated to, well-known and followed by staff and volunteers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '11.3 SOPs describe the roles and responsibilities of responders at strategic, management and operational levels at HQ, branches and communities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '11.4 SOPs incorporate procedures for all phases of response (early warning, early action, emergency assessment, response planning, etc.) including standardised templates.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '11.5 SOPs include procedures to scale alert levels up and down.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '11.6 Up-to-date and approved SOPs to respond to disasters and crises exist at branch level.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '11.7 SOPs include a decision making flowchart which assigns decision making responsibility accordingly at each level.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '11.8 SOPs include an up-to-date organogram with contact details.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 11 performance',
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
      componentTitle: 'Component 12: Response and recovery planning',
      componentDescription: 'A documented set of procedures for the disaster/crisis response and recovery process. Including use of local capacities, transition to recovery, type of activities and serivices provided during response and recovery activities and exit strategies, procedures for DREF & EA, and templates for planning, budgeting and accessing funds.',
      namespaces: [
        {
          nsTitle: '12.1 NS has an up-to-date, approved multi-sectoral response plan for rapid deployment and efficient use of human and material resources.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.2 The plan takes into consideration gender, age, disability and diversity complexities and community capacities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.3 The The plan is developed by the NS with the participation of community, staff, volunteers, governance, management and technical inputs from IFRC where relevant.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.4 The plan adheres to the Principles and Rules, DRM policy and Fundamental principles.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.5 The plan aligns with IFRC global standards and templates (EPOA).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.6 The plan considers how to reduce and address secondary risks and is in line with the medium to longer term interventions focused on recovery.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.7 The plan acknowledges response and recovery actions of other actors and is disseminated to the Movement and other relevant external actors.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.8 NS has a process to adapt the plan to changing context and emergency needs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.9 The plan considers how to support self-recovery of affected population with their active participation beyond providing relief (i.e. – considers early recovery needs).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.10 The plan is updated with lessons learned from real time and simulated exercises.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.11 NS can manage the transition from relief phase and use of short-term resources and volunteers, to medium-term recovery interventions.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '12.12 NS has a process to develop and approve donation protocols that communicate priority needs to the public in times of disaster and crisis.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 12 performance',
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
      componentTitle: 'Component 13: Pre-disaster meetings and agreements',
      componentDescription: 'A commitment to arrange meetings and agreements with Movement stakeholders and external actors to identify, plan for and address gaps for any upcoming disaster season (e.g. monsoon, floods or cyclones, or for any generic disaster/crisis event (e.g Epidemic, pandemic, confilict situations). Pre-disaster agreements should set out each partner\'s role in the event of a disaster/crisis.',
      namespaces: [
        {
          nsTitle: '13.1 Pre-disaster meetings with key stakeholders take place (at least once a year).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.2 Key staff are familiar with pre-disaster/crisis agreements and how to operationalize them in a response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.3 Coordination and management arrangements with relevant local and national key actors are formalized (NGO, INGO, UN, public authorities).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.4 NS has an up-to-date capacity mapping of Movement partners.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.5 Movement coordination agreements are known and available within NS and shared with IFRC.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.6 All contractors have signed the Code of Conduct.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.7 All pre-disaster agreements are in line with NS policies and procedures, including Principles and Rules, Strengthening Movement Coordination and Cooperation (SMCC) and in line with Quality and Accountability standards.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.8 Agreements exist with public authorities to facilitate expedited import of humanitarian aid and visas for incoming personnel.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.9 Agreements with key suppliers of goods and services are formalized with an agreed mechanism for activation.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.10 Agreements with money transfer providers are formalised with an agreed mechanism for activation.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '13.11 Agreements with existing Social Protection systems are in place, to facilitate access to pre-existing databases of vulnerable populations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 13 performance',
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
  areaTitle: 'Domaine 2: Analyse et planification',
  areaQuestion: 'Voulez-vous évaluer l\'état de préparation de votre Société Nationale pour les épidémies et les pandémies?',
  areaOptions: [
    'Oui',
    'Non'
  ],
  components: [
    {
      componentTitle: 'Catégorie 6: Analyse des aléas, du contexte et des risques, surveillance et alerte précoce',
      componentDescription: 'Décrit la manière dont la SN surveille et cartographie les aléas, les catastrophes et les crises passées, présentes et potentielles (ex. évaluations des aléas et de la vulnérabilité, informations issues des communautés et des autorités gouvernementales) et évalue de manière systématique les dommages qui pourraient être causés par une crise/catastrophe potentielle, la fréquence, la sévérité de l\'impact, et alerte les secteurs compétents de manière à augmenter les actions de préparation et ainsi réduire la vulnérabilité de la population.',
      namespaces: [
        {
          nsTitle: '6.1 Un système de surveillance des risques (comprenant un point focal) est formellement établi et mis en relation avec la préparation et les actions précoces.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '6.2 La SN a la capacité de collecter et d\'analyser des données primaires et secondaires (y compris des informations sectorielles spécifiques) sur les tendances politiques, sociales et politiques émergentes qui pourraient influencer l\'action humanitaire.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '6.3 Les lacunes, les barrières, les risques et les défis actuels/potentiels rencontrés par la SN en termes d\'acceptation, de sécurité et d\'accès sont identifiés.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '6.4 Un système d\'alerte précoce est mis en place, et inclut des paliers (y compris pour les catastrophes à déclenchement lent) ainsi que des mécanismes permettant de communiquer et d\'activer une action précoce.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '6.5 Des analyses et des cartes multi-aléas nationales mises à jour (incluant les tendances de variation des risques) sont partagées avec toutes les Branches au moins une fois tous les deux ans.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '6.6 Les communautés et les bénévoles locaux contribuent à la mise à jour régulière des cartes multi-aléas et des évaluations de la vulnérabilité et des capacités (EVC).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '6.7 Les évaluations du risque au niveau de la communauté incluent l\'analyse de connecteurs et de diviseurs potentiels au sein d\'une communauté.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '6.8 Pour les régions à risque, des données primaires et secondaires sur les vulnérabilités et les capacités des communautés sont ventilées par âge, sexe, handicap, revenu et selon d\'autres facteurs de diversité spécifiques au contexte, et incluent les conséquences potentielles sur la protection des populations affectées.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '6.9 Pour les régions transfrontalières à haut risque, les SN coordonnent la surveillance des risques, connaissent les capacités et les procédures de chaque SN, et ont établi un mécanisme de partage d\'informations.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: 'Résumé de la catégorie 6',
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
      componentTitle: 'Catégorie 7: Elaboration de scénarios',
      componentDescription: 'Une série de plans opérationnels pratiques reflétant précisément un plan d\'intervention générique, mais adaptés à un aléa spécifique (ex. séisme, épidémie de dengue, inondations, cyclone) et à un scénario spécifique (ex. nombre d\'individus affectés, leur emplacement et d\'autres facteurs importants).',
      namespaces: [
        {
          nsTitle: '7.1 L\'analyse est multisectorielle (ex. santé, moyens de subsistance, protection) et inclut l\'identification des vecteurs, (causes profondes des risques) qui alimenteront les potentiels scénarios, ainsi que des hypothèses pour appuyer l\'impact potentiel des scénarios.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '7.2 La SN a développé des scénarios humanitaires pour chaque zone à risque élevé dans le pays et les plans d\'intervention sont en adéquation avec ceux du gouvernement.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '7.3 Une stratégie d\'intervention est disponible pour chaque scénario. Les branches sont impliquées dans le développement de la stratégie d\'intervention en place dans leur région.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '7.4 Les scénarios incluent l\'identification des défis auxquels est confrontée la SN en termes d\'acceptation, de sécurité et d\'accès pendant des opérations humanitaires.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '7.5 Les plans d\'intervention incluent des déclencheurs permettant d\'activer le plan, en particulier pour les crises prolongées ou à déclenchement lent.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '7.6 Les plans d\'intervention destinés à d\'éventuelles crises régionales incluent des mécanismes de coordination entre les pays voisins, et en particulier pour des crises épidémiques et pandémiques potentielles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '7.7 Les plans d\'intervention concernant des risques élevés sont développés et révisés une fois par an.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 7',
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
      componentTitle: 'Catégorie 8: Gestion des risques',
      componentDescription: 'Une cartographie des risques potentiels dans toutes les régions, ainsi que des mesures d\'atténuation connexes. Inclut les risques pesant sur l\'organisation, les finances, la réputation, etc.',
      namespaces: [
        {
          nsTitle: '8.1 La gestion des risques est assignée à un membre qualifié du personnel de la SN, et la responsabilité générale de la gestion des risques est identifiée.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '8.2 La SN identifie, évalue et atténue systématiquement tout risque éventuel pesant sur ses opérations ou sa réputation, y compris les risques encourus lors d\'interventions dans des contextes non sécurisés.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '8.3 La gestion des risques est réalisée de manière holistique dans tous les secteurs techniques, où des mesures d\'atténuation sont identifiées et opérationnalisées.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '8.4 La SN identifie les acteurs clés et développe des stratégies d\'implication pour augmenter leur degré d\'acceptation.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '8.5 Des systèmes et des procédures sont mis en place pour éviter la fraude et la corruption, et renforcer l\'acceptation, la sécurité et l\'accès.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '8.6 La gestion des risques pesant sur la réputation et l\'intégrité est systématiquement à l\'ordre du jour des réunions du Conseil de direction de la SN.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '8.7 La SN met en place une unité/fonction de gestion de crise pour gérer les incidents critiques.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 3',
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
      componentTitle: 'Catégorie 9: Plans et budgets de préparation',
      componentDescription: 'Les plans identifiant les ressources organisationnelles, déterminant les rôles et les responsabilités, et développant des politiques, des procédures et des activités pour atteindre un niveau de préparation permettant d\'intervenir de manière efficace lors d\'une catastrophe ou d\'une crise. Les budgets permettent de sécuriser le support financier nécessaire, qui permet à son tour de développer des compétences et de maintenir une préparation constante.',
      namespaces: [
        {
          nsTitle: '9.1 La SN nomine un point focal formé sur la préparation aux catastrophes.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '9.2 Les lacunes de la préparation sont identifiées via des analyses de risque et une stratégie d\'intervention, et prennent en compte le renforcement des unités support.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '9.3 Des mesures correctives permettant de combler les lacunes de préparation sont mises en place.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '9.4 Les déficits de financement pour la préparation ou les actions précoces sont identifiés. La SN recherche activement des ressources et du soutien pour combler ces déficits.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '9.5 Les actions de préparation sont mises à jour au moins tous les deux ans, et révisées tous les six mois, ou après chaque catastrophe majeure.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '9.6 Des politiques et des procédures sont mises en place pour allouer un pourcentage au budget d\'urgence ou de développement pour le renforcement des capacités de préparation.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 9',
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
      componentTitle: 'Catégorie 10: Continuité des activités',
      componentDescription: 'Une stratégie permettant de contrer tout obstacle potentiel ou anticipé au fonctionnement de la SN, et permettant au personnel et aux biens d\'être protégés et de fonctionner en cas de catastrophe/crise.',
      namespaces: [
        {
          nsTitle: '10.1 La SN dispose d\'un plan de continuité des activités mis à jour en cas d\'urgence/crise majeure qui affecterait les opérations.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '10.2 La SN dispose de procédures spéciales pour communiquer avec les donateurs afin de réaffecter les fonds à des besoins urgents inattendus.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 5',
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
      componentTitle: 'Catégorie 11: Emergency Response Procedures (SOPs)',
      componentDescription: 'Des directives écrites qui décrivent les devoirs et les droits du personnel et qui commandent les structures, la coordination avec les autres organisations, les exigences de signalement, etc. Includes detailed organogram, decision-making flow chart, and defined roles and responsibilities.',
      namespaces: [
        {
          nsTitle: '11.1 La SN a des PON mis à jour et approuvés pour tous les domaines d\'intervention spécifiques et les services d\'appui aux catastrophes et aux crises.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '11.2 Les PON ont été disséminés et sont connus de tout le personnel et volontaires.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '11.3 Les PON décrivent les rôles et les responsabilités des intervenants aux niveaux stratégiques, opérationnels et de management au siège, dans les branches et les communautés.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '11.4 Les PON incluent des procédures pour toutes les phases d\'intervention (alerte précoce, action précoce, évaluation de l\'urgence, planification d\'intervention, etc.) ainsi que des modèles standardisés.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '11.5 Les PON incluent des procédures pour augmenter ou baisser les niveaux d\'alerte.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '11.6 Des PON mis à jour et approuvés spécifiques aux crises et catastrophes existent au niveau des branches.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '11.7 Les PON incluent un organigramme décisionnel et le prise de décision est attribuée convenablement à chaque niveau de responsabilité.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '11.8 Les PON incluent un organigramme mis à jour comprenant les coordonnées de chacun.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 11',
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
      componentTitle: 'Catégorie 12: Planification de l\'intervention et du relèvement',
      componentDescription: 'Une série de procédures documentées destinées au processus d\'intervention et de relèvement en cas de catastrophe/crise. Cela inclut l\'utilisation de compétences locales, la transition vers le relèvement, le type d\'activités et de services fournis pendant les activités d\'intervention et de relèvement et les stratégies de sortie, les procédures pour le DREF et l\'EA, et des modèles pour la planification, la budgétisation et l\'accès aux fonds.',
      namespaces: [
        {
          nsTitle: '12.1 La SN possède un plan d\'intervention mis à jour, approuvé et multisectoriel pour un déploiement rapide et une utilisation efficace des ressources humaines et matérielles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.2 Ce plan prend en considération le genre, l\'âge, le handicap, les complexités de la diversité et les capacités de la communauté.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.3 Le plan est développé avec la communauté, le personnel, les bénévoles, la gouvernance et la direction. Il utilise des informations techniques de la FICR lorsque cela est pertinent.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.4 Le plan adhère aux Principes et aux Règles, aux politiques de GC et aux Principes Fondamentaux.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.5 Le plan adhère aux normes et aux modèles globaux de la FICR (PAU).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.6 Le plan aborde la manière de gérer les catastrophes secondaires et de réduire les risques pendant une intervention.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.7 Le plan prend en considération les actions d\'intervention et de relèvement entreprises par d\'autres acteurs. Il est disséminé au sein du Mouvement et auprès d\'autres acteurs externes pertinents.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.8 La SN établit un processus pour adapter son plan d\'intervention en fonction du contexte et des besoins pouvant émerger.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.9 Le plan prend en considération les besoins de relèvement précoce.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.10 Le plan est mis à jour pour inclure des enseignements tirés sur le terrain et lors d\'exercices de simulation.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.11 La SN développe des stratégies de transmission et de transition en fonction des besoins, des priorités des communautés affectées, des fonds disponibles et des capacités locales.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '12.12 Des protocoles de don sont mis en place de manière à informer le public des besoins prioritaires en cas de catastrophe ou de crise.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 12',
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
      componentTitle: 'Catégorie 13: Réunions et accords pré-catastrophes',
      componentDescription: 'Un engagement pour organiser des réunions et des accords avec les acteurs internes et externes au Mouvement, de manière à identifier, planifier et combler les lacunes de la saison à venir (ex. mousson, inondations ou cyclones) ou de catastrophes/crises génériques (ex. épidémies, pandémies, conflits). Les accords pré-catastrophes doivent établir le rôle de chaque partenaire en cas de catastrophe/crise.',
      namespaces: [
        {
          nsTitle: '13.1 Des réunions pré-catastrophe sont organisées avec les acteurs clés (au moins une fois par an).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.2 Les membres clés du personnel connaissent les accords pré-catastrophes/crises et savent comment les mettre en pratique dans le cadre d\'une intervention.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.3 Des accords de coordination et de gestion sont conclus avec des acteurs clés locaux et nationaux (ONG, ONGI, ONU, autorités nationales).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.4 La NS dispose d\'une carte mise à jour des capacités des partenaires du Mouvement.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.5 Les accords de coordination du Mouvement sont connus, disponibles au sein de la SN et partagés avec la FICR.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.6 Tous les prestataires ont signé le Code de Conduite.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.7 Tous les accords pré-catastrophes sont conformes aux politiques et procédures de la SN, y compris aux Principes et Règles, au Renforcement de la Coordination et de la Coopération au sein du mouvement (RCCM), aux normes du Mouvement, et aux normes de Qualité et de Transparence.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.8 Des accords avec les autorités publiques existent pour faciliter l\'importation d\'aide humanitaire et l\'obtention de visas pour le personnel entrant dans le pays.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.9 Des accords avec des fournisseurs de biens et de services clés sont formalisés grâce à un mécanisme d\'activation convenu.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.10 Des accords avec les fournisseurs de transfert d\'argent sont formalisés à l\'aide d\'un mécanisme d\'activation convenu.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '13.11 Des accords avec les systèmes existant de Protection Sociale sont en place, pour faciliter l\'accès aux bases de données déjà existantes sur les populations vulnérables.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 13',
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
  areaTitle: 'Área 2: Análisis y planificación',
  areaQuestion: '¿Desea evaluar la preparación de su Sociedad Nacional de Epidemias y pandemias?',
  areaOptions: [
    'Si',
    'No'
  ],
  components: [
    {
      componentTitle: 'Componente 6. Análisis de Peligros, de Contexto y de Riesgos, Monitoreo y Alerta Temprana',
      componentDescription: 'Describe cómo la SN monitorea y mapea los peligros, desastres y crisis pasados, actuales y potenciales (por ejemplo, evaluación de peligros y de vulnerabilidad, recolección de información de las comunidades y autoridades gubernamentales) y evalúa sistemáticamente los daños que podrían ser causados por un posible desastre o crisis, la frecuencia, la gravedad del impacto y la alerta a las zonas pertinentes, para ampliar la escala de las acciones de preparación y así reducir la vulnerabilidad de la población.',
      namespaces: [
        {
          nsTitle: '6.1 Se establece formalmente un sistema de monitoreo de riesgos (incluyendo un punto focal) que está vinculado a la preparación y acción temprana.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '6.2 La SN tiene las capacidades para recolectar y analizar datos primarios y secundarios (incluyendo información sectorial específica) sobre tendencias políticas, sociales y económicas emergentes que podrían incidir en la acción humanitaria.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '6.3 Se han identificado las actuales/probables brechas, barreras, riesgos y desafíos para la aceptación, seguridad y el acceso de la SN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '6.4 Se establece un sistema de alerta temprana, que incluye umbrales (incluyendo para los desastres de surgimiento lento) y los mecanismos necesarios para comunicar y activar la acción temprana.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '6.5 Se comparten análisis y mapas de riesgo multi-amenaza nacionales actualizados con las filiales (incluyendo los patrones cambiantes de los riesgos) por lo menos cada dos años.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '6.6 Las comunidades y los voluntarios locales aportan a la actualización periódica del mapeo del riesgo multi-amenaza y del Análisis de Vulnerabilidad y Capacidad (AVC).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '6.7 Las evaluaciones de riesgos a nivel comunitario incluyen el análisis de los posibles factores de conexión y división dentro de una comunidad.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '6.8 Para las zonas en riesgo, los datos primarios y secundarios sobre las vulnerabilidades y capacidades de las comunidades se encuentran desglosados por edad, sexo, discapacidad, ingresos y otros factores culturales y de diversidad específicos al contexto, e incluyen posibles consecuencias para las poblaciones afectadas relacionadas con la protección.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '6.9 Para las zonas transfronterizas de alto riesgo, las SN coordinan el monitoreo de los riesgos, están familiarizadas con las capacidades y procedimientos de cada una y tienen un mecanismo establecido para compartir información.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 6',
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
      componentTitle: 'Componente 7. Planificación según Escenarios',
      componentDescription: 'Un conjunto de planes prácticos de operación que se asemejan bastante al plan genérico de respuesta ante desastres o crisis, pero que están adaptados a un tipo específico de peligro (por ejemplo, terremotos, epidemias de dengue, inundaciones, ciclones) y a un escenario específico (es decir, la cantidad de personas afectadas, su ubicación y otros factores importantes).',
      namespaces: [
        {
          nsTitle: '7.1 El análisis de los escenarios es multisectorial (por ejemplo salud, medios de vida, protección), e incluye la identificación de los factores determinantes (las causas raíz de los riesgos) y los supuestos en los que se basará el impacto potencial.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '7.2 La SN ha desarrollado escenarios humanitarios para cada zona de alto riesgo en el país, y los planes de contingencia están alineados con los del gobierno.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '7.3 Hay una estrategia de respuesta disponible para cada escenario, y las filiales están involucradas en el desarrollo de la estrategia de respuesta que afecta su zona.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '7.4 Los escenarios incluyen la identificación de problemas para la aceptación, seguridad y el acceso por parte de la SN durante las operaciones humanitarias.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '7.5 Los planes de contingencia incluyen detonantes para activar el plan, especialmente para crisis prolongadas y de surgimiento lento.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '7.6 Los planes de contingencia para posibles crisis regionales incluyen mecanismos de coordinación entre países vecinos, en particular para posibles crisis de epidemias y pandemias.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '7.7 Se desarrollan planes de contingencia para riesgos altos, y se revisan anualmente.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 7',
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
      componentTitle: 'Componente 8. Gestión de riesgos',
      componentDescription: 'Un mapeo de los riesgos potenciales en cada zona, junto con las medidas de mitigación relacionadas. Se incluyen riesgos financieros, reputacionales, organizacionales, etc.',
      namespaces: [
        {
          nsTitle: '8.1 La responsabilidad de la gestión de riesgos es asignada a un miembro calificado del personal de la SN, y se identifica la responsabilidad global por la gestión de riesgos.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '8.2 La SN sistemáticamente identifica, evalúa y mitiga cualquier posible riesgo operacional y reputacional, incluyendo los riesgos de responder en contextos inseguros.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '8.3 La gestión del riesgo se realiza de manera integral en todos los sectores técnicos, y se identifican y operacionalizan las medidas de mitigación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '8.4 La SN identifica a los actores clave, y desarrolla estrategias de relacionamiento para aumentar la aceptación por parte de ellos.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '8.5 La SN identifica a los actores clave, y desarrolla estrategias de relacionamiento para aumentar la aceptación por parte de ellos.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '8.6 La SN identifica a los actores clave, y desarrolla estrategias de relacionamiento para aumentar la aceptación por parte de ellos.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '8.7 La SN identifica a los actores clave, y desarrolla estrategias de relacionamiento para aumentar la aceptación por parte de ellos.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 8',
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
      componentTitle: 'Componente 9. Planes y presupuestos para la preparación',
      componentDescription: 'Planes que identifican los recursos de la organización, que determinan las funciones y las responsabilidades, y que desarrollan las políticas, procedimientos y actividades en desarrollo para poder alcanzar un nivel de preparación que permita responder eficazmente a un desastre o a una crisis. Los presupuestos garantizan el apoyo financiero necesario para poder desarrollar capacidades y mantener la preparación.',
      namespaces: [
        {
          nsTitle: '9.1 La SN tiene un punto focal designado y capacitado para la preparación ante desastres.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '9.2 Las brechas en preparación se identifican en base al análisis de riesgos y a la estrategia de respuesta, y se toma en cuenta el fortalecimiento de las unidades de apoyo.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '9.3 Se implementan medidas correctivas para eliminar las brechas en preparación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '9.4 Se identifican las brechas financieras para las acciones tempranas o de preparación. La SN busca activamente recursos y apoyo para cerrar esas brechas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '9.5 Las acciones de preparación se actualizan por lo menos cada dos años, y se modifican cada seis meses o después de cada desastre importante.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '9.6 Existen políticas y procedimientos para asignar un porcentaje de los presupuestos de emergencia o de desarrollo para el fortalecimiento de las capacidades en preparación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 9',
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
      componentTitle: 'Componente 10. Continuidad de negocios',
      componentDescription: 'Una estrategia para contrarrestar cualquier obstáculo potencial o previsto para el funcionamiento eficaz de la SN, con miras a garantizar que el personal y los bienes estén protegidos y en capacidad de funcionar en caso de desastre o crisis.',
      namespaces: [
        {
          nsTitle: '10.1 La SN tiene establecido un plan de continuidad de servicios, actualizado y aprobado, en caso de una situación grave de emergencia / crisis que afecte su capacidad de operación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '10.2 La SN tiene procedimientos actualizados y aprobados para comunicarse con los donantes para reasignar fondos para necesidades inesperadas o emergentes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 10',
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
      componentTitle: 'Componente 11. Procedimientos de Respuesta a Emergencias (POE)',
      componentDescription: 'Directrices escritas que describen las obligaciones y los derechos del personal, las estructuras de mando, la coordinación con otras organizaciones y los requisitos de presentación de informes, etc. Incluye un organigrama detallado, diagrama de flujo de toma de decisiones y funciones y responsabilidades definidas.',
      namespaces: [
        {
          nsTitle: '11.1 La SN tiene POE actualizados y aprobados para todas las áreas específicas de intervención y servicios de apoyo para desastres y crisis.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '11.2 Los POE han sido difundidos al personal y a los voluntarios, y todos estos los conocen bien.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '11.3 Los POE describen las funciones y responsabilidades de los respondedores a nivel estratégico, operacional y de gestión de la Sede, las Filiales y las comunidades.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '11.4 Los POE incorporan procedimientos para todas las fases de respuesta (alerta temprana, acción temprana, evaluación de emergencia, planificación de respuesta, etc.), incluyendo plantillas estandarizadas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '11.5 Los POE incluyen procedimientos para ampliar o disminuir la escala de los niveles de alerta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '11.6 Existen POE actualizados y aprobados a nivel de filial para desastres y crisis.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '11.7 Los POE incluyen un diagrama de flujo de toma de decisiones que asigna la responsabilidad de toma de decisiones a cada nivel según corresponde.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '11.8 Los POE incluyen un organigrama actualizado con datos de contacto.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 11',
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
      componentTitle: 'Componente 12. Planificación de respuesta y de recuperación',
      componentDescription: 'Un conjunto de procedimientos documentados para el proceso de respuesta y recuperación ante desastres / crisis. Esto incluye el uso de las capacidades locales, la transición hacia la recuperación, el tipo de actividades y servicios prestados durante las actividades de respuesta y de recuperación y las estrategias de salida, los procedimientos para acceder al DREF y EA, y plantillas para la planificación, presupuestos y acceso a fondos.',
      namespaces: [
        {
          nsTitle: '12.1 La SN aplica un plan de respuesta multisectorial, actualizado y aprobado, para el despliegue rápido y uso eficiente de los recursos humanos y materiales.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.2 El plan toma en cuenta las complejidades de género, edad, discapacidad y diversidad y las capacidades de la comunidad.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.3 El plan se desarrolla con la comunidad, el personal, los voluntarios y los órganos de gobierno y los de gestión, y con insumos técnicos por parte de la FICR donde corresponda.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.4 El plan se adhiere a los Principios y Normas para la Asistencia Humanitaria, a las políticas de GD y a los Principios Fundamentales.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.5 El plan se alinea con las normas y plantillas mundiales de la FICR (PdAE).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.6 El plan considera cómo abordar los desastres secundarios y reducir los riesgos durante la respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.7 El plan reconoce las acciones de respuesta y de recuperación de otros actores, y se difunde al Movimiento y a otros actores externos pertinentes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.8 La SN tiene un proceso para adaptar el plan al contexto cambiante y a las necesidades de emergencia',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.9 La SN tiene un proceso para adaptar el plan al contexto cambiante y a las necesidades de emergencia',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.10 La SN tiene un proceso para adaptar el plan al contexto cambiante y a las necesidades de emergencia',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.11 La SN tiene un proceso para adaptar el plan al contexto cambiante y a las necesidades de emergencia',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '12.12 La SN tiene un proceso para adaptar el plan al contexto cambiante y a las necesidades de emergencia',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 12',
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
      componentTitle: 'Componente 13. Reuniones y acuerdos pre-desastre',
      componentDescription: 'El compromiso de celebrar reuniones y acuerdos con actores externos y del Movimiento, para identificar, tomar medidas ante y abordar las brechas de cualquier temporada futura de desastres (por ejemplo, monzones, inundaciones o ciclones) o cualquier evento genérico de desastre / crisis (epidemia, pandemia o situaciones de conflicto). Los acuerdos pre desastre deberán establecer las funciones de cada socio en caso de desastre / crisis',
      namespaces: [
        {
          nsTitle: '13.1 Se celebran reuniones pre-desastre / crisis con actores clave (por lo menos una vez al año).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.2 El personal clave está familiarizado con los acuerdos predesastre / crisis y cómo operacionalizarlos durante una respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.3 Se formalizan los arreglos de coordinación y gestión con los actores locales y nacionales pertinentes (ONG, ONGI, ONU, Gobierno).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.4 La SN cuenta con un mapeo actualizado de las capacidades de los socios del Movimiento.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.5 En la SN se conocen y se dispone de los acuerdos de coordinación con el Movimiento, y son compartidos con la FICR.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.6 Todos los contratistas han firmado el Código de Conducta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.7 Todos los acuerdos predesastre están en línea con las políticas y procedimientos de la SN, incluyendo los Principios y Normas para la Asistencia Humanitaria, Fortalecimiento de la Coordinación y Cooperación de Movimiento (SMCC), estándares del Movimiento, y en línea con las normas de Calidad y de Rendición de Cuentas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.8 Existen acuerdos con el gobierno para facilitar las importaciones de ayuda humanitaria y agilizar los trámites de visa para el personal que es movilizado.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.9 Los acuerdos con los proveedores clave de bienes y servicios se formalizan con un mecanismo acordado para la activación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.10 Los acuerdos con los proveedores de servicios de transferencia de efectivo se formalizan con un mecanismo acordado para la activación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '13.11 Se tienen establecidos acuerdos con los sistemas existentes de protección social, para facilitar el acceso a bases de datos preexistentes de las poblaciones vulnerables.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 12',
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
