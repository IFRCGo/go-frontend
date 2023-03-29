import SharepointLink from './map-pdf-to-sharepoint';
const CatalogueOfSurgeServicesContent = [
    {
        hash: "#emergency",
        sectionTitle: "catalogueOfSurgeServicesSelectorEmergency",
        sectionText: "catalogueOfSurgeServicesEmergencySectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesEmergencyCards1Card1Element1",
                                url: SharepointLink['Assessment Coordinator.pdf'],
                            },
                            {
                                name: "catalogueOfSurgeServicesEmergencyCards1Card1Element2",
                                url: SharepointLink["Assessment Humanitarian Information Analysis Officer.pdf"],
                            },
                            {
                                name: "catalogueOfSurgeServicesEmergencyCards1Card1Element3",
                                url: SharepointLink["Assessment Primary Data Collection Officer.pdf"],
                            },
                            {
                                name: "catalogueOfSurgeServicesEmergencyCards1Card1Element4",
                                url: SharepointLink["Assessment Mapping and Visualization Officer.pdf"],
                            }
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesEmergencyCards1Card2BtnText',
                                url: SharepointLink["Assessment Technical Competency Framework.pdf"]
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesEmergencyCards2Card1Title',
                        cardText: 'catalogueOfSurgeServicesEmergencyCards2Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesEmergencyCards2Card1BtnText',
                        url: '#assessment-cell'
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleAdditionalResources",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesEmergencyCards3Card1Title',
                        cardText: 'catalogueOfSurgeServicesEmergencyCards3Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesEmergencyCards3Card1BtnText',
                        url: 'https://idp.ifrc.org/SSO/SAMLLogin?loginToSp=https://fednet.ifrc.org&returnUrl=https://fednet.ifrc.org/en/resources/disasters/disaster-and-crisis-mangement/assessment--planning/'
                    }
                ]
            }
        ]
    },
    {
        hash: "#basecamp",
        sectionTitle: "catalogueOfSurgeServicesSelectorBasecamp",
        sectionText: "catalogueOfSurgeServicesBasecampSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: "textBtn",
                        cardTitle: "catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit",
                        cardText: "catalogueOfSurgeServicesBasecampCards1CardText1",
                        cardBtnText: "catalogueOfSurgeServicesBasecampCards1CardBtnText1",
                        url: '#eru-base-camp-small'
                    },
                    {
                        cardType: "textBtn",
                        cardTitle: "catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit",
                        cardText: "catalogueOfSurgeServicesBasecampCards1CardText2",
                        cardBtnText: "catalogueOfSurgeServicesBasecampCards1CardBtnText2",
                        url: '#eru-base-camp-medium'
                    },
                    {
                        cardType: "textBtn",
                        cardTitle: "catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit",
                        cardText: "catalogueOfSurgeServicesBasecampCards1CardText3",
                        cardBtnText: "catalogueOfSurgeServicesBasecampCards1CardBtnText3",
                        url: '#eru-base-camp-large'
                    },
                    {
                        cardType: "textBtn",
                        cardTitle: "catalogueOfSurgeServicesBasecampCards1CardTitle2",
                        cardText: "catalogueOfSurgeServicesBasecampCards1CardText4",
                        cardBtnText: "catalogueOfSurgeServicesCardBtnTextLearnMore",
                        url: '#facility-management'
                    }
                ]
            }
        ]
    },
    {
        hash: "#cash",
        sectionTitle: "catalogueOfSurgeServicesSelectorCash",
        sectionText: "catalogueOfSurgeServicesCashSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesCashCards1Card1Element1",
                                url: SharepointLink['Cash and Voucher Assistance Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesCashCards1Card1Element2",
                                url: SharepointLink['Cash and Voucher Assistance Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesCashCards1Card1Element3",
                                url: SharepointLink['Cash and Voucher Assistance IM Officer.pdf']
                            }
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesCashCards1Card2BtnText',
                                url: SharepointLink['CVA Technical Competency Framework.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponse',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesCashCards1Card2BtnText',
                        url: '#cva'
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleAdditionalResources",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCashCards2Card1Title',
                        cardText: 'catalogueOfSurgeServicesCashCards2Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.cash-hub.org/guidance-and-tools/cash-in-emergencies-toolkit'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCashCards2Card2Title',
                        cardText: 'catalogueOfSurgeServicesCashCards2Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://cash-hub.org/'
                    }
                ]
            }
        ]
    },
    {
        hash: '#community',
        sectionTitle: 'catalogueOfSurgeServicesSelectorCommunity',
        sectionText: '',
        sectionCards: [
            {
                cardsTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel',
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: 'catalogueOfSurgeServicesCardTitleRoleProfiles',
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesCommunityCards1Card1Element1",
                                url: SharepointLink['CEA Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesCommunityCards1Card1Element2",
                                url: SharepointLink['CEA Officer (Accountability).pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesCommunityCards1Card1Element3",
                                url: SharepointLink['CEA Officer (RCCE).pdf']
                            }
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesCommunityCards1Card2BtnText',
                                url: SharepointLink['CEA Technical Competency Framework.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: 'catalogueOfSurgeServicesCardsTitleServices',
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponse',
                        cardText: 'catalogueOfSurgeServicesSelectorCommunity',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#community-engagement-and-accountability'
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleAdditionalResources",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCommunityCards1Card2BtnText',
                        cardText: 'catalogueOfSurgeServicesCommunityCards2Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.ifrc.org/CEA'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCommunityCards2Card2Title',
                        cardText: 'catalogueOfSurgeServicesCommunityCards2Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.communityengagementhub.org/'
                    }
                ]
            }
        ]
    },
    {
        hash: '#communications',
        sectionTitle: "catalogueOfSurgeServicesSelectorCommunications",
        sectionText: "catalogueOfSurgeServicesCommunicationSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesCommunicationCards1Card1Element1",
                                url: SharepointLink['Communications Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesCommunicationCards1Card1Element2",
                                url: SharepointLink['Communications Team Leader.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesCommunicationCards1Card1Element5",
                                url: SharepointLink['Communications Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesCommunicationCards1Card1Element6",
                                url: SharepointLink['AV Officer Role Profile.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesCommunicationCards1Card1Element4",
                                url: SharepointLink['AV Officer - Photographer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesCommunicationCards1Card1Element3",
                                url: SharepointLink['AV Officer - Videographer.pdf']
                            }
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesSelectorCommunications',
                                url: SharepointLink['Communications Technical Competency Framework.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: 'catalogueOfSurgeServicesCardsTitleServices',
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponse',
                        cardText: 'catalogueOfSurgeServicesCommunicationCards2Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#communications-emergency-response-tool-cert-1'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponse',
                        cardText: 'catalogueOfSurgeServicesCommunicationCards2Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#communications-emergency-response-tool-cert-2'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponse',
                        cardText: 'catalogueOfSurgeServicesCommunicationCards2Card3Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#communications-emergency-response-tool-cert-3'
                    }
                ]
            }
        ]
    },
    {
        hash: '#health',
        sectionTitle: "catalogueOfSurgeServicesSelectorHealth",
        sectionText: "catalogueOfSurgeServicesCommunicationSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: 'catalogueOfSurgeServicesCardTitleRoleProfiles',
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesHealthCards1Card1Element1",
                                url: SharepointLink['Health Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesHealthCards1Card1Element2",
                                url: SharepointLink['Medical Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesHealthCards1Card1Element3",
                                url: SharepointLink['Public Health in Emergencies Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesHealthCards1Card1Element4",
                                url: SharepointLink['Safe and Dignified Burials Coordinator.pdf']
                            },
                            
                            {
                                name: "catalogueOfSurgeServicesHealthCards1Card1Element6",
                                url: SharepointLink['Mental Health and Psychosocial Support Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesHealthCards1Card1Element7",
                                url: SharepointLink['MHPSS Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesHealthCards1Card1Element8",
                                url: SharepointLink['MHPSS Community Outreach Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesHealthCards1Card1Element9",
                                url: SharepointLink['ERU health facility MHPSS Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesHealthCards1Card1Element10",
                                url: SharepointLink['HEALTH Information Management.pdf']
                            }
                        ]
                    },
                    {
                        cardType: 'textFolder',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleHealthERU',
                        folders: [
                            {
                                btnText: "catalogueOfSurgeServicesHealthCards1Card1Element11",
                                url: SharepointLink['Emergency Clinic']
                            },
                            {
                                btnText: "catalogueOfSurgeServicesHealthCards1Card1Element12",
                                url: SharepointLink['Public Health']
                            },
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesSelectorHealth',
                                url: SharepointLink['Health Technical Competency Framework.pdf']
                            },
                            {
                                btnText: 'catalogueOfSurgeServicesHealthCards1Card2BtnText',
                                url: SharepointLink['Health PSS.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: 'catalogueOfSurgeServicesCardsTitleServices',
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle1',
                        cardText: 'catalogueOfSurgeServicesHealthCards2Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card1BtnText',
                        url: '#eru-red-cross-red-crescent-emergency-clinic'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle1',
                        cardText: 'catalogueOfSurgeServicesHealthCards2Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card2BtnText',
                        url: '#eru-red-cross-red-crescent-emergency-hospital'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle2',
                        cardText: 'catalogueOfSurgeServicesHealthCards2Card3Text',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card3BtnText',
                        url: '#surgical-surge'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle2',
                        cardText: 'catalogueOfSurgeServicesHealthCards2Card4Text',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card4BtnText',
                        url: '#maternal-newborn-health-clinic'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle2',
                        cardText: 'catalogueOfSurgeServicesHealthCards2Card5Text',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card5BtnText',
                        url: '#emergency-mobile-clinic'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle1',
                        cardText: 'catalogueOfSurgeServicesHealthCards2Card6Text',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card6BtnText',
                        url: '#eru-cholera-treatment-center'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle3',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card7BtnText',
                        url: '#community-case-management-of-cholera-ccmc'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle3',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card8BtnText',
                        url: '#community-based-surveillance-cbs'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle3',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card9BtnText',
                        url: '#safe-and-dignified-burials'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle3',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card10BtnText',
                        url: '#community-case-management-of-malnutrition-ccmm'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle4',
                        cardText: 'catalogueOfSurgeServicesHealthCards2Card11Text',
                        cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card11BtnText',
                        url: '#eru-pss-module'
                    }
                    // {
                    //     cardType: 'textBtn',
                    //     cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle3',
                    //     cardText: 'catalogueOfSurgeServicesHealthCards2Card12Text',
                    //     cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card12BtnText',
                    //     url: ''
                    // },
                    // {
                    //     cardType: 'textBtn',
                    //     cardTitle: 'catalogueOfSurgeServicesHealthCards2CardTitle3',
                    //     cardText: 'catalogueOfSurgeServicesHealthCards2Card13Text',
                    //     cardBtnText: 'catalogueOfSurgeServicesHealthCards2Card13BtnText',
                    //     url: ''
                    // }
                ]
            }
        ]
    },
    {
        hash: "#infoMgt",
        sectionTitle: "catalogueOfSurgeServicesSelectorInformationMan",
        sectionText: "",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesInformationManCards1Card1Element1",
                                url: SharepointLink['IM Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesInformationManCards1Card1Element2",
                                url: SharepointLink['Humanitarian Information Analysis Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesInformationManCards1Card1Element3",
                                url: SharepointLink['Primary Data Collection Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesInformationManCards1Card1Element4",
                                url: SharepointLink['Mapping and Visualization Officer.pdf']
                            },


                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [

                            {
                                btnText: 'catalogueOfSurgeServicesInformationManCards1Card1Element5',
                                url: SharepointLink["Assessment Technical Competency Framework.pdf"]
                            }
                        ]
                    }
                ]
            },

            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtnExt',
                        cardTitle: 'catalogueOfSurgeServicesInformationManSubtitle6Text1',
                        cardText: 'catalogueOfSurgeServicesInformationManSubtitle6Text2',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://rcrcsims.org/'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesInformationManSubtitle6Text3',
                        cardText: 'catalogueOfSurgeServicesInformationManSubtitle6Text4',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#Satellite-imagery'
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleAdditionalResources",
                cards: [
                    {
                        cardType: 'textBtnSimple',
                        cardTitle: 'catalogueOfSurgeServicesInformationManSubtitle7Text7',
                        cardText: 'catalogueOfSurgeServicesInformationManSubtitle7Text8',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#roles-and-resps'
                    },
                    {
                        cardType: 'textBtnSimple',
                        cardTitle: 'catalogueOfSurgeServicesInformationManSubtitle7Text9',
                        cardText: 'catalogueOfSurgeServicesInformationManSubtitle7Text10',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#im-support-for-op'
                    },
                    {
                        cardType: 'textBtnSimple',
                        cardTitle: 'catalogueOfSurgeServicesInformationManSubtitle7Text11',
                        cardText: 'catalogueOfSurgeServicesInformationManSubtitle7Text12',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#ifrc-geneva-im'
                    },
                    {
                        cardType: 'textBtnSimple',
                        cardTitle: 'catalogueOfSurgeServicesInformationManSubtitle7Text13',
                        cardText: 'catalogueOfSurgeServicesInformationManSubtitle7Text14',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#composition-of-im-res'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesInformationManSubtitle7Text1',
                        cardText: 'catalogueOfSurgeServicesInformationManSubtitle7Text2',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://go-user-library.ifrc.org/'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesInformationManSubtitle7Text3',
                        cardText: 'catalogueOfSurgeServicesInformationManSubtitle7Text4',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.ifrc.org/ifrc-kobotoolbox#'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesInformationManSubtitle7Text5',
                        cardText: 'catalogueOfSurgeServicesInformationManSubtitle7Text6',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://deephelp.zendesk.com/hc/en-us/articles/360041904812-4-DEEP-Using-the-DEEP-Platform-'
                    }
                ]
            }

        ]
    },
    {
        hash: "#informationTech",
        sectionTitle: "catalogueOfSurgeServicesSelectorInformationTech",
        sectionText: "catalogueOfSurgeServicesInformationTechSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesInformationTechCards1Card1Element1",
                                url: SharepointLink['IT and Telecom Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesInformationTechCards1Card1Element2",
                                url: SharepointLink['IT and Telecom Officer.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit',
                        cardText: 'catalogueOfSurgeServicesInformationTechCards2Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#eru-it-telecom'
                    }
                ]
            }
        ]
    },
    {
        hash: "#livelihoods",
        sectionTitle: "catalogueOfSurgeServicesSelectorLivelihoods",
        sectionText: "catalogueOfSurgeServicesLivelihoodsSectionText",
        sectionCards: [
            /* coming soon not wanted 1
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesLivelihoodsCards1Card1Element1",
                                url: ''
                            },
                            {
                                name: "catalogueOfSurgeServicesLivelihoodsCards1Card1Element2",
                                url: ''
                            },
                            {
                                name: "catalogueOfSurgeServicesLivelihoodsCards1Card1Element3",
                                url: ''
                            }
                        ]
                    }
                ]
            },
            */
            {
                cardsTitle: 'catalogueOfSurgeServicesCardsTitleServices',
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponse',
                        cardText: 'catalogueOfSurgeServicesSelectorLivelihoods',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#livelihoods-and-basic-needs'
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleAdditionalResources",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesLivelihoodsCards3Card1Title',
                        cardText: 'catalogueOfSurgeServicesLivelihoodsCards3Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.livelihoodscentre.org/'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesLivelihoodsCards3Card2Title',
                        cardText: 'catalogueOfSurgeServicesLivelihoodsCards3Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.livelihoodscentre.org/toolbox-intro'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesLivelihoodsCards3Card3Title',
                        cardText: 'catalogueOfSurgeServicesLivelihoodsCards3Card3Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.livelihoodscentre.org/indi'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesLivelihoodsCards3Card4Title',
                        cardText: 'catalogueOfSurgeServicesLivelihoodsCards3Card4Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.livelihoodscentre.org/documents/20720/100145/HES_Guidelines+3.0+(2014)/92cb5220-9278-4cd2-9fa7-1f5af063f3b7'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesLivelihoodsCards3Card5Title',
                        cardText: 'catalogueOfSurgeServicesLivelihoodsCards3Card5Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.livelihoodscentre.org/documents/20720/100145/IFRC+Livelihoods+Guidelines_EN.PDF/9d230644-9b02-4249-8252-0d37e79ad346'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesLivelihoodsCards3Card6Title',
                        cardText: 'catalogueOfSurgeServicesLivelihoodsCards3Card6Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.ifrc.org/Global/global-fsa-guidelines-en.pdf'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesLivelihoodsCards3Card7Title',
                        cardText: 'catalogueOfSurgeServicesLivelihoodsCards3Card7Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.livelihoodscentre.org/list-training'
                    },
                ]
            }
        ]
    },
    {
        hash: "#logistics",
        sectionTitle: "catalogueOfSurgeServicesSelectorLogistics",
        sectionText: "catalogueOfSurgeServicesLogisticsSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element1",
                                url: SharepointLink['Supply Chain Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element2",
                                url: SharepointLink['Logistics ERU Team Leader.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element3",
                                url: SharepointLink['Airops Officer .pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element4",
                                url: SharepointLink['Cash Logistics Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element5",
                                url: SharepointLink['Fleet Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element6",
                                url: SharepointLink['Logistics Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element7",
                                url: SharepointLink['Medical Logistics Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element8",
                                url: SharepointLink['Logistics Pipeline Management Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element9",
                                url: SharepointLink['Procurement Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element10",
                                url: SharepointLink['Supply Chain Admin Officer .pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesLogisticsCards1Card1Element11",
                                url: SharepointLink['Warehouse Officer.pdf']
                            }
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesSelectorLogistics',
                                url: SharepointLink['Logistics Technical Competency Framework.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: 'catalogueOfSurgeServicesCardsTitleServices',
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit',
                        cardText: 'catalogueOfSurgeServicesLogisticsCards2Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesLogisticsCards2Card1BtnText',
                        url: '#logistics-eru'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleServices',
                        cardText: 'catalogueOfSurgeServicesLogisticsCards2Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesLogisticsCards2Card2BtnText',
                        url: '#lpscm-for-national-societies'
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleAdditionalResources",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesLogisticsCards3Card1Title',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://fednet.ifrc.org/en/resources/logistics/logistics-standards-and-tools/lso/'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesLogisticsCards3Card2Title',
                        cardText: 'catalogueOfSurgeServicesLogisticsCards3Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://itemscatalogue.redcross.int/'
                    }
                ]
            }
        ]
    },
    {
        hash: "#operations",
        sectionTitle: "catalogueOfSurgeServicesSelectorOperations",
        sectionText: "",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesOperationsCards1Card1Element1",
                                url: SharepointLink['Head of Emergency Operations.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesOperationsCards1Card1Element2",
                                url: SharepointLink['Operations Manager.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesOperationsCards1Card1Element3",
                                url: SharepointLink['Deputy Operations Manager.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesOperationsCards1Card1Element4",
                                url: SharepointLink['Field Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesOperationsCards1Card1Element5",
                                url: SharepointLink['Movement Coordination Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesOperationsCards1Card1Element7",
                                url: SharepointLink['OM Recovery Coordinator.pdf']
                            },
                            /* coming soon not wanted 2
                            {
                                name: "catalogueOfSurgeServicesOperationsCards1Card1Element6",
                                url: ''
                            }
                            */
                        ]
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponse',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesOperationsCards2Card1BtnText',
                        url: '#head-of-emergency-operations-heops'
                    }
                ]
            }
        ]
    },
    {
        hash: "#protection",
        sectionTitle: "catalogueOfSurgeServicesSelectorProtection",
        sectionText: '',
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesProtectionCards1Card1Element1",
                                url: SharepointLink['Protection, Gender and Inclusion Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesProtectionCards1Card1Element2",
                                url: SharepointLink['Protection, Gender and Inclusion Officer.pdf']
                            }
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesProtectionCards1Card2BtnText',
                                url: SharepointLink['PGI Technical Competency Framework.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponse',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesProtectionCards2Card1BtnText',
                        url: '#protection-gender-and-inclusion'
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleAdditionalResources",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesProtectionCards3Card1Title',
                        cardText: 'catalogueOfSurgeServicesProtectionCards3Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.ifrc.org/media/12346'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesProtectionCards3Card2Title',
                        cardText: 'catalogueOfSurgeServicesProtectionCards3Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'https://www.ifrc.org/media/48958'
                    }
                ]
            }
        ]
    },
    {
        hash: "#planning",
        sectionTitle: "catalogueOfSurgeServicesSelectorPlanning",
        sectionText: 'catalogueOfSurgeServicesPlanningSectionText',
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesPlanningCards1Card1Element3",
                                url: SharepointLink['PMER Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesPlanningCards1Card1Element2",
                                url: SharepointLink['PMER Officer.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesPlanningCards2Card1Title',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesPlanningCards2Card1BtnText',
                        url: '#emergency-plan-of-action-epoa-monitoring-evaluation-plan'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesPlanningCards2Card2Title',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesPlanningCards2Card2BtnText',
                        url: '#real-time-evaluation-rte-and-guidance'
                    }
                ]
            }
        ]
    },
    {
        hash: "#relief",
        sectionTitle: "catalogueOfSurgeServicesSelectorRelief",
        sectionText: "catalogueOfSurgeServicesReliefSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    /* coming soon not wanted 3
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesReliefCards1Card1Element1",
                                url: ''
                            }
                        ]
                    },
                    */
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesSelectorRelief',
                                url: SharepointLink['Relief Technical Competency Framework.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesReliefCards2Card1BtnText',
                        url: '#eru-relief'
                    }
                ]
            }
        ]
    },
    {
        hash: "#security",
        sectionTitle: "catalogueOfSurgeServicesSelectorSecurity",
        sectionText: "catalogueOfSurgeServicesSecuritySectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesPlanningCards1Card1Element0",
                                url: SharepointLink['Security Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesPlanningCards1Card1Element1",
                                url: SharepointLink['Security Officer.pdf']
                            }
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesSecurityCards1Card1BtnText',
                                url: SharepointLink['Security Technical Competency Framework.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleRapidResponse',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesSecurityCards2Card1BtnText',
                        url: '#security-management'
                    }
                ]
            }
        ]
    },
    {
        hash: "#shelter",
        sectionTitle: "catalogueOfSurgeServicesSelectorShelter",
        sectionText: "catalogueOfSurgeServicesShelterSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element1",
                                url: SharepointLink['Shelter Programme Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element2",
                                url: SharepointLink['Shelter Programme Team Leader.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element3",
                                url: SharepointLink['Shelter Programme Technical Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element4",
                                url: SharepointLink['Shelter Cluster Coordinator.pdf']
                            },
                            /* coming soon not wanted 4
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element5",
                                url: ''
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element6",
                                url: ''
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element7",
                                url: ''
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element8",
                                url: ''
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element9",
                                url: ''
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element10",
                                url: ''
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element11",
                                url: ''
                            },
                            {
                                name: "catalogueOfSurgeServicesShelterCards1Card1Element12",
                                url: ''
                            }
                            */
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesShelterCards1Card2BtnText',
                                url: SharepointLink['Shelter and Settlements Technical Competency Framework.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesShelterCards2Card1Title',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesShelterCards2Card1BtnText',
                        url: '#sct-shelter-coordination-team'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesShelterCards2Card2Title',
                        cardText: '',
                        cardBtnText: 'catalogueOfSurgeServicesShelterCards2Card2BtnText',
                        url: '#stt-shelter-technical-team'
                    }
                ]
            }
        ]
    },
    {
        hash: '#water',
        sectionTitle: "catalogueOfSurgeServicesSelectorWater",
        sectionText: "catalogueOfSurgeServicesWaterSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleRapidResponsePersonnel",
                cards: [
                    {
                        cardType: 'file',
                        cardTitle: "catalogueOfSurgeServicesCardTitleRoleProfiles",
                        elements: [
                            {
                                name: "catalogueOfSurgeServicesWaterCards1Card1Element1",
                                url: SharepointLink['WASH Coordinator.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesWaterCards1Card1Element2",
                                url: SharepointLink['WASH Officer.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesWaterCards1Card1Element3",
                                url: SharepointLink['WASH Officer - Hygiene Promotion.pdf']
                            },
                            {
                                name: "catalogueOfSurgeServicesWaterCards1Card1Element4",
                                url: SharepointLink['WASH Officer - Sanitation Engineer.pdf']
                            },
                        ]
                    },
                    {
                        cardType: 'textBtnPdf',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFramework',
                        cardText: 'catalogueOfSurgeServicesCardsTitleTechnicalCompetencyFrameworkText',
                        buttons: [
                            {
                                btnText: 'catalogueOfSurgeServicesWaterCards1Card2BtnText',
                                url: SharepointLink['WASH Technical Competency Framework.pdf']
                            }
                        ]
                    }
                ]
            },
            {
                cardsTitle: 'catalogueOfSurgeServicesCardsTitleServices',
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardTitleEquipment',
                        cardText: 'catalogueOfSurgeServicesWaterCards2Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesWaterCards2Card1BtnText',
                        url: '#kit-2'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardTitleEquipment',
                        cardText: 'catalogueOfSurgeServicesWaterCards2Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesWaterCards2Card2BtnText',
                        url: '#kit-5'
                    },
                    // {
                    //     cardType: 'textBtn',
                    //     cardTitle: 'catalogueOfSurgeServicesCardTitleEquipment',
                    //     cardText: 'catalogueOfSurgeServicesWaterCards2Card3Text',
                    //     cardBtnText: 'catalogueOfSurgeServicesWaterCards2Card3BtnText',
                    //     url: '#kit-10'
                    // },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit',
                        cardText: 'catalogueOfSurgeServicesWaterCards2Card4Text',
                        cardBtnText: 'catalogueOfSurgeServicesWaterCards2Card4BtnText',
                        url: '#m15-eru'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit',
                        cardText: 'catalogueOfSurgeServicesWaterCards2Card5Text',
                        cardBtnText: 'catalogueOfSurgeServicesWaterCards2Card5BtnText',
                        url: '#msm20-eru'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit',
                        cardText: 'catalogueOfSurgeServicesWaterCards2Card6Text',
                        cardBtnText: 'catalogueOfSurgeServicesWaterCards2Card6BtnText',
                        url: '#m40-eru'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit',
                        cardText: 'catalogueOfSurgeServicesWaterCards2Card7Text',
                        cardBtnText: 'catalogueOfSurgeServicesWaterCards2Card7BtnText',
                        url: '#water-supply-rehabilitation-wsr'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesCardsTitleEmergencyResponseUnit',
                        cardText: 'catalogueOfSurgeServicesWaterCards2Card8Text',
                        cardBtnText: 'catalogueOfSurgeServicesWaterCards2Card8BtnText',
                        url: '#household-water-treatment-and-safe-storage-hwts'
                    }
                ]
            },
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleAdditionalResources",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesWaterCards3Card8Title',
                        cardText: 'catalogueOfSurgeServicesWaterCards3Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextGoTo',
                        url: 'http://watsanmissionassistant.org/'
                    }
                ]
            }
        ]
    },
    {
        hash: '#other',
        sectionTitle: "catalogueOfSurgeServicesSelectorOther",
        sectionText: "catalogueOfSurgeServicesOtherSectionText",
        sectionCards: [
            {
                cardsTitle: "catalogueOfSurgeServicesCardsTitleAdditionalServices",
                cards: [
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card1Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card1Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#civil-military-relations'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card2Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card2Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#disaster-risk-reduction-drr'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card3Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card3Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#human-resources'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card4Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card4Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#international-disaster-response-law'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card5Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card5Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#migration'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card6Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card6Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#national-society-development'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card7Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card7Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#partnership-and-resource-development'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card8Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card8Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#preparedness-for-effective-response-per'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card9Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card9Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#recovery'
                    },
                    {
                        cardType: 'textBtn',
                        cardTitle: 'catalogueOfSurgeServicesOtherCards1Card10Title',
                        cardText: 'catalogueOfSurgeServicesOtherCards1Card10Text',
                        cardBtnText: 'catalogueOfSurgeServicesCardBtnTextLearnMore',
                        url: '#greenresponse'
                    }
                ]
            }
        ]
    }
];

export default CatalogueOfSurgeServicesContent;
