import React from 'react';

class A1PolicyStrategyForm extends React.Component {
  constructor (props) {
    super(props);
    this.sendTheFormMate = this.sendTheFormMate.bind(this);
  }

  sendTheFormMate () {
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

  render () {
    return (
      <div className='fold'>
        <div className='inner'>
          <div className="fold__header">
            <h2 className="fold__title">WELCOME TO THE PREPAREDNESS FOR EFFECTIVE RESPONSE TOOL</h2>
          </div>

          <div className='per_form_area'>Area 1: Policy Strategy and Standards</div>
          <div className='per_form_question'>Do you want to assess the preparedness of your National Society for Epidemics and pandemics?</div>
          <input type='radio' name='a1' value='' /> Yes <br />
          <input type='radio' name='a1' value='' /> No
          <div className='per_form_area'>Component 1: RC auxiliary role, Mandate and Law</div>
          A constitutional reference to the role of the NS in responding to disasters and crises, which may be legislated or included/ recognized in the National Response System.<br /><br />

          <div className='per_form_ns'>1.1 NS establishes its auxiliary role to the public authorities through a clear mandate and roles set out in applicable legislation, policies and plans.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q11' value='yes' /> Yes<br />
          <input type='radio' name='q11' value='no' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>1.2 NS mandate is aligned with RCRC Fundamental Principles.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q12' value='' /> Yes<br />
          <input type='radio' name='q12' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>1.3 NS mandate is reflected in policy, strategy, plans and procedures. The mandate is disseminated and understood by staff and volunteers.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q13' value='' /> Yes<br />
          <input type='radio' name='q13' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>1.4 NS promotes IHL to the public authorities and uses humanitarian diplomacy to promote compliance.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q14' value='' /> Yes<br />
          <input type='radio' name='q14' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>Component 1 performance</div>
          <div className='per_form_question'>Status:</div>
          <input type='radio' name='q1' value='' />Not Reviewed<br />
          <input type='radio' name='q1' value='' />Does not exist<br />
          <input type='radio' name='q1' value='' />Partially exists<br />
          <input type='radio' name='q1' value='' />Need improvements<br />
          <input type='radio' name='q1' value='' />Exist, could be strengthened<br />
          <input type='radio' name='q1' value='' />High performance
          <div className='per_form_question'>Notes related to the component:</div>
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_area'>Component 2: DRM Strategy</div>
          An outline of the overall goal that the NS seeks to achieve in its disaster and crisis response operations. The goal considers: context analysis, ongoing/regular all-hazards risk assessments: it may define the target proportion of affected population that will be reached, and a definition of the areas/sectors where a NS will usually respond during an emergency.
          <div className='per_form_ns'>2.1 NS DRM strategy reflects the NS mandate, analysis of country context, trends, operational objectives, success indicators.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q21' value='' /> Yes<br />
          <input type='radio' name='q21' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>2.2 NS DRM strategy is regularly reviewed, reflected in response plan and known by staff and volunteers.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q22' value='' /> Yes<br />
          <input type='radio' name='q22' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>2.3 NS DRM strategy includes clear engagement with technical sectors and support services to ensure comprehensive response.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q23' value='' /> Yes<br />
          <input type='radio' name='q23' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>Component 2 performance</div>
          <div className='per_form_question'>Status:</div>
          <input type='radio' name='q2' value='' /> Not Reviewed<br />
          <input type='radio' name='q2' value='' /> Does not exist<br />
          <input type='radio' name='q2' value='' /> Partially exists<br />
          <input type='radio' name='q2' value='' /> Need improvements<br />
          <input type='radio' name='q2' value='' /> Exist, could be strengthened<br />
          <input type='radio' name='q2' value='' /> High performance
          <div className='per_form_question'>Notes related to the component:</div>
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_area'>Component 3: DRM Policy</div>
          Reflects the NS mission, RCRC principles and mandate. It acknowledges other relevant NS policies, and aligns with the government policy (where applicable), incorporating the general rules that the NS will obey in order to achieve something (i.e mandate, strategy, etc.)
          <div className='per_form_ns'>3.1 NS has its own DRM policy or has adopted the IFRC policy.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q31' value='' /> Yes<br />
          <input type='radio' name='q31' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>3.2 DRM policy sets out guiding principles and values that guide decision-making on the response approach and actions.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q32' value='' /> Yes<br />
          <input type='radio' name='q32' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>3.3 DRM policy is inclusive and involves other relevant sectors and services.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q33' value='' /> Yes<br />
          <input type='radio' name='q33' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>3.4 DRM policy is reflected in response plans, procedures and it is adhered to by staff and volunteers.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q34' value='' /> Yes<br />
          <input type='radio' name='q34' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>Component 3 performance</div>
          <div className='per_form_question'>Status:</div>
          <input type='radio' name='q3' value='' /> Not Reviewed<br />
          <input type='radio' name='q3' value='' /> Does not exist<br />
          <input type='radio' name='q3' value='' /> Partially exists<br />
          <input type='radio' name='q3' value='' /> Need improvements<br />
          <input type='radio' name='q3' value='' /> Exist, could be strengthened<br />
          <input type='radio' name='q3' value='' /> High performance
          <div className='per_form_question'>Notes related to the component:</div>
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_area'>Component 4: DRM Laws, Advocacy and Dissemination</div>
          Designed to support the NS in improving legal preparedness for disasters and crisis and to promote the use of the IDRL Guidelines in order to reduce human vulnerability.
          <div className='per_form_ns'>4.1 NS has an IDRL humanitarian diplomacy plan /actions in place based on IFRC's IDRL Checklist.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q41' value='' /> Yes<br />
          <input type='radio' name='q41' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>4.2 NS has identified the relevant legal facilities (i.e. special entitlements and exemptions) in the national legislation.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q42' value='' /> Yes<br />
          <input type='radio' name='q42' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>4.3 NS has staff trained in IDRL & IHL to act as a focal point in an emergency.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q43' value='' /> Yes<br />
          <input type='radio' name='q43' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>4.4 NS is advocating the government to enact legislation in line with the Model Act for the Facilitation and Regulation of International Disaster Relief and Initial Recovery Assistance.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q44' value='' /> Yes<br />
          <input type='radio' name='q44' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>4.5 NS tests and/or tracks IDRL lessons through response operations to guide its future humanitarian diplomacy work.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q45' value='' /> Yes<br />
          <input type='radio' name='q45' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>Component 4 performance</div>
          <div className='per_form_question'>Status:</div>
          <input type='radio' name='q4' value='' /> Not Reviewed<br />
          <input type='radio' name='q4' value='' /> Does not exist<br />
          <input type='radio' name='q4' value='' /> Partially exists<br />
          <input type='radio' name='q4' value='' /> Need improvements<br />
          <input type='radio' name='q4' value='' /> Exist, could be strengthened<br />
          <input type='radio' name='q4' value='' /> High performance
          <div className='per_form_question'>Notes related to the component:</div>
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_area'>Component 5: Quality and accountability</div>
          Describes the essential elements of principled, accountable, and high-quality humanitarian action.
          The RCRC Movement provides support to the most vulnerable people in line with the Sphere and CHS standards, Code of Conduct for the RCRC Movement and NGOS in Disaster Relief and the Code for Good Partnership of the RCRC Movement, Gender & Diversity, inclusion and protection, BPI/ Do no harm, context-sensitive analysis, violence prevention, accountability to affected population and disability considerations, Community engagement and accountability (CEA).
          <div className='per_form_ns'>5.1 NS has mechanisms in place to ensure the affected populations are involved in all stages of the response (including decision making) to ensure assistance is appropriate and meets their needs and priorities.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q51' value='' /> Yes<br />
          <input type='radio' name='q51' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>5.2 NS has trained CEA focal points at key branches and headquarters.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q52' value='' /> Yes<br />
          <input type='radio' name='q52' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>5.3 A NS CEA plan is developed and implemented, standard templates are available, and procedures are included in SOPs..</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q53' value='' /> Yes<br />
          <input type='radio' name='q53' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>5.4 Safe and accessible feedback and complaints mechanisms exists to record, refer or respond, and monitor communities' concerns and requests regarding the assistance provided or protection issues (including for sexual exploitation and abuse).</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q54' value='' /> Yes<br />
          <input type='radio' name='q54' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>5.5 NS has adopted the Protection for sexual exploitation and abuse policy in line with the International conference resolution on Sexual and Gender Based Violence.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q55' value='' /> Yes<br />
          <input type='radio' name='q55' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>5.6 NS adheres to Sphere and the Core Humanitarian Standards (may consider IASC Guidelines for Integrating gender based violence interventions, IASC Guidelines on Including persons with disabilities in humanitarian action) and integrates them into sectorial activities during assessment, planning and response.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q56' value='' /> Yes<br />
          <input type='radio' name='q56' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>5.7 NS adheres to protection policies to support their protection services (safe spaces for child protection, actions for unaccompanied and separated children, prevention of sexual and gender-based violence, violence prevention, psychosocial support, restoring family links, accessibility of facilities and information) to respond.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q57' value='' /> Yes<br />
          <input type='radio' name='q57' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>5.8 NS plans and procedures actively minimise potential harmful social, economic and environmental impacts of assistance (do no harm principle).</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q58' value='' /> Yes<br />
          <input type='radio' name='q58' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>5.9 NS follows the Minimum Standards for Protection, Gender and Inclusion in Emergencies.</div>
          <div className='per_form_question'>Benchmark status</div>
          <input type='radio' name='q59' value='' /> Yes<br />
          <input type='radio' name='q59' value='' /> No
          <div className='per_form_question'>Notes related to the benchmark & Means of verification/source</div>
          Document discussion that supports the selected status of the benchmark, explaining the reason and providing additional information on the preparedness action required
          <br /><input type='text' name='' /><br /><br />

          <div className='per_form_ns'>Component 5 performance</div>
          <div className='per_form_question'>Status:</div>
          <input type='radio' name='q5' value='' /> Not Reviewed<br />
          <input type='radio' name='q5' value='' /> Does not exist<br />
          <input type='radio' name='q5' value='' /> Partially exists<br />
          <input type='radio' name='q5' value='' /> Need improvements<br />
          <input type='radio' name='q5' value='' /> Exist, could be strengthened<br />
          <input type='radio' name='q5' value='' /> High performance
          <div className='per_form_question'>Notes related to the component:</div>
          <br /><input type='text' name='' /><br /><br />

          <input type='checkbox' name='' value='' /> Save as Draft<br />
          <button onClick={this.sendTheFormMate}>Submit</button>

        </div>
      </div>
    );
  }
}

export default A1PolicyStrategyForm;
