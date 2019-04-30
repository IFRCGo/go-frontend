import React from 'react';

class A5OperationsSupport extends React.Component {
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
  areaTitle: 'Area 5: Operations support',
  areaQuestion: 'Do you want to assess the preparedness of your National Society for Epidemics and pandemics?',
  areaOptions: [
    'yes',
    'no'
  ],
  components: [
    {
      componentTitle: 'Component 30. Safety and security management',
      componentDescription: 'Addresses policy and procedures to ensure the safety of staff and volunteers. This include awareness, effective recruitment, training and management processes in place to ensure that personnel are capable of undertaking the roles demanded of them (from NS operational, management and leaders) according to the Stay Safe (IFRC) and Safer Access (ICRC). Based on safer access framework, including concepts of access, perception, identification and acceptance, and protection and violence prevention.',
      namespaces: [
        {
          nsTitle: '30.1 NS implements Safer Access and has appropriate security systems in place to protect staff and volunteers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '30.2 Trained staff at headquarter and branch are appointed and accountable for safety and security.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '30.3 Context and risk analysis information is provided to responders on an ongoing basis.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '30.4 A safety and security policy and a compliance system exist to monitor staff and volunteers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '30.5 Responders have been trained in Safer Access, Stay Safe and managers have completed security management training.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '30.6 All staff and volunteers know the NS safety and security rules and procedures and follow them.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '30.7 NS has communication mechanisms for staff and volunteers to report safety and security risks and incidents.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 30 performance',
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
      componentTitle: 'Component: 31. Operations Monitoring, Evaluation, Reporting and Learning',
      componentDescription: 'The PMERL is designed to implement a results-based planning, monitoring and evaluation system that provides an evidence base of NS performance, including relevance, efficiency, effectiveness, sustainability and impact. A reliable and trusted organization is accountable, providing transparent and timely information and building systems to strengthen data collection and reporting. It is data-driven, analytical and results-based.',
      namespaces: [
        {
          nsTitle: '31.1 NS has a dedicated PMER function for emergency operations with adequate human and financial resources.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '31.2 NS refers to and uses lessons from previous operations in response planning (e.g. from evaluation, review and operational reports).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '31.3 NS has a standardised framework or plan of action for emergency operations which identifies specific results and the indicators to measure them.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '31.4 NS operates an M&E system at the field level to collect, manage and report on data to branch, country and IFRC offices against the set objectives of the operation.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '31.5 Operational plans are revised and updated based on intended and unintended outcomes of operations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '31.6 NS allocates resources to conducts evaluations and/or reviews of the operation to identify and integrate key lessons and recommendations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '31.7 NS reports in a timely manner using appropriate reporting templates/formats according to agreements with partners.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '31.8 NS effectively leads or cooperates with the IFRC and ICRC on relevant PMER processes, especially the compilation and sharing of Movement-wide contributions to the operation.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 31 performance',
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
      componentTitle: 'Component 32. Finance and Admin policy and emergency procedures',
      componentDescription: 'Overall budgeting, accounting, treasury, assets, financial reporting and financial services operations. it also includes the efficient delivery , cost effective and timely services to the NS. Pre-approved, auditable, expedited procedures that allow for flexibility during a disaster/crisis. These must meet transparency, oversight and accountability standards. Procedures may include faster approval processes, fewer signatures, different authority levels. The Emergency Procedures are activated for a specific period of time.',
      namespaces: [
        {
          nsTitle: '32.1 NS has an automated accounting and financial system and procedures to account for and report regularly on funds, expenditures and any in-kind resources received.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '32.2 NS has trained personnel in Finance and Admin emergency support procedures.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '32.3 NS has approved adapted Finance and Admin emergency procedures that comply with national laws and IFRC practices to rapidly support operations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '32.4 The activation of Finance and Admin emergency procedures is linked to the EOC SOPs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '32.5 NS has procedures in place to facilitate transparency.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '32.6 NS has in place systems and procedures for control and oversight to prevent acts of fraud and/or corruption during an emergency.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '32.7 Relevant admin finance staff and operation managers are familiar with existing emergency related MoUs or agreements for compliance.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 32 performance',
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
      componentTitle: 'Component 33. Information and Communication Technology (ICT)',
      componentDescription: 'Refers to technologies that provide access to information through telecommunications. This includes the Internet, wireless networks, mobile phones, radios and other communication mediums.',
      namespaces: [
        {
          nsTitle: '33.1 All key staff are equipped with functioning mobile phones, SIM cards/load cards are readily available, and a system to ensure recharging is in place while in the field.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.2 NS key personnel carry contact lists at all times with critical numbers saved as standard on all mobile phones.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.3 NS has an up-to-date, approved Emergency Notification Protocol / SOPs followed by all staff and volunteers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.4 NS has an agreed social media platform (i.e. WhatsApp, Viber, Line, Facebook etc.) for emergency communications and messaging.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.5 Key headquarter and branch staff in high-risk areas have a functioning radio system (two-way VHF and HF).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.6 Handheld radios are assigned to key staff and NS vehicles are equipped with radios.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.7 Frequencies for emergency radio transmission are officially cleared with national authorities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.8 All personnel have received radio training and call signs are assigned accordingly.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.9 NS has up-to-date, approved SOPs for mobile and radio communications.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.10 NS has assigned satellite phones to key staff (according to context needs) and any country restrictions are known and adhered to.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.11 NS has portable generators to ensure continuity of operations at key HQ and branch locations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.12 NS has an internet capable router to provide data connectivity for operational staff and pocket WiFi devices are available for field personnel.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '33.13 NS has trained IT support focal points able to support technical issues and equipment (e.g. computers, software, phones, cameras, GPS) and provide maintenance.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 33 performance',
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
      componentTitle: 'Component 34. Logistics, procurement and supply chain',
      componentDescription: 'A clear Logistics function with documented emergency procedures allowing for coordinated support to the response. Planning also needs to have been done with preferred domestic suppliers to facilitate rapid local procurement when necessary and also to identify alternative logistics and transport routes and access in case a disaster/crisis event affects the normal choices.'
    },
    {
      componentTitle: 'Sub Component: LOGISTICS MANAGEMENT',
      namespaces: [
        {
          nsTitle: '34.1 NS has a dedicated function/unit to carry out and coordinate all logistics activities, i.e. procurement, stock management and warehousing, transport and fleet.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.2 All staff involved in logistics have a clearly defined role in their job descriptions and have received training to carry out their tasks.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.3 Key staff are familiar with IFRC logistics services to support National Society emergency operations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.4 NS has analysed optimal supply chain options (e.g. prepositioned relief items, pre-existing agreements with suppliers, environmental impact) in terms of cost, speed and reliability.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.5 Pre-positioned relief items meet standards and reflect at risk/affected populations needs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.6 Pre-positioned relief items are strategically located in the high risk areas.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.7 NS has volunteers trained in logistics who can act as surge capacity during an emergency response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 34A performance',
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
      componentTitle: 'Sub Component: SUPPLY CHAIN MANAGEMENT',
      namespaces: [
        {
          nsTitle: '34.8 NS is aware of the existence of any status agreement IFRC has signed with the government and the implications of that agreement on any import duty and tax exemptions.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.9 NS coordinates their stock and equipment with other key stakeholders in country and adheres to Movement standards (Emergency Items Catalogue).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.10 A documented, expedited procedure exists for branches to request additional relief items and/or equipment for early action and immediate response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.11 NS has SOPs for accepting (or rejecting), storing, disposing and reporting on in-kind donations.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.12 NS has a procedure on the import of goods (regulations to comply, forms to be completed, requirement of import licensed agents, etc.), including import tax/duties exemptions.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 34B performance',
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
      componentTitle: 'Sub Component: PROCUREMENT',
      namespaces: [
        {
          nsTitle: '34.13 NS has trained personnel for procurement.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.14 NS has a documented and approved emergency procurement procedure, including authorisation levels, standard forms, templates, and relevant staff are familiar with the procedure.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.15 NS has an up-to-date database of suppliers (who are in compliance with IFRC Code of Conduct) for key items and services.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.16 Supplier database includes the option to blacklist suppliers who are in breach of Code of Conduct or are not performing as per agreement.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.17 NS has up-to-date pre-agreements with suppliers to be able to immediately access supplies and/or services necessary for humanitarian response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 34C performance',
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
      componentTitle: 'Sub Component: FLEET AND TRANSPORTATION MANAGEMENT',
      namespaces: [
        {
          nsTitle: '34.18 NS has a fleet manual including road safety and security, vehicle management and maintenance, insurance and registration, and staff are familiar with content.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.19 NS vehicles are insured and their use is fully documented through the use of logbooks, maintenance records, fuel checks etc.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.20 NS has sufficient and appropriate vehicles (i.e. 4x4 or trucks), owned or contracted, for disaster response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.21 NS vehicles are fitted with seatbelts, fire extinguishers and first aid kits, and there is a clear and enforced policy on no weapons in vehicles.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.22 NS only uses licensed mechanics (or workshops) for its vehicle maintenance.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.23 NS has documented procedures for recording and reporting of accidents and insurance claims.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.24 NS has mapped in-country resources to rent or borrow vehicles and/or drivers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.25 NS drivers are regularly tested and have valid licenses for the types of vehicles they are driving.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.26 NS drivers are trained in First Aid, defensive driving and Safer Access.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.27 NS has documented procedures to induct and test new drivers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.28 NS has emergency procedures to guide the hours for drivers including non-standard hours and compensation.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 34D performance',
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
      componentTitle: 'Sub Component: WAREHOUSE AND STOCK MANAGEMENT',
      namespaces: [
        {
          nsTitle: '34.29 NS has an approved warehouse and stock management manual with standard forms and templates.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.30 Relevant staff and volunteers are trained on the procedures and use of forms.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.31 NS has a secure, dedicated and appropriate space with 24/7 access to receive, store and dispatch relief supplies and response equipment, sufficient to cover target number of households as per its response plan.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '34.32 NS has storage space (owned, rented or shared with other organisations) near high-risk communities, accessible during disasters.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 34E performance',
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
      componentTitle: 'Component 35. Staff and volunteer management',
      componentDescription: 'Well-functioning staff and volunteer management systems and practices allow for effective recruitment, supervision, support and encouragement of staff and volunteers.',
      namespaces: [
        {
          nsTitle: '35.1 Responders are deployed and equipped according to ToRs.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.2 NS has learning paths for responders to obtain required qualifications and skills according to competencies and role profiles.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.3 Responders are trained in quality and accountability standards (Sphere, Code of Conduct, etc...) around the protection, sexual abuse, exploitation, child protection, gender-based violence and other forms of abuse.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.4 Responders have official updated ID recognised by authorities and appropriate visibility items.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.5 Responders are regularly briefed on safety and security risks and are appropriately insured.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.6 Procedures exist to activate, deploy and manage branch and national response teams.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.7 NS has an accessible, up-to-date database of responders contacts and capacities at branch and HQ level.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.8 NS incorporates response volunteers from relevant sectors to maintain a diverse workforce.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.9 NS has expedited procedures to incorporate spontaneous volunteers during emergencies which meet minimum screening procedures and comply with its volunteer in emergency policy.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.10 NS has HR procedures to scale-up and down (recruitment, retention), and procedures for appreciation of volunteers during emergencies.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.11 NS has a formal personnel rotation and retention strategy for response.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.12 For scenarios that entail safety and/or security concerns for staff and volunteers, a specific Safer Access analysis is conducted.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.13 Training on self-care, violence and harassment in the workplace is completed regularly, and psychosocial support is available for staff and volunteers during and after emergencies and crises.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.14 NS has a policy to cover responders\' expenses incurred during emergencies.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '35.15 The Code of Conduct is signed by all NS staff and volunteers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 35 performance',
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
      componentTitle: 'Component 36. Communication in emergencies',
      componentDescription: 'Incorporates a system of public messaging to enable the NS to share timely, accurate information before, during, and after a disaster or crisis.',
      namespaces: [
        {
          nsTitle: '36.1 Communications focal points are identified and trained at headquarters and branch level.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '36.2 An official spokesperson is designated in an emergency.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '36.3 NS uses public and social media to draw attention to unmet needs, and rights of affected people.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '36.4 Standard templates for communication are available.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '36.5 External communication plan is available and implemented, and NS provides information to public on emergency situation within 24 hours.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '36.6 Key messages and public awareness messages in an emergency are developed and shared with staff regularly.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '36.7 NS has capacity to track negative media and social media and react accordingly.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '36.8 NS coordinates with IFRC/ICRC on joint communication (SMCC).',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '36.9 NS has a social networking policy and guidelines to ensure appropriate conduct of staff and volunteers.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: '36.10 NS has capacity to generate evidence-based results/messages to advocate to targeted audiences, i.e. decision makers and communities.',
          nsQuestion: 'Benchmark status',
          nsAnswers: [
            'yes',
            'no'
          ],
          feedbackTitle: 'Notes related to the benchmark & Means of verification/source',
          feedbackDescription: 'Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required'
        },
        {
          nsTitle: 'Component 36 performance',
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
  areaTitle: 'Domaine 4: Coordination',
  areaQuestion: 'Voulez-vous évaluer l\'état de préparation de votre Société Nationale pour les épidémies et les pandémies?',
  areaOptions: [
    'Oui',
    'Non'
  ],
  components: [
    {
      componentTitle: 'Catégorie 24. Coordination avec le Mouvement',
      componentDescription: 'Des mécanismes facilitant la coordination avec le CICR, la FICR et la SNP nationale.',
      namespaces: [
        {
          nsTitle: '24.1 Toutes les activités de coordination et de coopération adhèrent aux principes du RCCM.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '24.2 Les mécanismes de coordination dans le pays sont établis avec les partenaires du mouvement de manière à partager des informations sur les évaluations de besoin, les plans d\'actions, l\'avancée des opérations et les lacunes émergentes en termes de ressources et de capacités opérationnelles.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '24.3 La SN échange des informations avec les SN des pays voisins et coordonne des activités d\'intervention.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: '24.4 Lorsque l\'assistance internationale est acceptée, la SN établit un cadre permettant de recevoir, coordonner, justifier et signaler son utilisation en collaboration avec la FICR.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises'
        },
        {
          nsTitle: 'Résumé de la catégorie 24',
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
      componentTitle: 'Catégorie 25. Coordination avec les autorités',
      componentDescription: 'Un mécanisme facilitant la coordination et la coopération avec les autorités locales et nationales. En lien avec le rôle d\'auxiliaire de la SN pour l\'assistance humanitaire.',
      namespaces: [
        {
          nsTitle: '25.1 La SN fait officiellement partie du système de coordination humanitaire national, participe régulièrement et informe ses partenaires des capacités du Mouvement de la CRCR si un support international est nécessaire.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '25.2 La SN connaît les capacités des autorités nationales et identifie les domaines de compétence d\'une intervention afin de remplir son rôle d\'auxiliaire.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '25.3 La SN maintient un contrôle sur les biens, les ressources, l\'utilisation de l\'emblème et assure son indépendance lorsqu\'elle travaille avec des autorités publiques.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '25.4 Chaque domaine d\'intervention dispose des mécanismes de coordination établis avec les autorités locales et nationales.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 25',
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
      componentTitle: 'Catégorie 26. Coordination avec les agences externes et les ONG',
      componentDescription: 'Un mécanisme facilitant la coordination et la collaboration avec les Organisations Non Gouvernementales (ONG), à la fois locales et internationales, les organisations de la société civile (OSC) et les agences des Nations Unies dans le pays.',
      namespaces: [
        {
          nsTitle: '26.1 La SN est un membre actif de la communauté humanitaire (ONU, ONG) dans la coordination et l\'efficacité de l\'intervention.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '26.2 Le rôle de la SN en tant que membre du cluster est formellement identifié, et la SN fournit des informations au système de coordination humanitaire.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '26.3 La SN connaît le rôle du Secrétariat de la FICR dans la coordination du cluster Abris.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '26.4 La SN connaît les mécanismes permettant de participer aux appels et aux processus stratégiques menés par l\'ONU.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '26.5 Des accords de partenariat avec des ONG/agences de l\'ONU partenaires d\'intervention d\'urgence sont formalisés et partagés entre les branches et les sièges.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 26',
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
      componentTitle: 'Catégorie 27. Relations civile-militaire',
      componentDescription: 'Dialogue et interaction avec des acteurs militaires, essentiels pour protéger et promouvoir les principes humanitaires, éviter la concurrence, minimiser les incohérences et, lorsque cela est approprié, poursuivre des objectifs communs.',
      namespaces: [
        {
          nsTitle: '27.1 Des accords de coordination existent avec l\'armée et respectent les Principes Fondamentaux, le Droit Humanitaire International (DHI), et les résolutions du Conseil des Délégués.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '27.2 La SN applique les directives du Mouvement au Mouvement et aux organes militaires (2005).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '27.3 La SN n\'utilise des moyens militaires qu\'en dernier recours, en coordination avec les autorités locales et en informant la FICR.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '27.4 La SN prend en compte l\'impact potentiel sur la sécurité des populations affectées lorsqu\'elle se coordonne avec l\'armée, et n\'utilise pas de protection armée ou de transport militaire armé.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '27.5 La SN promeut les Principes Fondamentaux et fait un usage approprié des emblèmes du Mouvement.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 27',
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
      componentTitle: 'Catégorie 28. Coordination avec les intervenants au niveau des communautés locales',
      componentDescription: 'Implication auprès des CDRTs (Équipes d\'intervention en cas de catastrophe au sein de la communauté) par le biais de la formation, de la coordination et du développement de la préparation communautaire aux catastrophes et des plans d\'intervention.',
      namespaces: [
        {
          nsTitle: '28.1 Il existe des procédures pour gérer les informations entre la communauté et les branches, et entre les branches et le siège.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '28.2 Les informations issues des communautés sont prises en considération pour la prise de décision dans les branches, et partagées avec les sièges.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '28.3 Les branches disposent de systèmes pour communiquer et se coordonner avec les CDRT.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '28.4 La SN soutient les systèmes d\'intervention communautaires (au sein de la SN ou en coordination avec les autorités locales).',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 28',
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
      componentTitle: 'Catégorie 29. Coopération avec le secteur privé',
      componentDescription: 'Un mécanisme permettant la coopération avec le secteur privé, qui joue souvent un rôle important dans l\'intervention, notamment lorsque des impacts se font sentir sur leur personnel et leurs activités. Les entreprises souhaitent généralement donner des biens et des services. Les accords préalables permettent d\'accélérer l\'intervention.',
      namespaces: [
        {
          nsTitle: '29.1 La SN fait preuve de diligence raisonnable lorsqu\'elle sélectionne ses partenaires et accepte des dons, de manière à minimiser les risques sur son image ou sa réputation.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '29.2 La SN garantit une utilisation appropriée de l\'emblème et protège l\'identité visuelle de l\'organisation.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: '29.3 La SN dispose de mécanismes pour former et utiliser des bénévoles issus d\'entreprises partenaires.',
          nsQuestion: 'Statut du jalon',
          nsAnswers: [
            'Oui',
            'Non'
          ],
          feedbackTitle: 'Notes relatives à la référence et moyens de vérification / source',
          feedbackDescription: 'Documenter la discussion qui prend en charge le statut sélectionné du point de repère, en expliquant la raison et en fournissant des informations supplémentaires sur les mesures de préparation requises.'
        },
        {
          nsTitle: 'Résumé de la catégorie 29',
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
  areaTitle: 'Area 4: Coordinación',
  areaQuestion: '¿Desea evaluar la preparación de su Sociedad Nacional de Epidemias y pandemias?',
  areaOptions: [
    'Si',
    'No'
  ],
  components: [
    {
      componentTitle: 'Componente 24. Coordinación con el Movimiento',
      componentDescription: 'Los mecanismos que facilitan la coordinación con el CICR, la FICR y las PNS en el país.',
      namespaces: [
        {
          nsTitle: '24.1 Toda coordinación y cooperación se adhiere a los principios de SMCC.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '24.2 En el país se establecen mecanismos de coordinación con los socios del Movimiento para compartir información sobre la evaluación de las necesidades, el plan de acción, los avances respecto a las operaciones y las brechas emergentes en cuanto a recursos y capacidades operacionales.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '24.3 La SN intercambia información con las SN vecinas y coordina actividades de respuesta con ellas.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '24.4 Cuando se acepta asistencia internacional, la SN establece un marco para recibir, coordinar, contabilizar y reportar sobre su uso, en colaboración con la FICR.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 24',
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
      componentTitle: 'Componente 25. Coordinación con las autoridades',
      componentDescription: 'Mecanismo que facilita la coordinación y cooperación con las autoridades locales y nacionales. Este está vinculado al papel auxiliar de la SN en la asistencia humanitaria',
      namespaces: [
        {
          nsTitle: '25.1 La SN formalmente forma parte del sistema nacional de coordinación humanitaria, participa regularmente en el mismo e informa a los socios sobre las capacidades del Movimiento de la CRMLR, en caso de requerirse apoyo internacional.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '25.2 La SN conoce las capacidades de las autoridades nacionales, e identifica áreas dentro de una respuesta donde cumplir su función auxiliar.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '25.3 La SN mantiene control sobre los activos, los recursos y el uso del emblema cuando trabaja con las autoridades públicas, y se asegura de su independencia.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '25.4 Cada área específica de intervención de la SN tiene mecanismos de coordinación establecidos con las autoridades locales y nacionales.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 25',
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
      componentTitle: 'Componente 26. Coordinación con Agencias Externas y ONG',
      componentDescription: 'Mecanismo que facilita la coordinación y la colaboración con organizaciones no gubernamentales (ONG), tanto locales como internacionales, organizaciones de sociedad civil (OSC) y organismos de las Naciones Unidas en el país.',
      namespaces: [
        {
          nsTitle: '26.1 La SN es un miembro activo de la comunidad humanitaria (ONU, ONG) para la coordinación y eficiencia de la respuesta.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '26.2 Se acuerda formalmente el papel de la SN como miembro del clúster, y la SN aporta información al sistema de coordinación humanitaria.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '26.3 La SN está consciente de la función de la Secretaría de la FICR en la coordinación del clúster de alojamiento.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '26.4 La SN conoce los mecanismos para participar en los procesos estratégicos y de llamamiento liderados por la ONU.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '26.5 Se formalizan los acuerdos de alianza con las principales instancias de la ONU/ONG socias que trabajan en respuesta ante emergencias en el país, y se comparten entre filiales y la sede.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 26',
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
      componentTitle: 'Compoenente 27. Relaciones Civico-Militares',
      componentDescription: 'Diálogo e interacción con los actores militares, lo cual es esencial para proteger y promover los principios humanitarios, evitar la competencia, minimizar la incoherencia y, cuando corresponda, perseguir objetivos comunes.',
      namespaces: [
        {
          nsTitle: '27.1 Existen acuerdos de coordinación con los militares que se adhieren a los Principios Fundamentales, al Derecho Internacional Humanitario (DIH) y a las resoluciones del Consejo de Delegados (CoD).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '27.2 La SN aplica el documento de orientación del Movimiento acerca del Movimiento y los cuerpos militares (2005).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '27.3 La SN utiliza los activos militares solo como último recurso, en coordinación con las autoridades locales e informando de ello a la FICR.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '27.4 Al coordinar con las fuerzas militares, la SN considera el impacto potencial a la seguridad de la población afectada, y no utiliza protección armada o transportes militares armados.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '27.5 La SN promueve los Principios Fundamentales y el uso correcto y apropiado de los emblemas del Movimiento.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 27',
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
      componentTitle: 'Componente 28. Coordinación con equipos locales de respuesta a nivel de comunidad.',
      componentDescription: 'Participación con los Equipos Comunitarios de Respuesta ante Desastres (CDRT), a través de capacitación, coordinación y desarrollo de planes comunitarios de preparación y de respuesta ante desastres.',
      namespaces: [
        {
          nsTitle: '28.1 Existen procedimientos para manejar la información desde la comunidad a las filiales, y desde las filiales y la sede y vice versa.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '28.2 En las filiales se toma en consideración la información desde las comunidades para la toma de decisiones, y se comparte con la sede.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '28.3 Las filiales tienen un sistema para comunicarse y coordinar con los CDRT.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '28.4 La SN apoya los sistemas de respuesta a nivel comunitario (ya sea dentro de la SN o en coordinación con las autoridades locales).',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 28',
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
      componentTitle: 'Componente 29. Cooperación con el sector privado',
      componentDescription: 'Mecanismo que permite la cooperación con el sector privado, que a menudo desempeña un papel importante en la respuesta, especialmente si hay un impacto en su personal y empresas. A menudo existe la voluntad de donar bienes y servicios. Los acuerdos establecidos con antelación ayudan a agilizar las acciones de respuesta.',
      namespaces: [
        {
          nsTitle: '29.1 La SN se asegura de realizar una verificación al seleccionar socios y al aceptar donaciones, para mitigar los riesgos a la imagen o a la reputación.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '29.2 La SN se asegura del uso adecuado del emblema y protege la identidad visual de la organización.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: '29.3 La SN tiene establecidos mecanismos para capacitar y usar a voluntarios de socios corporativos.',
          nsQuestion: 'Estado de referencia',
          nsAnswers: [
            'Si',
            'No'
          ],
          feedbackTitle: 'Notas relacionadas con el índice de referencia y medios de verificación / fuente',
          feedbackDescription: 'Documente la discusión que respalde el estado seleccionado del índice de referencia, explique la razón y proporcione información adicional sobre la acción de preparación requerida.'
        },
        {
          nsTitle: 'Resumen del componente 29',
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
