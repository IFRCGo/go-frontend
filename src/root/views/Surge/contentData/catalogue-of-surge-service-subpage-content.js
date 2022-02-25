const fileStorage = 'https://prddsgofilestorage.blob.core.windows.net/api/documents/surge/';
const CatalogueOfSurgeServiceSubpageContent = [
    {
        hash: '#household-water-treatment-and-safe-storage-hwts',
        other: false,
        title: 'catalogueHwtsTitle',
        textSection: {
            capacity: {
                text: 'catalogueHwtsCapacityText'
            },
            emergencyServices: {
                texts: [
                    'catalogueHwtsEmergencyText1',
                    'catalogueHwtsEmergencyText2'
                ],
                listItems: [
                    'catalogueHwtsEmergencyListItem1',
                    'catalogueHwtsEmergencyListItem2',
                    'catalogueHwtsEmergencyListItem3',
                    'catalogueHwtsEmergencyListItem4',
                    'catalogueHwtsEmergencyListItem5',
                    'catalogueHwtsEmergencyListItem6',
                ],
                textsOrder: [
                    { text: 0, listStart: 0, listEnd: 6 },
                    { text: 1 }
                ]
            },
            designedFor: {
                text: 'catalogueHwtsDesignedText'
            },
            personnel: {
                total: 'catalogueHwtsPersonnelTotal',
                compositions: [
                    'catalogueHwtsPersonnelCompoistion1',
                    'catalogueHwtsPersonnelCompoistion2',
                    'catalogueHwtsPersonnelCompoistion3',
                    'catalogueHwtsPersonnelCompoistion4',
                    'catalogueHwtsPersonnelCompoistion5',
                    'catalogueHwtsPersonnelCompoistion6'
                ]
            },
            standardComponents: {
                listItems: [
                    'catalogueHwtsStandardCompListItem1',
                    'catalogueHwtsStandardCompListItem2',
                    'catalogueHwtsStandardCompListItem3',
                    'catalogueHwtsStandardCompListItem4',
                    'catalogueHwtsStandardCompListItem5',
                    'catalogueHwtsStandardCompListItem6',
                    'catalogueHwtsStandardCompListItem7',
                    'catalogueHwtsStandardCompListItem8',
                    'catalogueHwtsStandardCompListItem9',
                    'catalogueHwtsStandardCompListItem10',
                    'catalogueHwtsStandardCompListItem11',
                    'catalogueHwtsStandardCompListItem12'
                ]
            },
            specifications: {
                weight: 'catalogueHwtsSpecifiationTbd',
                volume: 'catalogueHwtsSpecifiationTbd',
                nationalSocieties: 'catalogueHwtsSpecifiationNationalSocieties'
            },
            additionalResources: {
                text: 'catalogueHwtsAdditionalResourceText',
                textUrl: { text: '', url: '' }
            }
        }
    },
    {
        hash: '#water-supply-rehabilitation-wsr',
        other: false,
        title: 'catalogueWsrTitle',
        textSection: {
            capacity: {
                text: 'catalogueWsrCapacityText'
            },
            emergencyServices: {
                text: 'catalogueWsrEmergencyText',
                listItems: [
                    'catalogueWsrEmergencyListItem1',
                    'catalogueWsrEmergencyListItem2'
                ]
            },
            designedFor: {
                text: 'catalogueWsrDesignedText'
            },
            personnel: {
                total: 'catalogueWsrPersonnelTotal',
                compositions: [
                    'catalogueWsrPersonnelCompoistion1',
                    'catalogueWsrPersonnelCompoistion2',
                    'catalogueWsrPersonnelCompoistion3',
                    'catalogueWsrPersonnelCompoistion4',
                    'catalogueWsrPersonnelCompoistion5'
                ]
            },
            standardComponents: {
                listItems: [
                    'catalogueWsrStandardCompListItem1',
                    'catalogueWsrStandardCompListItem2'
                ]
            },
            specifications: {
                weight: 'catalogueWsrSpecifiationTbd',
                volume: 'catalogueWsrSpecifiationTbd',
                cost: 'catalogueWsrSpecifiationCost',
                nationalSocieties: 'catalogueWsrSpecifiationNationalSocieties'
            },
            additionalResources: {
                listItems: ['catalogueWsrAdditionalResourceText1'],
                listItemsUrls: [{ text: 'catalogueWsrAdditionalResourceUrlText1', url: 'https://rodekors.service-now.com/drm?id=hb_catalog&handbook=d1b744c1db45b810f15e3423f39619c4' }]
            }
        }
    },
    {
        hash: '#m40-eru',
        other: false,
        title: 'catalogueM40Title',
        // images: [
        //     fileStorage + 'wash-m40_01.jpg',
        //     fileStorage + 'wash-m40_02.jpg',
        //     fileStorage + 'wash-m40_03.jpg',
        //     fileStorage + 'wash-m40_04.jpg',
        //     fileStorage + 'wash-m40_05.jpg',
        //     fileStorage + 'wash-m40_06.jpg'
        // ],
        imgs :
        [{
        src: fileStorage + "wash-m40_01.jpg",
        thumbnail: fileStorage + "wash-m40_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'RCRC personnel working with pumps and pipes'
        },
        {
        src: fileStorage + "wash-m40_02.jpg",
        thumbnail: fileStorage + "wash-m40_02.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Rigid steel tanks'
        },

        {
        src: fileStorage + "wash-m40_03.jpg",
        thumbnail: fileStorage + "wash-m40_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'RCRC personnel and rigid tank'
        },
        {
        src: fileStorage + "wash-m40_04.jpg",
        thumbnail: fileStorage + "wash-m40_04.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Setting up tanks'
        },
        {
        src: fileStorage + "wash-m40_05.jpg",
        thumbnail: fileStorage + "wash-m40_05.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Tank filling with raw water'
        }
    ],
        textSection: {
            capacity: {
                text: 'catalogueM40CapacityText'
            },
            emergencyServices: {
                listItems: [
                    'catalogueM40EmergencyListItem1',
                    'catalogueM40EmergencyListItem2',
                    'catalogueM40EmergencyListItem3'
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueM40DesignedListItem1',
                    'catalogueM40DesignedListItem2',
                    'catalogueM40DesignedListItem3',
                    'catalogueM40DesignedListItem4'
                ]
            },
            personnel: {
                total: 'catalogueM40PersonnelTotal',
                composition: 'catalogueM40PersonnelCompoistion',
                subText: 'catalogueM40PersonnelSubText'
            },
            specifications: {
                weight: 'catalogueM40SpecifiationWeight',
                volume: 'catalogueM40SpecifiationVolume',
                cost: 'catalogueM40SpecifiationCost',
                nationalSocieties: 'catalogueM40SpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#msm20-eru',
        other: false,
        title: 'catalogueMsm20Title',
        // images: [
        //     fileStorage + 'wash-msm20_01.jpg',
        //     fileStorage + 'wash-msm20_02.jpg',
        //     fileStorage + 'wash-msm20_03.jpg',
        //     fileStorage + 'wash-msm20_04.jpg',
        //     fileStorage + 'wash-msm20_05.jpg',
        //     fileStorage + 'wash-msm20_06.jpg',
        //     fileStorage + 'wash-msm20_07.jpg',
        //     fileStorage + 'wash-msm20_08.jpg'
        // ],
        imgs :
        [
        {
        src: fileStorage + "wash-msm20_01.jpg",
        thumbnail: fileStorage + "wash-msm20_01.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Cleaned latrines made by timber and plastic in an IDP camp'
        },
        {
        src: fileStorage + "wash-msm20_02.jpg",
        thumbnail: fileStorage + "wash-msm20_02.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Elevated latrines set up in an IDP camp'
        },
        {
        src: fileStorage + "wash-msm20_03.jpg",
        thumbnail: fileStorage + "wash-msm20_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Latrines built timber and plastic sheets'
        },
        {
        src: fileStorage + "wash-msm20_04.jpg",
        thumbnail: fileStorage + "wash-msm20_04.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Latrines built with corrugated sheets'
        },
        {
        src: fileStorage + "wash-msm20_05.jpg",
        thumbnail: fileStorage + "wash-msm20_05.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Population looking at hygiene promotion material'
        },
        {
        src: fileStorage + "wash-msm20_06.jpg",
        thumbnail: fileStorage + "wash-msm20_06.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'RCRC personnel maintaining set up latrines'
        },
        {
        src: fileStorage + "wash-msm20_07.jpg",
        thumbnail: fileStorage + "wash-msm20_07.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'RCRC personnel performing hygiene promotion activities with the community'
        },
        {
        src: fileStorage + "wash-msm20_08.jpg",
        thumbnail: fileStorage + "wash-msm20_08.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'RCRC personnel setting up latrines'
        },
        ],
        textSection: {
            capacity: {
                text: 'catalogueMsm20CapacityText'
            },
            emergencyServices: {
                text: 'catalogueMsm20EmergencyText',
                listItems: [
                    'catalogueMsm20EmergencyListItem1',
                    'catalogueMsm20EmergencyListItem2'
                ]
            },
            designedFor: {
                text: 'catalogueMsm20DesignedText'
            },
            personnel: {
                total: 'catalogueMsm20PersonnelTotal',
                composition: 'catalogueMsm20PersonnelCompoistion',
                subText: 'catalogueMsm20PersonnelSubText'
            },
            specifications: {
                weight: 'catalogueMsm20SpecifiationWeight',
                volume: 'catalogueMsm20SpecifiationVolume',
                cost: 'catalogueMsm20SpecifiationCost',
                nationalSocieties: 'catalogueMsm20SpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#m15-eru',
        other: false,
        title: 'catalogueM15Title',
        // images: [
        //     fileStorage + 'wash-m15_01.jpg',
        //     fileStorage + 'wash-m15_02.jpg',
        //     fileStorage + 'wash-m15_03.jpg',
        //     fileStorage + 'wash-m15_04.jpg',
        //     fileStorage + 'wash-m15_05.jpg',
        //     fileStorage + 'wash-m15_06.jpg',
        //     fileStorage + 'wash-m15_07.jpg'
        // ],
        imgs :
        [
        {
        src: fileStorage + "wash-m15_01.jpg",
        thumbnail: fileStorage + "wash-m15_01.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Water treatment camp in Mozambique'
        },
        {
        src: fileStorage + "wash-m15_02.jpg",
        thumbnail: fileStorage + "wash-m15_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Water treatment camp in Indonesia'
        },
        {
        src: fileStorage + "wash-m15_03.jpg",
        thumbnail: fileStorage + "wash-m15_03.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Water treatment line'
        },
        {
        src: fileStorage + "wash-m15_04.jpg",
        thumbnail: fileStorage + "wash-m15_04.jpg",
        thumbnailWidth: 410,
        thumbnailHeight: 200,
        caption: 'M15 water treatment process'
        },
        {
        src: fileStorage + "wash-m15_05.jpg",
        thumbnail: fileStorage + "wash-m15_05.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Making analysis of the purified water'
        },
        {
        src: fileStorage + "wash-m15_06.jpg",
        thumbnail: fileStorage + "wash-m15_06.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Tap stand in China'
        },
        {
        src: fileStorage + "wash-m15_07.jpg",
        thumbnail: fileStorage + "wash-m15_07.jpg",
        thumbnailWidth: 133,
        thumbnailHeight: 200,
        caption: 'Tap stand in Haiti'
        },

        ],
        textSection: {
            capacity: {
                text: 'catalogueM15CapacityText'
            },
            emergencyServices: {
                listItems: [
                    'catalogueM15EmergencyListItem1',
                    'catalogueM15EmergencyListItem2',
                    'catalogueM15EmergencyListItem3',
                    'catalogueM15EmergencyListItem4'
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueM15DesignedListItem1',
                    'catalogueM15DesignedListItem2',
                    'catalogueM15DesignedListItem3',
                    'catalogueM15DesignedListItem4'
                ]
            },
            personnel: {
                total: 'catalogueM15PersonnelTotal',
                composition: 'catalogueM15PersonnelCompoistion'
            },
            specifications: {
                weight: 'catalogueM15SpecifiationWeight',
                volume: 'catalogueM15SpecifiationVolume',
                cost: 'catalogueM15SpecifiationCost',
                nationalSocieties: 'catalogueM15SpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                text: 'catalogueM15VariationText'
            }
        }
    },
    {
        hash: '#kit-10',
        other: false,
        title: 'catalogueKit10Title',
        textSection: {
            capacity: {
                text: 'catalogueKit10CapacityText'
            },
            emergencyServices: {
                text: 'catalogueKit10EmergencyText'
            },
            specifications: {
                weight: 'catalogueKit10SpecifiationWeight',
                volume: 'catalogueKit10SpecifiationVolume',
                subText: 'catalogueKit10SpecifiationSubText'
            }
        }
    },
    {
        hash: '#kit-5',
        other: false,
        title: 'catalogueKit5Title',
        // images: [fileStorage + 'wash-kit5_01.jpg'],
        imgs :
        [
        {
        src: fileStorage + "wash-kit5_01.jpg",
        thumbnail: fileStorage + "wash-kit5_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'WASH Kit 5'
        }
        ],
        textSection: {
            capacity: {
                text: 'catalogueKit5CapacityText'
            },
            emergencyServices: {
                text: 'catalogueKit5EmergencyText'
            },
            specifications: {
                weight: 'catalogueKit5SpecifiationWeight',
                volume: 'catalogueKit5SpecifiationVolume',
                subText: 'catalogueKit5SpecifiationSubText'
            }
        }
    },
    {
        hash: '#kit-2',
        other: false,
        title: 'catalogueKit2Title',
        // images: [fileStorage + 'wash-kit2_01.jpg'],
        imgs :
        [
        {
        src: fileStorage + "wash-kit2_01.jpg",
        thumbnail: fileStorage + "wash-kit2_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'WASH Kit 2'
        }
        ],
        textSection: {
            capacity: {
                text: 'catalogueKit2CapacityText'
            },
            emergencyServices: {
                text: 'catalogueKit2EmergencyText'
            },
            specifications: {
                weight: 'catalogueKit2SpecifiationWeight',
                volume: 'catalogueKit2SpecifiationVolume',
                subText: 'catalogueKit2SpecifiationSubText'
            }
        }
    },
    {
        hash: '#stt-shelter-technical-team',
        other: false,
        title: 'catalogueSttTitle',
        // images: [
        //     fileStorage + 'shelter-stt_01.jpg',
        //     fileStorage + 'shelter-stt_06.jpg',
        //     fileStorage + 'shelter-stt_07.jpg',
        //     fileStorage + 'shelter-stt_08.jpg',
        //     fileStorage + 'shelter-stt_12.jpg',
        //     fileStorage + 'shelter-stt_14.jpg',
        //     fileStorage + 'shelter-stt_16.jpg',
        //     fileStorage + 'shelter-stt_17.jpg',
        //     fileStorage + 'shelter-stt_23.jpg',
        //     fileStorage + 'shelter-stt_24.jpg',
        // ],
        imgs :
        [
        {
        src: fileStorage + "shelter-stt_01.jpg",
        thumbnail: fileStorage + "shelter-stt_01.jpg",
        thumbnailWidth: 354,
        thumbnailHeight: 200,
        caption: 'Build Back Safer - Bangladesh'
        },
        {
        src: fileStorage + "shelter-stt_06.jpg",
        thumbnail: fileStorage + "shelter-stt_06.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Tabon Tabon, Eastern Leyte, Philippines - Over one million homes were damaged and destroyed by Typhoon Haiyan. Sensitisation sessions provide communities with practical tips including proper fixings of tarpaulins, building stronger foundations and improving bracing. Each community is also provided with flyers that cover all of the learning.'
        },
        {
        src: fileStorage + "shelter-stt_07.jpg",
        thumbnail: fileStorage + "shelter-stt_07.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Focus Group Discussion - Greece'
        },
        {
        src: fileStorage + "shelter-stt_08.jpg",
        thumbnail: fileStorage + "shelter-stt_08.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'PASSA - Haiti'
        },
        {
        src: fileStorage + "shelter-stt_12.jpg",
        thumbnail: fileStorage + "shelter-stt_12.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Reconstruction - Haiti'
        },
        {
        src: fileStorage + "shelter-stt_14.jpg",
        thumbnail: fileStorage + "shelter-stt_14.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Shelter kits, tarpaulins, and other kits for distribution at Lay Htet Gyi village, Mawlamying Gyun district, Myanmar.'
        },
        {
        src: fileStorage + "shelter-stt_16.jpg",
        thumbnail: fileStorage + "shelter-stt_16.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Dzaipi Refugee camp, Adjumani, Uganda. 16/02/2014 - A man from South Sudan is building a house in the oldest camp in Dzaipi.'
        },
        {
        src: fileStorage + "shelter-stt_17.jpg",
        thumbnail: fileStorage + "shelter-stt_17.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Zimbabwe, Chingwizi, 2014 - William Banda, a Zimbabwe Red Cross volunteer helps construct shelter for flood-displaced families of the Masvingo province at Chingwizi transit camp. The camp will house 20,000 people over the next few months. Zimbabwe Red Cross is at the camp registering new arrivals, providing shelter, first aid and psychosocial support.'
        },
        {
        src: fileStorage + "shelter-stt_23.jpg",
        thumbnail: fileStorage + "shelter-stt_23.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'On August 15, 2007, an earthquake of great intensity caused serious damage mainly on the coast of the Ica region of Peru, thousands of buildings were destroyed or affected, thousands of families lost their homes, leaving them in the open. The activity of the Red Cross is focused on supporting the construction of temporary accommodation in rural areas where the situation is extremely vulnerable.'
        },
        {
        src: fileStorage + "shelter-stt_24.jpg",
        thumbnail: fileStorage + "shelter-stt_24.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Tanuan , Eastern Leyte, Philippines - Over one million homes were damaged and destroyed by Typhoon Haiyan. The Red Cross is targeting support mainly at families who are rebuilding their homes or making temporary shelters by providing toolkits, materials and technical advice on how to build back safer.'
        }
        ],
        textSection: {
            capacity: {
                text: 'catalogueSttCapacityText'
            },
            emergencyServices: {
                text: 'catalogueSttEmergencyText'
            },
            designedFor: {
                listItems: [
                    'catalogueSttDesignedListItem1',
                    'catalogueSttDesignedListItem2',
                    'catalogueSttDesignedListItem3',
                    'catalogueSttDesignedListItem4',
                    'catalogueSttDesignedListItem5',
                    'catalogueSttDesignedListItem6',
                    'catalogueSttDesignedListItem7',
                    'catalogueSttDesignedListItem8',
                    'catalogueSttDesignedListItem9',
                    'catalogueSttDesignedListItem10',
                    'catalogueSttDesignedListItem11'
                ]
            },
            personnel: {
                total: 'catalogueSttPersonnelTotal',
                composition: 'catalogueSttPersonnelCompoistion'
            },
            specifications: {
                nationalSocieties: 'catalogueSttSpecifiationNationalSocieties'
            },
            additionalResources: {
                listItems: [
                    'catalogueSttAdditionalResourceText1',
                    '',
                    'catalogueSttAdditionalResourceText3',
                    'catalogueSttAdditionalResourceText4',
                    'catalogueSttAdditionalResourceText5'
                ],
                listItemsUrls: [
                    { text: 'catalogueSttAdditionalResourceUrlText1', url: 'https://www.ifrc.org/shelter-and-settlements' },
                    { text: 'catalogueSttAdditionalResourceUrlText2', url: 'https://fednet.ifrc.org/en/resources/disasters/shelter/' },
                    { text: 'catalogueSttAdditionalResourceUrlText3', url: 'https://itemscatalogue.redcross.int/relief--4/shelter-and-construction-materials--23.aspx' },
                    { text: 'catalogueSttAdditionalResourceUrlText4', url: 'https://www.ifrc.org/media/48901' },
                    { text: 'catalogueSttAdditionalResourceUrlText5', url: 'https://ifrc.csod.com/ui/lms-learning-details/app/course/6bcddb4f-0e33-471c-93fb-281764be8092' },
                ],
            }
        }
    },
    {
        hash: '#sct-shelter-coordination-team',
        other: false,
        title: 'catalogueSctTitle',
        // images: [
        //     fileStorage + 'shelter-sct_01.jpg',
        //     fileStorage + 'shelter-sct_02.jpg',
        //     fileStorage + 'shelter-sct_03.jpg',
        //     fileStorage + 'shelter-sct_04.jpg'
        // ],
        imgs :
        [
        {
        src: fileStorage + "shelter-sct_01.jpg",
        thumbnail: fileStorage + "shelter-sct_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'East Cameroon, May 2014 - With civil unrest continuing to cause an upheaval in people`s daily routines in the Central African Republic, neighbouring Cameroon has become a haven for tens of thousands of men, women and children seeking safety. Supported by IFRC through an emergency appeal, the Cameroon Red Cross Society has deployed a large number of volunteers who provide diversified and substantial assistance to families affected by the on-going crisis.'
        },
        {
        src: fileStorage + "shelter-sct_02.jpg",
        thumbnail: fileStorage + "shelter-sct_02.jpg",
        thumbnailWidth: 400,
        thumbnailHeight: 200,
        caption: 'Petit Goave Meeting, June 2010'
        },
        {
        src: fileStorage + "shelter-sct_03.jpg",
        thumbnail: fileStorage + "shelter-sct_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'SCT Philippines'
        },
        {
        src: fileStorage + "shelter-sct_04.jpg",
        thumbnail: fileStorage + "shelter-sct_04.jpg",
        thumbnailWidth: 670,
        thumbnailHeight: 200,
        caption: 'Shelter Cluster Coordination Meeting at OSOCC Tent, Haiti, 9 March 2010'
        },
        ],
        textSection: {
            capacity: {
                text: 'catalogueSctCapacityText'
            },
            emergencyServices: {
                text: 'catalogueSctEmergencyText'
            },
            designedFor: {
                listItems: [
                    'catalogueSctDesignedListItem1',
                    'catalogueSctDesignedListItem2',
                    'catalogueSctDesignedListItem3',
                    'catalogueSctDesignedListItem4',
                    'catalogueSctDesignedListItem5',
                    'catalogueSctDesignedListItem6',
                    'catalogueSctDesignedListItem7'
                ],
                listItemsBoldStart: [
                    'catalogueSctDesignedListItemStartsBold1',
                    'catalogueSctDesignedListItemStartsBold2',
                    'catalogueSctDesignedListItemStartsBold3',
                    'catalogueSctDesignedListItemStartsBold4',
                    'catalogueSctDesignedListItemStartsBold5',
                    'catalogueSctDesignedListItemStartsBold6',
                    'catalogueSctDesignedListItemStartsBold7'
                ]
            },
            personnel: {
                total: 'catalogueSctPersonnelTotal',
                composition: 'catalogueSctPersonnelCompoistion'
            },
            specifications: {
                nationalSocieties: 'catalogueSctSpecifiationNationalSocieties'
            },
            additionalResources: {
                listItems: [
                    '',
                    'catalogueSctAdditionalResourceText2',
                    'catalogueSctAdditionalResourceText3',
                    'catalogueSctAdditionalResourceText4',
                    'catalogueSctAdditionalResourceText5'
                ],
                listItemsUrls: [
                    { text: 'catalogueSctAdditionalResourceUrlText1', url: 'https://www.sheltercluster.org/' },
                    { text: 'catalogueSctAdditionalResourceUrlText2', url: 'http://www.sheltercluster.org/library/coordination-team' },
                    { text: 'catalogueSctAdditionalResourceUrlText3', url: 'https://www.sheltercluster.org/global/humanitarian-shelter-coordination-master-level-short-course' },
                    { text: 'catalogueSctAdditionalResourceUrlText4', url: 'https://www.sheltercluster.org/resources/page/more-just-roof' },
                    { text: 'catalogueSctAdditionalResourceUrlText5', url: 'https://www.buildingabetterresponse.org/' },
                ],
            }
        }
    },
    {
        hash: '#security-management',
        other: false,
        title: 'catalogueSecurityTitle',
        // images: [
        //     fileStorage + 'security-management_01.jpg',
        //     fileStorage + 'security-management_02.jpg',
        //     fileStorage + 'security-management_03.jpg',
        //     fileStorage + 'security-management_04.jpg'
        // ],
        imgs :
        [
        {
        src: fileStorage + "security-management_01.jpg",
        thumbnail: fileStorage + "security-management_01.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "security-management_02.jpg",
        thumbnail: fileStorage + "security-management_02.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "security-management_03.jpg",
        thumbnail: fileStorage + "security-management_03.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "security-management_04.jpg",
        thumbnail: fileStorage + "security-management_04.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: ''
        },
        ],
        textSection: {
            capacity: {
                text: 'catalogueSecurityCapacityText'
            },
            emergencyServices: {
                text: 'catalogueSecurityEmergencyText'
            },
            designedFor: {
                listItems: [
                    'catalogueSecurityDesignedListItem1',
                    'catalogueSecurityDesignedListItem2',
                    'catalogueSecurityDesignedListItem3',
                    'catalogueSecurityDesignedListItem4',
                    'catalogueSecurityDesignedListItem5'
                ],
                listItemsBoldStart: [
                    'catalogueSecurityDesignedListItemBoldStart1',
                    'catalogueSecurityDesignedListItemBoldStart2',
                    'catalogueSecurityDesignedListItemBoldStart3',
                    'catalogueSecurityDesignedListItemBoldStart4',
                    'catalogueSecurityDesignedListItemBoldStart5'
                ]
            },
            variationOnConfiguration: {
                text: 'catalogueSecurityVariationText'
            }
        }
    },
    {
        hash: '#eru-relief',
        other: false,
        title: 'catalogueReliefTitle',
        // images: [
        //     fileStorage + 'relief-eru_01.jpg',
        //     fileStorage + 'relief-eru_02.jpg',
        //     fileStorage + 'relief-eru_03.jpg',
        //     fileStorage + 'relief-eru_04.jpg',
        //     fileStorage + 'relief-eru_05.jpg',
        //     fileStorage + 'relief-eru_06.jpg',
        //     fileStorage + 'relief-eru_07.jpg',
        //     fileStorage + 'relief-eru_08.jpg',
        //     fileStorage + 'relief-eru_09.jpg',
        //     fileStorage + 'relief-eru_10.jpg'
        // ],
        imgs :
        [
        {
        src: fileStorage + "relief-eru_01.jpg",
        thumbnail: fileStorage + "relief-eru_01.jpg",
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        caption: 'Distribution 17.09.2019 of relief items in Abaco, the Bahamas; Hygiene kits, kitchen set, shelter toolkits, buckets, jerry cans and blankets. Hygiene and health promoted.'
        },
        {
        src: fileStorage + "relief-eru_02.jpg",
        thumbnail: fileStorage + "relief-eru_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Red Cross relief distribution on Abaco, the Bahamas, after Hurricane Dorian'
        },
        {
        src: fileStorage + "relief-eru_03.jpg",
        thumbnail: fileStorage + "relief-eru_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Philippines - Distribution check list'
        },
        {
        src: fileStorage + "relief-eru_04.jpg",
        thumbnail: fileStorage + "relief-eru_04.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: '23 September 2018. Philippines, Cagayan province, in the town of Baggao. One week since deadly Typhoon Mangkhut (locally known as Ompong) hit the Philippines, Philippine Red Cross led the distribution of non-food items, hygiene kits, emergency shelter kits, and corrugated iron sheets to hundreds of families.'
        },
        {
        src: fileStorage + "relief-eru_05.jpg",
        thumbnail: fileStorage + "relief-eru_05.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Tropical storm Podul caused extensive floods in Lao People’s Democratic Republic that have affected more than 300,000 people. Lao Red Cross teams have carried out search and rescue activities and evacuations, provided first aid and distributed food and water.'
        },
        {
        src: fileStorage + "relief-eru_06.jpg",
        thumbnail: fileStorage + "relief-eru_06.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Refugees in Sinjar take support from Iraq Red Crescent volunteers. The refugees are in need of the most basic items for their survival, so the Iraq Red Crescent is distributing food and non-food items, particularly water, ice, milk for babies and hot meals every day.'
        },
        {
        src: fileStorage + "relief-eru_07.jpg",
        thumbnail: fileStorage + "relief-eru_07.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Kenya Red Cross is working with the Government of Kenya to support those affected by floods, delivering emergency relief items and essential supplies like household items and water and sanitation in evacuation centres for people already displaced.'
        },
        {
        src: fileStorage + "relief-eru_08.jpg",
        thumbnail: fileStorage + "relief-eru_08.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Distribution organized by the Danish Red Cross of shelter items in camps in Port au Prince, Haiti.'
        },
        {
        src: fileStorage + "relief-eru_09.jpg",
        thumbnail: fileStorage + "relief-eru_09.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Food distribution organized by the Mexican and Colombian Red Cross in Camp Bzotun, Haiti.'
        },
        {
        src: fileStorage + "relief-eru_10.jpg",
        thumbnail: fileStorage + "relief-eru_10.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Relief in Haiti.'
        }
        ],
        textSection: {
            capacity: {
                text: 'catalogueReliefCapacityText'
            },
            emergencyServices: {
                texts: [
                    'catalogueReliefEmergencyText1',
                    'catalogueReliefEmergencyText2'
                ],
                listItems: [
                    'catalogueReliefEmergencyListItem1',
                    'catalogueReliefEmergencyListItem2',
                    'catalogueReliefEmergencyListItem3',
                    'catalogueReliefEmergencyListItem4'
                ],
                textsOrder: [
                    { text: 0, listStart: 0, listEnd: 4 },
                    { text: 1 }
                ]
            },
            designedFor: {
                text: 'catalogueReliefDesignedText',
                listItems: [
                    'catalogueReliefDesignedListItem1',
                    'catalogueReliefDesignedListItem2'
                ]
            },
            personnel: {
                total: 'catalogueReliefPersonnelTotal',
                composition: 'catalogueReliefPersonnelCompoistion',
                subText: 'catalogueReliefPersonnelSubText'
            },
            standardComponents: {
                listItems: [
                    'catalogueReliefStandardCompListItem1',
                    'catalogueReliefStandardCompListItem2'
                ]
            },
            specifications: {
                weight: 'catalogueReliefSpecifiationWeight',
                volume: 'catalogueReliefSpecifiationVolume',
                nationalSocieties: 'catalogueReliefSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#real-time-evaluation-rte-and-guidance',
        other: false,
        title: 'catalogueRteTitle',
        textSection: {
            capacity: {
                text: 'catalogueRteCapacityText'
            },
            emergencyServices: {
                text: 'catalogueRteEmergencyText'
            },
            designedFor: {
                text: 'catalogueRteDesignedText'
            },
            personnel: {
                text: 'catalogueRtePersonnelText'
            },
            specifications: {
                cost: 'catalogueRteSpecifiationCost',
                nationalSocieties: 'catalogueRteSpecifiationNationalSocieties'
            },
            additionalNotes: {
                text: 'catalogueRteAdditionalNoteText'
            }
        }
    },
    {
        hash: '#emergency-plan-of-action-epoa-monitoring-evaluation-plan',
        other: false,
        title: 'catalogueEpoaTitle',
        textSection: {
            capacity: {
                text: 'catalogueEpoaCapacityText'
            },
            emergencyServices: {
                listItems: [
                    'catalogueEpoaEmergencyListItem1',
                    'catalogueEpoaEmergencyListItem2',
                    'catalogueEpoaEmergencyListItem3'
                ]
            },
            designedFor: {
                text: 'catalogueEpoaDesignedText'
            },
            personnel: {
                text: 'catalogueEpoaPersonnelText'
            },
            specifications: {
                cost: 'catalogueEpoaSpecifiationCost',
                nationalSocieties: 'catalogueEpoaSpecifiationNationalSocieties'
            },
            additionalNotes: {
                text: 'catalogueEpoaAdditionalNoteText'
            }
        }
    },
    {
        hash: '#protection-gender-and-inclusion',
        other: false,
        title: 'catalogueProtectionTitle',
        // images: [
        //     fileStorage + 'pgi-pgi_01.jpg',
        //     fileStorage + 'pgi-pgi_02.jpg',
        //     fileStorage + 'pgi-pgi_05.jpg',
        //     fileStorage + 'pgi-pgi_04.jpg'
        // ],
        imgs :
        [
        {
        src: fileStorage + "pgi-pgi_01.jpg",
        thumbnail: fileStorage + "pgi-pgi_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: '23 September 2018. Philippines, Cagayan province, in the towns of Gattaran and Baggao. One week since deadly Typhoon Mangkhut (locally known as Ompong) hit the Philippines, Philippine Red Cross led the distribution of non-food items, hygiene kits, emergency shelter kits, and corrugated iron sheets to hundreds of families.'
        },
        {
        src: fileStorage + "pgi-pgi_02.jpg",
        thumbnail: fileStorage + "pgi-pgi_02.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Indonesia'
        },
        {
        src: fileStorage + "pgi-pgi_05.jpg",
        thumbnail: fileStorage + "pgi-pgi_05.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'Chikwawa, Malawi. Floods in Malawi early 2019 have had widespread devastation. Malawi Red Cross is providing critical life-saving support, ensuring communities are evacuated safely and provided emergency relief items, including food, non-food items and shelter kits.'
        },
        {
        src: fileStorage + "pgi-pgi_04.jpg",
        thumbnail: fileStorage + "pgi-pgi_04.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: '16 October 2018. Philippines, Kalinga province. Community leaders participate in a social mapping activity facilitated by the Philippine Red Cross in the village of Cudal in Tabuk, Kalinga province.'
        },
        ],
        textSection: {
            capacity: {
                text: 'catalogueProtectionCapacityText'
            },
            emergencyServices: {
                texts: [
                    'catalogueProtectionEmergencyText1',
                    'catalogueProtectionEmergencyText2'
                ],
                listItems: [
                    'catalogueProtectionEmergencyListItem1',
                    'catalogueProtectionEmergencyListItem2',
                    'catalogueProtectionEmergencyListItem3',
                    'catalogueProtectionEmergencyListItem4',
                    'catalogueProtectionEmergencyListItem5',
                    'catalogueProtectionEmergencyListItem6',
                    'catalogueProtectionEmergencyListItem7',
                    'catalogueProtectionEmergencyListItem8',
                    'catalogueProtectionEmergencyListItem9',
                    'catalogueProtectionEmergencyListItem10',
                    'catalogueProtectionEmergencyListItem11',
                    'catalogueProtectionEmergencyListItem12',
                ],
                textsOrder: [
                    { text: 0, listStart: 0, listEnd: 6 },
                    { text: 1, listStart: 6, listEnd: 12 }
                ]
            },
            designedFor: {
                text: 'catalogueProtectionDesignedText',
                listItems: [
                    'catalogueProtectionDesignedListItem1',
                    'catalogueProtectionDesignedListItem2',
                    'catalogueProtectionDesignedListItem3'
                ]
            },
            personnel: {
                total: 'catalogueProtectionPersonnelTotal',
                composition: 'catalogueProtectionPersonnelCompoistion'
            },
            standardComponents: {
                text: 'catalogueProtectionStandardCompText'
            }
        }
    },
    {
        hash: '#head-of-emergency-operations-heops',
        other: false,
        title: 'catalogueHeopsTitle',
        textSection: {
            capacity: {
                text: 'catalogueHeopsCapacityText'
            },
            emergencyServices: {
                text: 'catalogueHeopsEmergencyText'
            },
            designedFor: {
                listItems: [
                    'catalogueHeopsDesignedListItem1',
                    'catalogueHeopsDesignedListItem2',
                    'catalogueHeopsDesignedListItem3',
                    'catalogueHeopsDesignedListItem4',
                    'catalogueHeopsDesignedListItem5',
                    'catalogueHeopsDesignedListItem6'
                ]
            },
            personnel: {
                text: 'catalogueHeopsPersonnelText'
            },
            standardComponents: {
                text: 'catalogueHeopsStandardCompText'
            },
            specifications: {
                cost: 'catalogueHeopsSpecifiationCost',
                nationalSocieties: 'catalogueHeopsSpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                text: 'catalogueHeopsVariationText'
            },
            additionalResources: {
                listItems: [
                    'catalogueHeopsAdditionalResourceListItem1',
                    'catalogueHeopsAdditionalResourceListItem2'
                ],
                listItemsUrls: [
                    { text: 'catalogueHeopsAdditionalResourceUrlText1', url: 'https://fednet.ifrc.org/en/resources/disasters/disaster-and-crisis-mangement/disaster-response/surge-capacity/heops/' },
                    { text: 'catalogueHeopsAdditionalResourceUrlText2', url: 'https://ifrcgo.org/global-services/assets/docs/opsmanagement/HeOps%20bios%20-%202020%2002.pdf' }
                ],
            }
        }
    },
    {
        hash: '#lpscm-for-national-societies',
        other: false,
        title: 'catalogueLpscmTitle',
        textSection: {
            capacity: {
                text: 'catalogueLpscmCapacityText'
            },
            emergencyServices: {
                listItems: [
                    'catalogueLpscmEmergencyListItem1',
                    'catalogueLpscmEmergencyListItem2',
                    'catalogueLpscmEmergencyListItem3',
                    'catalogueLpscmEmergencyListItem4',
                    'catalogueLpscmEmergencyListItem5',
                    'catalogueLpscmEmergencyListItem6',
                    'catalogueLpscmEmergencyListItem7'
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueLpscmDesignedListItem1',
                    'catalogueLpscmDesignedListItem2',
                    'catalogueLpscmDesignedListItem3',
                    'catalogueLpscmDesignedListItem4',
                    'catalogueLpscmDesignedListItem5',
                    'catalogueLpscmDesignedListItem6',
                    'catalogueLpscmDesignedListItem7'
                ],
                listItemsBoldStart: [
                    'catalogueLpscmDesignedListItemBoldStart1',
                    'catalogueLpscmDesignedListItemBoldStart2',
                    'catalogueLpscmDesignedListItemBoldStart3',
                    'catalogueLpscmDesignedListItemBoldStart4',
                    'catalogueLpscmDesignedListItemBoldStart5',
                    'catalogueLpscmDesignedListItemBoldStart6',
                    'catalogueLpscmDesignedListItemBoldStart7'
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
                    { text: 'catalogueLpscmAdditionalResourceUrlText1', url: 'https://fednet.ifrc.org/en/resources/logistics/mobilization-of-goods/' },
                    { text: 'catalogueLpscmAdditionalResourceUrlText2', url: 'https://fednet.ifrc.org/en/resources/logistics/procurement/' },
                    { text: 'catalogueLpscmAdditionalResourceUrlText3', url: 'https://fednet.ifrc.org/en/resources/logistics/our-global-structure/DubaiLPSCM/global-fleet-base/vehicle-rental-programme/' },
                    { text: 'catalogueLpscmAdditionalResourceUrlText4', url: 'https://fednet.ifrc.org/en/resources/logistics/our-global-structure/' },
                    { text: 'catalogueLpscmAdditionalResourceUrlText5', url: 'https://fednet.ifrc.org/en/resources/logistics/contingency-stock/' },
                    { text: 'catalogueLpscmAdditionalResourceUrlText6', url: 'https://fednet.ifrc.org/en/resources/logistics/logistics-training-and-workshop/' }
                ],
                text: 'catalogueLpscmAdditionalResourceText',
                textUrl: { text: 'catalogueLpscmAdditionalResourceTextUrl', url: 'https://fednet.ifrc.org/en/resources/logistics/our-global-structure/' }
            }
        }
    },
    {
        hash: '#logistics-eru',
        other: false,
        title: 'catalogueLogisticsTitle',
        // images: [
        //     fileStorage + 'logs_01.jpg',
        //     fileStorage + 'logs_02.jpg',
        //     fileStorage + 'logs_03.jpg',
        //     fileStorage + 'logs_04.jpg',
        //     fileStorage + 'logs_05.jpg',
        //     fileStorage + 'logs_06.jpg',
        //     fileStorage + 'logs_07.jpg',
        //     fileStorage + 'logs_08.jpg',
        //     fileStorage + 'logs_09.jpg',
        //     fileStorage + 'logs_10.jpg',
        //     fileStorage + 'logs_11.jpg',
        // ],
        imgs :
        [
        {
        src: fileStorage + "logs_01.jpg",
        thumbnail: fileStorage + "logs_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'The IFRC warehouse in Panama is where relief items are prepositioned for deployment across the Americans in case of disaster.'
        },
        {
        src: fileStorage + "logs_02.jpg",
        thumbnail: fileStorage + "logs_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'The IFRC warehouse in Panama is where relief items are prepositioned for deployment across the Americans in case of disaster.'
        },
        {
        src: fileStorage + "logs_03.jpg",
        thumbnail: fileStorage + "logs_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Nassau, Bahamas - Red Cross logistics delegates Maureen Koch and Annahita Nikpour, oversee the loading of food supplies and cooking kits on to a ship at the port in Nassau. This humanitarian relief was shipped to Abaco and Grand Bahama as part of the response to Hurricane Dorian, which hit the Bahamas on Sept. 1, 2019.'
        },
        {
        src: fileStorage + "logs_04.jpg",
        thumbnail: fileStorage + "logs_04.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "logs_05.jpg",
        thumbnail: fileStorage + "logs_05.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "logs_06.jpg",
        thumbnail: fileStorage + "logs_06.jpg",
        thumbnailWidth: 333,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "logs_07.jpg",
        thumbnail: fileStorage + "logs_07.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "logs_08.jpg",
        thumbnail: fileStorage + "logs_08.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "logs_09.jpg",
        thumbnail: fileStorage + "logs_09.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'A plane with relief supplies from Panama arrived to the Bahamas on Thursday 5 September 2019.'
        },
        {
        src: fileStorage + "logs_10.jpg",
        thumbnail: fileStorage + "logs_10.jpg",
        thumbnailWidth: 333,
        thumbnailHeight: 200,
        caption: 'October 2018. Palu, Indonesia - Indonesian Red Cross is focusing on relief distributions, evacuations, water distribution, medical aid and restoring family links.'
        },
        {
        src: fileStorage + "logs_11.jpg",
        thumbnail: fileStorage + "logs_11.jpg",
        thumbnailWidth: 267,
        thumbnailHeight: 200,
        caption: 'July 29, 2019 - Brindisi airport, Italy - Relief items being loaded on a cargo plane for delivery to Venezuela.'
        }
        ],
        textSection: {
            capacity: {
                text: 'catalogueLogisticsCapacityText'
            },
            emergencyServices: {
                text: 'catalogueLogisticsEmergencyText',
                listItems: [
                    'catalogueLogisticsEmergencyListItem1',
                    'catalogueLogisticsEmergencyListItem2',
                    'catalogueLogisticsEmergencyListItem3',
                    'catalogueLogisticsEmergencyListItem4'
                ]
            },
            personnel: {
                total: 'catalogueLogisticsPersonnelTotal',
                composition: 'catalogueLogisticsPersonnelCompoistion',
            },
            standardComponents: {
                text: 'catalogueLogisticsStandardCompText',
                listItems: [
                    'catalogueLogisticsStandardCompListItem1',
                    'catalogueLogisticsStandardCompListItem2',
                    'catalogueLogisticsStandardCompListItem3',
                    'catalogueLogisticsStandardCompListItem4',
                    'catalogueLogisticsStandardCompListItem5',
                    'catalogueLogisticsStandardCompListItem6',
                    'catalogueLogisticsStandardCompListItem7'
                ]
            },
            specifications: {
                weight: 'catalogueLogisticsSpecifiationWeight',
                volume: 'catalogueLogisticsSpecifiationVolume',
                cost: 'catalogueLogisticsSpecifiationCost',
                nationalSocieties: 'catalogueLogisticsSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#livelihoods-and-basic-needs',
        other: false,
        title: 'catalogueLivelihoodsTitle',
        // images: [
        //     fileStorage + 'livelihoods-basic-needs_01.jpg',
        //     fileStorage + 'livelihoods-basic-needs_02.jpg',
        //     fileStorage + 'livelihoods-basic-needs_03.jpg',
        //     fileStorage + 'livelihoods-basic-needs_04.jpg',
        //     fileStorage + 'livelihoods-basic-needs_05.jpg'
        // ],
        imgs :
        [
        {
        src: fileStorage + "livelihoods-basic-needs_01.jpg",
        thumbnail: fileStorage + "livelihoods-basic-needs_01.jpg",
        thumbnailWidth: 366,
        thumbnailHeight: 200,
        caption: 'The Indonesia Red Cross implemented a fishery-based livelihoods programme for women in tsunami-affected areas who could no longer plant rice due to drought. Credit: Musfarayani/Dok, ©IFRC'
        },
        {
        src: fileStorage + "livelihoods-basic-needs_02.jpg",
        thumbnail: fileStorage + "livelihoods-basic-needs_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'The Bangladesh Red Crescent Society’s (BDRCS) Dignity, Access, Participation, Safety Centre (DAPS) in the camps of Cox’s Bazar provides a space to meet new people, share thoughts and learn new skills such as fishing net making and repair or sewing. Credit: Ibrahim Mollik, ©IFRC'
        },
        {
        src: fileStorage + "livelihoods-basic-needs_03.jpg",
        thumbnail: fileStorage + "livelihoods-basic-needs_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'A bakery in Port-au-Prince that was supported by the Italian Red Cross provides food and employment opportunities to the local community. Credit: Samuel Dameus, ©IFRC'
        },
        {
        src: fileStorage + "livelihoods-basic-needs_04.jpg",
        thumbnail: fileStorage + "livelihoods-basic-needs_04.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'The Philippine Red Cross responded to the immediate needs of the earthquake-affected communities by amongst others providing food items. Credit: France Noguera, ©IFRC'
        },
        {
        src: fileStorage + "livelihoods-basic-needs_05.jpg",
        thumbnail: fileStorage + "livelihoods-basic-needs_05.jpg",
        thumbnailWidth: 133,
        thumbnailHeight: 200,
        caption: 'A South Sudan Red Cross volunteer speaks with a farmer who received nutritionally rich seeds and farming implements from the Red Cross in May 2018. Credit: Corrie Butler, ©IFRC'
        }
        ],
        textSection: {
            capacity: {
                texts: [
                    'catalogueLivelihoodsCapacityText1',
                    'catalogueLivelihoodsCapacityText2',
                    'catalogueLivelihoodsCapacityText3'
                ],
                urls: [
                    { text: 'catalogueLivelihoodsCapacityUrlText1', url: 'http://www.livelihoodscentre.org/' },
                    { text: 'catalogueLivelihoodsCapacityUrlText2', url: 'http://www.livelihoodscentre.org/-/inundaciones-en-la-region-sur-de-paragu-1' },
                    { text: 'catalogueLivelihoodsCapacityUrlText3', url: 'mailto:livelihoods@cruzroja.es' }
                ],
                textsWithUrlOrder: [
                    { text: 0, url: 0 },
                    { text: 1, url: 1 },
                    { text: 2, url: 2 }
                ]
            },
            emergencyServices: {
                text: 'catalogueLivelihoodsEmergencyText'
            },
            designedFor: {
                texts: [
                    'catalogueLivelihoodsDesignedText1',
                    'catalogueLivelihoodsDesignedText2'
                ],
                listItems: [
                    'catalogueLivelihoodsDesignedListItem1',
                    'catalogueLivelihoodsDesignedListItem2',
                    'catalogueLivelihoodsDesignedListItem3',
                    'catalogueLivelihoodsDesignedListItem4'
                ],
                textsOrder: [
                    { text: 0, listStart: 0, listEnd: 4 },
                    { text: 1 }
                ]
            },
            personnel: {
                texts: [
                    'catalogueLivelihoodsPersonnelText1',
                    'catalogueLivelihoodsPersonnelText2',
                    'catalogueLivelihoodsPersonnelText3'
                ],
                listItems: [
                    'catalogueLivelihoodsPersonnelListItem1',
                    'catalogueLivelihoodsPersonnelListItem2',
                    'catalogueLivelihoodsPersonnelListItem3',
                    'catalogueLivelihoodsPersonnelListItem4',
                    'catalogueLivelihoodsPersonnelListItem5',
                    'catalogueLivelihoodsPersonnelListItem6',
                    'catalogueLivelihoodsPersonnelListItem7',
                    'catalogueLivelihoodsPersonnelListItem8',
                    'catalogueLivelihoodsPersonnelListItem9'
                ],
                textsOrder: [
                    { text: 0, listStart: 0, listEnd: 2 },
                    { text: 1, listStart: 2, listEnd: 8 },
                    { text: 2 }
                ]
            },
            specifications: {
                nationalSocieties: 'catalogueLivelihoodsSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#eru-it-telecom',
        other: false,
        title: 'catalogueItTelecomTitle',
        textSection: {
            capacity: {
                text: 'catalogueItTelecomCapacityText'
            },
            emergencyServices: {
                text: 'catalogueItTelecomEmergencyText'
            },
            designedFor: {
                text: 'catalogueItTelecomDesignedText'
            },
            personnel: {
                total: 'catalogueItTelecomPersonnelTotal',
                composition: 'catalogueItTelecomPersonnelCompoistion'
            },
            standardComponents: {
                listItems: [
                    'catalogueItTelecomStandardCompListItem1',
                    'catalogueItTelecomStandardCompListItem2',
                    'catalogueItTelecomStandardCompListItem3',
                    'catalogueItTelecomStandardCompListItem4',
                    'catalogueItTelecomStandardCompListItem5',
                    'catalogueItTelecomStandardCompListItem6',
                    'catalogueItTelecomStandardCompListItem7'
                ]
            },
            specifications: {
                cost: 'catalogueItTelecomSpecifiationCost',
                nationalSocieties: 'catalogueItTelecomSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#surge-information-management-support-sims',
        other: false,
        title: 'catalogueSimsTitle',
        textSection: {
            capacity: {
                text: 'catalogueSimsCapacityText'
            },
            emergencyServices: {
                text: 'catalogueSimsEmergencyText'
            },
            designedFor: {
                listItems: [
                    'catalogueSimsDesignedListItem1',
                    'catalogueSimsDesignedListItem2',
                    'catalogueSimsDesignedListItem3',
                    'catalogueSimsDesignedListItem4'
                ],
                listItemsBoldStart: [
                    'catalogueSimsStandardCompListItemBoldStart1',
                    'catalogueSimsStandardCompListItemBoldStart2',
                    'catalogueSimsStandardCompListItemBoldStart3',
                    'catalogueSimsStandardCompListItemBoldStart4'
                ]
            },
            additionalResources: {
                listItems: [
                    'catalogueSimsAdditionalResourceListItem1',
                    'catalogueSimsAdditionalResourceListItem2'
                ],
                listItemsUrls: [
                    { text: 'catalogueSimsAdditionalResourceUrlText1', url: 'https://rcrcsims.org/' },
                    { text: 'catalogueSimsAdditionalResourceUrlText2', url: 'https://go.ifrc.org/' }
                ],
            }
        }
    },
    {
        hash: '#eru-pss-module',
        other: false,
        title: 'cataloguePssModuleTitle',
        images: [],
        textSection: {
            capacity: {
                text: 'cataloguePssModuleCapacityText',
                listItems: [
                    'cataloguePssModuleCapacityListItem1',
                    'cataloguePssModuleCapacityListItem2',
                    'cataloguePssModuleCapacityListItem3',
                    'cataloguePssModuleCapacityListItem4',
                    'cataloguePssModuleCapacityListItem5',
                    'cataloguePssModuleCapacityListItem6'
                ]
            },
            designedFor: {
                text: 'cataloguePssModuleDesignedText',
                listItems: [
                    'cataloguePssModuleDesignedListItem1',
                    'cataloguePssModuleDesignedListItem2',
                    'cataloguePssModuleDesignedListItem3'
                ]
            },
            personnel: {
                total: 'cataloguePssModulePersonnelTotal',
                composition: 'cataloguePssModulePersonnelCompoistion'
            },
            standardComponents: {
                text: 'cataloguePssModuleStandardCompText',
                listItems: ['cataloguePssModuleStandardCompListItem1'],
                listItemsBoldStart: [
                    'cataloguePssModuleStandardCompListItemBoldStart1'
                ]
            },
            specifications: {
                nationalSocieties: 'cataloguePssModuleSpecifiationNationalSocieties'
            },
            additionalResources: {
                text: '',
                textUrl: { text: 'cataloguePssModuleAdditionalResourceUrlText', url: 'http://pscentre.org/' }
            }
        }
    },
    {
        hash: '#community-case-management-of-malnutrition-ccmm',
        other: false,
        title: 'catalogueCcmmTitle',
        textSection: {
            capacity: {
                text: 'catalogueCcmmCapacityText'
            },
            emergencyServices: {
                text: 'catalogueCcmmEmergencyText'
            },
            designedFor: {
                text: 'catalogueCcmmDesignedText'
            },
            specifications: {
                nationalSocieties: 'catalogueCcmmSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#safe-and-dignified-burials',
        other: false,
        title: 'catalogueSafeDignifiedTitle',
        textSection: {
            capacity: {
                text: 'catalogueSafeDignifiedCapacityText'
            },
            emergencyServices: {
                text: 'catalogueSafeDignifiedEmergencyText'
            },
            personnel: {
                total: 'catalogueSafeDignifiedPersonnelTotal',
                composition: 'catalogueSafeDignifiedPersonnelCompoistion',
            },
            standardComponents: {
                listItems: [
                    'catalogueSafeDignifiedStandardCompListItem1',
                    'catalogueSafeDignifiedStandardCompListItem2',
                    'catalogueSafeDignifiedStandardCompListItem3',
                    'catalogueSafeDignifiedStandardCompListItem4',
                    'catalogueSafeDignifiedStandardCompListItem5',
                    'catalogueSafeDignifiedStandardCompListItem6'
                ]
            },
            specifications: {
                weight: 'catalogueSafeDignifiedSpecifiationWeight',
                volume: 'catalogueSafeDignifiedSpecifiationVolume',
                cost: 'catalogueSafeDignifiedSpecifiationCost',
                nationalSocieties: 'catalogueSafeDignifiedSpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                text: 'catalogueSafeDignifiedVariationText'
            }
        }
    },
    {
        hash: '#community-based-surveillance-cbs',
        other: false,
        title: 'catalogueSurveillanceTitle',
        textSection: {
            capacity: {
                text: 'catalogueSurveillanceCapacityText'
            },
            emergencyServices: {
                text: 'catalogueSurveillanceEmergencyText'
            },
            designedFor: {
                text: 'catalogueSurveillanceDesignedText'
            },
            personnel: {
                total: 'catalogueSurveillancePersonnelTotal',
                compositions: [
                    'catalogueSurveillancePersonnelCompoistion1',
                    'catalogueSurveillancePersonnelCompoistion2'
                ],
                subText: 'catalogueSurveillancePersonnelSubText'
            },
            standardComponents: {
                listItems: [
                    'catalogueSurveillanceStandardCompListItem1',
                    'catalogueSurveillanceStandardCompListItem2',
                    'catalogueSurveillanceStandardCompListItem3',
                    'catalogueSurveillanceStandardCompListItem4'
                ]
            },
            specifications: {
                weight: 'catalogueSurveillanceSpecifiationWeight',
                volume: 'catalogueSurveillanceSpecifiationVolume',
                cost: 'catalogueSurveillanceSpecifiationCost',
                nationalSocieties: 'catalogueSurveillanceSpecifiationNationalSocieties'
            },
            additionalResources: {
                listItems: [
                    'catalogueSurveillanceVariationListItem1',
                    'catalogueSurveillanceVariationListItem2'
                ],
                listItemsUrls: [
                    { text: 'catalogueSurveillanceVariationListItem1UrlText', url: 'https://www.cbsrc.org/' },
                    { text: 'catalogueSurveillanceVariationListItem2UrlText', url: 'https://rodekors.service-now.com/drm?id=hb_catalog&handbook=09f973a8db15f4103408d7b2f39619ee' }
                ]
            }
        }
    },
    {
        hash: '#community-case-management-of-cholera-ccmc',
        other: false,
        title: 'catalogueManagementCholeraTitle',
        // images: [fileStorage + 'health-ccmc_01.jpg'],
        imgs :
        [
        {
        src: fileStorage + "health-ccmc_01.jpg",
        thumbnail: fileStorage + "health-ccmc_01.jpg",
        thumbnailWidth: 333,
        thumbnailHeight: 200,
        caption: 'ORP in Somaliland'
        },
        ],
        textSection: {

            capacity: {
                text: 'catalogueManagementCholeraCapacityText'
            },
            emergencyServices: {
                text: 'catalogueManagementCholeraEmergencyText'
            },
            designedFor: {
                text: 'catalogueManagementCholeraDesignedText'
            },
            personnel: {
                total: 'catalogueManagementCholeraPersonnelTotal',
                composition: 'catalogueManagementCholeraPersonnelCompoistion'
            },
            standardComponents: {
                listItems: [
                    'catalogueManagementCholeraStandardCompListItem1',
                    'catalogueManagementCholeraStandardCompListItem2',
                    'catalogueManagementCholeraStandardCompListItem3',
                    'catalogueManagementCholeraStandardCompListItem4',
                    'catalogueManagementCholeraStandardCompListItem5'
                ]
            },
            specifications: {
                weight: 'catalogueManagementCholeraSpecifiationWeight',
                volume: 'catalogueManagementCholeraSpecifiationVolume',
                nationalSocieties: 'catalogueManagementCholeraSpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                text: 'catalogueManagementCholeraVariationText'
            }
        }
    },

    {
        hash: '#roles-and-resps',
        other: false,
        textSection: {
            rolesAndResps: '1'
        }
    },
    {
        hash: '#im-support-for-op',
        other: false,
        textSection: {
            imSupportForOp: '1'
        }
    },
    {
        hash: '#ifrc-geneva-im',
        other: false,
        textSection: {
            ifrcGenevaIm: '1'
        }
    },
    {
        hash: '#composition-of-im-res',
        other: false,
        textSection: {
            compositionOfImRes: '1'
        }
    },

    {
        hash: '#eru-cholera-treatment-center',
        other: false,
        title: 'catalogueCholeraTreatmentTitle',
        textSection: {
            capacity: {
                text: 'catalogueCholeraTreatmentCapacityText'
            },
            emergencyServices: {
                text: 'catalogueCholeraTreatmentEmergencyText'
            },
            designedFor: {
                text: 'catalogueCholeraTreatmentDesignedText',
                listItems: [
                    'catalogueCholeraTreatmentDesignedListItem1',
                    'catalogueCholeraTreatmentDesignedListItem2',
                    'catalogueCholeraTreatmentDesignedListItem3'
                ]
            },
            personnel: {
                total: 'catalogueCholeraTreatmentPersonnelTotal',
                composition: 'catalogueCholeraTreatmentPersonnelCompoistion'
            },
            standardComponents: {
                text: 'catalogueCholeraTreatmentStandardCompText',
                listItems: [
                    'catalogueCholeraTreatmentStandardCompListItem1',
                    'catalogueCholeraTreatmentStandardCompListItem2',
                    'catalogueCholeraTreatmentStandardCompListItem3',
                    'catalogueCholeraTreatmentStandardCompListItem4',
                    'catalogueCholeraTreatmentStandardCompListItem5',
                    'catalogueCholeraTreatmentStandardCompListItem6',
                    'catalogueCholeraTreatmentStandardCompListItem7',
                    'catalogueCholeraTreatmentStandardCompListItem8',
                    'catalogueCholeraTreatmentStandardCompListItem9',
                    'catalogueCholeraTreatmentStandardCompListItem10',
                    'catalogueCholeraTreatmentStandardCompListItem11',
                    'catalogueCholeraTreatmentStandardCompListItem12'
                ],
                listItemsBoldStart: [
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart1',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart2',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart3',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart4',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart5',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart6',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart7',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart8',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart9',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart10',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart11',
                    'catalogueCholeraTreatmentStandardCompListItemBoldStart12'
                ]
            },
            specifications: {
                nationalSocieties: 'catalogueCholeraTreatmentSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#emergency-mobile-clinic',
        other: false,
        title: 'catalogueMobileClinicTitle',
        // images: [
        //     fileStorage + 'health-mobile-clinic_01.jpg',
        //     fileStorage + 'health-mobile-clinic_02.jpg'
        // ],
        imgs :
        [
        {
        src: fileStorage + "health-mobile-clinic_01.jpg",
        thumbnail: fileStorage + "health-mobile-clinic_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Mobile clinic distributing medicines in Sulawesi, Indonesia.'
        },
        {
        src: fileStorage + "health-mobile-clinic_02.jpg",
        thumbnail: fileStorage + "health-mobile-clinic_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Mobile clinic in Cox`s Bazar, Bangladesh.'
        },
        ],
        textSection: {
            capacity: {
                text: 'catalogueMobileClinicCapacityText'
            },
            emergencyServices: {
                text: 'catalogueMobileClinicEmergencyText',
                listItems: [
                    'catalogueMobileClinicEmergencyListItem1',
                    'catalogueMobileClinicEmergencyListItem2',
                    'catalogueMobileClinicEmergencyListItem3',
                    'catalogueMobileClinicEmergencyListItem4',
                    'catalogueMobileClinicEmergencyListItem5'
                ],
                subText: 'catalogueMobileClinicEmergencySubText'
            },
            designedFor: {
                text: 'catalogueMobileClinicDesignedText',
                listItems: [
                    'catalogueMobileClinicDesignedListItem1',
                    'catalogueMobileClinicDesignedListItem2',
                    'catalogueMobileClinicDesignedListItem3',
                    'catalogueMobileClinicDesignedListItem4'
                ]
            },
            personnel: {
                total: 'catalogueMobileClinicPersonnelTotal',
                composition: 'catalogueMobileClinicPersonnelCompoistion'
            },
            standardComponents: {
                text: 'catalogueMobileClinicStandardCompText',
                listItems: [
                    'catalogueMobileClinicStandardCompListItem1',
                    'catalogueMobileClinicStandardCompListItem2',
                    'catalogueMobileClinicStandardCompListItem3',
                    'catalogueMobileClinicStandardCompListItem4',
                    'catalogueMobileClinicStandardCompListItem5'
                ],
                listItemsBoldStart: [
                    'catalogueMobileClinicStandardCompListItemBoldStart1',
                    'catalogueMobileClinicStandardCompListItemBoldStart2',
                    'catalogueMobileClinicStandardCompListItemBoldStart3',
                    'catalogueMobileClinicStandardCompListItemBoldStart4',
                    'catalogueMobileClinicStandardCompListItemBoldStart5'
                ]
            },
            specifications: {
                nationalSocieties: 'catalogueMobileClinicSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#maternal-newborn-health-clinic',
        other: false,
        title: 'catalogueHealthClinicTitle',
        textSection: {
            capacity: {
                text: 'catalogueHealthClinicCapacityText'
            },
            emergencyServices: {
                text: 'catalogueHealthClinicEmergencyText'
            },
            designedFor: {
                text: 'catalogueHealthClinicDesignedText',
                listItems: [
                    'catalogueHealthClinicDesignedListItem1',
                    'catalogueHealthClinicDesignedListItem2'
                ]
            },
            personnel: {
                total: 'catalogueHealthClinicPersonnelTotal',
                composition: 'catalogueHealthClinicPersonnelCompoistion'
            },
            standardComponents: {
                text: 'catalogueHealthClinicStandardCompText',
                listItems: [
                    'catalogueHealthClinicStandardCompListItem1',
                    'catalogueHealthClinicStandardCompListItem2',
                    'catalogueHealthClinicStandardCompListItem3',
                    'catalogueHealthClinicStandardCompListItem4',
                    'catalogueHealthClinicStandardCompListItem5'
                ],
                listItemsBoldStart: [
                    'catalogueHealthClinicStandardCompListItemBoldStart1',
                    'catalogueHealthClinicStandardCompListItemBoldStart2',
                    'catalogueHealthClinicStandardCompListItemBoldStart3',
                    'catalogueHealthClinicStandardCompListItemBoldStart4',
                    'catalogueHealthClinicStandardCompListItemBoldStart5'
                ]
            },
            specifications: {
                nationalSocieties: 'catalogueHealthClinicSpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                listItems: [
                    'catalogueHealthClinicVariationListItem1',
                    'catalogueHealthClinicVariationListItem2',
                    'catalogueHealthClinicVariationListItem3'
                ]
            }
        }
    },
    {
        hash: '#surgical-surge',
        other: false,
        title: 'catalogueSurgicalSurgeTitle',
        textSection: {
            capacity: {
                text: 'catalogueSurgicalSurgeCapacityText'
            },
            emergencyServices: {
                text: 'catalogueSurgicalSurgeEmergencyText'
            },
            designedFor: {
                text: 'catalogueSurgicalSurgeDesignedText'
            },
            personnel: {
                total: 'catalogueSurgicalSurgePersonnelTotal',
                composition: 'catalogueSurgicalSurgePersonnelCompoistion',
            },
            standardComponents: {
                text: 'catalogueSurgicalSurgeStandardCompText',
                listItems: [
                    'catalogueSurgicalSurgeStandardCompListItem1',
                    'catalogueSurgicalSurgeStandardCompListItem2',
                    'catalogueSurgicalSurgeStandardCompListItem3',
                    'catalogueSurgicalSurgeStandardCompListItem4',
                    'catalogueSurgicalSurgeStandardCompListItem5'
                ],
                listItemsBoldStart: [
                    'catalogueSurgicalSurgeStandardCompListItemBoldStart1',
                    'catalogueSurgicalSurgeStandardCompListItemBoldStart2',
                    'catalogueSurgicalSurgeStandardCompListItemBoldStart3',
                    'catalogueSurgicalSurgeStandardCompListItemBoldStart4',
                    'catalogueSurgicalSurgeStandardCompListItemBoldStart5'
                ]
            },
            specifications: {
                cost: 'catalogueSurgicalSurgeSpecifiationCost',
                nationalSocieties: 'catalogueSurgicalSurgeSpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                listItems: [
                    'catalogueSurgicalSurgeVariationListItem1',
                    'catalogueSurgicalSurgeVariationListItem2',
                    'catalogueSurgicalSurgeVariationListItem3'
                ]
            }
        }
    },
    {
        hash: '#eru-red-cross-red-crescent-emergency-hospital',
        other: false,
        title: 'catalogueEmergencyHospitalTitle',
        // images: [
        //     fileStorage + 'health-emt2_01.jpg',
        //     fileStorage + 'health-emt2_02.jpg',
        //     fileStorage + 'health-emt2_03.jpg',
        //     fileStorage + 'health-emt2_04.jpg',
        //     fileStorage + 'health-emt2_05.jpg',
        //     fileStorage + 'health-emt2_06.jpg'
        // ],
        imgs :
        [{
        src: fileStorage + "health-emt2_01.jpg",
        thumbnail: fileStorage + "health-emt2_01.jpg",
        thumbnailWidth: 569,
        thumbnailHeight: 200,
        caption: 'Ormoc, Philippines - Typhoon Haiyan, 1 Dec 2013'
        },
        {
        src: fileStorage + "health-emt2_02.jpg",
        thumbnail: fileStorage + "health-emt2_02.jpg",
        thumbnailWidth: 266,
        thumbnailHeight: 200,
        caption: 'NS staff in the operating theatre'
        },

        {
        src: fileStorage + "health-emt2_03.jpg",
        thumbnail: fileStorage + "health-emt2_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "health-emt2_04.jpg",
        thumbnail: fileStorage + "health-emt2_04.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'RCRC Hospital in Haiti'
        },
        {
        src: fileStorage + "health-emt2_05.jpg",
        thumbnail: fileStorage + "health-emt2_05.jpg",
        thumbnailWidth: 400,
        thumbnailHeight: 200,
        caption: 'RCRC Hospital in India'
        },
        {
        src: fileStorage + "health-emt2_06.jpg",
        thumbnail: fileStorage + "health-emt2_06.jpg",
        thumbnailWidth: 333,
        thumbnailHeight: 200,
        caption: 'RCRC Hospital'
        }
        ],
        textSection: {
            capacity: {
                text: 'catalogueEmergencyHospitalCapacityText'
            },
            emergencyServices: {
                text: 'catalogueEmergencyHospitalEmergencyText',
                listItems: [
                    'catalogueEmergencyHospitalEmergencyListItem1',
                    'catalogueEmergencyHospitalEmergencyListItem2',
                    'catalogueEmergencyHospitalEmergencyListItem3',
                    'catalogueEmergencyHospitalEmergencyListItem4',
                    'catalogueEmergencyHospitalEmergencyListItem5',
                    'catalogueEmergencyHospitalEmergencyListItem6',
                    'catalogueEmergencyHospitalEmergencyListItem7',
                    'catalogueEmergencyHospitalEmergencyListItem8',
                    'catalogueEmergencyHospitalEmergencyListItem9'
                ]
            },
            designedFor: {
                text: 'catalogueEmergencyHospitalDesignedText',
                listItems: [
                    'catalogueEmergencyHospitalDesignedListItem1',
                    'catalogueEmergencyHospitalDesignedListItem2',
                    'catalogueEmergencyHospitalDesignedListItem3'
                ]
            },
            personnel: {
                total: 'catalogueEmergencyHospitalPersonnelTotal',
                composition: 'catalogueEmergencyHospitalPersonnelCompoistion'
            },
            standardComponents: {
                text: 'catalogueEmergencyHospitalStandardCompText',
                listItems: [
                    'catalogueEmergencyHospitalStandardCompListItem1',
                    'catalogueEmergencyHospitalStandardCompListItem2',
                    'catalogueEmergencyHospitalStandardCompListItem3',
                    'catalogueEmergencyHospitalStandardCompListItem4',
                    'catalogueEmergencyHospitalStandardCompListItem5',
                    'catalogueEmergencyHospitalStandardCompListItem6'
                ],
                listItemsBoldStart: [
                    'catalogueEmergencyHospitalStandardCompListItemBoldStart1',
                    'catalogueEmergencyHospitalStandardCompListItemBoldStart2',
                    'catalogueEmergencyHospitalStandardCompListItemBoldStart3',
                    'catalogueEmergencyHospitalStandardCompListItemBoldStart4',
                    'catalogueEmergencyHospitalStandardCompListItemBoldStart5',
                    'catalogueEmergencyHospitalStandardCompListItemBoldStart6'
                ]
            },
            specifications: {
                weight: 'catalogueEmergencyHospitalSpecifiationWeight',
                volume: 'catalogueEmergencyHospitalSpecifiationVolume',
                cost: 'catalogueEmergencyHospitalSpecifiationCost',
                nationalSocieties: 'catalogueEmergencyHospitalSpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                listItems: [
                    'catalogueEmergencyHospitalVariationListItem1',
                    'catalogueEmergencyHospitalVariationListItem2',
                    'catalogueEmergencyHospitalVariationListItem3'
                ]
            },
            additionalResources: {
                listItems: [
                    'catalogueEmergencyHospitalResourceText1',
                    'catalogueEmergencyHospitalResourceText2'
                ],
                listItemsUrls: [
                    { text: 'catalogueEmergencyHospitalResourceUrlText1', url: 'https://rodekors.service-now.com/drm?id=hb_catalog&handbook=e3cabf24db361810d40e16f35b9619c7' },
                    { text: 'catalogueEmergencyHospitalResourceUrlText2', url: 'https://www.youtube.com/watch?v=TIW6nf-MPb0' },
                ],
            }
        }
    },
    {
        hash: '#eru-red-cross-red-crescent-emergency-clinic',
        other: false,
        title: 'catalogueEmergencyClinicTitle',
        // images: [
        //     fileStorage + 'health-emergency-clinic_01.jpg',
        //     fileStorage + 'health-emergency-clinic_02.jpg',
        //     fileStorage + 'health-emergency-clinic_03.jpg',
        //     fileStorage + 'health-emergency-clinic_04.jpg',
        //     fileStorage + 'health-emergency-clinic_05.jpg'
        // ],
        
        imgs :
        [{
        src: fileStorage + "health-emergency-clinic_01.jpg",
        thumbnail: fileStorage + "health-emergency-clinic_01.jpg",
        thumbnailWidth: 263,
        thumbnailHeight: 200,
        caption: 'RCRC Emergency clinic'
        },
        {
        src: fileStorage + "health-emergency-clinic_02.jpg",
        thumbnail: fileStorage + "health-emergency-clinic_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'RCRC Clinic in Philippines'
        },

        {
        src: fileStorage + "health-emergency-clinic_03.jpg",
        thumbnail: fileStorage + "health-emergency-clinic_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'RCRC Clinic in Sulawesi, Indonesia'
        },
        {
        src: fileStorage + "health-emergency-clinic_05.jpg",
        thumbnail: fileStorage + "health-emergency-clinic_05.jpg",
        thumbnailWidth: 150,
        thumbnailHeight: 200,
        caption: 'RCRC member with patients in Cox`s Bazar'
        }
    ],


        textSection: {
            capacity: {
                text: 'catalogueEmergencyClinicCapacityText'
            },
            emergencyServices: {
                text: 'catalogueEmergencyClinicEmergencyText',
                listItems: [
                    'catalogueEmergencyClinicEmergencyListItem1',
                    'catalogueEmergencyClinicEmergencyListItem2',
                    'catalogueEmergencyClinicEmergencyListItem3',
                    'catalogueEmergencyClinicEmergencyListItem4',
                    'catalogueEmergencyClinicEmergencyListItem5'
                ]
            },
            designedFor: {
                text: 'catalogueEmergencyClinicDesignedText',
                listItems: [
                    'catalogueEmergencyClinicDesignedListItem1',
                    'catalogueEmergencyClinicDesignedListItem2',
                    'catalogueEmergencyClinicDesignedListItem3'
                ],
            },
            personnel: {
                total: 'catalogueEmergencyClinicPersonnelTotal',
                composition: 'catalogueEmergencyClinicPersonnelCompoistion'
            },
            standardComponents: {
                text: 'catalogueEmergencyClinicStandardCompText',
                listItems: [
                    'catalogueEmergencyClinicStandardCompListItem1',
                    'catalogueEmergencyClinicStandardCompListItem2',
                    'catalogueEmergencyClinicStandardCompListItem3',
                    'catalogueEmergencyClinicStandardCompListItem4',
                    'catalogueEmergencyClinicStandardCompListItem5',
                    'catalogueEmergencyClinicStandardCompListItem6',
                    'catalogueEmergencyClinicStandardCompListItem7',
                    'catalogueEmergencyClinicStandardCompListItem8',
                    'catalogueEmergencyClinicStandardCompListItem9',
                    'catalogueEmergencyClinicStandardCompListItem10',
                    'catalogueEmergencyClinicStandardCompListItem11',
                    'catalogueEmergencyClinicStandardCompListItem12',
                    'catalogueEmergencyClinicStandardCompListItem13',
                    'catalogueEmergencyClinicStandardCompListItem14'
                ],
                listItemsBoldStart: [
                    'catalogueEmergencyClinicStandardCompListItemBoldStart1',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart2',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart3',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart4',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart5',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart6',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart7',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart8',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart9',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart10',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart11',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart12',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart13',
                    'catalogueEmergencyClinicStandardCompListItemBoldStart14'
                ]
            },
            specifications: {
                weight: 'catalogueEmergencyClinicSpecifiationWeight',
                volume: 'catalogueEmergencyClinicSpecifiationVolume',
                cost: 'catalogueEmergencyClinicSpecifiationCost',
                nationalSocieties: 'catalogueEmergencyClinicSpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                listItems: [
                    'catalogueEmergencyClinicVariationListItem1',
                    'catalogueEmergencyClinicVariationListItem2',
                    'catalogueEmergencyClinicVariationListItem3',
                    'catalogueEmergencyClinicVariationListItem4'
                ]
            }
        }
    },
    {
        hash: '#communications-emergency-response-tool-cert-3',
        other: false,
        title: 'catalogueCert3Title',
        // images: [
        //     fileStorage + 'comms-comms_01.jpg',
        //     fileStorage + 'comms-comms_02.jpg',
        //     fileStorage + 'comms-comms_03.jpg'
        // ],
        imgs :
        [{
        src: fileStorage + "comms-comms_01.jpg",
        thumbnail: fileStorage + "comms-comms_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'June 27, 2019. Cox`s Bazar, Bangladesh. "We go door-to-door giving people information about what to do if a storm hits," says Nurjahan (center) a cyclone preparedness volunteer in Cox`s Bazar, Bangladesh.'
        },
        {
        src: fileStorage + "comms-comms_02.jpg",
        thumbnail: fileStorage + "comms-comms_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Gennike Mayers, communications delegate at the IFRC is interviewing 24 year old James Aloute who lives in a tent with his brothers and sisters since the earthquake. He has just received new tarpaulins from the Red Cross to be able to replace the old ones in preparation for the hurricanes.'
        },

        {
        src: fileStorage + "comms-comms_03.jpg",
        thumbnail: fileStorage + "comms-comms_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'FACT Team leader doing a live interview on the situation for BBC'
        },
        ],
        textSection: {
            capacity: {
                text: 'catalogueCert3CapacityText',
                listItems: [
                    'catalogueCert3CapacityListItem1',
                    'catalogueCert3CapacityListItem2',
                    'catalogueCert3CapacityListItem3',
                    'catalogueCert3CapacityListItem4',
                    'catalogueCert3CapacityListItem5',
                    'catalogueCert3CapacityListItem6',
                    'catalogueCert3CapacityListItem7',
                    'catalogueCert3CapacityListItem8'
                ]
            },
            emergencyServices: {
                text: 'catalogueCert3EmergencyText',
                listItems: [
                    'catalogueCert3EmergencyListItem1',
                    'catalogueCert3EmergencyListItem2',
                    'catalogueCert3EmergencyListItem3',
                    'catalogueCert3EmergencyListItem4',
                    'catalogueCert3EmergencyListItem5',
                    'catalogueCert3EmergencyListItem6',
                    'catalogueCert3EmergencyListItem7',
                    'catalogueCert3EmergencyListItem8',
                    'catalogueCert3EmergencyListItem9',
                    'catalogueCert3EmergencyListItem10',
                    'catalogueCert3EmergencyListItem11',
                    'catalogueCert3EmergencyListItem12',
                    'catalogueCert3EmergencyListItem13',
                    'catalogueCert3EmergencyListItem14',
                    'catalogueCert3EmergencyListItem15'
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueCert3DesignedListItem1',
                    'catalogueCert3DesignedListItem2',
                    'catalogueCert3DesignedListItem3',
                    'catalogueCert3DesignedListItem4',
                    'catalogueCert3DesignedListItem5'
                ]
            },
            personnel: {
                total: 'catalogueCert3PersonnelTotal',
                composition: 'catalogueCert3PersonnelCompoistion'
            },
            standardComponents: {
                text: 'catalogueCert3StandardCompText'
            },
            specifications: {
                cost: 'catalogueCert3SpecifiationCost',
                nationalSocieties: 'catalogueCert3SpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#communications-emergency-response-tool-cert-2',
        other: false,
        title: 'catalogueCert2Title',
        // images: [
        //     fileStorage + 'comms-comms_01.jpg',
        //     fileStorage + 'comms-comms_02.jpg',
        //     fileStorage + 'comms-comms_03.jpg'
        // ],
        imgs :
        [{
        src: fileStorage + "comms-comms_01.jpg",
        thumbnail: fileStorage + "comms-comms_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'June 27, 2019. Cox`s Bazar, Bangladesh. "We go door-to-door giving people information about what to do if a storm hits," says Nurjahan (center) a cyclone preparedness volunteer in Cox`s Bazar, Bangladesh.'
        },
        {
        src: fileStorage + "comms-comms_02.jpg",
        thumbnail: fileStorage + "comms-comms_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Gennike Mayers, communications delegate at the IFRC is interviewing 24 year old James Aloute who lives in a tent with his brothers and sisters since the earthquake. He has just received new tarpaulins from the Red Cross to be able to replace the old ones in preparation for the hurricanes.'
        },

        {
        src: fileStorage + "comms-comms_03.jpg",
        thumbnail: fileStorage + "comms-comms_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'FACT Team leader doing a live interview on the situation for BBC'
        },
        ],
        textSection: {
            capacity: {
                text: 'catalogueCert2CapacityText',
                listItems: [
                    'catalogueCert2CapacityListItem1',
                    'catalogueCert2CapacityListItem2',
                    'catalogueCert2CapacityListItem3',
                    'catalogueCert2CapacityListItem4',
                    'catalogueCert2CapacityListItem5',
                    'catalogueCert2CapacityListItem6',
                    'catalogueCert2CapacityListItem7',
                    'catalogueCert2CapacityListItem8'
                ]
            },
            emergencyServices: {
                text: 'catalogueCert2EmergencyText',
                listItems: [
                    'catalogueCert2EmergencyListItem1',
                    'catalogueCert2EmergencyListItem2',
                    'catalogueCert2EmergencyListItem3',
                    'catalogueCert2EmergencyListItem4',
                    'catalogueCert2EmergencyListItem5',
                    'catalogueCert2EmergencyListItem6',
                    'catalogueCert2EmergencyListItem7',
                    'catalogueCert2EmergencyListItem8',
                    'catalogueCert2EmergencyListItem9',
                    'catalogueCert2EmergencyListItem10'
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueCert2DesignedListItem1',
                    'catalogueCert2DesignedListItem2',
                    'catalogueCert2DesignedListItem3',
                    'catalogueCert2DesignedListItem4',
                    'catalogueCert2DesignedListItem5'
                ],
            },
            personnel: {
                total: 'catalogueCert2PersonnelTotal',
                composition: 'catalogueCert2PersonnelCompoistion',
            },
            standardComponents: {
                text: 'catalogueCert2StandardCompText'
            },
            specifications: {
                cost: 'catalogueCert2SpecifiationCost',
                nationalSocieties: 'catalogueCert2SpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#communications-emergency-response-tool-cert-1',
        other: false,
        title: 'catalogueCert1Title',
        // images: [
        //     fileStorage + 'comms-comms_01.jpg',
        //     fileStorage + 'comms-comms_02.jpg',
        //     fileStorage + 'comms-comms_03.jpg'
        // ],
        imgs :
        [{
        src: fileStorage + "comms-comms_01.jpg",
        thumbnail: fileStorage + "comms-comms_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'June 27, 2019. Cox`s Bazar, Bangladesh. "We go door-to-door giving people information about what to do if a storm hits," says Nurjahan (center) a cyclone preparedness volunteer in Cox`s Bazar, Bangladesh.'
        },
        {
        src: fileStorage + "comms-comms_02.jpg",
        thumbnail: fileStorage + "comms-comms_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Gennike Mayers, communications delegate at the IFRC is interviewing 24 year old James Aloute who lives in a tent with his brothers and sisters since the earthquake. He has just received new tarpaulins from the Red Cross to be able to replace the old ones in preparation for the hurricanes.'
        },

        {
        src: fileStorage + "comms-comms_03.jpg",
        thumbnail: fileStorage + "comms-comms_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'FACT Team leader doing a live interview on the situation for BBC'
        },
        ],
        textSection: {
            capacity: {
                text: 'catalogueCert1CapacityText',
                listItems: [
                    'catalogueCert1CapacityListItem1',
                    'catalogueCert1CapacityListItem2',
                    'catalogueCert1CapacityListItem3',
                    'catalogueCert1CapacityListItem4',
                    'catalogueCert1CapacityListItem5',
                    'catalogueCert1CapacityListItem6',
                    'catalogueCert1CapacityListItem7'
                ]
            },
            emergencyServices: {
                text: 'catalogueCert1EmergencyText',
                listItems: [
                    'catalogueCert1EmergencyListItem1',
                    'catalogueCert1EmergencyListItem2',
                    'catalogueCert1EmergencyListItem3',
                    'catalogueCert1EmergencyListItem4',
                    'catalogueCert1EmergencyListItem5',
                    'catalogueCert1EmergencyListItem6'
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueCert1DesignedListItem1',
                    'catalogueCert1DesignedListItem2'
                ],
            },
            personnel: {
                total: 'catalogueCert1PersonnelTotal',
                composition: 'catalogueCert1PersonnelCompoistion',
            },
            standardComponents: {
                text: 'catalogueCert1StandardCompText'
            },
            specifications: {
                cost: 'catalogueCert1SpecifiationCost',
                nationalSocieties: 'catalogueCert1SpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#community-engagement-and-accountability',
        other: false,
        title: 'catalogueCommunityEngagementTitle',
        // images: [
        //     fileStorage + 'cea-cea_01.jpg',
        //     fileStorage + 'cea-cea_02.jpg',
        //     fileStorage + 'cea-cea_03.jpg',
        //     fileStorage + 'cea-cea_04.jpg',
        //     fileStorage + 'cea-cea_05.jpg',
        // ],
        imgs :
        [{
        src: fileStorage + "cea-cea_01.jpg",
        thumbnail: fileStorage + "cea-cea_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: '20-21 September 2018. Philippines, Cagayan province, village of Santa Margarita in the town of Baggao. Barely a week since deadly Typhoon Mangkhut (locally known as Ompong) hit the Philippines, Philippine Red Cross led the distribution of non-food items and hygiene kits to over 400 families. Before the distribution, families were oriented on the proper use of each item.'
        },
        {
        src: fileStorage + "cea-cea_02.jpg",
        thumbnail: fileStorage + "cea-cea_02.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: ''
        },
        {
        src: fileStorage + "cea-cea_03.jpg",
        thumbnail: fileStorage + "cea-cea_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Bangladesh, 2 December 2018 - Children are attending the radio listening programme where information is being provided highlighting particularly Cholera related issues faced by children and the necessary steps for preventing and treating the virus.'
        },
        {
        src: fileStorage + "cea-cea_04.jpg",
        thumbnail: fileStorage + "cea-cea_04.jpg",
        thumbnailWidth: 356,
        thumbnailHeight: 200,
        caption: 'Bangladesh, Kurigram, October 2019 - A BDRCS volunteer with IFRC colleague giving a simple orientation to the flood-affected people who gathered to receive multi-purpose cash grant and seeds support from BDRCS in Kurigram district.'
        },
        {
        src: fileStorage + "cea-cea_05.jpg",
        thumbnail: fileStorage + "cea-cea_05.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'A mobile cinema takes place near the border between Uganda and DRC. The cinema provides a unique and engaging way for communities to get more information about Ebola and how to prevent and protect themselves from its spread. According to polls in this first mobile cinema, there was an average 40 per cent increase in the knowledge about Ebola.'
        }
        ],
        textSection: {
            capacity: {
                text: 'catalogueCommunityEngagementCapacityText'
            },
            emergencyServices: {
                text: 'catalogueCommunityEngagementEmergencyText'
            },
            designedFor: {
                listItems: [
                    'catalogueCommunityEngagementDesignedListItem1',
                    'catalogueCommunityEngagementDesignedListItem2',
                    'catalogueCommunityEngagementDesignedListItem3',
                    'catalogueCommunityEngagementDesignedListItem4',
                    'catalogueCommunityEngagementDesignedListItem5'
                ],
            },
            personnel: {
                total: 'catalogueCommunityEngagementPersonnelTotal',
                composition: 'catalogueCommunityEngagementPersonnelCompoistion'
            }
        }
    },
    {
        hash: '#cva',
        other: false,
        title: 'catalogueCvaTitle',
        // images: [
        //     fileStorage + 'cash-cva_01.jpg',
        //     fileStorage + 'cash-cva_03.jpg',
        //     fileStorage + 'cash-cva_04.jpg',
        //     fileStorage + 'cash-cva_05.jpg',
        //     fileStorage + 'cash-cva_02.jpg'
        // ],
        imgs :
        [{
        src: fileStorage + "cash-cva_01.jpg",
        thumbnail: fileStorage + "cash-cva_01.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Lao Red Cross distributed unconditional cash grants in January 2019 to 1,464 households whose houses were totally destroyed by flash floods in Attapeu after a dam collapse.'
        },
        {
        src: fileStorage + "cash-cva_02.jpg",
        thumbnail: fileStorage + "cash-cva_02.jpg",
        thumbnailWidth: 133,
        thumbnailHeight: 200,
        caption: 'Bangladesh, Sirajganj, 9 Oct 2019 - Morjina, who came to the distribution point with her little granddaughter and daughter, received 4500 Bangladeshi Taka (53 US dollars) and vegetable seeds. More than 28 districts of Bangladesh faced extensive flooding due to heavy monsoon rain and water from upstream regions.'
        },
        {
        src: fileStorage + "cash-cva_03.jpg",
        thumbnail: fileStorage + "cash-cva_03.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Bangladesh, Sirajganj, 9 Oct 2019 - Bangladesh Red Crescent Society distributing cash grants and vegetable seeds to the flood-affected families in Sirajganj. A total of 209 families received 4,500 Bangladeshi Taka (53 US dollars) and eight kinds of vegetable seeds.'
        },
        {
        src: fileStorage + "cash-cva_04.jpg",
        thumbnail: fileStorage + "cash-cva_04.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Lombok, Indonesia, 2019 - One year after a series of earthquakes struck Lombok, Indonesia, the Indonesian Red Cross (Palang Merah Indonesia) has reached over 6,000 families with unconditional cash grants to help with shelter repairs.'
        },
        {
        src: fileStorage + "cash-cva_05.jpg",
        thumbnail: fileStorage + "cash-cva_05.jpg",
        thumbnailWidth: 300,
        thumbnailHeight: 200,
        caption: 'Vietnam, Da Teh, Oct 2019 - In August 2019, the Da Teh district faced extensive flooding due to heavy monsoon rains. Red Cross teams are providing cash grants to the most vulnerable families to rebuild their lives.'
        }
        ],
        textSection: {
            capacity: {
                text: 'catalogueCvaCapacityText'
            },
            emergencyServices: {
                listItems: [
                    'catalogueCvaEmergencyListItem1',
                    'catalogueCvaEmergencyListItem2',
                    'catalogueCvaEmergencyListItem3',
                    'catalogueCvaEmergencyListItem4'
                ]
            },
            designedFor: {
                text: 'catalogueCvaDesignedText',
                assessment: 'catalogueCvaDesignedAssesment',
                responseAnalysis: 'catalogueCvaDesignedResponse',
                setupAndImplementation: 'catalogueCvaDesignedSetup',
                monitoringAndEvaluation: 'catalogueCvaDesignedMonitoring'
            },
            personnel: {
                total: 'catalogueCvaPersonnelTotal',
                compositions: [
                    'catalogueCvaPersonnelCompoistion1',
                    'catalogueCvaPersonnelCompoistion2',
                    'catalogueCvaPersonnelCompoistion3'
                ]
            },
            standardComponents: {
                text: 'catalogueCvaStandardCompText'
            },
            specifications: {
                cost: 'catalogueCvaSpecifiationCost',
                nationalSocieties: 'catalogueCvaSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#eru-base-camp-small',
        other: false,
        title: 'catalogueBaseCampSmallTitle',
        // images: [
        //     fileStorage + 'basecamp-basecamp_01.jpg',
        //     fileStorage + 'basecamp-basecamp_02.jpg',
        //     fileStorage + 'basecamp-basecamp_03.jpg',
        //     fileStorage + 'basecamp-basecamp_04.jpg',
        //     fileStorage + 'basecamp-basecamp_05.jpg',
        // ],
        imgs :
        [{
        src: fileStorage + "basecamp-basecamp_01.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_01.jpg",
        thumbnailHeight: 200,
        caption: 'Basecamp in Philippines.'
        },
        {
        src: fileStorage + "basecamp-basecamp_02.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_02.jpg",
        thumbnailHeight: 200,
        caption: 'The Italian Red Cross works to set up the basecamp in Beira, Mozambique one month after Cyclone Idai hit. 22 April / Beira, Mozambique.'
        },
        {
        src: fileStorage + "basecamp-basecamp_03.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_03.jpg",
        thumbnailHeight: 200,
        caption: 'The Italian Red Cross works to set up the basecamp in Beira, Mozambique one month after Cyclone Idai hit. 22 April 2019 / Beira, Mozambique.'
        },
        {
        src: fileStorage + "basecamp-basecamp_04.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_04.jpg",
        thumbnailHeight: 200,
        caption: 'Earthquake in Haiti 2010, Danish relief ERU team arrives to the Red Cross Headquarters where the basecamp is set up (picture by Jakob Dall).'
        },
        {
        src: fileStorage + "basecamp-basecamp_05.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_05.jpg",
        thumbnailHeight: 200,
        caption: 'Basecamp in Philippines.'
        }
        ],
        textSection: {
            capacity: {
                text: 'catalogueBaseCampSmallCapacityText'
            },
            emergencyServices: {
                listItems: [
                    'catalogueBaseCampSmallEmergencyListItem1',
                    'catalogueBaseCampSmallEmergencyListItem2',
                    'catalogueBaseCampSmallEmergencyListItem3',
                    'catalogueBaseCampSmallEmergencyListItem4',
                    'catalogueBaseCampSmallEmergencyListItem5',
                    'catalogueBaseCampSmallEmergencyListItem6',
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueBaseCampSmallDesignedListItem1',
                    'catalogueBaseCampSmallDesignedListItem2',
                    'catalogueBaseCampSmallDesignedListItem3',
                    'catalogueBaseCampSmallDesignedListItem4'
                ]
            },
            personnel: {
                total: 'catalogueBaseCampSmallPersonnelTotal'
            },
            standardComponents: {
                listItems: [
                    'catalogueBaseCampSmallStandardCompListItem1',
                    'catalogueBaseCampSmallStandardCompListItem2',
                    'catalogueBaseCampLargeStandardCompListItem3',
                    'catalogueBaseCampSmallStandardCompListItem3',
                    'catalogueBaseCampLargeStandardCompListItem7',
                    'catalogueBaseCampLargeStandardCompListItem8',
                    'catalogueBaseCampLargeStandardCompListItem11',
                    'catalogueBaseCampSmallStandardCompListItem4'
                ]
            },
            specifications: {
                weight: 'catalogueBaseCampSmallSpecifiationWeight',
                volume: 'catalogueBaseCampSmallSpecifiationVolume',
                cost: 'catalogueBaseCampSmallSpecifiationCost',
                nationalSocieties: 'catalogueBaseCampSmallSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#eru-base-camp-medium',
        other: false,
        title: 'catalogueBaseCampMediumTitle',
        // images: [
        //     fileStorage + 'basecamp-basecamp_01.jpg',
        //     fileStorage + 'basecamp-basecamp_02.jpg',
        //     fileStorage + 'basecamp-basecamp_03.jpg',
        //     fileStorage + 'basecamp-basecamp_04.jpg',
        //     fileStorage + 'basecamp-basecamp_05.jpg',
        // ],
        imgs :
        [{
        src: fileStorage + "basecamp-basecamp_01.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_01.jpg",
        thumbnailHeight: 200,
        caption: 'Basecamp in Philippines.'
        },
        {
        src: fileStorage + "basecamp-basecamp_02.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_02.jpg",
        thumbnailHeight: 200,
        caption: 'The Italian Red Cross works to set up the basecamp in Beira, Mozambique one month after Cyclone Idai hit. 22 April / Beira, Mozambique.'
        },
        {
        src: fileStorage + "basecamp-basecamp_03.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_03.jpg",
        thumbnailHeight: 200,
        caption: 'The Italian Red Cross works to set up the basecamp in Beira, Mozambique one month after Cyclone Idai hit. 22 April 2019 / Beira, Mozambique.'
        },
        {
        src: fileStorage + "basecamp-basecamp_04.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_04.jpg",
        thumbnailHeight: 200,
        caption: 'Earthquake in Haiti 2010, Danish relief ERU team arrives to the Red Cross Headquarters where the basecamp is set up (picture by Jakob Dall).'
        },
        {
        src: fileStorage + "basecamp-basecamp_05.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_05.jpg",
        thumbnailHeight: 200,
        caption: 'Basecamp in Philippines.'
        }
        ],

        textSection: {
            capacity: {
                text: 'catalogueBaseCampMediumCapacityText'
            },
            emergencyServices: {
                listItems: [
                    'catalogueBaseCampMediumEmergencyListItem1',
                    'catalogueBaseCampMediumEmergencyListItem2',
                    'catalogueBaseCampMediumEmergencyListItem3',
                    'catalogueBaseCampMediumEmergencyListItem4',
                    'catalogueBaseCampMediumEmergencyListItem5',
                    'catalogueBaseCampMediumEmergencyListItem6',
                    'catalogueBaseCampMediumEmergencyListItem7'
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueBaseCampMediumDesignedListItem1',
                    'catalogueBaseCampMediumDesignedListItem2',
                    'catalogueBaseCampMediumDesignedListItem3',
                    'catalogueBaseCampMediumDesignedListItem4',
                    'catalogueBaseCampMediumDesignedListItem5'
                ]
            },
            personnel: {
                total: 'catalogueBaseCampMediumPersonnelTotal',
                composition: 'catalogueBaseCampMediumPersonnelCompoistion',
                subText: 'catalogueBaseCampMediumPersonnelSubText'
            },
            standardComponents: {
                listItems: [
                    'catalogueBaseCampLargeStandardCompListItem1',
                    'catalogueBaseCampLargeStandardCompListItem2',
                    'catalogueBaseCampLargeStandardCompListItem3',
                    'catalogueBaseCampLargeStandardCompListItem4',
                    'catalogueBaseCampLargeStandardCompListItem5',
                    'catalogueBaseCampLargeStandardCompListItem6',
                    'catalogueBaseCampLargeStandardCompListItem7',
                    'catalogueBaseCampLargeStandardCompListItem8',
                    'catalogueBaseCampLargeStandardCompListItem9',
                    'catalogueBaseCampLargeStandardCompListItem10',
                    'catalogueBaseCampLargeStandardCompListItem11',
                    'catalogueBaseCampMediumStandardCompListItem1'
                ]
            },
            specifications: {
                volume: 'catalogueBaseCampMediumSpecifiationVolume',
                cost: 'catalogueBaseCampMediumSpecifiationCost',
                nationalSocieties: 'catalogueBaseCampMediumSpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                text: 'catalogueBaseCampMediumVariationText'
            }
        }
    },
    {
        hash: '#eru-base-camp-large',
        other: false,
        title: 'catalogueBaseCampLargeTitle',
        // images: [
        //     fileStorage + 'basecamp-basecamp_01.jpg',
        //     fileStorage + 'basecamp-basecamp_02.jpg',
        //     fileStorage + 'basecamp-basecamp_03.jpg',
        //     fileStorage + 'basecamp-basecamp_04.jpg',
        //     fileStorage + 'basecamp-basecamp_05.jpg',
        // ],
        imgs :
        [{
        src: fileStorage + "basecamp-basecamp_01.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_01.jpg",
        thumbnailHeight: 200,
        caption: 'Basecamp in Philippines.'
        },
        {
        src: fileStorage + "basecamp-basecamp_02.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_02.jpg",
        thumbnailHeight: 200,
        caption: 'The Italian Red Cross works to set up the basecamp in Beira, Mozambique one month after Cyclone Idai hit. 22 April / Beira, Mozambique.'
        },
        {
        src: fileStorage + "basecamp-basecamp_03.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_03.jpg",
        thumbnailHeight: 200,
        caption: 'The Italian Red Cross works to set up the basecamp in Beira, Mozambique one month after Cyclone Idai hit. 22 April 2019 / Beira, Mozambique.'
        },
        {
        src: fileStorage + "basecamp-basecamp_04.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_04.jpg",
        thumbnailHeight: 200,
        caption: 'Earthquake in Haiti 2010, Danish relief ERU team arrives to the Red Cross Headquarters where the basecamp is set up (picture by Jakob Dall).'
        },
        {
        src: fileStorage + "basecamp-basecamp_05.jpg",
        thumbnail: fileStorage + "basecamp-basecamp_05.jpg",
        thumbnailHeight: 200,
        caption: 'Basecamp in Philippines.'
        }
        ],

        textSection: {
            capacity: {
                text: 'catalogueBaseCampLargeCapacityText'
            },
            emergencyServices: {
                listItems: [
                    'catalogueBaseCampLargeEmergencyListItem1',
                    'catalogueBaseCampLargeEmergencyListItem2',
                    'catalogueBaseCampLargeEmergencyListItem3',
                    'catalogueBaseCampLargeEmergencyListItem4',
                    'catalogueBaseCampLargeEmergencyListItem5',
                    'catalogueBaseCampLargeEmergencyListItem6',
                    'catalogueBaseCampLargeEmergencyListItem7',
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueBaseCampLargeDesignedListItem1',
                    'catalogueBaseCampLargeDesignedListItem2',
                    'catalogueBaseCampLargeDesignedListItem3',
                    'catalogueBaseCampLargeDesignedListItem4',
                    'catalogueBaseCampLargeDesignedListItem5'
                ]
            },
            personnel: {
                total: 'catalogueBaseCampLargePersonnelTotal',
                composition: 'catalogueBaseCampLargePersonnelCompoistion',
                subText: 'catalogueBaseCampLargePersonnelSubText'
            },
            standardComponents: {
                listItems: [
                    'catalogueBaseCampLargeStandardCompListItem1',
                    'catalogueBaseCampLargeStandardCompListItem2',
                    'catalogueBaseCampLargeStandardCompListItem3',
                    'catalogueBaseCampLargeStandardCompListItem4',
                    'catalogueBaseCampLargeStandardCompListItem5',
                    'catalogueBaseCampLargeStandardCompListItem6',
                    'catalogueBaseCampLargeStandardCompListItem7',
                    'catalogueBaseCampLargeStandardCompListItem8',
                    'catalogueBaseCampLargeStandardCompListItem9',
                    'catalogueBaseCampLargeStandardCompListItem10',
                    'catalogueBaseCampLargeStandardCompListItem11',
                    'catalogueBaseCampLargeStandardCompListItem12'
                ]
            },
            specifications: {
                volume: 'catalogueBaseCampLargeSpecifiationVolume',
                cost: 'catalogueBaseCampLargeSpecifiationCost',
                nationalSocieties: 'catalogueBaseCampLargeSpecifiationNationalSocieties'
            },
            variationOnConfiguration: {
                text: 'catalogueBaseCampLargeVariationText'
            }
        }
    },
    {
        hash: '#facility-management',
        other: false,
        title: 'catalogueFacilityManagementTitle',
        textSection: {
            emergencyServices: {
                listItems: [
                    'catalogueFacilityManagementEmergencyListItem1',
                    'catalogueFacilityManagementEmergencyListItem2'
                ]
            },
            designedFor: {
                listItems: [
                    'catalogueFacilityManagementDesignedListItem1',
                    'catalogueFacilityManagementDesignedListItem2'
                ]
            },
            personnel: {
                text: 'catalogueFacilityManagementPersonnelText'
            },
            standardComponents: {
                text: 'catalogueFacilityManagementStandardCompText'
            },
            specifications: {
                weight: 'catalogueSpecificationDefaultValue',
                volume: 'catalogueSpecificationDefaultValue',
                cost: 'catalogueSpecificationDefaultValue',
                nationalSocieties: 'catalogueFacilityManagementSpecifiationNationalSocieties'
            }
        }
    },
    {
        hash: '#assessment-cell',
        other: false,
        title: 'catalogueAssesmentTitle',
        // images: [
        //     fileStorage + 'assessment-cell_01.jpg',
        //     fileStorage + 'assessment-cell_02.jpg',
        //     fileStorage + 'assessment-cell_03.jpg',
        //     fileStorage + 'assessment-cell_04.jpg'
        // ],
        imgs :
        [{
        src: fileStorage + "assessment-cell_01.jpg",
        thumbnail: fileStorage + "assessment-cell_01.jpg",
        thumbnailHeight: 200,
        caption: 'Samoa RC Volunteer getting primary data from a community member.'
        },
        {
        src: fileStorage + "assessment-cell_02.jpg",
        thumbnail: fileStorage + "assessment-cell_02.jpg",
        thumbnailHeight: 200,
        caption: 'Bangladesh, Khulna, 12 Nov 2019 - After extreme severe tropical cyclonic storm `Bulbul`, Bangladesh Red Crescent Society and its Movement partners including the IFRC conducting rapid needs assessment.'
        },
        {
        src: fileStorage + "assessment-cell_03.jpg",
        thumbnail: fileStorage + "assessment-cell_03.jpg",
        thumbnailHeight: 200,
        caption: 'Mozambique TC Idai operation. Sharing information with stakeholders.'
        },
        {
        src: fileStorage + "assessment-cell_04.jpg",
        thumbnail: fileStorage + "assessment-cell_04.jpg",
        thumbnailHeight: 200,
        caption: 'Bangladesh Red Crescent and Movement partners conducting key informants interviews.'
        },
        ],
        textSection: {
            capacity: {
                text: 'catalogueAssesmentCapacityText'
            },
            emergencyServices: {
                text: 'catalogueAssesmentEmergencyText',
                listItems: [
                    'catalogueAssesmentEmergencyListItem1',
                    'catalogueAssesmentEmergencyListItem2',
                    'catalogueAssesmentEmergencyListItem3',
                    'catalogueAssesmentEmergencyListItem4',
                    'catalogueAssesmentEmergencyListItem5',
                    'catalogueAssesmentEmergencyListItem6',
                    'catalogueAssesmentEmergencyListItem7',
                    'catalogueAssesmentEmergencyListItem8',
                    'catalogueAssesmentEmergencyListItem9',
                    'catalogueAssesmentEmergencyListItem10'
                ]
            },
            designedFor: {
                text: 'catalogueAssesmentDesignedText'
            },
            personnel: {
                total: 'catalogueAssesmentPersonnelTotal',
                composition: 'catalogueAssesmentPersonnelCompoistion'
            },
            variationOnConfiguration: {
                text: 'catalogueAssesmentVariationText'
            }
        }
    },
    {
        hash: '#civil-military-relations',
        other: true,
        title: 'catalogueOtherService1Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService1Text1',
                urls: []
            },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService1Text2',
                urls: [
                    { text: 'catalogueOtherService1Text2Url', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Civ-Mil%20Relations%20Coordinator.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#disaster-risk-reduction-drr',
        other: true,
        title: 'catalogueOtherService2Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService2Text1',
                urls: []
            },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService2Text2',
                urls: [
                    { text: 'catalogueOtherService2Text2Url', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Disaster%20Risk%20Reduction%20and%20Climate%20Action%20Coordinator.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#human-resources',
        other: true,
        title: 'catalogueOtherService3Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService3Text1',
                urls: []
            },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService3Text2',
                urls: [
                    { text: 'catalogueOtherService3Text2Url', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Human%20Resources%20Coordinator.pdf' },
                    /* coming soon not wanted 6
                    { text: 'catalogueOfSurgeServicesHealthCards1Card1Element5', url: '' }
                    */
                ]
            }
        ]
    },
    {
        hash: '#international-disaster-response-law',
        other: true,
        title: 'catalogueOtherService4Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService4Text1',
                urls: []
            },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService4Text2',
                urls: [
                    { text: 'catalogueOtherService4Text2Url', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20International%20Disaster%20Response%20Law%20Coordinator%20-%20Emergency%20Phase.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#migration',
        other: true,
        title: 'catalogueOtherService5Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService5Text1',
                urls: []
            },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService5Text2',
                urls: [
                    { text: 'catalogueOtherService5Text2Url', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Migration%20and%20Displacement%20Coordinator.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#national-society-development',
        other: true,
        title: 'catalogueOtherService6Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService6Text1',
                urls: []
            },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService6Text2',
                urls: [
                    { text: 'catalogueOtherService6Text2Url1', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20NS%20Development%20in%20Emergencies%20Coordinator.pdf' },
                    { text: 'catalogueOtherService6Text2Url2', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Volunteer%20Management%20in%20Emergencies%20Officer.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#partnership-and-resource-development',
        other: true,
        title: 'catalogueOtherService7Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService7Text1',
                urls: []
            },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService7Text2',
                urls: [
                    { text: 'catalogueOtherService7Text2Url1', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Partnerships%20and%20Resource%20Development%20Officer.pdf' },
                    { text: 'catalogueOtherService7Text2Url2', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20PRD%20Officer%20National%20Society%20Support.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#preparedness-for-effective-response-per',
        other: true,
        title: 'catalogueOtherService8Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService8Text1',
                urls: []
            },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService8Text2',
                urls: [
                    { text: 'catalogueOtherService8Text2Url1', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Preparedness%20for%20Effective%20Response%20Coordinator.pdf' },
                    { text: 'catalogueOtherService8Text2Url2', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20National%20Society%20Preparedness%20for%20Effective%20Response%20Officer.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#recovery',
        other: true,
        title: 'catalogueOtherService9Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService9Text1',
                urls: []
            },
            {
                title: 'catalogueOtherServiceTextTitle3',
                text: 'catalogueOtherService9Text2',
                urls: [
                    { text: 'catalogueOtherService9Text2Url', url: 'https://ifrcgo.org/global-services/assets/docs/other/Recovery%20Technical%20Competency%20Framework%20March%202020.pdf' }
                ]
            },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService9Text3',
                urls: [
                    { text: 'catalogueOtherService9Text3Url1', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Recovery%20Coordinator.pdf' },
                    { text: 'catalogueOtherService9Text3Url2', url: 'https://ifrcgo.org/global-services/assets/docs/other/Rapid%20Response%20Profile%20Early%20Recovery%20Officer.pdf' }
                ]
            }
        ]
    },
    {
        hash: '#greenresponse',
        other: true,
        title: 'catalogueOtherService10Title',
        textSection: [
            {
                title: 'catalogueOtherServiceTextTitle1',
                text: 'catalogueOtherService10Text1',
                urls: []
            },
            // {
            //     title: 'catalogueOtherServiceTextTitle3',
            //     text: 'catalogueOtherService10Text2',
            //     urls: [
            //         { text: 'catalogueOtherService10Text2Url', url: 'https://ifrcgo.org/global-services/assets/docs/other/Recovery%20Technical%20Competency%20Framework%20March%202020.pdf' }
            //     ]
            // },
            {
                title: 'catalogueOtherServiceTextTitle2',
                text: 'catalogueOtherService10Text3',
                urls: [
                    { text: 'catalogueOtherService10Text3Url1', url: 'https://ifrcorg.sharepoint.com/:b:/s/IFRCSharing/Eadht7nkd0BGj2Hl_QUyvOMBJrIGZdgotLzPjGs6rJrXDA?e=Vay5KV' },
                    
                ]
            }
        ]
    },
    {
        hash: '#Satellite-imagery',
        other: false,
        title: 'catalogueOfSurgeServicesInformationManSatelliteImagery',
        textSection: {
            satelliteImagery: {
                texts: [
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText1',
                    '',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText2'
                ],
                urls: [
                    { text: 'catalogueOfSurgeServicesInformationManSatelliteImageryLinkText1', url: 'https://americanredcross.github.io/images-from-above/index.html' },
                    { text: 'catalogueOfSurgeServicesInformationManSatelliteImageryLinkText2', url: 'https://docs.google.com/spreadsheets/d/1IGxQVIRF0PkNXNXUcEA9_dz66-U2MCPRzN5O1hol1Mg/edit#gid=1206256283' },
                    { text: '', url:''}
            
                ],
                textsWithUrlOrder: [
                    { text: 0, url: 0 },
                    { text: 1, url: 1 },
                    { text: 2, url: 2 }
                ]
            },
            whatsNeeded: {
                texts: [
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText3',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText4',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryList1',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryList2',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryList3',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryList4'
                ],
                urls: [
                    { text: 'catalogueOfSurgeServicesInformationManSatelliteImageryLinkText3', url: 'https://americanredcross.github.io/images-from-above/index.html' },
                    { text: '', url: '' },
                    { text: '', url:''},
                    { text: '', url: '' },
                    { text: '', url:''},
                    { text: '', url: '' },
                ],
                textsWithUrlOrder: [
                    { text: 0, url: 0 },
                    { text: 1, url: 1 },
                    { text: 2, url: 2 },
                    { text: 3, url: 3 },
                    { text: 4, url: 4 },
                    { text: 5, url: 5 }
                ]
            },
            analysisSources: {
                text: 'catalogueOfSurgeServicesInformationManSatelliteImageryText5' 
            },
            unosat: {
                texts: [
                    '',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText6',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText7',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText8a',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText8b',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText9a',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText9b',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText10',
                    'catalogueOfSurgeServicesInformationManSatelliteImageryText11'
                ],
                urls: [
                    { text: 'catalogueOfSurgeServicesInformationManSatelliteImageryLinkText7', url: 'https://www.unitar.org/maps' },
                    { text: 'catalogueOfSurgeServicesInformationManSatelliteImageryLinkText4', url: 'https://www.unitar.org/maps' },
                    { text: 'catalogueOfSurgeServicesInformationManSatelliteImageryLinkText5', url: 'http://smcs.unosat.org/' },
                    { text: 'catalogueOfSurgeServicesInformationManSatelliteImageryLinkText6', url: 'https://www.unitar.org/maps/unosat-rapid-mapping-service' },
                    { text: '', url:''},
                    { text: '', url: '' },
                    { text: '', url:''},
                    { text: '', url: '' },
                    { text: '', url: '' }

                ],
                textsWithUrlOrder: [
                    { text: 0, url: 0 },
                    { text: 1, url: 4 },
                    { text: 2, url: 5 },
                    { text: 3, url: 1 },
                    { text: 4, url: 6 },
                    { text: 5, url: 2 },
                    { text: 6, url: 6 },
                    { text: 7, url: 3 },
                    { text: 8, url: 8}


                ]
            },
        }
    }

    
];

export default CatalogueOfSurgeServiceSubpageContent;