import React from 'react';

// Misnamed! - Operational capacity
class A6Performance extends React.Component {
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

export default A6Performance;

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
      componentTitle: 'Component 14: NS-specific areas of intervention',
      componentDescription: 'Sector-specific or services provided by the NS in case of emergencies, it is in line with the NS mandate and legislation in country. It includes Community Based DP/DRR, Evacuation, Health in Emergencies, Epidemic and Pandemic, First aid, WASH, Food security and Livelihoods, Search and rRescue, Shelter, Management of dead bodies, RFL, Transition to recovery, and CBRN preparedness.',
      namespaces: [
        {
          nsTitle: 'Sub-Component 14.A: COMMUNITY-BASED DP AND DRR',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.1 NS ensures the active participation of the local population, including marginalized and excluded groups, in the assessment, design/ planning of community-based activities , ensuring that programmes appropriately reflect community needs and strengthen existing local coping strategies.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.2 NS conducts regular awareness raising and public education on disaster/crises.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.3 Community based early warning and early action is in place and linked to the local systems.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.4 CDRTs are trained and equipped to handle local response in partnership with relevant local actors.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.5 CDRTs have an up-to-date response and contingency plan aligned with relevant local plans and resources.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.6 NS ensures assessment, planning and response is done in an inclusive, gender and diversity and conflict sensitive way.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 24 performance',
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
      componentTitle: 'Sub-Component 14.B: EVACUATION',
      namespaces: [
        {
          nsTitle: '14.7 Evacuation is part of NS\'s response strategy and is identified in different scenarios.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.8 NS is part of the mechanism for the evacuation of communities in high-risk areas.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 14B performance',
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
      componentTitle: 'Sub-Component 14.C: HEALTH IN EMERGENCIES',
      namespaces: [
        {
          nsTitle: '14.9 Multi-sectoral response needs are identified for different epidemic scenarios including multi-country outbreaks.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.10 NS has procedures, data collection and feedback mechanisms in place to ensure community engagement in prevention and response interventions.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.11 NS has a procedure in place to manage and respond to rumours.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.12 NS has safety protocols in place for paid staff and volunteers, for infection prevention and control within epidemics.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.13 NS is part of the public authorities\' safe and dignified management of dead bodies and identification system in infectious disease outbreaks.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.14 NS has appropriate personal protection equipment in place with regularly trained staff and volunteers on handling, using and disposing this equipment.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.15 Community based early warning and early action is in place and linked to the local systems.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.16 NS has clearly identified their role in the case of isolation and quarantine being declared and have established relevant technical support to ensure best practice.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14C',
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
      componentTitle: 'Sub-Component 14.D: FIRST AID',
      namespaces: [
        {
          nsTitle: '14.17 First Aid is part of NS\'s response strategy and is identified in different scenarios.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.18 NS includes First Aid training as part of its CBDRR strategy.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.19 NS has trained and equipped teams of First Aid volunteers for quick and effective response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 14D performance',
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
      componentTitle: 'Sub-Component 14.E. WATER AND SANITATION',
      namespaces: [
        {
          nsTitle: '14.20 Water and sanitation humanitarian consequences are part of the NS\'s response strategy and identified in different scenarios.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.21 NS response teams (national and branch) have the appropriate WASH training, skills and equipment.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.22 NS has the required equipment to provide quality WASH services or clear SOPs on how to obtain this equipment (in-country or via IFRC).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.23 WASH technical support in emergencies is available in the NS, through RCRC Movement partners or agreed with relevant WASH authorities/ partners.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.24 NS is engaged and coordinates with other organizations and networks active in WASH in the country.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 14E performance',
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
      componentTitle: 'Sub-Component 14.F. FOOD SECURITY',
      componentDescription: 'Mechanism that allows cooperation with private sector that often plays a strong role in response, particularly if there is impact on their staff and businesses. There is often a willingness to donate goods and services. Advance agreements help to expedite response actions.',
      namespaces: [
        {
          nsTitle: '14.25 NS monitors, analyses and documents food security levels in the country, food-security status of the population/most vulnerable, agro-meteorological data, supplies and demand in main food and agricultural markets, food reserves.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.26 NS has identified technical staff for food assistance trained to identify needs and assess situation to make recommendations on assistance needed, transfer modality (cash, food, vouchers) and delivery mechanism, on markets situation.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.27 NS is engaged and coordinated with other organizations and networks (clusters) active in food aid distribution (WFP, ICRC…).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.28 NS has integrated food distribution in its response strategies (main risks, scenarios, response capacity) and adheres to policy and safety standards for food and milk distribution.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.29 NS has a specific action plan to procure and distribute food aid at scale: assessment forms SOPs for Affected population identification and selection food ration calculation (based on food access and availability at household level) different types of food distribution system set up of distribution site',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14F',
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
      componentTitle: 'Sub-Component 14.G. LIVELIHOOD SECURITY AND SAFETY NETS',
      namespaces: [
        {
          nsTitle: '14.30 Livelihoods is incorporated into NS DM/DP strategy, plans, systems and procedures.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.31 NS has identified national policies related to safety nets, employment and livelihood/economic/resilience development plans.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.32 NS has identified a Livelihood household/FS focal point and other technical staff (emergency response teams) for livelihoods preparedness who are trained on assessment, market analysis, etc.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.33 NS has identified and documented main livelihoods zones and systems (agricultural and non-agricultural), main market systems (food and household livelihood) in disaster-prone areas and a market baseline is developed and updated.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.34 NS has identified risks to community and household productive assets in disaster-prone areas with plans for protection in place.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.35 NS emergency tools are contextualised and include livelihoods.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.36 NS is engaged and coordinated with other organizations and networks active in livelihoods in the country.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.37 NS staff and volunteers are trained in data collection (for baseline and progress/indicators measurement).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14G',
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
      componentTitle: 'Sub-Component 14.H. SEARCH AND RESCUE',
      namespaces: [
        {
          nsTitle: '14.38 Search and rescue is part of the NS\'s response strategy and is identified in different scenarios.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14G',
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
      componentTitle: 'Sub-Component 14.I. SHELTER, HOUSEHOLD ITEMS, SETTLEMENTS',
      namespaces: [
        {
          nsTitle: '14.39 NS has mechanisms for consultation with target population on the most appropriate shelter response solutions.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.40 Based on the scenario agreed with the public authorities, shelter supplies are pre-positioned in high-risk areas.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.41 NS has an agreed standard NFI kit with items prepositioned, and clear SOPs on how to obtain them (in-country or via IFRC).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.42 NS has identified suppliers of shelter items and NFIs with pre-disaster and framework agreements in place.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.43 NS has standard emergency and temporary shelter designs, following consultation with at risk population and based on available materials and common techniques.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.44 NS volunteers are trained in the use of the prepositioned shelter materials to construct basic shelters (e.g. shelter kit training).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14G',
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
      componentTitle: 'Sub-Component 14.J. MANAGEMENT OF DEAD BODIES TO FACILITATE THEIR IDENTIFICATION',
      namespaces: [
        {
          nsTitle: '14.45 NS is part of the public authorities\' management of dead bodies and identification system.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.46 Management of dead bodies and identification needs are part of the NS\'s response strategy and identified in different scenarios.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14J',
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
      componentTitle: 'Sub-Component 14.K. RESTORING FAMILY LINKS (RFL)',
      namespaces: [
        {
          nsTitle: '14.47 Staff and volunteers are able to provide quality RFL services.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.48 Procedures and agreements with ICRC on RFL are in place.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14K',
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
      componentTitle: 'Sub-Component 14.L. TRANSITION TO RECOVERY',
      namespaces: [
        {
          nsTitle: '14.49 Key staff are familiar with recovery principles.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.50 The NS mandate for recovery is formally agreed with the public authorities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.51 NS has set up enabling systems allowing early recovery of livelihoods to bridge the gap between the relief phase and long-term recovery activities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.52 NS coordinates with public authorities and humanitarian actors participating in the livelihoods response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.53 NS volunteers are trained in the use of the prepositioned shelter materials to construct basic shelters (e.g. shelter kit training).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.54 NS has developed a livelihoods (early) recovery plan of action: background and justification, logical framework and indicators, monitoring and evaluation plan, activity chronogram with responsibilities allocation and milestones, budget (activity level).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.55 NS staff and volunteers are trained in response interventions for rehabilitation of productive assets (small infrastructures, clearance etc.).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14L',
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
      componentTitle: 'Sub-Component 14.M. CHEMICAL, BIOLOGICAL, RADIOLOGICAL AND NUCLEAR (CBRN) EMERGENCY PREPAREDNESS',
      namespaces: [
        {
          nsTitle: '14.56 NS has a defined role and allied responsibilities in national, regional and local authorities\' emergency plans related to CBRN hazards.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.57 NS has an action plan to respond to a CBRN incident based on its agreed role.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.58 NS has SOPs including safety protocols for CBRN related operations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.59 NS has a dedicated focal point for CBRN.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.60 NS has, according to its mandate, specifically trained staff and volunteers able to effectively operate in CBRN preparedness and response environments.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.61 NS has appropriate CBRN personal protection equipment in place, and regularly trains staff and volunteers on handling and using this equipment.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.62 NS has built up a network of expertise with relevant organizations and key experts to receive specialized support for CBRN-related hazards.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.63 NS, in line with its mandate, has readily available public key messages for CBRN emergencies, that have been vetted by the relevant civil authorities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.64 NS has engaged with neighboring National Societies in planning for and responding to the cross-border effects of CBRN hazards.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.65 The NS is participating in relevant CBRN-related forums (national/regional) for preparedness and response, and has the mechanisms for real-time information sharing.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.66 The NS has identified the need for international assistance for CBRN events (if applicable) and has shared this with Movement partners.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14M',
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
      componentTitle: 'Sub-Component 14.N. COMMUNITY BASED HEALTH & FIRST AID (CBHFA)',
      namespaces: [
        {
          nsTitle: '14.67 Community health volunteers discuss and develop health contingency plans with their communities, and conduct community health and safety assessments, once a year.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.68 Every volunteer in every sector is initially trained in Basic First Aid and receives refresher training each year.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.69 CBHFA volunteer training includes a session on proper reporting of suspect health events to branch staff and/or the Ministry of Health',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '14.70 CBHFA volunteers are actively engaged in simulation planning, implementation and evaluation to ensure community awareness and involvement, and that information and referral linkages with health facilities are maintained.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Summary of sub-component 14M',
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
      componentTitle: 'Catégorie 14: Domaines spécifiques d\'intervention de la SN',
      componentDescription: 'Services fournis par la SN en cas d\'urgence, conformément au mandat de la SN et à la législation nationale. Inclut la RRC et le PC basés sur la communauté, l\'évacuation, la santé d\'urgence, les épidémies et les pandémies, les premiers secours, l\'eau et l\'assainissement, la sécurité alimentaire, la recherche et le sauvetage, les abris, la gestion des dépouilles, la RLF, la transition vers le relèvement, et la préparation NRBC.'
    },
    {
      componentTitle: 'Sous Catégorie 14.A: PC ET RRC A BASE COMMUNAUTAIRE',
      namespaces: [
        {
          nsTitle: '14.1 La SN garantit la participation active de la population locale, y compris des groupes marginalisés et exclus, dans l\'évaluation, la conception/planification des activités communautaires, pour assurer que les programmes reflètent de manière appropriée les besoins de la communauté et renforcent les stratégies actuelles d\'adaptation.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '14.2 La SN conduit une sensibilisation et une éducation publique régulière aux catastrophes et aux crises.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '14.3 Le système d\'alerte précoce et d\'action précoce basé sur la communauté est en place et en relation avec les systèmes locaux.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '14.4 Les CDRT sont formés et équipés pour gérer une intervention locale en partenariat avec les acteurs locaux pertinents.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '14.5 Les CDRTs disposent d\'un plan d\'intervention et d\'urgence mis à jour, en phase avec les plans et les ressources locales.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '14.6 La SN assure que l\'évaluation, la planification et l\'intervention soit menée de manière inclusive, en prenant en compte le genre, la diversité et les conflits.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: 'Résumé de la sous catégorie 14A',
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
      componentTitle: 'Sous Catégorie 14.B: EVACUATION',
      componentDescription: 'Un mécanisme facilitant la coordination et la coopération avec les autorités locales et nationales. En lien avec le rôle d\'auxiliaire de la SN pour l\'assistance humanitaire.',
      namespaces: [
        {
          nsTitle: '14.7 L\'évacuation fait partie de la stratégie d\'intervention de la SN. Elle est identifiée dans différents scénarios.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '4.8 La SN fait partie du mécanisme d\'évacuation des communautés vivant dans des zones à haut risque.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la sous catégorie 14B',
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
      componentTitle: 'Sous Catégorie 14.C: LA SANTE EN SITUATION D\'URGENCE',
      namespaces: [
        {
          nsTitle: '14.9 Les besoins d\'intervention multisectoriels sont identifiés pour différents scénarios d\'épidémies, et notamment pour des épidémies impliquant plusieurs pays.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.10 La SN dispose de procédures, de mécanismes de collecte de données et de rétroaction, afin de garantir l\'implication de la communauté dans la prévention et les interventions.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.11 La SN a mis en place une procédure pour gérer et répondre aux rumeurs.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.12 La SN dispose de protocoles de sécurité destinés au personnel rémunéré et aux bénévoles, pour la prévention des infections et le contrôle des épidémies.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.13 La SN fait partie du système de gestion sûre et digne des cadavres et du système d\'identification lors des épidémies de maladies infectieuses.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.14 La SN dispose d\'équipements de protection individuelle, et forme régulièrement son personnel et ses bénévoles à la manipulation et à l\'utilisation de ces équipements, ainsi qu\'à leur mise au rebut.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.15 La SN a clairement identifié son rôle dans les épidémies, et a établi un support technique pertinent pour garantir les meilleurs pratiques possibles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.16 La SN a clairement identifié en cas d\'isolation et de quarantaine, et a établi un support technique pertinent pour garantir les meilleurs pratiques possibles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14C',
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
      componentTitle: 'Sous Catégorie 14.D: PREMIERS SECOURS',
      namespaces: [
        {
          nsTitle: '14.17 Les premiers secours font partie de la stratégie d\'intervention de la SN et sont identifiés pour différents scénarios.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.18 La SN a inclus une formation aux premiers secours dans le cadre de sa stratégie pour la RRC basée sur la communauté.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.19 La SN a formé des équipes bénévoles de premiers secours pouvant intervenir rapidement et efficacement en cas de catastrophe.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14D',
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
      componentTitle: 'Sous Catégorie 14.E. EAU ET ASSAINISSEMENT',
      namespaces: [
        {
          nsTitle: '14.20 Les conséquences humanitaires sur l\'eau et l\'assainissement font partie de la stratégie d\'intervention de la SN et sont identifiées dans différents scénarios.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.21 Les équipes d\'intervention de la SN (niveau national et branche) disposent des qualifications, des compétences et des équipements adéquats en matière d\'eau et d\'assainissement (WASH).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.22 La SN dispose des équipements nécessaires pour fournir des services de qualité dans le domaine WASH, ou de PON détaillant comment obtenir ces équipements (au niveau national ou par le biais de la FICR).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.23 Un support technique WASH d\'urgence est disponible à la SN via les partenaires du Mouvement CRCR, ou est assuré par des partenaires/autorités WASH.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.24 La SN s\'engage et se coordonne avec d\'autres organisations et réseaux travaillant dans le domaine WASH dans le pays.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14E',
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
      componentTitle: 'Sous Catégorie 14.F. SECURITE ALIMENTAIRE',
      namespaces: [
        {
          nsTitle: '14.25 La SN surveille, analyse et documente les niveaux de sécurité alimentaire dans le pays, le statut de la sécurité alimentaire de la population/des plus vulnérables, les données agro-météorologiques, l\'offre et la demande sur les principaux marchés alimentaires et agricoles, et les réserves de nourriture.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.26 La SN a identifié une équipe technique en charge de l\'assistance alimentaire et l\'a formée à identifier les besoins et à évaluer la situation pour émettre des recommandations, en termes d\'assistance, de modalité de transfert (monétaire, nourriture, coupons) de mécanismes de livraison et de la situation des marchés.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.27 La SN s\'engage et se coordonne avec d\'autres organisations et réseaux (clusters) actifs dans la distribution d\'aide alimentaire (PAM, CICR…).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.28 La SN a intégré la distribution alimentaire à ses stratégies d\'intervention (risques principaux, scénarios, capacités d\'intervention) et adhère aux politiques et aux normes de sécurité pour la distribution de nourriture et de lait.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.29 La SN dispose d\'un plan d\'action spécifique pour se procurer et distribuer une aide alimentaire d\'envergure : formulaires d\'évaluation PON pour l\'identification et la sélection des populations affectées calcul des rations alimentaires (basé sur l\'accès et la disponibilité de la nourriture au niveau du foyer) différents types de systèmes de distribution de nourriture mise en place du lieu de distribution',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14F',
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
      componentTitle: 'Sous Catégorie 14.G. SECURITE DES MOYENS DE SUBSISTANCE ET FILETS DE SECURITE',
      namespaces: [
        {
          nsTitle: '14.30 Les moyens de subsistance sont inclus à la stratégie GC/PC, aux plans, aux systèmes et aux procédures de la SN.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.31 La SN a identifié des politiques nationales en lien avec les filets de sécurité, l\'emploi et les plans de développement des moyens de subsistance/économiques/de la résilience.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.32 La SN a identifié un point focal chargé des moyens de subsistance / Sécurité alimentaire ainsi que d\'autres membres du personnel (équipes d\'intervention d\'urgence) responsable de la préparation aux moyens de subsistance, formés aux évaluations, aux analyses de marché, etc.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.33 Dans les régions les plus exposées aux catastrophes, les principaux systèmes et zones produisant des moyens de subsistance sont documentés (agricoles et non-agricoles), les principaux systèmes de marché sont identifiés (aliments et moyens de subsistance) et une valeur de référence sur le marché est développée et mise à jour.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.34 Dans des régions exposées aux catastrophes, les risques pesant sur la communauté et les moyens de production du foyer sont identifiés et un plan de protection de ces moyens de production est mis en place.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.35 Des outils d\'urgence sont adaptés/développés pour inclure les moyens de subsistance, et sont contextualisés.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.36 La SN s\'engage et se coordonne avec d\'autres organisations et réseaux actifs dans les moyens de subsistance dans le pays.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.37 Le personnel de la SN est formé à la collecte de données (pour mesurer une donnée de référence et des indicateurs de progrès).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14G',
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
      componentTitle: 'Sous Catégorie 14.H. RECHERCHE ET SAUVETAGE',
      namespaces: [
        {
          nsTitle: '14.38 Les besoins en recherche et sauvetage sont identifiés pour différents scénarios et font partie de la stratégie d\'intervention de la SN.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14G',
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
      componentTitle: 'Sous Catégorie 14.I. ABRIS, ARTICLES MENAGERS, CAMPS',
      namespaces: [
        {
          nsTitle: '14.39 Des mécanismes de consultation des populations cibles portant sur les solutions d\'abris les plus appropriés sont disponibles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.40 Conformément au scénario établi avec le gouvernement, des abris sont pré-positionnés dans des zones à haut risque.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.41 La NS dispose d\'un kit non alimentaire de base approuvé dont les articles sont pré-positionnées, et de PON clairs sur les mécanismes d\'obtention des articles (à l\'échelle nationale ou par le biais de la FICR).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.42 Les fournisseurs d\'abris et d\'articles non alimentaires sont identifiés par la SN en amont de la catastrophe et des accords-cadres sont en place.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.43 Les plans pour des abris d\'urgence standards et temporaires sont établis suite à une consultation de la population à risque, et sont basés sur les matériaux disponibles et les techniques habituelles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.44 Les bénévoles de la SN sont formés à l\'utilisation des matériaux de construction des abris pré-positionnés (ex. formation aux kits d\'abris).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14L',
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
      componentTitle: 'Sous Catégorie 14.J. GESTION DES DEPOUILLES POUR FACILITER LEUR IDENTIFICATION',
      namespaces: [
        {
          nsTitle: '14.45 La SN fait partie du système de gestion et d\'identification des dépouilles du gouvernement.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.46 Les besoins en gestion des dépouilles et en identification sont identifiés pour différents scénarios et font partie de la stratégie d\'intervention de la SN.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14G',
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
      componentTitle: 'Sous Catégorie 14.K. RESTAURATION DES LIENS FAMILIAUX (RLF)',
      namespaces: [
        {
          nsTitle: '14.47 Le personnel et les bénévoles sont aptes à fournir des services de RLF de qualité.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.48 Des procédures et des accords de RLF sont mis en place auprès du CICR.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14G',
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
      componentTitle: 'Sous Catégorie 14.L. TRANSITION VERS LE RELEVEMENT',
      namespaces: [
        {
          nsTitle: '14.49 Les membres clés du personnel connaissent les principes du relèvement.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.50 Le mandat de la SN dans le relèvement est formellement convenu avec le gouvernement.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.51 La SN a mis en place des systèmes habilitants permettant le relèvement précoce des moyens de subsistance, de manière à créer un pont entre la phase de secours et les activités de relèvement à long terme.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.52 La SN est bien coordonnée avec le Gouvernement et les acteurs humanitaires participant à l\'intervention sur les moyens de subsistance.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.53 La SN est formée aux évaluations participatives (dont la collecte de données (Suivi et évaluation)) pour identifier les priorités des communautés et des foyers (identifier les lacunes).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.54 La SN a développé un plan d\'action de relèvement (précoce) des moyens de subsistance : contexte et justification, cadre logique et indicateurs, plan de surveillance et d\'évaluation, chronogramme des activités avec jalons et attribution des responsabilités, budget (niveau d\'activité).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.55 La SN dispose d\'une équipe formée pour mener à bien des interventions de réhabilitation des moyens de production (petites infrastructures, déblaiement…).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14L',
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
      componentTitle: 'Sous Catégorie 14.M. PREPARATION AUX RISQUES NUCLEAIRES, RADIOACTIFS, BIOLOGIQUES ET CHIMIQUES (NRBC)',
      namespaces: [
        {
          nsTitle: '14.56 La SN dispose d\'un rôle négocié et défini dans les plans d\'urgence nationaux, régionaux et locaux concernant les aléas NRBC.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.57 La SN dispose d\'un plan d\'action pour répondre à un incident NRBC, conformément à son rôle convenu.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.58 La NS dispose de PON comprenant des protocoles de sécurité pour les opérations liées aux aléas NRBC.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.59 La NS dispose d\'un point focal pour les aléas NRBC.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.60 La SN a, conformément à son mandat, formé du personnel et des bénévoles à agir de manière efficace dans l\'intervention et la préparation aux incidents NRBC.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.61 La SN dispose d\'équipements de protection NRBC individuels, et forme régulièrement son personnel et ses bénévoles à manipuler et à utiliser ces équipements.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.63 La SN, conformément à son mandat, dispose d\'ores et déjà de messages publics clés en cas d\'urgence NRBC, qui ont été validés par les autorités civiles compétentes.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.64 La SN s\'est impliquée auprès des Sociétés Nationales des pays voisins pour planifier et répondre aux effets transnationaux des aléas NRBC.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.65 La SN participe à des forums NRBC pertinents (nationaux/régionaux) pour la préparation et l\'intervention, et dispose de mécanismes de partage d\'informations en temps réel.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.66 La SN a identifié le besoin d\'assistance internationale en cas d\'événement NRBC et l\'a partagé avec les partenaires appropriés du Mouvement.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14M',
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
      componentTitle: 'Sous Catégorie 14.N. SANTE ET PREMIERS SECOURS BASES SUR LA COMMUNAUTE (SPSBC)',
      namespaces: [
        {
          nsTitle: '14.67 Les bénévoles de santé communautaires discutent et développent des plans d\'urgence avec leurs communautés, et conduisent des évaluations de santé et de sécurité de la communauté une fois par an.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.68 Chaque bénévole de chaque secteur est formé aux Premiers Secours et suit un cours de perfectionnement une fois par an.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.69 La formation SPSBC destinée aux bénévoles inclut une session sur le signalement adéquat d\'événements de santé suspects au personnel de la branche et/ou au Ministère de la Santé.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '14.70 Les bénévoles SPSBC sont activement impliqués dans la planification, la mise en œuvre et l\'évaluation de simulations, pour garantir la sensibilisation et l\'implication de la communauté, et faire en sorte que les informations et les liaisons avec les structures sanitaires soient maintenues.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 14N',
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
      componentTitle: 'Componente 14. Áreas de intervención específicas a la SN',
      componentDescription: 'Servicios específicos al sector prestados por la SN en caso de emergencias, lo cual está en consonancia con el mandato y la legislación de la SN en el país. Esto incluye PD / RRD Comunitario, Evacuación, Salud en Emergencias, Epidemia y Pandemia, Primeros Auxilios, WASH, Seguridad Alimentaria y Medios de Vida, Búsqueda y Rescate, Alojamiento, Manejo de Cadáveres, RCF, Transición hacia la Recuperación y Preparación CBRN.'
    },
    {
      namespaces: [
        {
          nsTitle: '14.1 La SN se asegura de la participación activa de la población local, incluyendo los grupos marginados y excluidos, en la evaluación, el diseño/planificación de las actividades comunitarias, asegurándose de que los programas reflejen adecuadamente las necesidades de la comunidad y fortalezcan las estrategias locales de afrontamiento existentes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.2 La SN realiza actividades periódicas de sensibilización y educación pública en materia de desastres y crisis.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.3 Están establecidas la alerta temprana y la acción temprana comunitarias, y están vinculadas a los sistemas locales.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.4 Los CDRT están capacitados y equipados para manejar la respuesta local en asociación con los actores locales pertinentes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.5 Los CDRT tienen un plan de respuesta y de contingencia actualizado alineado con los planes y recursos locales pertinentes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.6 La SN se asegura de que la evaluación, la planificación y la respuesta se lleven a cabo de manera inclusiva y sensible a género, diversidad y a los conflictos.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14A',
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
      componentTitle: 'Sub Componente: 14.B. EVACUACIÓN',
      namespaces: [
        {
          nsTitle: '14.7 La evacuación es parte de la estrategia de respuesta de la SN, y se identifica en diferentes escenarios.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.8 La SN es parte del mecanismo para la evacuación de comunidades en zonas de alto riesgo.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14B',
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
      componentTitle: 'Sub Componente: 14.C. SALUD EN EMERGENCIAS',
      namespaces: [
        {
          nsTitle: '14.9 Se identifican necesidades de respuesta multisectorial para diferentes escenarios de epidemias, incluyendo brotes en múltiples países.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.10 La SN cuenta con procedimientos y mecanismos de recopilación de datos y de retroalimentación para garantizar la participación de la comunidad en las intervenciones de prevención y respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.11 La SN tiene establecido un procedimiento para manejar y responder a los rumores.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.12 La SN tiene establecidos protocolos de seguridad para el personal remunerado y los voluntarios, para la prevención y control de infecciones en casos de epidemias.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.13 La SN es parte del sistema gubernamental a cargo del manejo seguro y digno de cadáveres y del sistema de identificación en casos de brotes de enfermedades infecciosas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.14 La SN dispone de equipo de protección personal adecuado, y regularmente capacita al personal y a los voluntarios en el manejo, uso y eliminación de este equipo.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.15 La SN ha identificado claramente su papel dentro de las epidemias, y ha establecido el apoyo técnico pertinente para garantizar las mejores prácticas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.16 La SN ha identificado claramente su papel en el caso de declararse aislamientos y cuarentenas, y ha establecido el apoyo técnico pertinente para garantizar las mejores prácticas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14C',
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
      componentTitle: 'Sub Componente: 14.D. PRIMEROS AUXILIOS',
      namespaces: [
        {
          nsTitle: '14.17 Los primeros auxilios forman parte de la estrategia de respuesta de la SN, y se identifican en diferentes escenarios.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.18 La SN incluye la capacitación en Primeros Auxilios en su estrategia de reducción de riesgos de desastres basada en la comunidad.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.19 La SN tiene equipos de voluntarios entrenados y equipados para prestar Primeros Auxilios, para una respuesta rápida y eficaz.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14D',
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
      componentTitle: 'Sub Componente: 14.E. AGUA Y SANEAMIENTO',
      namespaces: [
        {
          nsTitle: '14.20 Las consecuencias humanitarias en cuanto a agua y saneamiento son parte de la estrategia de respuesta de la SN, y se identifican en diferentes escenarios.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.21 Los equipos de respuesta de la SN (nacional y de filiales) tienen la capacitación, las habilidades y los equipos adecuados relativos a WASH.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.22 La SN cuenta con el equipamiento necesario para prestar servicios WASH de calidad, o POE claros sobre cómo obtener este equipamiento (en el país o mediante la FICR).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.23 La SN dispone de apoyo técnico de WASH en emergencias, ya sea mediante socios del Movimiento de la CRMLR o acordado con las autoridades / socios pertinentes en WASH.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.24 La SN participa y coordina con otras organizaciones y redes activas en WASH en el país.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14E',
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
      componentTitle: 'Sub Componente: 14.F. SEGURIDAD ALIMENTARIA',
      namespaces: [
        {
          nsTitle: '14.25 La SN monitorea, analiza y documenta los niveles de seguridad alimentaria en el país, la situación de seguridad alimentaria de la población / los más vulnerables, los datos agrometeorológicos, la oferta y la demanda en los principales mercados agrícolas y de alimentos, y las reservas de alimentos.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.26 La SN ha identificado al personal técnico para la asistencia alimentaria, el cual está capacitado para identificar necesidades y evaluar la situación para hacer recomendaciones sobre la asistencia que se necesita, la modalidad de transferencia (dinero en efectivo, alimentos, cupones) y el mecanismo de entrega, y sobre la situación de los mercados.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.27 La SN participa y está coordinada con otras organizaciones y redes (clústeres) activas en la distribución de ayuda alimentaria (PMA, CICR, etc.)',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.28 La SN ha integrado la distribución de alimentos en sus estrategias de respuesta (principales riesgos, escenarios, capacidad de respuesta), y se adhiere a las normas y políticas de seguridad para la distribución de alimentos y leche.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.29 La SN tiene un plan de acción específico para adquirir y distribuir ayuda alimentaria a escala: formularios de evaluación POE para la identificación y selección de población afectada cálculo de raciones de alimentos (en base al acceso a alimentos y la disponibilidad a nivel de hogar) diferentes tipos de sistemas de distribución de alimentos instalación de lugar de distribución',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14F',
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
      componentTitle: 'Sub Componente: 14.G. SEGURIDAD DE MEDIOS DE VIDA Y REDES DE SEGURIDAD',
      namespaces: [
        {
          nsTitle: '14.30 Se incorporan los medios de vida en la estrategia, planes, sistemas y procedimientos de GD / PD de la SN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.31 La SN ha identificado políticas nacionales relacionadas con las redes de seguridad, el empleo y los planes de desarrollo económico/ de medios de vida / de resiliencia.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.32 La SN ha identificado a un punto focal de medios de vida / Seguridad alimentaria y otro personal técnico (equipos de respuesta a emergencias) para la preparación en medios de vida, los cuales están capacitados en evaluación, análisis de mercado, etc.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.33 En las zonas propensas a desastres, la SN ha identificado y documentado las principales zonas y sistemas de medios de vida (agrícolas y no agrícolas), los principales sistemas de mercado (alimentos y medios de vida de hogar), y se desarrolla y actualiza una línea de base del mercado',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.34 En zonas propensas a desastres, la SN ha identificado los riesgos para los activos productivos de la comunidad y de los hogares, y se establece un plan de protección.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.35 Las herramientas de emergencia de la SN se contextualizan e incluyen los medios de vida.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.36 La SN participa y está coordinada con otras organizaciones y redes activas en medios de vida en el país.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.37 El personal y los voluntarios de la SN están capacitados en recolección de datos (para la realización de línea de base y la medición de los avances / indicadores).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14G',
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
      componentTitle: 'Sub Componente: 14.H. BÚSQUEDA Y RESCATE',
      namespaces: [
        {
          nsTitle: '14.38 La búsqueda y rescate forma parte de la estrategia de respuesta de la SN, y se identifica en diferentes escenarios.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14H',
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
      componentTitle: 'Sub Componente: 14.I. ALOJAMIENTO, ARTÍCULOS PARA EL HOGAR, ASENTAMIENTOS',
      namespaces: [
        {
          nsTitle: '14.39 La SN dispone de mecanismos para consultar a la población objetivo sobre las soluciones más adecuadas en materia de respuesta de alojamiento.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.40 Los suministros para alojamiento se encuentran pre-posicionados en zonas de alto riesgo en base al escenario acordado con el gobierno.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.41 La SN tiene acordado un kit estándar de NFI con artículos preposicionados, así como POE claros sobre cómo obtenerlos (en el país o mediante la FICR).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.42 La SN ha identificado los proveedores de artículos NFI y de alojamiento, y se encuentran establecidos acuerdos predesastre y marco.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.43 La SN dispone de diseños estándar de alojamientos temporales y de emergencia, previa consulta con la población en riesgo y en base a técnicas comunes y a los materiales disponibles.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.44 Los voluntarios de la SN están capacitados en el uso de los materiales de alojamiento preposicionados para construir refugios básicos (por ejemplo, capacitación en el kit de alojamiento).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14G',
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
      componentTitle: 'Sub Componente: 14.J. GESTIÓN DE CADÁVERES PARA FACILITAR SU IDENTIFICACIÓN',
      namespaces: [
        {
          nsTitle: '14.45 La SN es parte del sistema gubernamental de gestión e identificación de cadáveres.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.46 La gestión de cadáveres y las necesidades de identificación forman parte de la estrategia de respuesta de la SN, y se identifican en diferentes escenarios.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14J',
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
      componentTitle: 'Sub Componente: 14.K. RESTABLECIMIENTO DE CONTACTOS FAMILIARES (RCF)',
      namespaces: [
        {
          nsTitle: '14.47 El personal y los voluntarios son capaces de prestar servicios de RCF de calidad.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.48 Se encuentran establecidos los procedimientos y los acuerdos en materia de RCF con el CICR.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14K',
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
      componentTitle: 'Sub Componente: 14.L. TRANSICIÓN HACIA LA RECUPERACIÓN',
      namespaces: [
        {
          nsTitle: '14.49 El personal clave está familiarizado con los principios de la recuperación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.50 El mandato de recuperación de la SN está formalmente acordado con el gobierno.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.51 La SN ha establecido sistemas que permiten la recuperación temprana de los medios de vida, para cerrar la brecha entre la fase de socorro y las actividades de recuperación a largo plazo.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.52 La SN coordina con los actores gubernamentales y humanitarios que participan en la respuesta en medios de vida.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.53 El personal y los voluntarios de la SN están capacitados en evaluación participativa (incluyendo recolección de datos - M&E) para identificar las prioridades y las brechas de las comunidades y los hogares.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.54 La SN ha desarrollado un plan (temprano) de acción para la recuperación de los medios de vida: antecedentes y justificación, marco lógico e indicadores, plan de M&E, cronograma de actividades con asignación de responsabilidades e hitos, presupuesto (nivel de actividad).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.55 El personal y los voluntarios de la SN están capacitados en intervenciones de respuesta para la rehabilitación de activos productivos (infraestructura pequeña, limpieza, etc.).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14L',
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
      componentTitle: 'Sub Componente: 14.M. PREPARACIÓN ANTE EMERGENCIAS QUÍMICAS, BIOLÓGICAS, RADIOLÓGICAS Y NUCLEARES (CBRN)',
      namespaces: [
        {
          nsTitle: '14.56 La VBC incluye eventos químicos como un indicador específico o como un evento inusual. La SN incluye contactos con autoridades químicas en sus POE para VBC.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.58 La SN tiene POE que incluyen protocolos de seguridad para operaciones relacionadas con CBRN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.58 La SN tiene POE que incluyen protocolos de seguridad para operaciones relacionadas con CBRN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.59 La SN tiene un punto focal dedicado para CBRN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.60 De acuerdo a su mandato, la SN cuenta con personal y voluntarios específicamente capacitados y capaces de operar eficazmente en contextos de preparación y respuesta ante CBRN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.61 La SN dispone de equipo de protección personal adecuado para CBRN, y capacita regularmente al personal y a los voluntarios en el manejo y uso de este equipo.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.62 La SN ha creado una red de conocimiento especializado con las organizaciones pertinentes y los expertos clave, para recibir apoyo especializado para los peligros relacionados con CBRN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.63 De acuerdo con su mandato, la SN tiene mensajes claves de sensibilización pública fácilmente disponibles para las emergencias CBRN, los cuales han sido revisados y aprobados por las autoridades civiles pertinentes.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.64 La SN ha participado con las Sociedades Nacionales vecinas en la planificación y respuesta a efectos transfronterizos de peligros CBRN.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.65 La SN está participando en foros pertinentes relacionados con CBRN (nacionales / regionales) para preparación y respuesta, y cuenta con los mecanismos para compartir información en tiempo real.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.66 La SN ha identificado la necesidad de asistencia internacional para eventos CBRN (de ser aplicable), y ha compartido esto con los socios del Movimiento',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14M',
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
      componentTitle: 'Sub Componente: 14.N. SALUD Y PRIMEROS AUXILIOS COMUNITARIOS (SPAC)',
      namespaces: [
        {
          nsTitle: '14.67 Los voluntarios comunitarios de salud discuten y desarrollan planes de contingencia de salud con sus comunidades, y realizan evaluaciones de salud y de seguridad comunitaria una vez al año.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.68 Cada voluntario de cada sector es inicialmente capacitado en Primeros Auxilios Básicos, y recibe capacitación de actualización todos los años',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.69 La capacitación para los voluntarios de SPAC incluye una sesión sobre la forma correcta de reportar eventos de salud sospechosos al personal de la filial y / o al Ministerio de Salud.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '14.70 Los voluntarios de SPAC participan activamente en la planificación, implementación y evaluación de simulacros, para garantizar la sensibilización y la participación de la comunidad y que se mantengan los vínculos de información y de remisión con los establecimientos de salud.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 14N',
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
