import { environment } from "#config";
import LanguageContext from "#root/languageContext";
import { PropTypes as T } from 'prop-types';
import React from "react";

export default class CatalogueOfSurgeServicesSubPage extends React.Component {

    openNewTab(url, e) {
        e.preventDefault();
        if (url === undefined || url === null || url === "") {
            return;
        }

        window.open(url, '_blank');
    }

    createInnerHtml(content) {
        return { __html: content };
    }

    renderContentAdditionalResources(content, title) {
        return (
            <>
                <h3 className="margin-4-t">{title}</h3>
                {content.listItems !== undefined ?
                    <ul>
                        {content.listItems.map((listItem, index) => (
                            <li>{listItem}<a href={content.listItemsUrls[index].url}>{content.listItemsUrls[index].text}</a></li>
                        ))}
                    </ul>
                    : <></>
                }
                {content.text !== undefined ?
                    <p>{content.text}<a href={content.textUrl.url}>{content.textUrl.text}</a></p>
                    : <></>
                }
            </>
        );
    }

    renderContentSpecifications(content, title) {
        return (
            <>
                <h3 className="margin-4-t">{title}</h3>
                {content.weight !== undefined ?
                    <>
                        <p><strong>Weight:</strong></p>
                        <p>{content.weight}</p>
                    </>
                    : <></>
                }
                {content.volume !== undefined ?
                    <>
                        <p><strong>Volume:</strong></p>
                        <p>{content.volume}</p>
                    </>
                    : <></>
                }
                {content.cost !== undefined ?
                    <>
                        <p><strong>Cost (indicative):</strong></p>
                        <p>{content.cost}</p>
                    </>
                    : <></>
                }
                {content.nationalSocieties !== undefined ?
                    <>
                        <p><strong>National societies providing this service:</strong></p>
                        <p>{content.nationalSocieties}</p>
                    </>
                    : <></>
                }
                {content.subText !== undefined ?
                    <p style={{ fontStyle: 'italic' }}>{content.subText}</p>
                    : <></>
                }
            </>
        );
    }

    renderContentPersonnel(content, title) {
        return (
            <>
                <h3 className="margin-4-t">{title}</h3>
                {content.text !== undefined ?
                    <p>{content.text}</p> : <></>
                }
                {content.listItems !== undefined ?
                    <ul>
                        {content.listItems.map(listItem => (
                            <li>{listItem}</li>
                        ))}
                    </ul>
                    : <></>
                }
                {content.total !== undefined ?
                    <>
                        <p><strong>Total:</strong></p>
                        <p>{content.total}</p>
                    </>
                    : <></>
                }
                {content.composition !== undefined ?
                    <>
                        <p><strong>Composition:</strong></p>
                        <p>{content.composition}</p>
                    </>
                    : <></>
                }
                {content.compositions !== undefined ?
                    <>
                        <p><strong>Composition:</strong></p>
                        <ul>
                            {content.compositions.map(composition => (
                                <li>{composition}</li>
                            ))}
                        </ul>
                    </>
                    : <></>
                }
                {content.subText !== undefined ?
                    <p style={{ fontStyle: 'italic' }}>{content.subText}</p>
                    : <></>
                }
            </>
        );
    }

    renderContentWithTextsAndListItemsAndSubText(content, title) {
        return (
            <>
                <h3 className="margin-4-t">{title}</h3>
                {content.text !== undefined ?
                    <p>{content.text}</p> : <></>
                }
                {content.innerHtml !== undefined ?
                    <div dangerouslySetInnerHTML={this.createInnerHtml(content.innerHtml)}></div>
                    : content.listItemsBoldStart !== undefined ?
                        <ul>
                            {content.listItems.map((listItem, index) => (
                                <li><strong>{content.listItemsBoldStart[index]}</strong>{listItem}</li>
                            ))}
                        </ul>
                        : content.listItems !== undefined ?
                            <ul>
                                {content.listItems.map(listItem => (
                                    <li>{listItem}</li>
                                ))}
                            </ul>
                            : <></>
                }
                {content.assessment !== undefined ?
                    <>
                        <p><strong>Assessment:</strong></p>
                        <p>{content.assessment}</p>
                    </>
                    : <></>
                }
                {content.responseAnalysis !== undefined ?
                    <>
                        <p><strong>Response Analysis:</strong></p>
                        <p>{content.responseAnalysis}</p>
                    </>
                    : <></>
                }
                {content.setupAndImplementation !== undefined ?
                    <>
                        <p><strong>Set-up & Implementation:</strong></p>
                        <p>{content.assessment}</p>
                    </>
                    : <></>
                }
                {content.monitoringAndEvaluation !== undefined ?
                    <>
                        <p><strong>Monitoring & Evaluation:</strong></p>
                        <p>{content.assessment}</p>
                    </>
                    : <></>
                }
                {content.subText !== undefined ?
                    <p style={{ fontStyle: 'italic' }}>{content.subText}</p>
                    : <></>
                }
            </>
        );
    }

    renderCatalogueServices(content) {
        return (
            <div className="catalogueServicePage">
                <h1>{content.title}</h1>
                {content.images !== undefined ?
                    <div className="row flex-sm margin-2-t">
                        {content.images.map(image => (
                            <img className={`margin-2-b col col-6-sm ${content.images.length <= 2 ? "col-4-sm" : "col-3-mid"}`} src={image} />
                        ))}
                    </div>
                    : <></>
                }
                {content.textSection.capacity !== undefined ?
                    this.renderContentWithTextsAndListItemsAndSubText(content.textSection.capacity, 'Capacity')
                    : <></>
                }
                {content.textSection.emergencyServices !== undefined ?
                    this.renderContentWithTextsAndListItemsAndSubText(content.textSection.emergencyServices, 'Emergency Services')
                    : <></>
                }
                {content.textSection.designedFor !== undefined ?
                    this.renderContentWithTextsAndListItemsAndSubText(content.textSection.designedFor, 'Designed for')
                    : <></>
                }
                {content.textSection.personnel !== undefined ?
                    this.renderContentPersonnel(content.textSection.personnel, 'Personnel')
                    : <></>
                }
                {content.textSection.standardComponents !== undefined ?
                    this.renderContentWithTextsAndListItemsAndSubText(content.textSection.standardComponents, 'Standard components')
                    : <></>
                }
                {content.textSection.specifications !== undefined ?
                    this.renderContentSpecifications(content.textSection.specifications, 'Specifications')
                    : <></>
                }
                {content.textSection.variationOnConfiguration !== undefined ?
                    this.renderContentWithTextsAndListItemsAndSubText(content.textSection.variationOnConfiguration, 'Variation on configuration')
                    : <></>
                }
                {content.textSection.additionalResources !== undefined ?
                    this.renderContentAdditionalResources(content.textSection.additionalResources, 'Additional resources')
                    : <></>
                }
                {content.textSection.additionalNotes !== undefined ?
                    this.renderContentWithTextsAndListItemsAndSubText(content.textSection.additionalNotes, 'Additional Notes')
                    : <></>
                }
            </div>
        );
    }

    renderOtherCatalogueServices(content) {
        return (
            <div className="catalogueServicePage">
                <h1>{content.title}</h1>
                {content.textSection.map((section) => {
                    if (section.urls.length === 0) {
                        return (
                            <div>
                                <h3>{section.title}</h3>
                                <p>{section.text}</p>
                            </div>
                        );
                    } else if (section.urls.length === 1) {
                        return (
                            <div>
                                <h3>{section.title}</h3>
                                <p>
                                    {section.text}
                                    <a href={section.urls[0].url} onClick={() => this.openNewTab(section.urls[0].url)}>{section.urls[0].text}</a>
                                </p>
                            </div>
                        );
                    } else {
                        return (
                            <div>
                                <h3>{section.title}</h3>
                                <p>{section.text}</p>
                                <ul>
                                    {section.urls.map(url => (
                                        <li>
                                            <a href={url.url} onClick={() => this.openNewTab(url.url)}>{url.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    }
                })}
            </div>
        );
    }

    render() {
        const content = data.find(content => content.hash === this.props.selectedService);
        if (content === undefined) {
            return (
                <></>
            );
        }

        if (content.other) {
            return this.renderOtherCatalogueServices(content);
        } else {
            return this.renderCatalogueServices(content);
        }
    }
}
CatalogueOfSurgeServicesSubPage.contextType = LanguageContext;
if (environment !== 'production') {
    CatalogueOfSurgeServicesSubPage.propTypes = {
        selectedService: T.string
    };
}

const data = [
    {
        hash: '#household-water-treatment-and-safe-storage-hwts',
        other: false,
        title: 'Household Water Treatment and Safe Storage (HWTS)',
        textSection: {
            capacity: {
                text: 'The Household Water Treatment and Safe Storage (HWTS) Module is a lighter configuration of a water supply Unit, with the capacity to design and implement a comprehensive household water program, including hygiene promotion and safe storage components.\n\nThe module is deployed to support host National Society in the establishment of a household water treatment programme in emergency, including:\n\nThe Module has the capacity to work stand-alone up to 4 months, based on monthly rotations. Additionally, it can be also used as a support for other Emergency Response Units during the emergency response phase or as a solution for exit strategy.\n\nThe number of people that can be served by the HWTS is not predefined. The minimum start-up capacity, however, is estimated in 1,000 families for the first month.'
            },
            emergencyServices: {
                innerHtml: '<p>The HWTS module is a flexible tool, capable of scaling up and down the activities accordingly to the evolution of the context needs. The set of activities that the Module is prepared to carry out includes:</p><ul><li>Needs and situation assessment in terms of access to safe water at household level, (including aspects related to storage capacity, hygiene habits and practices, legal issues and local capacity to respond to the needs -market analysis- to look into different response options).</li><li>Selection of beneficiaries (considering elements such as gender and diversity as well as potential vulnerabilities related to age or disability)</li><li>Drafting of a Plan of Action, programme implementation and monitoring and reporting on results and impact.</li><li>Selection of adequate water treatment system(s), training on them to the population and coordination with distribution teams for the delivery to the target community.</li><li>Conduct hygiene promotion activities</li><li>Carry out of activities aimed to ensure the access to safe water at community institutional and communal areas level.</li></ul><p>To carry out these activities, the Module will be integrated by personnel with a combination of core and technical competencies.</p>'
            },
            designedFor: {
                text: 'The HWTS can respond to a range of disasters such as floods, earthquakes, hurricanes, or large displacements of people, as well as slow-onset disasters such as droughts, to areas affected by protracted crisis and WASH related disease outbreaks. The HWTS can be deployed to settings where other water ERUs are not deployed, alongside other ERUs (M15/M40/WSR/Health) and can continue past other ERUs.'
            },
            personnel: {
                total: 'Depending on the type of intervention, the Module’s Team composition may vary from 1 to 6 people.',
                compositions: [
                    'Team leader/HWTS assessment lead',
                    'Emergency water quality and treatment specialist',
                    'Emergency community mobilization/hygiene promotion specialist',
                    'Distribution specialist',
                    'Admin/Logs and contracting officer',
                    'Market assessment and Cash-based assistance specialist'
                ]
            },
            standardComponents: {
                listItems: [
                    'The basic equipment for a HWTS Team is comprised of:',
                    'Water quality testing kit',
                    'Water treatment samples',
                    'Distribution and storage elements',
                    'Hygiene promotion box A',
                    'Personal equipment',
                    'Others (PPEs, tools kits, etc.)',
                    'Additionally, depending on the deployment conditions, the Team can also be deployed with:',
                    'Vehicle(s)',
                    'Life zone (including office zone)',
                    'The team will need to be provided with a cash advance. The minimum amount will be established on a case by case basis.',
                    'The HWTS has access to backstopping technical advice/communities of practice and can call upon remote support for work on some aspects of the damage assessment as well as the implementation.'
                ]
            },
            specifications: {
                weight: 'TBD but capable of inclusion as hold baggage on commercial flight',
                volume: 'TBD but capable of inclusion as hold baggage on commercial flight',
                nationalSocieties: 'Spanish.'
            },
            additionalResources: {
                listItems: ['Spanish Red Cross HWTS Module implementation guide/SOP'],
                listItemsUrls: [
                    { text: '', url: '' }
                ]
            }
        }
    },
    {
        hash: '#water-supply-rehabilitation-wsr',
        other: false,
        title: 'Water Supply Rehabilitation (WSR)',
        textSection: {
            capacity: {
                text: 'To support host National Societies to assess and deliver water supply to populations affected by disasters/crisis through rehabilitation and, if necessary, establishment of new water supply infrastructure. The Water Supply Rehabilitation (WSR) ERU consists of a small team of specialised delegates with limited equipment, able to support a host National Society to rapidly assess the state of the existing water system and improve the system. The WSR can be deployed for up to 4 months and able to transition into longer term recovery though earlier withdrawal remains an option. The interventions of the WSR ERU aims with shorter-term interventions to improve existing water systems serving past the immediate emergency phase. The number of people that can be served by the WSR is not predefined and depends on the capacity and status of the existing water system but is primarily intended for larger scale operations.'
            },
            emergencyServices: {
                text: 'The WSR ERU module is flexible to provide the appropriate response for different context and select the personnel with the right combination and balance of RC/RC and professional experience to implement its activities:',
                listItems: [
                    'Rapid damage assessment of the pre-existing water system and its management, feasibility study, planning, design, and implementation of water system repair/rehabilitation. The WSR focusses on quick implementation and the selection of environmentally feasible, affordable and durable technical solutions. It will ensure that distinct needs and realities of women, men, and vulnerable groups are reflected in decision making.',
                    'Planning, design, implementation and monitoring of hygiene promotion activities with an achievable function: 1) focus on establishing and/or supporting, where appropriate, community water management structures such as water committees contributing to sustainability of water supply systems, including assessment, and 2) community mobilisation and hygiene information, education and communication targeted at promoting protective hygiene behaviour and proper set up of community accountability systems.'
                ]
            },
            designedFor: {
                text: 'The WSR can respond to a range of disasters such as floods, earthquakes, hurricanes, or large displacements of people, as well as slow-onset disasters such as droughts, to areas affected by protracted crisis and WASH related disease outbreaks. The WSR can be deployed to settings where other water ERUs are not deployed, alongside other ERUs (M15/M40/HWTS) and can continue past other ERUs. The type of rehabilitation or construction depends on the context (rural, peri-urban, camps) and the type of existing water system and includes improving abstraction (pumping), treatment or protection of water sources as well as improving storage and distribution systems. The WSR in support of NS can draw upon a full range of mechanism beyond direct delivery i.e. use indirect delivery; hire of contractors, daily labour payments, work with Govt/water utilities to re-establish or improve damaged/degraded water systems. Each water system needs to be managed and to improve a system the WSR will work with those who are managing or have a responsibility for the system.'
            },
            personnel: {
                total: 'May be deployed as a 1-5-person team, that can in consultation with IFRC/NS call for further resources. The WSR ERU will retain personnel to fit a selected number of core roles as detailed below.',
                compositions: [
                    'Team leader/water assessment lead',
                    'Emergency water supply engineer (bulk/networked systems)',
                    'Emergency water supply engineer (point/ground water sources)',
                    'Hygiene promotor/community mobiliser (behaviour change/gender and inclusion/community engagement and accountability)',
                    'Logistics and contracting officer'
                ]
            },
            standardComponents: {
                listItems: [
                    'Each team is fully equipped with surveillance, survey, camera & mapping tools to conduct water system assessments and water system design and a hygiene promotion box',
                    'The WSR has access to backstopping technical advice/communities of practice and can call upon remote support for work on some aspects of the damage assessment.'
                ]
            },
            specifications: {
                weight: 'TBD but capable of inclusion as hold baggage on commercial flight',
                volume: 'TBD but capable of inclusion as hold baggage on commercial flight',
                cost: 'CHF 5,000 (equipment only)',
                nationalSocieties: 'Norwegian, Netherlands.'
            },
            additionalResources: {
                listItems: ['NorCross Water Supply Rehabilitation ERU Handbook/SOP'],
                listItemsUrls: [
                    { text: '', url: '' }
                ],
            }
        }
    },
    {
        hash: '#m40-eru',
        other: false,
        title: 'M40 ERU',
        images: [
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m40_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m40_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m40_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m40_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m40_05.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m40_06.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Water treatment and distribution for 40,000 people for a maximum of 4 months according to ERU SOPs.'
            },
            emergencyServices: {
                listItems: [
                    'Treatment (with chemical, non filtration) and distribution of up to 600,000 litres of water a day to a population of up to 40,000.',
                    'The unit can set up nine different storage and distribution points for up to 75,000 litres a day.',
                    'Distribution and trucking capacity for the transport of treated water to dispersed populations.'
                ]
            },
            designedFor: {
                listItems: [
                    'Response to population that could be scattered but not very dispersed, due to the need to set up a water treatment not mobile camp.',
                    'The unit requires the availability of a suitable local surface water supply.',
                    'Tanks for water treatment are normally not mobile.',
                    'Tank for water distribution can be mobile and this unit should arrange transport to areas where population is served.'
                ]
            },
            personnel: {
                total: '4-6 people.',
                composition: 'Team Leader, 1-2 WASH or Chemical Engineer, 1 Technician/Plumber, 1 Logistic/Admin/Finance.',
                subText: 'In addition to the above team, local staff is normally contracted to assist in other areas such as security, set up of the water treatment camps, maintenance, truck drivers, etc.'
            },
            specifications: {
                weight: '25 MT',
                volume: '110 CBM',
                cost: 'CHF 300,000',
                nationalSocieties: 'Austrian, German (supported by Croatia and Macedonia), Swedish, French.'
            }
        }
    },
    {
        hash: '#msm20-eru',
        other: false,
        title: 'MSM20 ERU',
        images: [
            'https://ifrcgo.org/global-services/assets/img/wash/wash-msm20_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-msm20_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-msm20_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-msm20_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-msm20_05.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-msm20_06.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-msm20_07.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-msm20_08.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Sanitation facilities and hygiene promotion for 20,000 people for a maximum of 4 months according to ERU SOPs.'
            },
            emergencyServices: {
                text: 'Integrated response through:',
                listItems: [
                    'Hygiene promotion (including community mobilization, hygiene education, and operation and maintenance).',
                    'Basic sanitation facilities (including latrines, vector control and solid waste disposal) for up to 20,000).'
                ]
            },
            designedFor: {
                text: 'Situations where bad hygiene is consistently practiced by affected people, where there is the danger of diarrhoea, cholera, and other disease outbreaks will persist.'
            },
            personnel: {
                total: '5-6 people.',
                composition: 'Team Leader, 1-2 Sanitation Engineer, 1 Hygiene promoter, 1 Logistic/Admin/Finance.',
                subText: 'In addition to the above team, local staff is normally contracted to assist in the construction of the sanitation facilities (masons, builders supervisors, etc).'
            },
            specifications: {
                weight: '14 MT',
                volume: '90 CBM',
                cost: 'CHF 200,000',
                nationalSocieties: 'Austrian, British, German, Spanish, Swedish.'
            }
        }
    },
    {
        hash: '#m15-eru',
        other: false,
        title: 'M15 ERU',
        images: [
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m15_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m15_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m15_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m15_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m15_05.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m15_06.jpg',
            'https://ifrcgo.org/global-services/assets/img/wash/wash-m15_07.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Water treatment and distribution for 15,000 people for a maximum of 4 months according to ERU SOPs.'
            },
            emergencyServices: {
                listItems: [
                    'Treatment (including filtration) and distribution of water up to 225,000 litres a day for a population of 15,000 people.',
                    'Storage capacity of a maximum of 200,000 litres a day.',
                    'Basic sanitation for up to 5,000 people.',
                    'Distribution and trucking capacity for transport of treated water to dispersed populations, capacity of up to 75,000 litres a day.'
                ]
            },
            designedFor: {
                listItems: [
                    'Response to scattered populations, with a flexible approach due to a number of smaller treatment units, which can be split and set up as stand-alone units in different locations.',
                    'Availability of local water sources is required.',
                    'Possibility to set up nine different storage and distribution points. Preconditions are availability of flatbed trucks, fuel, road access.',
                    'Water treatment lines (catchment, filtration, chlorination, distribution, and delivery) are mobile and the number might vary from 3 to 5 (production from 45,000 to 75,000 liters/day).'
                ]
            },
            personnel: {
                total: '4-6 people',
                composition: 'Team Leader, 1-2 WASH or Chemical Engineer, 1 Technician/Plumber, 1 Logistic/Admin/Finance'
            },
            specifications: {
                weight: '22 MT',
                volume: '160 CBM',
                cost: 'CHF 250,000',
                nationalSocieties: 'Austrian, French, German, Spanish'
            },
            variationOnConfiguration: {
                text: 'Depending on NS the number of water purification lines (from catchment to delivery to affected people) can vary from 3 to 5.\n\nThis unit could also provide very basic sanitation and hygiene promotion activities to 5,000 people.'
            }
        }
    },
    {
        hash: '#kit-10',
        other: false,
        title: 'Kit 10',
        textSection: {
            capacity: {
                text: 'Water treatment for a population of up to 10,000 people.'
            },
            emergencyServices: {
                text: 'This kit is designed for the treatment and distribution of water for medium size populations, providing up to 150,000 litres of water a day for a population of up to 10,000 people. This kit requires the availability of a local surface or ground water supply. Limited sanitation capacity for a first response is supplied within the kit as well as some trucking capacity. It can provide the transport of treated water to several distribution points (capacity of up to 30,000 litres of water a day) with limited possibility to set up different storage and distribution points (preconditions are the availability of flatbed trucks, fuel, road access).\n\nHygiene promotion, as well as training in the proper use of equipment supplied, is an essential part of the operation and must be carried out alongside distribution activities. Local water and sanitation technicians and Red Cross Red Crescent volunteers for training and distribution of items are needed.'
            },
            specifications: {
                weight: '7 MT',
                volume: '30 m3',
                subText: 'This kit should be pre-positioned at zonal level.'
            }
        }
    },
    {
        hash: '#kit-5',
        other: false,
        title: 'Kit 8',
        images: ['https://ifrcgo.org/global-services/assets/img/wash/wash-kit5_01.jpg'],
        textSection: {
            capacity: {
                text: 'Water treatment for a population of up to 5,000 people.'
            },
            emergencyServices: {
                text: 'Designed for the treatment and distribution of water for small populations, this kit can treat up to 75,000 litres of water a day for a population of up to 5,000 people. This kit requires the availability of local surface or ground water supply. Limited sanitation capacity for a first response is supplied within the kit, as well as some capacity for water trucking. The kit allows for the transport of treated water to several distribution points (capacity of up to 15,000 litres of water a day) with limited possibility of setting up different storage and distribution points (preconditions are the availability of flatbed trucks, fuel, road access).\n\nHygiene promotion, as well as training in the proper use of the equipment supplied, is an essential part of the operation and must be carried out alongside distribution activities. Local water and sanitation technicians and Red Cross Red Crescent volunteers for training and distribution of items are needed.'
            },
            specifications: {
                weight: '3.5 MT',
                volume: '15 m3',
                subText: 'This kit should be pre-positioned at country level.'
            }
        }
    },
    {
        hash: '#kit-2',
        other: false,
        title: 'Kit 2',
        images: ['https://ifrcgo.org/global-services/assets/img/wash/wash-kit2_01.jpg'],
        textSection: {
            capacity: {
                text: 'Water treatment at household level for 2,000 people (400 families).'
            },
            emergencyServices: {
                text: 'This kit provides water treatment at household level for up to 2,000 people (400 families), with no central treatment or storage capacity. This kit provides very basic sanitation facilities for a small population and is designed for response to the needs of scattered populations at household level and when people targeted numbers are limited.\n\nHygiene promotion, as well as training in the use of materials and tools in the kit, is an essential part of the operation and must be carried out alongside distribution activities. Availability of local water sources is required. Local water and sanitation technicians and Red Cross Red Crescent volunteers are needed to ensure that the people targeted are familiar with household level water treatment methods.'
            },
            specifications: {
                weight: '1.5 MT',
                volume: '8 m3',
                subText: 'This kit should be pre-positioned at country level.'
            }
        }
    },
    {
        hash: '#stt-shelter-technical-team',
        other: false,
        title: 'STT (Shelter Technical Team)',
        images: [
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_05.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_06.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_07.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_08.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_09.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-stt_10.jpg',
        ],
        textSection: {
            capacity: {
                text: 'Provide support in shelter response operations through the IFRC shelter roster of trained professionals and partner National Societies.\n\nFlexible team that can be adapted to the specific needs of a response, as it is a flexible configuration of one or several individuals depending of needs and capacity of the HNS/operation and the nature of the disaster.'
            },
            emergencyServices: {
                text: 'The Shelter Surge Operational Capacity is provided through individuals or a team deployed in emergencies to support the HNS to develop, coordinate and implement the Shelter component of the overall strategy in response to the needs created by the impact of a disaster.'
            },
            designedFor: {
                listItems: [
                    'Shelter focus: Assessment and analysis of the situation/context, identification of capacities and needs (Red Cross, government/administration; different actors and affected population).',
                    'Design and management of shelter & settlements interventions in response to a disaster (from emergency to recovery for example site planning, technical designs, BOQ…).',
                    'Project feasibility studies (market analysis relevant to delivering shelter programmes as labour, rental market or technical surveys).',
                    'Analysis of local building practices and materials.',
                    'Construction management (quality control, specific expertise during construction phases).',
                    'Design Safe shelter awareness sessions/materials (software component shelter intervention) for quality assurance and self-recovery (IEC materials dissemination, demonstration of key mitigation and improvements to be implemented on the shelter components during construction/repair/reinforcement…).',
                    'Monitoring and evaluation of humanitarian shelter and reconstruction programmes (housing/infrastructure rehabilitation, people targeted satisfaction surveys).',
                    'Definition of shelter interventions considering the use of appropriate materials and technologies, innovation and energy efficiency and specification development.',
                    'Participatory approaches for community regeneration/ upgrading.',
                    'Identification and advocacy on overcoming regulatory barriers to the provision of shelter, including housing, land and property issues/security of tenure.',
                    'Coordination within RCRC movement to support one movement approach and integrating programming.'
                ]
            },
            personnel: {
                total: '1+ people.',
                composition: 'It depends on the emergency and the context. It can be 1 person or a team with several members with 3-4 different profiles.'
            },
            specifications: {
                nationalSocieties: 'IFRC and NS which have been supporting consistently during the last 5 years but not only limited to them are: Australian RC, British RC, Canadian RC, German RC, Luxemburg RC, Netherland RC, Norwegian RC, Spanish RC, Swedish RC, Swiss RC.'
            },
            additionalResources: {
                listItems: [
                    'IFRC ',
                    '',
                    'Standard Products Catalogue - ',
                    'Master level short course in ',
                    'Self-learning online course on '
                ],
                listItemsUrls: [
                    { text: 'website', url: 'http://www.ifrc.org/en/what-we-do/disaster-management/responding/services-for-the-disaster-affected/shelter-and-settlement/' },
                    { text: 'Fednet', url: 'https://fednet.ifrc.org/en/resources/disasters/shelter/' },
                    { text: 'Shelter and construction materials', url: 'https://itemscatalogue.redcross.int/relief--3/shelter-and-construction-materials--23.aspx' },
                    { text: 'Shelter & Settlements in Emergencies, Natural Disasters', url: 'https://media.ifrc.org/ifrc/course-initiative/master-level-short-course-shelter-settlements-emergencies-natural-disasters/' },
                    { text: 'Shelter programming: More than just a roof', url: 'https://www.sheltercluster.org/resources/page/more-just-roof' },
                ],
            }
        }
    },
    {
        hash: '#sct-shelter-coordination-team',
        other: false,
        title: 'SCT (Shelter Coordination Team)',
        images: [
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-sct_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-sct_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-sct_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/shelter/shelter-sct_04.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Convene the interagency shelter cluster at country level in natural disasters and co-lead the global shelter cluster on behalf of IFRC. To coordinate the Shelter Cluster at the country level, the IFRC deploys a SCT. The shelter coordination team serves as a ‘secretariat’ of the Shelter Cluster. Its dedicated, full-time staff work exclusively on coordination services to shelter agencies. The SCT is deployed through the IFRC Shelter roster of trained professionals and partner or network organisations.\n\nFlexible team that can be adapted to the specific needs of established Humanitarian coordination mechanism in response to a natural disaster, as it is a flexible configuration of one or several individuals depending of needs and capacity of the HNS/government/shelter agencies.'
            },
            emergencyServices: {
                text: 'The SCT is a flexible coordination mechanism. Its composition varies depending on the size and needs of a disaster. The IFRC typically deploys a dedicated team of 3-4 people, but if a disaster response requires additional support from the Shelter Cluster, the SCT can incorporate several additional roles. The key positions of the SCT ensure that core services are provided to shelter agencies, delivering consistent and predictable support that is easy for partners to understand.'
            },
            designedFor: {
                listItems: [
                    ' coordination management, information management, integration of other sectors.',
                    ' coordinated assessments.',
                    ' strategic planning, technical coordination, recovery guidance, resource mobilization.',
                    ' coordinated communications and advocacy, government liaison, legal and regulatory issues.',
                    ' performance monitoring.',
                    ' contingency planning, exit strategy.',
                    ' community liaison / AAP.'
                ],
                listItemsBoldStart: [
                    'Supporting service delivery:',
                    'Informing Humanitarian Coordinator and Humanitarian Country Team strategic decision making:',
                    'Planning and strategy development:',
                    'Advocacy:',
                    'Monitoring and reporting:',
                    'Contingency planning and preparedness:',
                    'Accountability to affected population:'
                ]
            },
            personnel: {
                total: 'The SCT is a flexible coordination mechanism. Its composition varies depending on the size and needs of a disaster.',
                composition: 'Shelter Coordination Team key positions include Coordinator, Information manager, Technical coordinator, and Recovery advisor.'
            },
            specifications: {
                nationalSocieties: 'IFRC and NS which have been supporting consistently during the last 5 years but not only limited to them are: Australian RC, British RC, Canadian RC, German RC, Luxemburg RC, Netherland RC, Norwegian RC, Spanish RC, Swedish RC, Swiss RC. Nevertheless, as the SCT is part of the interagency coordination mechanism, there are other organizations and donors outside the Movement that provide support as SDC (Swiss Agency for Development and Cooperation), CRS, ACTED, and IMPACT.'
            },
            additionalResources: {
                listItems: [
                    '',
                    'Shelter Cluster ',
                    'Master level short course in ',
                    'Self-learning online course on ',
                    'Self-learning online course on '
                ],
                listItemsUrls: [
                    { text: 'Global Shelter Cluster', url: 'https://www.sheltercluster.org/' },
                    { text: 'team roles', url: 'http://www.sheltercluster.org/library/coordination-team' },
                    { text: 'Humanitarian Shelter Coordination', url: 'https://media.ifrc.org/ifrc/course-initiative/master-level-short-course-in-humanitarian-shelter-coordination/' },
                    { text: 'Shelter programming: More than just a roof', url: 'https://www.sheltercluster.org/resources/page/more-just-roof' },
                    { text: 'Coordination: Building a Better Response', url: 'https://www.buildingabetterresponse.org/' },
                ],
            }
        }
    },
    {
        hash: '#security-management',
        other: false,
        title: 'Security Management',
        images: [
            'https://ifrcgo.org/global-services/assets/img/security/security-management_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/security/security-management_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/security/security-management_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/security/security-management_04.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Will provide field-based support to operations, according to disaster scale, complexity, impact of the event or the context into which a surge response is being deployed. For high risk missions it is suggested that a Surge Security Coordinator is always deployed as part of the first rotation. Provide support in surge response operations through a roster of trained professionals and partner National Societies.'
            },
            emergencyServices: {
                text: 'The Surge Security Coordinator is required to deploy in a complex and / or large-scale emergency. The Security Surge will be expected to provide professional security risk management (SRM) advice and support/guidance and recommendations to management of the operation. The Surge Security will work closely with the in-country IFRC operations, should they exist.'
            },
            designedFor: {
                listItems: [
                    ' Advise and support the HeOps on security related matters focusing on all personnel and assets that are under IFRC security management responsibility. Provide technical guidance in relation to security related issues in Emergency appeals and budgets, for continued operations.',
                    ' Guide and support the in-country security risk management process,- development of a comprehensive security risk assessment-identification of functional and practical risk prevention and mitigation measures. To assist HeOps in creating security management systems and provide rapid and professional support / assistance. Ensure that the operation is IFRC, MSR compliant and oversee the implementation of procedures if required. Follow-up on security incident reporting and assist the HeOps in incident analysis and incident mapping. Update the IFRC Security Risk Register as and when necessary and report any changes and make appropriate recommendations to HeOps.',
                    ' Guide and support in-country MSR process, including the relevant procedures and trainings/briefings. Monitor, evaluate and report on the implementation of MSRs.',
                    ' Establish and maintain a security network of internal and external contacts and participate in relevant meetings both internally and externally.',
                    ' Conduct security briefings for all incoming personnel and provide general or more specific trainings.'
                ],
                listItemsBoldStart: [
                    'Strategic management/support:',
                    'Operational management/support:',
                    'Compliance:',
                    'Coordination:',
                    'Training & development:'
                ]
            },
            variationOnConfiguration: {
                text: 'In larger scale operations, in complex environments, it could be foreseen that more than one Security Coordinator is deployed.'
            }
        }
    },
    {
        hash: '#eru-relief',
        other: false,
        title: 'ERU Relief',
        images: [
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_05.jpg',
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_06.jpg',
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_07.jpg',
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_08.jpg',
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_09.jpg',
            'https://ifrcgo.org/global-services/assets/img/relief/relief-eru_10.jpg'
        ],
        textSection: {
            capacity: {
                text: 'To support the host National Society to support/update relief assessments, targeted people selection, targeted people registration and to assist in planning and set-up for food, cash based interventions and household items (including emergency shelter material distributions), as well as produce relief distribution statistics and reports.'
            },
            emergencyServices: {
                text: 'The capacity of a deployed Relief ERU depends of support identified needs to carry out relief cycle activities:\n\nIt could come through deployment of qualified personal without equipment to an equipped full team for a period of 4 months.',
                listItems: [
                    'Relief assessment.',
                    'People targeted targeting and registration.',
                    'Distribution and related awareness.',
                    'Post distribution monitoring and reporting.'
                ]
            },
            designedFor: {
                text: 'Flexibility to adapt to:',
                listItems: [
                    'Programmatic needs and possible modalities for relief support to be delivered (in kind Households items, CBI, emergency shelter material).',
                    'Operational needs to cover different geographic operational areas or hubs.'
                ]
            },
            personnel: {
                total: '4+ people.',
                composition: '1 team leader, 1 or more field officers, 1 logistic/relief interface officer, 1 finance/relief interface officer, and 1 Relief Information Management (IM) officer (for large operations only).',
                subText: 'All field officers could support the implementation of the relief activities cycle with in kind distribution, but specialists in CBI or emergency shelter could also be mobilized.'
            },
            standardComponents: {
                listItems: [
                    'Relief kit (RK) with material to support people targeted registration and distribution.',
                    'Medium Life Kit (MLK) with material to allow relief team to be autonomous.'
                ]
            },
            specifications: {
                weight: 'RK = 518 KG / MLK = 1,926 KG (Weight based on French Red Cross reference. Kit can be modified depending on field needs.)',
                volume: 'RK = 3.49 m3 / MLK = 9.5 m3 (Volume based on French Red Cross reference.)',
                nationalSocieties: 'American, BeNeLux, Danish, Finnish, French, Spanish.'
            }
        }
    },
    {
        hash: '#real-time-evaluation-rte-and-guidance',
        other: false,
        title: 'Real Time Evaluation (RTE) and guidance',
        textSection: {
            capacity: {
                text: 'RTE trained evaluators tagged on global surge roster.'
            },
            emergencyServices: {
                text: 'Setting up and delivery a quality real-time or other evaluation of the operation, in line with the requirements of the IFRC’s M&E Framework and the criteria for holding a RTE (scale, scope, value and complexity of an operation).'
            },
            designedFor: {
                text: 'RTEs and other evaluations are designed to assess, analyse and report back on the progress and quality of the operational delivery to affected populations and to help inform operational management decision-making and the future roll out of the response.'
            },
            personnel: {
                text: 'RTE team leader externally recruited consultant. RTE team members identified from within the wider IFRC (Sect and NSs).'
            },
            specifications: {
                cost: 'Fees for the external consultant team leader. Mission costs for RCRC team members.',
                nationalSocieties: 'Multiple (plus external team leader).'
            },
            additionalNotes: {
                text: 'RTEs are set up for all major operations meeting the relevant criteria (scale, scope, value and complexity - see RTE guidance).'
            }
        }
    },
    {
        hash: '#emergency-plan-of-action-epoa-monitoring-evaluation-plan',
        other: false,
        title: 'Emergency Plan of Action (EPoA) Monitoring & Evaluation Plan',
        textSection: {
            capacity: {
                text: 'When a disaster or crisis occurs, the global surge request technical PMER support, which is mobilised by PMER Geneva and Regions. Experienced PMER personnel are contacted, identified and mobilised through the wider PMER network of IFRC and National Society contacts, based on operational need. It is recommended PMER is deployed in the early days or the response, alongside IM and CEA, to ensure strong planning and set up monitoring and reporting mechanisms (quality programming).'
            },
            emergencyServices: {
                listItems: [
                    'Development and coordination of the EPOA based on info gathered from needs assessment and field data gathering from technical teams.',
                    'Design of the M&E plan and setting up of data collection methods/processes and ongoing support to operational monitoring.',
                    'Supporting and ensuring the delivery of institutional and specific donor reporting requirements and standards.'
                ]
            },
            designedFor: {
                text: 'Designed for the provision of support for all planning, monitoring and reporting functions to ensure the quality of the operation. These functions are essential for all emergency operations and should be considered core and the deployed personnel will also support the development of necessary planning, monitoring and reporting tools, processes and capacity building.'
            },
            personnel: {
                text: 'See technical competencies and role profiles for: PMER Coordinator and PMER Delegate.'
            },
            specifications: {
                cost: 'Cost standard delegate and NSs staffing costs (IFRC or NS provision of staff).  Profiles include trained and experienced PMER personnel from IFRC and NSs, preference to staff with IFRC systems experience or NS with min experience with IFRC.',
                nationalSocieties: 'Multiple.'
            },
            additionalNotes: {
                text: 'Close link between work of PMER staff and the IM and CEA teams.'
            }
        }
    },
    {
        hash: '#protection-gender-and-inclusion',
        other: false,
        title: 'Protection - Gender and Inclusion',
        images: [
            'https://ifrcgo.org/global-services/assets/img/pgi/pgi-pgi_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/pgi/pgi-pgi_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/pgi/pgi-pgi_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/pgi/pgi-pgi_04.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Operation dependent.'
            },
            emergencyServices: {
                innerHtml: '<p>PGI delegates are deployed to address specific protection, gender and inclusion issues affecting women, men, girls and boys (including elderly and persons with disabilities) during crises and build local protection capacities.</p><p><strong>Mainstreaming</strong></p><ul><li>Monitor and support sex- age and disability data-collection to define people selection criteria and targeting.</li><li>Provide technical advice to other teams on PGI mainstreaming (IFRC Minimum Standards for Protection, Gender and Inclusion; All Under One Roof Disability Inclusive Shelter and Settlements in Emergencies).</li><li>Support sectors in meeting accessibility standards in infrastructure and environment, information and communications.</li><li>Provide technical monitoring of programmes using the Minimum Standard Monitoring Template.</li><li>Provide advice to Head of Operations on ensuring implementation of Child Protection. Prevention of Sexual Exploitation and Abuse and reporting mechanisms.</li><li>Roll out the Protection Incident Monitoring Reporting.</li></ul><p><strong>Standalone</strong></p><ul><li>Conduct PGI assessment and analysis.</li><li>Requisition and deliver Dignity Kits.</li><li>Establish DAPS Houses in line with DAPS House SOPs and quality standards.</li><li>Train volunteers and staff in specialised services.</li><li>Map and share SGBV and CP referral pathways ensuring the response meets Survivor Centered Approach standards.</li><li>Coordination with relevant ministries and other organization (representation in protection cluster and sub-clusters).</li></ul>'
            },
            designedFor: {
                text: 'Designed for the provision of support to NS in PGI mainstreaming (all sectors) and initiating or augmenting standalone activities in communities affected by acute crises such as:',
                listItems: [
                    'Population movement.',
                    'Natural disaster(s).',
                    'Public health emergency.'
                ]
            },
            personnel: {
                total: '1-2+ people.',
                composition: 'Typically deployed team includes one to two PGI delegates. Team can be expanded based on scale of the needs.'
            },
            standardComponents: {
                text: 'PGI human capacity and tools needed to carry out needs assessments to identify at-risk groups and protection risks; support National Society to enhance dignity, access, participation and safety of affected individuals within the response; coordinating closely with relevant ministries and other humanitarian actors including representation in protection cluster and its sub-clusters, SGBV and child protection referrals, and setting up (standardized) Dignity Houses and/or safe spaces for vulnerable groups, as required.'
            }
        }
    },
    {
        hash: '#head-of-emergency-operations-heops',
        other: false,
        title: 'Head of Emergency Operations (HeOps)',
        textSection: {
            capacity: {
                text: 'The Head of Emergency Operations (HeOps) is the Federation’s main tool for providing high-level operational and strategic leadership and coordination in large-scale emergency operations. Upon deployment, the HeOps takes up the lead in managing the IFRC Emergency Appeal operation and supporting the National Society in successful planning and implementation of appropriate response.\n\nThe main responsibilities of the HeOps are related to strategy and priorities definition, management of overall operation, , external coordination, Movement coordination, security management, transition to recovery, etc.'
            },
            emergencyServices: {
                text: 'HeOps will be ready to deploy on a rotational basis to anywhere in the world within 48 hours to provide first-phase strategic leadership and coordination in major Federation-led emergency field operations for up to three months.'
            },
            designedFor: {
                listItems: [
                    'Assume responsibility for leading the operation on behalf of the IFRC in the affected country, ensuring appropriate links with IFRC structure (Resource management and Programme management).',
                    'Supervise IFRC technical sectors in country and in the regional office to ensure they work closely with the managers of relevant NS departments in all related programming roles and responsibilities, providing advice and recommendations that carefully consider local capacity and context communications support to operational management.',
                    'Advocate for and design operational strategies considering partners’ respective capacities.',
                    'Constantly monitor the disaster situation and overall context and adapt the orientation or set-up of the operation.',
                    'Facilitate Movement coordination and cooperation through the application of SMCC process.',
                    'Define and communicate the operation’s strategic direction to implement and the development of capacities within the NS for emergency response, and review contingency planning for identified threats in operational areas.'
                ]
            },
            personnel: {
                text: '3 full time HeOps in stand-by worldwide. 20 HeOps certified in stand by in different NS worldwide.'
            },
            standardComponents: {
                text: 'Each HeOps is self-equipped with a laptop, smart phone'
            },
            specifications: {
                cost: 'CHF 25,000 per month (salary/allowance and insurance, flights, visa fees, telephone and internet charges, luggage allowance, in country transportation and accommodation)',
                nationalSocieties: 'American Red Cross, Austrian Red Cross, Canadian Red Cross, Finnish Red Cross, IFRC, Hong Kong Red Cross branch of the Red Cross Society of China (HKRC), Spanish Red Cross, Swiss Red Cross.'
            },
            variationOnConfiguration: {
                text: 'In larger scale operations, in complex environments, more than one HeOps could be deployed with different role-profiles.'
            },
            additionalResources: {
                listItems: [
                    'HeOps on ',
                    'HeOps '
                ],
                listItemsUrls: [
                    { text: 'FedNet', url: 'https://fednet.ifrc.org/en/resources/disasters/disaster-and-crisis-mangement/disaster-response/surge-capacity/heops/' },
                    { text: 'short biographies', url: 'https://ifrcgo.org/global-services/assets/docs/opsmanagement/HeOps%20bios%20-%202020%2002.pdf' }
                ],
            }
        }
    },
    {
        hash: '#lpscm-for-national-societies',
        other: false,
        title: 'LPSCM for National Societies',
        textSection: {
            capacity: {
                text: 'National Societies may require Logistics and Procurement Services, Fleet Services and Country-Level Logistics Services from the International Federation of Red Cross and Red Crescent Societies (IFRC) when implementing humanitarian and development programmes. The IFRC responds to this need through its Logistics Procurement and Supply Chain Management (LPSCM) set up.\n\nIn providing these services, the IFRC contributes to ensuring accountability to donors and affected population by providing an efficient and effective means to maintain internal controls, ensuring value for money.\n\nThrough its global logistics network and structures, the LPSCM has the capacity to deliver the following services to the IFRC operations and National Societies:'
            },
            emergencyServices: {
                listItems: [
                    'Mobilization of relief supplies.',
                    'Procurement and transportation.',
                    'Procurement Process Quality Assurance.',
                    'Fleet services.',
                    'Warehousing and handling.',
                    'Contingency Stock.',
                    'Specialized logistics support.'
                ]
            },
            designedFor: {
                listItems: [
                    ' This service refers to the coordination, sourcing and transport of relief supplies from point of supply to first port of entry for IFRC humanitarian and development programmes in support to National Societies. Mobilization services ensure efficient and cost-effective sourcing decisions are made with a view to the needs of an operation as well as availability of relief supplies. As part of this service, a mobilization table is prepared and maintained to consolidate and communicate relief supply needs. It provides operations managers and donors with real-time information on what relief items are required, what relief items have been pledged and what relief items are still outstanding.',
                    ' This service refers to the purchase and delivery of requested goods and services, calculating the most cost-effective supply chain that meets the time and specification requirements. LPSCM procurement and transportation services include sourcing, tendering, supplier selection, transportation to final port of entry, insurance, and inspection.\n\nLPSCM can undertake procurement for National Societies on an ad hoc basis, or through the use of framework agreements with suppliers. Framework agreements are used as an effective means of securing goods and services at a competitive price, while guaranteeing quality, quantity and delivery terms for goods that are procured frequently. In order to ensure timely response and minimize cost, LPSCM has pre-positioned stock in Dubai, Kuala Lumpur, Panama, and Las Palmas. Depending on the nature of the procurement request and inventory levels, procurement can be fulfilled from pre-positioned inventory or via ad hoc purchase of custom order inventory. (In both cases, procurement fees apply).\n\nProcurement for IFRC humanitarian and development programmes funded by donors is undertaken by LPSCM and is mandatory in the following circumstances: all procurements of drugs and medical supplies; all international procurements; when the National Society is unable to undertake procurement in compliance with donor requirements.',
                    ' This service provides accountability to donors and people targeted, ensures value for money and contributes to the prevention of fraud and corruption. Procurement process quality assurance is undertaken by LPSCM to support domestic procurement for an IFRC humanitarian and development programme where there is either: (1) a competent procurement specialist within the IFRC country office or (2) a competent National Society able to undertake procurement in compliance with donor requirements. In cases where the value of a procurement order exceeds CHF 50,000 or the procurement involves material that is unusual from a legal or reputational perspective, or it incurs financial risk to the IFRC, the file goes through a procurement process quality assurance review prior to the signing of the purchase order or contract.',
                    ' Vehicle Rental Programme, fleet management training and fleet development activities are delivered by the IFRC Global Fleet Unit to the IFRC’s country clusters/offices and National Societies around the world.',
                    ' LPSCM provides warehousing and handling services to National Societies. Warehousing and handling services to IFRC humanitarian and development programmes funded by donors, and implemented in support to National Societies include receipt, warehousing, and dispatch. National Societies who wish to stock humanitarian and development supplies can use the IFRC warehouses in Dubai, Kuala Lumpur, Panama and Las Palmas.',
                    ' In cooperation with partner National Societies and support of donors the LPSCM has emergency response stockpiles sufficient to meet the needs of 450,000 people. The emergency stockpiles are strategically positioned in a global network of regional Operational LPSCM Hub and Units, located in Dubai, Kuala Lumpur, Panama and Las Palmas. The strategic pre-positioning of emergency supplies allows the IFRC to deliver aid to people in need faster, and at minimum cost.',
                    ' LPSCM provides a wide range of services to National Societies, including logistics training, logistics assessments and in-country supply chain set-up.'
                ],
                listItemsBoldStart: [
                    'Mobilization of relief supplies:',
                    'Procurement and transportation:',
                    'Procurement process quality assurance:',
                    'Fleet services:',
                    'Warehousing and handling:',
                    'Contingency stock:',
                    'Specialized logistics support:'
                ]
            },
            additionalResources: {
                listItems: [
                    '',
                    '',
                    '',
                    '',
                    '',
                    ''
                ],
                listItemsUrls: [
                    { text: 'Mobilization of relief items', url: 'https://fednet.ifrc.org/en/resources/logistics/mobilization-of-goods/' },
                    { text: 'Procurement and transportation', url: 'https://fednet.ifrc.org/en/resources/logistics/procurement/' },
                    { text: 'Fleet services', url: 'https://fednet.ifrc.org/en/resources/logistics/our-global-structure/DubaiLPSCM/global-fleet-base/vehicle-rental-programme/' },
                    { text: 'Warehousing and handling', url: 'https://fednet.ifrc.org/en/resources/logistics/our-global-structure/' },
                    { text: 'Contingency stock', url: 'https://fednet.ifrc.org/en/resources/logistics/contingency-stock/' },
                    { text: 'Specialized logistics support', url: 'https://fednet.ifrc.org/en/resources/logistics/logistics-training-and-workshop/' }
                ],
                text: 'For further information please contact ',
                textUrl: { text: 'Operational LPSCM in your region.', url: 'https://fednet.ifrc.org/en/resources/logistics/our-global-structure/' }
            }
        }
    },
    {
        hash: '#logistics-eru',
        other: false,
        title: 'Logistics ERU',
        images: [
            'https://ifrcgo.org/global-services/assets/img/logs/logs_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_05.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_06.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_07.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_08.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_09.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_10.jpg',
            'https://ifrcgo.org/global-services/assets/img/logs/logs_11.jpg',
        ],
        textSection: {
            capacity: {
                text: 'Logistics ERU organizes logistics in the field and is developed to effectively manage the arrival, clearance, storage and distribution of relief items. The logistics ERU also arranges logistics for arrival of other ERUs.'
            },
            emergencyServices: {
                text: 'The Logistic ERU can provide the following services:',
                listItems: [
                    'Mobilization of goods, including dealing with customs, air operations, and supply chain.',
                    'Procurement and transportation.',
                    'Fleet services.',
                    'Warehousing and handling.'
                ]
            },
            personnel: {
                total: '4-7 people.',
                composition: 'Team Leader, 1-2 Supply Chain Administration delegates, AirOps delegate, 1 - 3 Warehouse/Transport delegates.',
            },
            standardComponents: {
                text: 'The existing kits are as follows:',
                listItems: [
                    'FURNITURES, for 4 persons',
                    'ERU ADMINISTRATIVE STARTER KIT, 1 office, 3-5 persons',
                    'GENERATORs, 3kw, 6kW, 9 Kw (3 kits)',
                    'LIGHTING, outdoor/indoor, 6x500w spots',
                    '4x4 VEHICLE Pick-Up, Station-Wagon',
                    'PERSONNEL FIELD KIT, for 4 persons/10 days',
                    'PERSONNEL COMMUNICATION KIT'
                ]
            },
            specifications: {
                weight: '10 MT, Includes 2 x Toyota Land Cruiser and one 4x4 forklift',
                volume: '100 CBM, Includes 2 x Toyota Land Cruiser and one 4x4 forklift',
                cost: 'CHF 120,000',
                nationalSocieties: 'British, Danish, Finnish, Spanish, Swiss.'
            }
        }
    },
    {
        hash: '#livelihoods-and-basic-needs',
        other: false,
        title: 'Livelihoods and Basic needs',
        images: [
            'https://ifrcgo.org/global-services/assets/img/livelihoods/livelihoods-basic-needs_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/livelihoods/livelihoods-basic-needs_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/livelihoods/livelihoods-basic-needs_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/livelihoods/livelihoods-basic-needs_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/livelihoods/livelihoods-basic-needs_05.jpg'
        ],
        textSection: {
            capacity: {
                innerHtml: '<p>Surge Operational Capacity for Livelihoods and Basic (L&BN) covers a broad scope of interventions such as assistance to meet basic needs including food assistance and support to restart economic activities in rural and urban areas.</p><p>The IFRC <a href="http://www.livelihoodscentre.org/">Livelihoods Resource Centre</a> is the main technical resource available to support AoF 3. Their approach to livelihoods is summarised in the <a href="http://www.livelihoodscentre.org/-/inundaciones-en-la-region-sur-de-paragu-1">”What are Livelihoods?”</a> video.</p><p>The Livelihoods resource centre has developed a wide range of material to be used from field practitioners such as a toolbox, training material, methodological notes, case studies.</p><p>They play a significant role in capacity building with the regular organisation of training programmes in Livelihoods and Cash which they developed and deliver online or Face-to-face. The LRC can provide direct technical assistant to implement good quality livelihoods programmes. They can be contacted at: <a href="mailto:livelihoods@cruzroja.es">livelihoods@cruzroja.es</a>.</p>'
            },
            emergencyServices: {
                text: 'In any emergencies affecting food and economic security, National Societies can be supported with the deployment of a team or an individual to be part of the Rapid Response Teams to coordinate the response in Livelihoods and Basic needs. This team should work closely with the Cash and Voucher Assistance Team.\n\nMain support would include food and basic needs analysis, primary data collection for needs assessment, identification of the response options for short, medium and long term in the Area of Focus 3 (AoF 3) Livelihoods and Basic needs. Other development of a response strategy in L&BN, capacity strengthening, drafting of the Emergency Plan of Action (AoF 3) and implementation.\n\nOther essential services to be provided include skills enhancement in basi for NS staff and volunteers.\n\nSpecialists will be identified through a roster of trained professionals from National Societies or the IFRC.\n\nRemote support and backstopping from Regions or Geneva can be considered on a case by case basis, especially when no technical delegate is deployed and depending upon availability of staff from IFRC or the Livelihoods Resource Centre (LRC).'
            },
            designedFor: {
                innerHtml: '<p>In emergencies, the priority is to identify the main sources of food and income and main livelihood activities before the disaster, identify the impact of the disaster in terms of basic needs and livelihoods and identify currently used coping strategies to:</p><ul><li>Respond to immediate needs for food and basic needs assistance.</li><li>Counter deterioration of the situation by preventing further depletion of household productive assets and negative coping strategies.</li><li>Enhance human capacity such as technical and soft skills to restart economic activities and strengthen their sustainability.</li><li>Create a conducive environment to promote recovery of economic activities and food production to ensure that interventions create positive impact on individuals, households and communities.</li></ul><p>Profiles deployed in emergencies have to be able to conduct rapid socio-economic and market analysis to understand the nature of the gaps in access to as well as availability and utilisation of food and basic services.</p><p>They need to identify response options that provide quality assistance to meet immediate basic needs for the entire duration of the gap through the most appropriate modality (In-kind, voucher, cash or a combination of the different modalities).</p><p>Livelihoods recovery through for example replacement of assets and capacity building should also be included in the response strategy to phase out emergency assistance as soon as possible.</p>'
            },
            personnel: {
                text: 'Two role profiles have been developed as part of the Technical Competency framework for Livelihoods and Basic needs.\n\nThe profiles require basic technical competencies common to all specialists such as a strong understanding of the livelihoods framework, skills in data collection, response planning, and strong understanding of the different modalities of interventions (in-kind, voucher and cash assistance).\n\nIdeally, both personnel are deployed as a team taking into account the wide range of competencies needed to respond to Livelihoods and basic needs, meeting immediate needs while working on designing the response strategy and ensuring good inter-agency coordination. Profiles needed for deployment need to be specific to the type of disaster, scope and magnitude, the context (urban/rural), the profile of the affected population and their livelihoods activities (or livelihoods groups).\n\nTasks include:\n\nNeed to work closely with Cash and Voucher Delegate(s), Logistic, Finance, PMER. Depending on the type of disaster, scope, context.',
                listItems: [
                    'Livelihoods and Basic Needs Coordinator',
                    'Livelihoods and Basic Needs Officer',
                    'Draft of Emergency Appeals / Emergency Plan of Action, budgeting.',
                    'Design of response options needs to be climate-smart, gender-sensitive and inclusive.',
                    'Draft SOPs for quality selection and implementation of holistic food security and livelihoods responses.',
                    'Capacity strengthening of staff and volunteers in food assistance, basic needs and livelihoods.',
                    'Procurement / distribution of food, seeds, tools, livestock or other assets in emergencies.',
                    'Strong understanding of cash and voucher assistance.',
                    'Coordination within the RCRC movement and other coordination mechanism specific to FSL (food security cluster, early recovery working groups).'
                ]
            },
            specifications: {
                nationalSocieties: 'IFRC Livelihoods Resource Centre (Staff, Technical assistance, training).'
            }
        }
    },
    {
        hash: '#eru-it-telecom',
        other: false,
        title: 'ERU IT/Telecom',
        textSection: {
            capacity: {
                text: 'The level of support can be scaled to meet operation and context-specific needs. In general, IT&T teams/individuals have knowledge of radio systems (VHF), sat comms (phones, VSAT), power supply, computer desktop support skills and IT network management.'
            },
            emergencyServices: {
                text: 'The purpose of IT&T Emergency Response Units and delegates is to establish IT and telecommunications networks to help ensure the smooth flow of information within the operation and connect operational actors to external resources.'
            },
            designedFor: {
                text: 'Rapid deployment to an affected area with destroyed, damaged, or insufficient communications infrastructure and/or capabilities.'
            },
            personnel: {
                total: 'Generally 2-6 people.',
                composition: '1 team leader and technicians with context-appropriate skill sets.'
            },
            standardComponents: {
                listItems: [
                    'VHF Module',
                    'Satcom Module',
                    'VSAT Module',
                    'Network Module',
                    'Tools Module',
                    'ERU Light Kit',
                    'Power Module',
                    'Network Module'
                ]
            },
            specifications: {
                cost: 'CHF 150,000 without VSATS (approximately CHF 35,000 additional per VSAT system)',
                nationalSocieties: 'American Red Cross, Austrian Red Cross, Danish Red Cross, Finish Red Cross, New Zealand Red Cross, Spanish Red Cross.'
            }
        }
    },
    {
        hash: '#surge-information-management-support-sims',
        other: false,
        title: 'Surge Information Management Support (SIMS)',
        textSection: {
            capacity: {
                text: 'When a disaster occurs, SIMS is activated through the IFRC Disaster Crisis Management Surge Desk to provide either remote or field-based support to operations, according to disaster scale, complexity and impact of the event. In addition to direct operational support, SIMS also serves as a network for information management coordination and capacity building, helping improve information management standards, tools, and expertise across response operations.'
            },
            emergencyServices: {
                text: 'The Surge Information Management Support (SIMS) project is a network of trained specialists who develop, coordinate and implement information management systems for global Red Cross and Red Crescent disaster response operations.'
            },
            designedFor: {
                listItems: [
                    ' Base maps, thematic maps, and interactive web maps to support response planning and decision-making.',
                    ' Infographics and dashboards to make data easily comprehensible for decision-makers.',
                    ' IM specialists in the field supporting data process, systems and management for global response teams and ops managers to better use date to aid decision-making.',
                    ' Comprehensive, adaptable IM toolkit and resources with ready-made template, formats and guidance materials for responders.'
                ],
                listItemsBoldStart: [
                    'Mapping:',
                    'Data visualisations:',
                    'Hands on expertise:',
                    'Toolkit & resources:'
                ]
            },
            additionalResources: {
                listItems: [
                    'SIMS ',
                    'IFRC '
                ],
                listItemsUrls: [
                    { text: 'website', url: 'https://rcrcsims.org/' },
                    { text: 'GO', url: 'https://go.ifrc.org/' }
                ],
            }
        }
    },
    {
        hash: '#eru-pss-module',
        other: false,
        title: 'ERU PSS Module',
        images: [],
        textSection: {
            capacity: {
                text: 'PSS delegates to provide psychosocial support to adults and children within communities affected by acute crises. Services include:',
                listItems: [
                    'Assessment.',
                    'Volunteer training.',
                    'Referral to local services.',
                    'Psychosocial first aid.',
                    'Child friendly and other safe spaces.',
                    'Psychosocial Support in Emergencies (PSSiE).'
                ]
            },
            designedFor: {
                text: 'Unit can be deployed within 48 hours upon receiving a deployment request; base of operations can be setup within hours once on site, is self-sufficient for 1 month and can operate for up to 4 months.\n\nDesigned for the provision of support to NS initiating or augmenting PSS activities in communities affected by acute crises such as:',
                listItems: [
                    'Population movement.',
                    'Natural disaster(s).',
                    'Public health emergency.'
                ]
            },
            personnel: {
                total: 'Typically 1-2 people.',
                composition: 'Deployed team includes one to two psychosocial support delegates. Delegates normally have a social work, nursing or psychologist background and IMPACT, ERU and PSS in emergency training.'
            },
            standardComponents: {
                text: 'Specific module names and components may vary but generally include the following:',
                listItems: ['Psychosocial Support (PSS) Module: Contains essential equipment and materials needed to carry out a rapid needs assessment to identify vulnerable groups, and support an operating NS to implement volunteer-driven PSS activities; activities focused on training up volunteers as needed, coordinating closely with social institutions and other humanitarian actors, assisting adults in affected communities with practical information, emotional and social support through PFA and referral, and setting up play and recreational activities for children where relevant and/or safe spaces for other vulnerable groups, as required.']
            },
            specifications: {
                nationalSocieties: 'Canadian, Danish, Finnish, French, Israeli, Jamaican, Japanese, Norwegian.'
            },
            additionalResources: {
                text: '',
                textUrl: { text: 'IFRC Psychosocial Centre', url: 'http://pscentre.org/' }
            }
        }
    },
    {
        hash: '#community-case-management-of-malnutrition-ccmm',
        other: false,
        title: 'Community Case Management of Malnutrition (CCMM)',
        textSection: {
            capacity: {
                text: 'Under development.'
            },
            emergencyServices: {
                text: 'Rapid setup and maintenance of Community Management of Acute Malnutrition (CMAM) programming.'
            },
            designedFor: {
                text: 'The key objective of a CMAM programme is to reduce mortality and morbidity from acute malnutrition by providing timely diagnosis and effective treatment of acute malnutrition, and through building local capacity (health system and community) in the identification and management of acute malnutrition.'
            },
            specifications: {
                nationalSocieties: 'French'
            }
        }
    },
    {
        hash: '#safe-and-dignified-burials',
        other: false,
        title: 'Safe and Dignified Burials',
        textSection: {
            capacity: {
                text: 'Establishment of safe and culturally appropriate approaches to burials for outbreaks of hemorrhagic fevers (e.g. Ebola, Marburg) and other high impact diseases with a significant risk of post-mortem transmission.'
            },
            emergencyServices: {
                text: 'Design of SDB system, including alert, response and data management, for rapid implementation of SDB programming. Provides training, equipment, logistics, supportive supervision, etc. to ensure safe and functional SDB system.'
            },
            personnel: {
                total: 'Typically 5-6 people.',
                composition: 'Team leader, educator/trainer, logistician, PSS, IPC/WASH, finance/admin.',
            },
            standardComponents: {
                listItems: [
                    'SDB training kit (1)',
                    'SDB starter kit (2)',
                    'SDB replenishment kit (1)',
                    'Bodybags',
                    'Digital Data gathering kit',
                    'Vehicles x 2 per SDB team'
                ]
            },
            specifications: {
                weight: 'approx. 600 kg',
                volume: 'approx 3.2 CBM',
                cost: '(to be confirmed)',
                nationalSocieties: 'Canadian'
            },
            variationOnConfiguration: {
                text: 'Number of SDB teams and kits required to be scaled based on population and geography affected by outbreak.'
            }
        }
    },
    {
        hash: '#community-based-surveillance-cbs',
        other: false,
        title: 'Community-based Surveillance (CBS)',
        textSection: {
            capacity: {
                text: 'The purpose Public Health ERU CBS is to reduce the loss of lives by preventing or contributing to reduction of disease outbreaks or potential disease outbreaks or their negative impacts in sudden-onset disasters, protracted crisis or health emergencies/outbreaks, where there is a defined need for surveillance of health risks or events. PH ERU CBS establish a CBS system for detecting and reporting of events of public health significance within a community by community members, to strengthen the response during an emergency.'
            },
            emergencyServices: {
                text: 'Specific objectives: assess the need for a PH ERU CBS module in the specific context; determine the configuration of the data collection, flow, protection and response, and other components of the CBS system that will be put into place; set up the data collection and analysis tools; train delegates, NS staff and volunteers who will support data collection, analysis and response; maintain ongoing analysis and use data for decision-making; ensure monitoring of data collection, analysis and response; early detection of cases of disease at community level, and appropriate preventive responses and referral, as necessary. Activities include: assessment of needs, feasibility and capacity for response of the CBS based on initial request by NS or IFRC; design of CBS system; set up of CBS system adapted to context and need; coordination with all relevant stakeholders; training of RC volunteers in CBS methodology; depending on the situation; support epidemic control for volunteers training; development of exit strategy/plan.'
            },
            designedFor: {
                text: 'A public health ERU CBS module should be considered for deployment very early where there is a risk of disease outbreak. Examples include sudden onset disasters and protracted crises in areas with endemic diseases with epidemic potential, along with deployment to public health emergencies (i.e. epidemics). Emergency operations should not wait for an outbreak to begin before requesting a CBS module.'
            },
            personnel: {
                total: '2 people (advanced), 5-6 people (full deployment).',
                compositions: [
                    'Team lead, field epidemiologist or data/information manager. (advanced team)',
                    'Team lead, field epidemiologist or data/information manager, public health, ICT and/or logistics, finance/admin. (full deployment)'
                ],
                subText: 'An advanced CBS assessment team can be deployed for 1-2 weeks within 48 hours upon receiving a deployment request. If the assessment team determines that implementation of a CBS system is feasible, the remaining team members and equipment are deployed.'
            },
            standardComponents: {
                listItems: [
                    'Digital data gathering kit',
                    'Training kit',
                    'Vehicles (rent or supply)',
                    'Field accommodation preferred'
                ]
            },
            specifications: {
                weight: '10 to 15 kg',
                volume: 'Carry-on baggage',
                cost: 'CHF 5,000 (equipment only)',
                nationalSocieties: 'Norwegian'
            },
            additionalResources: {
                listItems: ['Community based surveillance (CBS) '],
                listItemsUrls: [
                    { text: 'website', url: 'https://www.cbsrc.org/' }
                ]
            }
        }
    },
    {
        hash: '#community-case-management-of-cholera-ccmc',
        other: false,
        title: 'Community Case Management of Cholera (CCMC)',
        images: ['https://ifrcgo.org/global-services/assets/img/health/health-ccmc_01.jpg'],
        textSection: {
            capacity: {
                text: 'The purpose of the Public Health ERU CCM cholera module is to help to reduce mortality and morbidity due to cholera through early response at community level. It provides oral rehydration services at standalone Oral Rehydration Points (ORP) in communities affected by outbreaks of cholera or acute watery diarrhoea.'
            },
            emergencyServices: {
                text: 'This module provides oral rehydration solution and zinc at oral rehydration points in communities which have reported cases of acute watery diarrhoea. This service is scalable to be able to expand and or move to respond to changing epidemic dynamics. The ORP functions as a first aid point for people suffering from potential cholera or acute watery diarrhoea, and advises severely ill people to seek medical care. Hygiene and health messages will be provided at ORPs. Each ORP systematically collects and reports data for monitoring, analysis and operational decision making. One ORP kit can produce enough water each day to provide ORS to approximately 35 people per day at the site. The CCMC module provides volunteer management and supervision for this activity, which is carried out by trained volunteers and staff in affected communities.'
            },
            designedFor: {
                text: 'A public health ERU CCMC module should be considered for deployment very early when there is risk of or existing AWD outbreak, where the HNS requires support in order to reach affected communities with ORP services. Unit can be deployed within 48 hours upon receiving a deployment request, is self-sufficient for 1 month and can operate for up to 4 months.'
            },
            personnel: {
                total: '7 people.',
                composition: 'Team Leader, Public Health / Epidemiologist, Quality control/training x 2, WASH, Logistics, and Finance/Admin.'
            },
            standardComponents: {
                listItems: [
                    'ORP kits (quantity as requested)',
                    'Field accommodation preferred',
                    'Training kit',
                    'Digital Data gathering kit',
                    'Vehicles (rent or supply)'
                ]
            },
            specifications: {
                weight: '1090 kg per 6 ORPs',
                volume: '3 pallets per 6 ORPs',
                nationalSocieties: 'Swiss'
            },
            variationOnConfiguration: {
                text: 'Number of ORPs and kits required to be scaled based on population and geography affected by outbreak.'
            }
        }
    },
    {
        hash: '#eru-cholera-treatment-center',
        other: false,
        title: 'ERU Cholera Treatment Center',
        textSection: {
            capacity: {
                text: '24 hour outpatient observation and inpatient services with supplies for a minimum of 1 month before replenishment needed; operational for up to 4 months. Up to 90 inpatient beds, scalable in units of 30.'
            },
            emergencyServices: {
                text: 'Inpatient and outpatient emergency health services to provide clinical treatment for cholera patients. Services include: triage, assessment, medical treatment of cholera (oral and IV as clinically indicated). Non-cholera patients who present to the clinic will be referred to the most appropriate local medical provider.'
            },
            designedFor: {
                text: 'Unit can be deployed within 48 hours upon receiving a deployment request, can be setup within hours once on site, is self-sufficient for 1 month and can operate for up to 4 months. Designed for the provision of fixed cholera clinical treatment services in communities with limited access to health care as a result of:',
                listItems: [
                    'Population movement to areas where there are no pre-existing health facilities and cholera outbreak has been confirmed.',
                    'Health infrastructure damages following natural disaster(s) where a cholera outbreak has been declared.',
                    'Existing health facilities are overwhelmed by influx of patients and/or cholera-related health needs following a crisis.'
                ]
            },
            personnel: {
                total: 'Typically 26-30 people + 72-76 contacted locally.',
                composition: 'Doctors and nurses skilled in cholera treatment (including a comprehensive understanding of pediatric and maternal health considerations related to cholera), and experience with training other health professionals. Non-medical staff includes logisticians, administrators and site technicians. In addition to the deployed team, local health care professionals are integrated into unit as soon as possible with the aim of reaching or exceeding a nursing ratio of at least 1 nurse: 8 ward beds (24 hour services). Public health and WASH profiles can be added depending on the stated need and other resources available in the response.'
            },
            standardComponents: {
                text: 'Specific Module names and components may vary but generally include the following:',
                listItems: [
                    ' Contains a minimum one-month supply of the medications and medical consumables needed to provide services according to the MSF Clinical Guidelines; quantities also largely based on WHO DD and Cholera Kits. Scalable depending on need.',
                    ' Contains cholera beds, IV stands, etc; all the medical equipment required to set up an inpatient and an observation cholera treatment ward. Also includes IPC materials specifically required in the CTC environment, chlorination sprayers etc, extra cups for administering ORS, etc.',
                    ' Contains the equipment and materials needed to set up a warehouse space to store and manage drugs and medical consumables.',
                    ' Contains the equipment and materials needed for the safe management of medical waste in a low-resource setting; includes a portable incinerator.',
                    ' Contains the equipment and materials needed to maintain a safe water supply for patients and staff within the ERU facility; generally includes a water filtration unit able to produce a volume of water that is aligned with Sphere standards for health facilities as a minimum, along with chlorine-based agents to treat water as per international norms.',
                    ' Contains the essential equipment and materials needed to set up temporary latrines for patient and staff use in a ratio that is aligned with Sphere standards for health facilities as a minimum.',
                    ' temporary tented, water repellent infrastructure of varying sizes (3x3m to XXX); tents can be metal-framed or inflatable depending on context and needs.',
                    ' Equipment/materials needed to provide self-sufficient power and light generation throughout the temporary health facility; typically petrol/gas run generators ranging from XXX to XXX with associated cabling and energy-efficient lighting.',
                    ' Equipment/materials to set up a field office.',
                    ' Contains portable laptops, satellite communications equipment, mobile telephones and VHF handsets for two-way field communications, as well as essential equipment to set-up a local wireless network within the health facility and field office.',
                    ' 4x4 Toyota Land Cruisers as per IFRC specifications for team field movements, and possibly patient transportation (where context dictates); right hand and left hand drive options available; quantity deployed varies according to size of team and context.',
                    ' Equipment/materials needed to set-up temporary living accommodations for ERU team in contexts where commercial accommodations are not available.'
                ],
                listItemsBoldStart: [
                    'Pharmaceutical and Medical Consumables Module(s):',
                    'CTC-Specific Ward/Inpatient Module:',
                    'Medical stores/warehousing Module:',
                    'Waste Management Module:',
                    'Water Treatment Module:',
                    'Sanitation Module:',
                    'Infrastructure:',
                    'Power/lighting Module:',
                    'Administration Module:',
                    'IT/Telecommunications Module:',
                    'Vehicles:',
                    'Basecamp/accommodation Module:'
                ]
            },
            specifications: {
                nationalSocieties: 'Canadian'
            }
        }
    },
    {
        hash: '#emergency-mobile-clinic',
        other: false,
        title: 'Emergency Mobile Clinic',
        images: [
            'https://ifrcgo.org/global-services/assets/img/health/health-mobile-clinic_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-mobile-clinic_02.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Day time services with supplies for 1 month, before replenishment needed, and operational for up to 4 months.'
            },
            emergencyServices: {
                text: 'Mobile emergency clinic to provide primary health care and urgent services to adults and children within hard-to-reach communities. Services include:',
                listItems: [
                    'Triage.',
                    'Assessment.',
                    'First aid.',
                    'Basic medical care of common ailments including childhood illnesses, non-communicable diseases, communicable diseases.',
                    'Stabilisation and referral of trauma and non trauma emergencies.'
                ],
                subText: '(section to be revised once ongoing development is complete)'
            },
            designedFor: {
                text: 'Unit can be deployed within 48 hours upon receiving a deployment request; base of operations can be setup within hours once on site, is self-sufficient for 1 month and can operate for up to 4 months. Designed for the provision of mobile emergency health services in communities with limited access to health care as a result of:',
                listItems: [
                    'Natural disaster with health infrastructure damage; mobile clinic is a temporary substitution of services while infrastructure comes back online.',
                    'Population movement where groups of people settle in areas where there are no existing health services and no permanent health facilities.',
                    'Migrant populations where groups of people are continually on the move; access to health services and/or permanent health facilities is difficult to predict.',
                    'Conflict/tensions between communities; health facilities exist but communities can’t safely access them.'
                ]
            },
            personnel: {
                total: 'Typically 14-19 people from sending NS + 11-25 contracted locally.',
                composition: 'Deployed team includes: team leader, deputy team leader, finance, admin, logistics, doctors, nurses, technicians, PSS, public health, and others. Contracted local personnel include nurse, triage nurse, doctor, translator, midwives, cleaners, social mobilization (NS Volunteers), PSS (NS Volunteers), and others.'
            },
            standardComponents: {
                text: 'Specific module names and components may vary but generally include the following:',
                listItems: [
                    ' (under development)',
                    ' Contains a minimum one-month supply of the medications and medical consumables needed to provide services according to the MSF Clinical Guidelines; quantities also largely based on Interagency Emergency Health Kit calculations for coverage of health needs in a population of 30,000.',
                    ' Contains the equipment and materials needed to set up a warehouse space to store and manage drugs and medical consumablesAdministration Module: equipment/materials to set up a field office.',
                    ' Contains portable laptops, satellite communications equipment, mobile telephones and VHF handsets for two-way field communications, as well as essential equipment to set-up a local wireless network within the health facility and field office.',
                    ' 4x4 Toyota Land Cruisers as per IFRC specifications for team field movements, and possibly patient transportation (where context dictates); right hand and left hand drive options available; quantity deployed varies according to size of team and context.'
                ],
                listItemsBoldStart: [
                    'Mobile Clinic Module:',
                    'Pharmaceutical and Medical Consumables Module(s):',
                    'Medical stores/warehousing Module:',
                    'IT/Telecommunications Module:',
                    'Vehicles:'
                ]
            },
            specifications: {
                nationalSocieties: 'Canadian, Spanish.'
            }
        }
    },
    {
        hash: '#maternal-newborn-health-clinic',
        other: false,
        title: 'Maternal Newborn Health Clinic',
        textSection: {
            capacity: {
                text: 'Day time clinical services with capacity for 3 birthing suites and a 15-bed observation capacity. Supplies for 500 vaginal deliveries before replenishment needed, and operational for up to 4 months.'
            },
            emergencyServices: {
                text: 'Maternal Newborn Health services component of the emergency clinic that can be deployed as a stand-alone capacity in a context where obstetric and newborn care are the identified gap in health services. Unit provides equipment and supplies needed to provide preconception/periconceptual interventions, pregnancy care, care during childbirth, postnatal care to mother and immediate essential newborn care.'
            },
            designedFor: {
                text: 'Unit can be deployed within 48 hours upon receiving a deployment request, can be set up within hours once on site, is self-sufficient for 1 month and can operate for up to 4 months with re-supply.\n\nDesigned for the provision of maternal and newborn care services in communities with limited access to health care as a result of:',
                listItems: [
                    'Population movement to areas where there are no pre-existing health facilities.',
                    'Health infrastructure damages following natural disaster(s).'
                ]
            },
            personnel: {
                total: 'Typically 5-6 people from sending NS + 25-50 locally contracted.',
                composition: 'Deployed team includes midwives and/or an Ob/Gyn specialist depending on context as well as L&D and ward nurses and support (tech, admin) staff as required. Team composition (including number of staff) can be tailored to the specific needs of the context (existing facility, whether or not postnatal ward care is required, etc).'
            },
            standardComponents: {
                text: 'Specific module names and components may vary but generally include the following:',
                listItems: [
                    ' Contains the equipment and supplies needed to provide care to women in childbirth including basic emergency obstetric care with includes administering antibiotics, uterotonic drugs (oxytocin) and anticonvulsants (magnesium sulphate); manual removal of the placenta; removal of retained products following miscarriage or abortion; assisted vaginal delivery, preferably with vacuum extractor; basic neonatal resuscitation care.',
                    ' Designed to provide antenatal outpatient consultations - including tetanus vaccination, well-pregnancy health visits including urine testing, measurement of fundal height, doppler for fetal HR, nutrition counseling for mom, birth planning where appropriate, early identification of potential birth complications and/or high risk pregnancies for referral, etc.',
                    ' Contains a minimum one-month supply of the medications and medical consumables needed to provide reproductive health services according to the MSF Essential Obstetric and Newborn Care guidelines and quantities largely based on the UNFPA Reproductive Health Kit calculations for coverage of reproductive health needs in a population of 30,000.',
                    ' Contains equipment and supplies needed to implement the safe reprocessing and sterilization of reusable medical items and surgical instruments; contains a 45L autoclave with traceability with written protocols/guidelines for its use, and supplies for a minimum of 1-month of operation before replenishment is needed.',
                    ' Contains equipment and supplies needed to set-up and maintain an inpatient/observation ward, including beds, bedding, nursing equipment and supplies for the postnatal care of mothers and their infants.'
                ],
                listItemsBoldStart: [
                    'Maternal/Newborn Care Module:',
                    'Antenatal Care (ANC) Module:',
                    'Pharmaceutical and Medical Consumables Module(s):',
                    'Sterilization Module:',
                    'Maternity Ward/Observation Module:'
                ]
            },
            specifications: {
                nationalSocieties: 'Canadian'
            },
            variationOnConfiguration: {
                listItems: [
                    '110v or 230v configuration.',
                    'With or without heating/cooling.',
                    'Can deploy specific stand-alone modules.'
                ]
            }
        }
    },
    {
        hash: '#surgical-surge',
        other: false,
        title: 'Surgical Surge',
        textSection: {
            capacity: {
                text: '1 operating theatre able to manage approximately 10 major surgical cases per day and medical consumables for initial surgical management of 300 trauma and/or war-wounded patients although initial shipment of medical consumables can be adjusted to expected case load.'
            },
            emergencyServices: {
                text: 'Surgical component of emergency hospital that can be deployed as a stand-alone capacity in a context where surgical care may be the identified gap in health services. Unit provides equipment and supplies needed to provide perioperative and postoperative care to patients with traumatic injuries, including surgical triage, assessment and advanced life support, definitive wound and advanced fracture management, damage control surgery, emergency general and obstetric surgery, inpatient care, general anaesthesia, whole blood transfusion, and early rehab services in an existing health facility.'
            },
            designedFor: {
                text: 'Unit can be deployed within 48 hours upon receiving a deployment request, can be setup within hours once on site, is self-sufficient for 1 month and can operate for up to 4 months with re-supply.\n\nDesigned for the provision of surgical services to augment trauma/surgical care in an existing facility overwhelmed by influx of injured patients. Footprint can be scaled to needs, for example if additional ward space is needed, equipment/materials can be added to standard modules/components outlined.'
            },
            personnel: {
                total: 'Typically 5 people from sending NS + 30-45 local staff.',
                composition: 'Deployed team includes surgeon, anesthetist, operating theater nurse(s), and ward nurse(s). In addition to deployed team, local health care professionals are integrated into unit as soon as possible with the aim of reaching or exceeding the following ratios: anesthetic technician/ anesthetist ratio 1:1 with surgeons, 5 OR technical staff per OT table, nursing ratio of at least 1 nurse: 8 ward beds (24 hour services).',
            },
            standardComponents: {
                text: 'Specific module names and components may vary but generally include the following:',
                listItems: [
                    ' Contains the equipment/materials needed to safely provide perioperative care for approximately 10 major surgical cases per day for one month or 300 surgical cases before re-supply is needed; includes operating table, basic patient monitoring equipment, surgical lighting, suction equipment, anesthesia machine and supplies, oxygen concentrators, and related items.',
                    ' Contains equipment and supplies needed to implement the safe reprocessing and sterilization of reusable medical items and surgical instruments; contains a full surgical 90L autoclave with traceability with written protocols/guidelines for its use, and supplies for 1-month of operation before replenishment is needed.',
                    ' Contains equipment and supplies needed to manage a minimum diagnostic capacity that goes beyond point-of-care or rapid tests; includes capacity to implement a walking blood bank including the supplies needed to test whole blood for HIV, Hep B, Hep C and syphilis (and malaria for areas where endemic) prior to administration.',
                    ' Contains the medications and medical consumables needed to safely provide perioperative care for approximately 10 major surgical cases per day for one month or 300 surgical cases before re-supply is needed; items similar to those found in the ICRC 50WW kit.',
                    ' Contains the equipment and materials needed for the safe management of medical waste in a low-resource setting; includes a portable incinerator.'
                ],
                listItemsBoldStart: [
                    'Surgical Module:',
                    'Sterilization Module:',
                    'Laboratory Module:',
                    'Pharmaceutical and Medical Consumables Module(s):',
                    'Waste Management Module:'
                ]
            },
            specifications: {
                cost: 'CHF 400,000',
                nationalSocieties: 'Canadian'
            },
            variationOnConfiguration: {
                listItems: [
                    '110v or 230v configuration.',
                    'With or without heating/cooling.',
                    'Can deploy specific stand-alone modules.'
                ]
            }
        }
    },
    {
        hash: '#eru-red-cross-red-crescent-emergency-hospital',
        other: false,
        title: 'ERU Red Cross Red Crescent Emergency Hospital',
        images: [
            'https://ifrcgo.org/global-services/assets/img/health/health-emt2_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-emt2_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-emt2_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-emt2_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-emt2_05.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-emt2_06.jpg'
        ],
        textSection: {
            capacity: {
                text: '24 hour clinical services for 100-200 outpatients/day, 1 operating theatre able to manage 7 major or 15 minor operations per day and up to 100+ inpatients with sufficient materials/supplies for 1 month, before replenishment is needed.'
            },
            emergencyServices: {
                text: 'Inpatient emergency hospital to provide acute medical care, general and obstetric surgery for trauma and other major medical conditions. Services provided include:',
                listItems: [
                    'Surgical triage.',
                    'Assessment and advanced life support.',
                    'Definitive wound and basic fracture management.',
                    'Damage control surgery.',
                    'Emergency general and obstetric surgery.',
                    'Inpatient care for non-trauma emergencies basic anaesthesia.',
                    'X-ray.',
                    'Whole blood transfusion.',
                    'Lab and early rehab services (acceptance and referral services).'
                ]
            },
            designedFor: {
                text: 'Unit can be deployed within 48 hours upon receiving a deployment request, can be setup within hours once on site, is self-sufficient for 1 month and can operate for up to 4 months. Designed for the provision of fixed emergency health services in communities with limited access to health care as a result of:',
                listItems: [
                    'Population movement to areas where there are no pre-existing health facilities.',
                    'Health infrastructure damages following natural disaster(s).',
                    'Existing health facilities are overwhelmed by influx of patients and/or particular health needs following a crisis (could include an epidemic or similar public health emergency).'
                ]
            },
            personnel: {
                total: 'Typically 35-48 people from sending National Society + 151 contracted locally.',
                composition: 'Deployed team includes doctors and nurses skilled in emergency and general medical care (including pediatrics and maternal health), surgical and anesthetic staff for the operating theatre, with the remainder non-medical staff including logisticians, administrators and site technicians. In addition to deployed team, local health care professionals are integrated into unit as soon as possible with the aim of reaching or exceeding the following ratios: anesthetic technician/ anesthetist ratio 1:1 with surgeons, 5 OR technical staff per OT table, nursing ratio of at least 1 nurse: 8 ward beds (24 hour services). Contracted local personnel include medical coordinator, head nurse, nurses, midwives, doctors, internist, Lab tech, Xray , porters, sterilization tech, washers, cooks, cleaners, gate control, security guard, registration clerk, nurses, midwives, pharmacist, admin, waste management, drivers, officers, and others.'
            },
            standardComponents: {
                text: 'Specific module names and components may vary but generally include the following, in addition to the modules standard to a Type 1 Emergency Clinic configuration:',
                listItems: [
                    ' Contains the equipment/materials needed to safely provide perioperative care for approximately 10 major surgical cases per day for one month or 300 surgical cases before re-supply is needed; includes operating table, basic patient monitoring equipment, surgical lighting, suction equipment, anesthesia machine and supplies, oxygen concentrators, and related items.',
                    ' Contains equipment and supplies needed to implement the safe reprocessing and sterilization of reusable medical items and surgical instruments; contains a full surgical 90L autoclave with traceability with written protocols/guidelines for its use, and supplies for 1-month of operation before replenishment is needed.',
                    ' Contains equipment and supplies needed to set-up and maintain an inpatient ward, including beds, bedding, nursing equipment and supplies for different patient populations; the same materials (or similar module) can be used to set-up an intensive observation care area for close observation and nursing care of acutely ill or injured patients, or those requiring observation post-anesthesia. Depending on the context, wards can be set-up by gender (male, female), age (adult vs pediatric), or health needs (maternity ward, post-surgical vs medical ward) and scaled to admission needs (e.g. Ward Kit contains 15 beds, but several kits can be sent if needed).',
                    ' Contains equipment and supplies needed to set-up an isolation area for the admission and care of cases of communicable disease that need to be hospitalised, but require a separate care area from the general patient population; includes PPEs to maintain droplet and contact precautions in this patient population as needed.',
                    ' Contains equipment and supplies needed to manage a minimum diagnostic capacity that goes beyond point-of-care or rapid tests; includes capacity to implement a walking blood bank including the supplies needed to test whole blood for HIV, Hep B, Hep C and syphilis (and malaria for areas where endemic) prior to administration.',
                    ' Contains equipment and supplies needed to set up a digital x-ray imaging space for reception of patients and processing/reading of digital images; includes PPEs for operating staff.'
                ],
                listItemsBoldStart: [
                    'Surgical Module:',
                    'Sterilization Module:',
                    'Ward/Inpatient Module:',
                    'Isolation Module:',
                    'Laboratory Module:',
                    'Xray Module:'
                ]
            },
            specifications: {
                weight: '30 MT',
                volume: '200 CBM',
                cost: 'CHF 1,200,000',
                nationalSocieties: 'Canadian, Finnish, German, Norwegian.'
            },
            variationOnConfiguration: {
                listItems: [
                    '110v or 230v configuration.',
                    'With or without heating/cooling.',
                    'Can deploy specific stand-alone modules.'
                ]
            }
        }
    },
    {
        hash: '#eru-red-cross-red-crescent-emergency-clinic',
        other: false,
        title: 'ERU Red Cross Red Crescent Emergency Clinic',
        images: [
            'https://ifrcgo.org/global-services/assets/img/health/health-emergency-clinic_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-emergency-clinic_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-emergency-clinic_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-emergency-clinic_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/health/health-emergency-clinic_05.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Day time clinical services with observation capacity possible for 100 outpatients/day for 1 month, before replenishment needed, and operational for up to 4 months.'
            },
            emergencyServices: {
                text: 'Outpatient emergency clinic to provide initial emergency care of injuries and other significant health care needs for adults and children. Services include:',
                listItems: [
                    'Triage.',
                    'Assessment.',
                    'First aid.',
                    'Stabilisation and referral of severe trauma and non trauma emergencies.',
                    'Definite care for minor trauma and non trauma emergencies.'
                ]
            },
            designedFor: {
                text: 'Unit can be deployed within 48 hours upon receiving a deployment request, can be setup within hours once on site, is self-sufficient for 1 month and can operate for up to 4 months. Designed for the provision of fixed emergency health services in communities with limited access to health care as a result of:',
                listItems: [
                    'Population movement to areas where there are no pre-existing health facilities.',
                    'Health infrastructure damages following natural disaster(s).',
                    'Existing health facilities are overwhelmed by influx of patients and/or particular health needs following a crisis (could include an epidemic or similar public health emergency).'
                ],
            },
            personnel: {
                total: 'Typically 19-23 people form sending National Society + 38 contracted locally.',
                composition: 'Deployed team composed of nurses, doctors and midwives trained in emergency and primary care, with the remainder non-medical staff including logisticians, administrators and site technicians. Clinical staff is skilled in emergency and trauma care, maternal and child health, and has knowledge of endemic disease management. In addition to deployed team, local health care professionals are integrated into unit as soon as possible, ideally reaching a doctor: nurse ratio of 1:3. Contracted local personnel include medical coordinator, head nurse, gate control, security guard, registration clerk, nurses, midwives, pharmacist, admin, and others.'
            },
            standardComponents: {
                text: 'Specific module names and components may vary but generally include the following services:',
                listItems: [
                    ' Contains the equipment and supplies needed to carry out initial triage, basic first aid and life support, stabilization fo patients, as well as initial wound care, basic fracture management, minor surgical procedures, basic outpatient care of communicable disease, basic outpatient paediatric care, basic/outpatient chronic disease care; diagnostics done through clinical examination and basic point-of-care laboratory tests.',
                    ' Contains the equipment and supplies needed to provide care to women in childbirth including basic emergency obstetric care with includes administering antibiotics, uterotonic drugs (oxytocin) and anticonvulsants (magnesium sulphate); manual removal of the placenta; removal of retained products following miscarriage or abortion; assisted vaginal delivery, preferably with vacuum extractor; basic neonatal resuscitation care.',
                    ' Contains a minimum one-month supply of the medications and medical consumables needed to provide services according to the MSF Clinical Guidelines; quantities also largely based on Interagency Emergency Health Kit calculations for coverage of health needs in a population of 30,000.',
                    ' Contains essential equipment and materials needed to carry out a rapid needs assessment to identify vulnerable groups, and support an operating NS to implement volunteer-driven PSS activities; activities focused on training up volunteers as needed, coordinating closely with social institutions and other humanitarian actors, assisting adults in affected communities with practical information, emotional and social support through PFA and referral, and setting up play and recreational activities for children where relevant.',
                    ' Contains the equipment and materials needed to set up a warehouse space to store and manage drugs and medical consumables.',
                    ' Contains the equipment and materials needed for the safe management of medical waste in a low-resource setting; includes a portable incinerator.',
                    ' Contains the equipment and materials needed to maintain a safe water supply for patients and staff within the ERU facility; generally includes a water filtration unit able to produce a volume of water that is aligned with Sphere standards for health facilities as a minimum, along with chlorine-based agents to treat water as per international norms.',
                    ' Contains the essential equipment and materials needed to set up temporary latrines for patient and staff use in a ratio that is aligned with Sphere standards for health facilities as a minimum',
                    ' Temporary tented, water repellent infrastructure of varying sizes (3x3m to XXX); tents can be metal-framed or inflatable depending on context and needs.',
                    ' Equipment/materials needed to provide self-sufficient power and light generation throughout the temporary health facility; typically petrol/gas run generators with associated cabling and energy-efficient lighting.',
                    ' Equipment/materials to set up a field office.',
                    ' Contains portable laptops, satellite communications equipment, mobile telephones and VHF handsets for two-way field communications, as well as essential equipment to set-up a local wireless network within the health facility and field office.',
                    ' 4x4 Toyota Land Cruisers as per IFRC specifications for team field movements, and possibly patient transportation (where context dictates); right hand and left hand drive options available; quantity deployed varies according to size of team and context.',
                    ' Equipment/materials needed to set-up temporary living accommodations for ERU team in contexts where commercial accommodations are not available.'
                ],
                listItemsBoldStart: [
                    'Outpatient Department (OPD) Module:',
                    'Maternal/Newborn Care Module:',
                    'Pharmaceutical and Medical Consumables Module(s):',
                    'Psychosocial Support (PSS) Module:',
                    'Medical stores/warehousing Module:',
                    'Waste Management Module:',
                    'Water Treatment Module:',
                    'Sanitation Module:',
                    'Infrastructure:',
                    'Power/lighting Module:',
                    'Administration Module:',
                    'IT/Telecommunications Module:',
                    'Vehicles:',
                    'Basecamp/accommodation Module:'
                ]
            },
            specifications: {
                weight: '20 MT',
                volume: '100 CBM',
                cost: 'CHF 650,000',
                nationalSocieties: 'Canadian, Finnish, French, German, Japanese, Norwegian, Spanish, Iranian.'
            },
            variationOnConfiguration: {
                listItems: [
                    '110v or 230v configuration.',
                    'With or without heating/cooling.',
                    'Can deploy specific stand-alone modules.',
                    'Can deploy as mobile clinics.'
                ]
            }
        }
    },
    {
        hash: '#communications-emergency-response-tool-cert-3',
        other: false,
        title: 'Communications Emergency Response Tool (CERT) 3',
        images: [
            'https://ifrcgo.org/global-services/assets/img/comms/comms-comms_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/comms/comms-comms_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/comms/comms-comms_03.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Rapid deployment of communications professionals at the outset of and during a disaster or emergency can support IFRC and its members to:',
                listItems: [
                    'Shape the public story and seize the immediate media opportunity in the first 24-72 hours following an emergency (or 24-36 hours prior to an imminent disaster).',
                    'Raise funds for appeals.',
                    'Protect against reputational criticisms of inaction that invariably follow any emergency response.',
                    'Provide first-hand information and analysis on disaster and crisis situations (including for international media and content generation).',
                    'Communication with affected communities – share life-saving information and support delivery of better services.',
                    'Influence key stakeholders - advocacy on behalf of affected communities.',
                    'Support coordination with partners.',
                    'Profile the work of the Red Cross and Red Crescent - create a better understanding of what we do, gain trust and generate more support.'
                ]
            },
            emergencyServices: {
                text: 'Rapid deployment (within 36 hours upon receiving a deployment request) of suitable and relevant role profile(s) to provide field-based communications support to a small to medium scale emergency response operations in a low to moderate complexity context, and with high level of attention from international media and global public interest.\n\nThe CERT3 team will provide management, strategic and technical support and advice to the operations, host National Society and member National Societies with the aim of highlighting the needs of the affected people, the work of the Red Cross Red Crescent in responding to these needs, and advocating on behalf of people at risk and affected by disasters/ crises for increased action to address their vulnerabilities and unmet humanitarian needs. The focus of this CERT team will be on:',
                listItems: [
                    'Communications capacity and needs assessment, planning and implementing communications strategies .',
                    'Spokesperson and in-country liaison for international media.',
                    'Managing communications resources on the ground and ensuring communications materials are shared for wider distribution and use among the Red Cross Red Crescent network.',
                    'Managing the editorial narrative/messaging according to the news cycle and disaster response/management cycle.',
                    'Ensuring strong visibility in local and international media by researching and identifying story ideas.',
                    'Audiovisual and written content production.',
                    'Supporting fundraising efforts.',
                    'Communications coordination with Movement partners.',
                    'Managing media opportunities including for high-level visits and other major milestones throughout the operation.',
                    'Ensure the availability of well-briefed spokespeople and support in country officials (National Society and IFRC) in their media engagements.',
                    'Supporting and advising IFRC and National Society colleagues and leadership in country on all public communications matters (i.e. media relations and social media engagement) related to the operations.',
                    'Anticipating, identifying and flagging potential reputational issues, and work with relevant focal points to advise on handling strategy and implement appropriate response.',
                    'Ensuring strong social media engagement by providing strategic guidance in country (in consultation with IFRC global communications team) on social media content production, identifying story opportunities that can be proactively pitched to digital media and distribution platforms, and supporting host National Society in planning and executing social media strategies.',
                    'Strengthening host National Society’s communications capacity through strategic communications advice and providing opportunities for learning, coaching, skills transfer, mentoring and facilitation of peer-to-peer exchanges.',
                    'Representing the communications team at task force and coordination meetings in country.'
                ]
            },
            designedFor: {
                listItems: [
                    'Large scale emergencies (red) with high level of international media attention and global public interest.',
                    'Highly complex context requiring tighter communications coordination and strategic communications support to operational management.',
                    'Serious escalation of slow onset emergencies, population movement or protracted crises.',
                    'Public health emergencies (pandemic outbreaks).',
                    'Potential need for reputational/ public risk management is high.'
                ]
            },
            personnel: {
                total: '5 person team.',
                composition: '1x Communications Team Leader, 1x Communications Coordinator , 1x Communications Officer, 1x AV Officer - Photographer , 1x AV Officer - Video.'
            },
            standardComponents: {
                text: 'Each team member is self-equipped with a laptop, smart phone with relevant suite of communications and editing apps, video/still camera, tripod(s) and microphone(s) or suitable sound recording device, a drone/ 360 camera (if legally permissable).'
            },
            specifications: {
                cost: 'CHF 62,000 per month (salary/allowance and insurance, flights, visa fees, telephone and internet charges, luggage allowance, in country transportation and accommodation)',
                nationalSocieties: 'Profiles in the roster include trained communications professionals from National Societies and IFRC. Efforts are underway to collaborate with ICRC and explore including their personnel in the IFRC network’s roster for communication coordination role profiles.'
            }
        }
    },
    {
        hash: '#communications-emergency-response-tool-cert-2',
        other: false,
        title: 'Communications Emergency Response Tool (CERT) 2',
        images: [
            'https://ifrcgo.org/global-services/assets/img/comms/comms-comms_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/comms/comms-comms_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/comms/comms-comms_03.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Rapid deployment of communications professionals at the outset of and during a disaster or emergency can support IFRC and its members to:',
                listItems: [
                    'Shape the public story and seize the immediate media opportunity in the first 24-72 hours following an emergency (or 24-36 hours prior to an imminent disaster).',
                    'Raise funds for appeals.',
                    'Protect against reputational criticisms of inaction that invariably follow any emergency response.',
                    'Provide first-hand information and analysis on disaster and crisis situations (including for international media and content generation).',
                    'Communication with affected communities – share life-saving information and support delivery of better services.',
                    'Influence key stakeholders - advocacy on behalf of affected communities.',
                    'Support coordination with partners.',
                    'Profile the work of the Red Cross and Red Crescent - create a better understanding of what we do, gain trust and generate more support.'
                ]
            },
            emergencyServices: {
                text: 'Rapid deployment (within 36 hours upon receiving a deployment request) of suitable and relevant role profile(s) to provide field-based communications support to a small to medium scale emergency response operations in a low to moderate complexity context, and with high level of attention from international media and global public interest.\n\nThe CERT2 team will provide strategic and technical support and advice to the operations, host National Society and member National Societies with the aim of highlighting the needs of the affected people, the work of the Red Cross Red Crescent in responding to these needs, and advocating on behalf of people at risk and affected by disasters/ crises for increased action to address their vulnerabilities and unmet humanitarian needs. The focus of this CERT team will be on:',
                listItems: [
                    'Communications capacity and needs assessment, planning and implementing communications strategies.',
                    'Setting the editorial narrative/messaging according to the news cycle and disaster response/management cycle.',
                    'International media engagement, including coordinating requests and fielding interviews.',
                    'Audiovisual and written content production.',
                    'Communications coordination with Movement partners.',
                    'Coordinate communications support for high-level visits, media related requests and visits from partner National Societies.',
                    'Ensure the availability of well-briefed spokespeople and support in country officials (National Society and IFRC) in their media engagements.',
                    'Ensure strong social media engagement by proposing, gathering and sharing engaging content for IFRC and National Society channels, tracking trends and rumours, and supporting host National Society in responding to audience engagement with social media.',
                    'Supporting fundraising efforts.',
                    'Anticipating, identifying and flagging potential reputational issues, and work with relevant focal points to advise on appropriate response.'
                ]
            },
            designedFor: {
                listItems: [
                    'Medium scale emergencies (orange) with high level of international media attention and global public interest.',
                    'In a moderate to complex context requiring close communications coordination.',
                    'Escalation of slow onset emergencies, population movement or protracted crises.',
                    'Public health emergencies (epidemic outbreaks).',
                    'Where potential media risk management could be required.'
                ],
            },
            personnel: {
                total: '3 person team.',
                composition: '1x Communications Coordinator or Team Leader (depending on context), 1x Communications Officer, and 1x AV Officer.',
            },
            standardComponents: {
                text: 'Each team member is self-equipped with a laptop, smart phone with relevant suite of communications and editing apps, video/still camera, tripod(s) and microphone(s) or suitable sound recording device, a drone/ 360 camera (if legally permissable).'
            },
            specifications: {
                cost: 'CHF 37,000 per month (salary/allowance and insurance, flights, visa fees, telephone and internet charges, luggage allowance, in country transportation and accommodation)',
                nationalSocieties: 'Profiles in the roster include trained communications professionals from National Societies and IFRC. Efforts are underway to collaborate with ICRC and explore including their personnel in the IFRC network’s roster for communication coordination role profiles.'
            }
        }
    },
    {
        hash: '#communications-emergency-response-tool-cert-1',
        other: false,
        title: 'Communications Emergency Response Tool (CERT) 1',
        images: [
            'https://ifrcgo.org/global-services/assets/img/comms/comms-comms_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/comms/comms-comms_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/comms/comms-comms_03.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Rapid deployment of communications professionals at the outset of and during a disaster or emergency can support IFRC and its members to:',
                listItems: [
                    'Shape the public story and seize the immediate media opportunity in the first 24-72 hours following an emergency (or 24-36 hours prior to an imminent disaster).',
                    'Raise funds for appeals.',
                    'Protect against reputational criticisms of inaction that invariably follow any emergency response.',
                    'Provide first-hand information and analysis on disaster and crisis situations (including for international media and content generation).',
                    'Communication with affected communities – share life-saving information and support delivery of better services.',
                    'Influence partners and decision makers - advocacy on behalf of affected communities.',
                    'Profile the work of the Red Cross and Red Crescent - create a better understanding of what we do, gain trust and generate more support.'
                ]
            },
            emergencyServices: {
                text: 'Rapid deployment (within 36 hours upon receiving a deployment request) of suitable and relevant role profile(s) to provide field-based communications support to a small to medium scale emergency response operations in a low to moderate complexity context, and with high level of attention from international media and global public interest.\n\nThe CERT1 team will provide technical support and advice to the operations, host National Society and member National Societies on the ground with the aim of highlighting the needs of affected people, the work of the Red Cross Red Crescent in responding to these needs, and advocating for increased action to address vulnerabilities and unmet humanitarian needs. The focus of this CERT team will be on:',
                listItems: [
                    'Communications capacity and needs assessment, planning and implementing communications strategies.',
                    'Identifying the editorial narrative/messaging according to the news cycle and disaster response/management cycle.',
                    'International media engagement, including coordinating requests and fielding interviews.',
                    'Audiovisual and written content production.',
                    'Supporting social media engagement, monitoring and scanning.',
                    'Supporting fundraising efforts.'
                ]
            },
            designedFor: {
                listItems: [
                    'Small to medium scale emergencies (yellow/ orange) in a low to moderate complexity context with high level of regional/ international media attention and global public interest.',
                    'Slow onset emergencies and public health emergencies (infectious disease outbreaks).'
                ],
            },
            personnel: {
                total: '1-2 person team.',
                composition: '1x Communications coordinator and/or 1x AV Officer.',
            },
            standardComponents: {
                text: 'Each team member is self-equipped with a laptop, smart phone with relevant suite of communications and editing apps, video/still camera, tripod(s) and microphone(s) or suitable sound recording device.'
            },
            specifications: {
                cost: 'CHF 25,500 per month (salary/allowance and insurance, flights, visa fees, telephone and internet charges, luggage allowance, in country transportation and accommodation)',
                nationalSocieties: 'Profiles in the roster include trained communications professionals from National Societies and IFRC. Efforts are underway to collaborate with ICRC and explore including their personnel in the IFRC network’s roster for communication coordination role profiles.'
            }
        }
    },
    {
        hash: '#community-engagement-and-accountability',
        other: false,
        title: 'Community Engagement and Accountability',
        images: [
            'https://ifrcgo.org/global-services/assets/img/cea/cea-cea_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/cea/cea-cea_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/cea/cea-cea_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/cea/cea-cea_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/cea/cea-cea_05.jpg',
        ],
        textSection: {
            capacity: {
                text: 'Provision of technical expertise to enhance the impact, reach and efficiency of emergency response operations through the integration and coordination of community engagement and accountability activities and approaches. This includes participatory approaches, feedback systems, risk communication/behaviour change communication (in closed collaboration with health promotion delegates) and evidence-based advocacy.'
            },
            emergencyServices: {
                text: 'Provide support in response operations through the CEA roster of trained professionals from the IFRC and National Societies.\n\nFlexible team (Tier 1 and 2) that can be adapted to the specific needs of a response (which could focus more on accountability issues or risk communication and community engagement as it is the case of epidemics), depending of needs and capacity of the HNS/operation.'
            },
            designedFor: {
                listItems: [
                    'Provide technical guidance and advice to guide community engagement assessments, as part of intersectoral assessment work towards collecting information and feedback needs and channels as well as insights on socio-cultural and contextual factors that can inform planning and guide community engagement efforts.',
                    'Supports the planning, rolling out and adaptation of CEA tools, methodologies, trainings and activities based on the needs assessment and suitable to the local context and cultural practices.',
                    'Supports and ensures use across operations teams of the most relevant social sciences research, impact surveys and perception data (including social-cultural data, sources of vulnerabilities, community structures and power dynamics) to support the design of comprehensive and evidence-based community engagement approaches in the operations.',
                    'Supports the setting up/strengthening of appropriate feedback methods and systems to gain a deeper understanding of the community feedback, including perceptions, beliefs, rumours and complaints. Ensures feedback, community perceptions and insights are regularly analysed and shared with key operation teams and decision makers to inform action.',
                    'Designs and facilitates the training of staff and volunteers on essential CEA aspects, including on the code of conduct, good communication skills, dealing with complaints and ensuring that feedback is acted upon.'
                ],
            },
            personnel: {
                total: 'Generally 2 people.',
                composition: 'Tier 1 Officer, and Tier 2 Coordinator.'
            }
        }
    },
    {
        hash: '#cva',
        other: false,
        title: 'CVA',
        images: [
            'https://ifrcgo.org/global-services/assets/img/cash/cash-cva_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/cash/cash-cva_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/cash/cash-cva_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/cash/cash-cva_05.jpg',
            'https://ifrcgo.org/global-services/assets/img/cash/cash-cva_02.jpg'
        ],
        textSection: {
            capacity: {
                text: 'Support the host National Society to carry out cash feasibility, market assessment, selection and contracting of Financial Services Provider, cash disbursements, data management and reporting via the deployment of a Cash Coordinator, Cash Officer and Cash IM officer.\n\nCash Coordinator, Cash Officer and Cash IM Officer profiles are deployed through the roster of trained professionals maintained by the IFRC Geneva Cash team.'
            },
            emergencyServices: {
                listItems: [
                    'Can support the host National Society to carry out cash feasibility, market assessment, selection and contracting of Financial Services Provider, cash disbursements, data management and reporting.',
                    'Can carry out advocacy for use of cash as response option.',
                    'Can support the sectors in designing interventions with cash as response option.',
                    'Representation of Movement in external working groups.'
                ]
            },
            designedFor: {
                text: 'Cash Coordinator, Cash Officer and Cash IM Officer profiles support the following activities:',
                assessment: 'Data Collection Plan, 4Ws management, Priority Needs Calculation, Assessment Findings Consolidation.',
                responseAnalysis: 'Response Options Weighting, Transfer Value Calculation, Vulnerability & Hazard Mapping, Priority Needs Calculation, Targeting Data Analysis (Geographic, Vulnerability Criteria).',
                setupAndImplementation: 'CEA Infographics, People Targeted Data Processing & Protection, Distribution/Encashment Planning Analysis, Distribution Reporting & Progress Mapping, Complaint & Feedback Mechanism Database.',
                monitoringAndEvaluation: 'Exit Survey Data Collection & Analysis, PDM Data Collection & Analysis, Price Market Data Collection, Case Studies, Lessons Learned, Final Documentation.'
            },
            personnel: {
                total: '1+ people',
                compositions: [
                    'Cash Coordinator x 1 for cash feasibility, advocacy, mainstreaming cash into sectoral activities.',
                    'Cash Officer x 1 for implementation. More Cash Officers can be deployed based on the geographical needs.',
                    'Cash IM Officer x 1 for data management, support in reporting, visualization and decision making.'
                ]
            },
            standardComponents: {
                text: 'Cash in Emergencies toolkit, with tools, templates and guidelines available for implementation of any CVA intervention.'
            },
            specifications: {
                cost: 'HR only, depends upon the assignment.',
                nationalSocieties: 'In the last years, many National Societies have enhanced their capacity and have contributed to CVA deployments.'
            }
        }
    },
    {
        hash: '#eru-base-camp-small',
        other: false,
        title: 'ERU Base Camp - small',
        images: [
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_05.jpg',
        ],
        textSection: {
            capacity: {
                text: 'Accommodation for up to 10 persons.'
            },
            emergencyServices: {
                listItems: [
                    'Can accommodate 2-10 RC delegates, and can be scaled by 2 delegates at the time.',
                    'Kitchen facilities are very limited, mostly dry bag food.',
                    'Office facilities for up to 8 delegates.',
                    'Filtration water treatment (CW200) of up to 1,200 Liter per day.',
                    'Clean water storage capacity 40 Liter.',
                    'Portable solar power system (40-50 Ah battery/75W panels).',
                ]
            },
            designedFor: {
                listItems: [
                    'Climates above 0 degree Celsius.',
                    'Assessment teams or small short term operations.',
                    'Lifespan intended is 4-6 weeks.',
                    'Can recycle 0-10% of the equipment.'
                ]
            },
            personnel: {
                total: '1-2 people per camp.'
            },
            standardComponents: {
                listItems: [
                    'Accommodation tent',
                    'Living',
                    'Kitchen',
                    'Office tent',
                    'Electricity',
                    'Maintenance and tools',
                    'WASH',
                    'Dry food for 10 persons for 7 days'
                ]
            },
            specifications: {
                weight: '450 - 500 kg',
                volume: '2.5 m3',
                cost: 'CHF 20,000 per camp',
                nationalSocieties: 'Danish, Italian'
            }
        }
    },
    {
        hash: '#eru-base-camp-medium',
        other: false,
        title: 'ERU Base Camp - medium',
        images: [
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_05.jpg',
        ],
        textSection: {
            capacity: {
                text: 'Accommodation for up to 16 - 50 persons.'
            },
            emergencyServices: {
                listItems: [
                    'Can accommodate 16 - 40 RC delegates, and can be scaled by 4 delegates at the time.',
                    'Kitchen facilities that can cater for up to 50 delegates, 3 times a day (max 150 meals per day).',
                    'Office facilities for up to 12 delegates.',
                    'Meeting facilities in one 24m2 tents.',
                    'Filtration water treatment (EM1000) of up to 10,000 Liter per day.',
                    'Clean water storage capacity 10,000 (2 x 5,000L).',
                    'Electrical infrastructure, (Generators 40 kW, 60 kW).'
                ]
            },
            designedFor: {
                listItems: [
                    'Climates above 0 degree Celsius.',
                    'Areas where infrastructure is damaged, unsafe or missing (earthquakes, floods or population movements).',
                    'Medium and Big operations where keeping delegates together is important for security/coordination.',
                    'Lifespan intended is 6-10 months.',
                    'Can recycle 0-25% of the equipment.'
                ]
            },
            personnel: {
                total: '4-5 people / 3 people.',
                composition: 'Team Leader (Assessment), 2-3 Technicians, 1 ITC / Camp Manager, Technician, Kitchen Supervisor.',
                subText: 'In addition to the above team, local staff is normally contracted for maintenance, cleaners, cooks, etc.'
            },
            standardComponents: {
                listItems: [
                    'Accommodation',
                    'Laundry',
                    'Kitchen',
                    'Leisure',
                    'Office',
                    'Climate',
                    'Electricity',
                    'Maintenance and tools',
                    'Operational support',
                    'Tents',
                    'WASH',
                    'Food for 40 people for 21 days'
                ]
            },
            specifications: {
                volume: '85 m3',
                cost: 'CHF 300,000',
                nationalSocieties: 'Danish, Italian'
            },
            variationOnConfiguration: {
                text: 'Camp can be scaled up or down depending on the situation, within all the modules.'
            }
        }
    },
    {
        hash: '#eru-base-camp-large',
        other: false,
        title: 'ERU Base Camp - large',
        images: [
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_04.jpg',
            'https://ifrcgo.org/global-services/assets/img/basecamp/basecamp-basecamp_05.jpg',
        ],
        textSection: {
            capacity: {
                text: 'Accommodation for up to 60 - 100 persons.'
            },
            emergencyServices: {
                listItems: [
                    'Can accommodate 60 - 100 RC delegates, and can be scaled by 8 delegates at the time.',
                    'Kitchen facilities that can cater for up to 200 people, 3 times a day (max 600 meals pr day).',
                    'Office facilities for up to 42 delegates.',
                    'Meeting facilities.',
                    'Ultrafiltration and UV water treatment of up to 15,000 Liter per day.',
                    'Clean water storage capacity 10,000 (2 x 5,000 L).',
                    'Electrical infrastructure, (Generators 60 kW, 80 kW).',
                ]
            },
            designedFor: {
                listItems: [
                    'Climates above 0 degree Celsius.',
                    'Areas where infrastructure is damaged, unsafe or missing (earthquakes, floods or population movements).',
                    'Big operations where keeping delegates together is important for security/coordination.',
                    'Lifespan - More that 12 month.',
                    'Can recycle 0-70 % of the equipment.'
                ]
            },
            personnel: {
                total: ' 5 people / 3-4 people.',
                composition: 'Team Leader (Assessment), 3 Technicians, 1 ITC / Camp Manager, Technician, Kitchen Supervisor, 0-1 Cook.',
                subText: 'In addition to the above team, local staff is normally contracted for maintenance, cleaners, cooks, etc.'
            },
            standardComponents: {
                listItems: [
                    'Accommodation',
                    'Laundry',
                    'Kitchen',
                    'Leisure',
                    'Office',
                    'Climate',
                    'Electricity',
                    'Maintenance and tools',
                    'Operational support',
                    'Tents',
                    'WASH',
                    'Food for 80 people for 21 days'
                ]
            },
            specifications: {
                volume: '200 m3',
                cost: 'CHF 1,000,000',
                nationalSocieties: 'Danish, Italian'
            },
            variationOnConfiguration: {
                text: 'Camp can be scaled up or down depending on the situation, within all the modules.'
            }
        }
    },
    {
        hash: '#facility-management',
        other: false,
        title: 'Facility Management',
        textSection: {
            emergencyServices: {
                listItems: [
                    'Can facilitate all aspects of facility management with a mix of buildings (if available), tents and local equipment.',
                    'Can help locate suitable buildings (empty building, housing complex or a hotel that can be rented) for accommodation or offices and transition it into a field hotel, office area or operation center.'
                ]
            },
            designedFor: {
                listItems: [
                    'Slow unset disasters.',
                    'Disasters where infrastructure has not been seriously damaged.'
                ]
            },
            personnel: {
                text: 'Depends on the assignment.'
            },
            standardComponents: {
                text: 'Modules can be taken from the Base Camp modules or purchased locally.'
            },
            specifications: {
                weight: 'varias',
                volume: 'varias',
                cost: 'varias',
                nationalSocieties: 'Danish'
            }
        }
    },
    {
        hash: '#assessment-cell',
        other: false,
        title: 'Assessment Cell',
        images: [
            'https://ifrcgo.org/global-services/assets/img/assessment/assessment-cell_01.jpg',
            'https://ifrcgo.org/global-services/assets/img/assessment/assessment-cell_02.jpg',
            'https://ifrcgo.org/global-services/assets/img/assessment/assessment-cell_03.jpg',
            'https://ifrcgo.org/global-services/assets/img/assessment/assessment-cell_04.jpg'
        ],
        textSection: {
            capacity: {
                text: 'The members of this team would be deployed in country or remotely, with a broad set of competencies from assessment, coordination, information gathering, management and analysis, GIS, and others. The composition of the team is context specific and will depend on existing capacities, stakeholders deployed, phase of the emergencies., scope and scale of the emergency, etc.\n\nFor large scale emergencies, the assessment cell should report to the multi-sectorial coordinator of the operation (Team Leader, Ops manager, Program Manager or others) and will be supporting the sectorial coordinators to ensure their overall emergency plan of action is evidence base.\n\nCurrently there are people trained in Emergency Needs Assessment and Planning / Humanitarian Information Analysis and Survey design and mobile data collection.'
            },
            emergencyServices: {
                text: 'Support to NS in their operations for:',
                listItems: [
                    'Provide Secondary data analysis through the use of DEEP (Secondary data review report, database)',
                    'Ensure there is an assessment registry.',
                    'Support with data collection templates, forms and plan.',
                    'Provide training to volunteers as data collector as part of the filed assessment team.',
                    'Coordinate and cooperate with the multi-sectorial coordination mechanism at National/Cluster level.',
                    'Analytical framework for sectorial information consolidation, Analysis plan.',
                    'Support sectors with the scenario building.',
                    'List of information gaps in operations.',
                    'Provide the current and priority needs (sectors, geographical areas, affected groups) at different stages from the initial to rapid to a more in depth assessment (from community to household level).',
                    'Lesson learned report and recommendations for next deployments.'
                ]
            },
            designedFor: {
                text: 'For orange and red scale emergencies, the assessments cell would support the through the deployment of assessment specialists team.\n\nThe assessment cell can be deployed to sudden on set disasters, slow on set, protracted or complex crisis. For sudden on set disasters the team can deploy from the emergency to the recovery phase to support the sector on their planning of the response options.'
            },
            personnel: {
                total: '2+ people',
                composition: 'Assessment Cell Coordinator, Info Analyst, Primary Data Collection Specialist, Secondary Data Collection Specialist (can be remote), Data Visualization Specialist.'
            },
            variationOnConfiguration: {
                text: 'The assessment cell could vary its configuration and competencies of the role profiles to be deployed depending on the phase of the emergency, existing deployed capacities, scope and scale of the disaster and crisis, etc.'
            }
        }
    },
    {
        hash: '#civil-military-relations',
        other: true,
        title: 'Civil Military Relations',
        textSection: [
            {
                title: 'Overview',
                text: 'Military and civil defence assets are often the first capabilities engaged in a domestic response, as well as offered by neighbouring states, and can make a valuable contribution in responding to natural disasters. However, the modus operandi of these mechanisms should be well regulated and coordinated with humanitarian organisations who share the same space. Disaster responses increasingly have a domestic and/or international military/police component that interact with RCRC Movement components responding on the ground. This necessitates a clear and common approach to Civil-Military Relations (CMR) by Red Cross Red Crescent (RCRC) Movement components to ensure a principled and effective response. Where the level of interaction with armed actors is (or can be expected to be) high, then the deployment of a CMR Coordinator is recommended.',
                urls: []
            },
            {
                title: 'Rapid response personnel role profile',
                text: 'Details about the expectations for this specialty can be found in the ',
                urls: [
                    { text: 'Civ-Mil Relations Coordinator.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Civ-Mil%20Relations%20Coordinator.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#disaster-risk-reduction-drr',
        other: true,
        title: 'Disaster risk reduction (DRR)',
        textSection: [
            {
                title: 'Overview',
                text: 'In recent years, there has been shift in the type of disasters that the RCRC Movement is responding to. There are more protracted crises, including silent and forgotten disasters. Of equal concern are smaller and medium sized disasters that constitute most of the events globally. Patterns of climate change are contributing to increased vulnerability and risk, not only in times of disaster but in relation to already existing issues including health and nutrition, food security, access to safe water and water-borne diseases, protection, gender and inclusion, among others. As a consequence, additional funding is required to meet the increased needs. Additional dedicated resources are necessary to not only raise awareness and funding for emergency operations but also to strengthen the fundraising capacity of National Societies during emergencies and their collective accountability and donor stewardship. As part of our efforts to strengthen resilience and mainstream vulnerability and risk reduction within emergency and recovery operations, the Disaster Risk Reduction surge personnel available to be deployed alongside recovery surge personnel to ensure the long term action are taking into consideration and suitably addressed and included in assessment, planning and programming, where appropriate to no regenerate new risk and take active measure to increase resilience at community level.',
                urls: []
            },
            {
                title: 'Rapid response personnel role profile',
                text: 'Details about the expectations for this specialty can be found in the ',
                urls: [
                    { text: 'Rapid Response Profile Disaster Risk Reduction and Climate Action Coordinator role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Disaster%20Risk%20Reduction%20and%20Climate%20Action%20Coordinator.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#human-resources',
        other: true,
        title: 'Human Resources',
        textSection: [
            {
                title: 'Overview',
                text: 'HR focuses on providing technical HR support and expertise to National Society and operational leadership. HR leads on HR assessments, HR planning, recruitment and staff wellbeing. The HR function is responsible for ensuring the use of HR policies and procedures that are adherent to IFRC standards and local legal contexts. HR also provides capacity strengthening in HR skills and processes to member National Societies involved in operational responses, where needed.',
                urls: []
            },
            {
                title: 'Rapid response personnel role profile',
                text: 'Details about the expectations for this specialty can be found in the ',
                urls: [
                    { text: 'Rapid Response Human Resources Coordinator role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Human%20Resources%20Coordinator.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#international-disaster-response-law',
        other: true,
        title: 'International Disaster Response Law',
        textSection: [
            {
                title: 'Overview',
                text: 'Addressing legal and regulatory issues that commonly arise concerning international assistance following disasters.',
                urls: []
            },
            {
                title: 'Rapid response personnel role profile',
                text: 'Details about the expectations for this specialty can be found in the ',
                urls: [
                    { text: 'Rapid Response International Disaster Response Law Coordinator-Emergency Phase role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20International%20Disaster%20Response%20Law%20Coordinator%20-%20Emergency%20Phase.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#migration',
        other: true,
        title: 'Migration',
        textSection: [
            {
                title: 'Overview',
                text: 'The IFRC and its member National Societies provide assistance and protection to migrants, irrespective of status, the host community, as well as those left behind. Collectively we have experience responding to large scale population movements such as those experienced in Cox’s Bazar, the Caravan’s in the Americas or the European Migrant Crisis. In addition, National Red Cross Red Crescent Societies support local communities displaced by disaster, conflict and climate change.',
                urls: []
            },
            {
                title: 'Rapid response personnel role profile',
                text: 'Details about the expectations for this specialty can be found in the ',
                urls: [
                    { text: 'Rapid Response Migration and Displacement Coordinator role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Migration%20and%20Displacement%20Coordinator.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#national-society-development',
        other: true,
        title: 'National Society Development',
        textSection: [
            {
                title: 'Overview',
                text: 'Strengthening of National Societies is one of the Federation’s and particularly the IFRC Secretariat’s fundamental tasks. During emergencies and crisis NS development may be jeopardized by national and international support channeled through the National Society. The IFRC and National Societies partners will ensure that National Societies are not harmed and NS development is not negatively affected by the international support they receive. \n\n Support to National Societies during response operations should be guided by efforts for self-defined development based on by their own strategy and its current situation and priorities, increase of capacity as local actor and improvement to effective local response. National Societies are supported to balance their humanitarian obligations towards vulnerable groups with existing organisational development commitments in order to develop their auxiliary role, strategy, governance and accountability; strengthen areas such as financial management and sustainability, communications, ensure volunteer engagement and management and improve capacity to manage external relations.',
                urls: []
            },
            {
                title: 'Rapid response personnel role profile',
                text: 'Details about the expectations for this specialty can be found in the role profiles:',
                urls: [
                    { text: 'Rapid Response NS Development in Emergencies Coordinator role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20NS%20Development%20in%20Emergencies%20Coordinator.pdf' },
                    { text: 'Rapid Response Volunteer Management in Emergencies Officer role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Volunteer%20Management%20in%20Emergencies%20Officer.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#partnership-and-resource-development',
        other: true,
        title: 'Partnership and resource development',
        textSection: [
            {
                title: 'Overview',
                text: 'The IFRC provides both strategic and technical support in partnerships and resource mobilization to National Societies who are working to increase their capacity. The IFRC supports National Societies in building their capacities to develop domestic fundraising portfolios. IFRC also coordinates global initiatives when the IFRC is best placed to do so, such as global digital campaigns for emergencies.',
                urls: []
            },
            {
                title: 'Rapid response personnel role profile',
                text: 'Details about the expectations for this specialty can be found in the role profiles:',
                urls: [
                    { text: 'Rapid Response Partnerships and Resource Development Officer role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Partnerships%20and%20Resource%20Development%20Officer.pdf' },
                    { text: 'Rapid Response PRD Officer National Society Support role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20PRD%20Officer%20National%20Society%20Support.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#preparedness-for-effective-response-per',
        other: true,
        title: 'National Society Development',
        textSection: [
            {
                title: 'Overview',
                text: 'Preparedness for Effective Response (PER) is a cyclical approach designed to empower National Societies to become more creative and innovative in their disaster management actions, and contribute to the coordination of national and global response systems.',
                urls: []
            },
            {
                title: 'Rapid response personnel role profile',
                text: 'Details about the expectations for this specialty can be found in the role profiles:',
                urls: [
                    { text: 'Rapid Response Preparedness for Effective Response Coordinator role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Preparedness%20for%20Effective%20Response%20Coordinator.pdf' },
                    { text: 'Rapid Response National Society Preparedness for Effective Response Officer role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20National%20Society%20Preparedness%20for%20Effective%20Response%20Officer.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#recovery',
        other: true,
        title: 'National Society Development',
        textSection: [
            {
                title: 'Overview',
                text: 'Supporting National Society and Operations Management to ensure that recovery is considered early in the operation; to help manage a smooth transition from rapid response to the medium-term operation which will support community recovery; and to ensure that the approach to recovery is holistic and integrated, working towards community resilience and better prepared NS.',
                urls: []
            },
            {
                title: 'Technical competency framework',
                text: 'Tiered competencies describing the knowledge and skills expected of personnel in this sector cam be found in the ',
                urls: [
                    { text: 'Recovery technical competency framework.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Recovery%20Technical%20Competency%20Framework%20March%202020.pdf' }
                ]
            },
            {
                title: 'Rapid response personnel role profile',
                text: 'Details about the expectations for this specialty can be found in the role profiles:',
                urls: [
                    { text: 'Rapid Response Recovery Coordinator role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Recovery%20Coordinator.pdf' },
                    { text: 'Rapid Response Early Recovery Officer role profile.', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Early%20Recovery%20Officer.pdf' }
                ]
            }
        ]
    }
];