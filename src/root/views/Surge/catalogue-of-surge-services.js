import LanguageContext from "#root/languageContext";
import React from "react";
import CatalogueOfSurgeServicesSubpage from "./catalogue-of-surge-services-subpage";
import CatalogueOfSurgeServicesContent from './contentData/catalogue-of-surge-services-content';

export default class CatalogueOfSurgeServices extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedSelector: '#catalogue',
            selectedService: ''
        };
    }

    selectorClicked(hash) {
        this.setState({ selectedSelector: hash, selectedService: '' });
    }

    getSelectorMenuDetails() {
        const { strings } = this.context;
        return [
            { title: strings.catalogueOfSurgeServicesSelectorEmergency, hash: '#emergency', icon: 'collecticon-humanitarian-assessment' },
            { title: strings.catalogueOfSurgeServicesSelectorBasecamp, hash: '#basecamp', icon: 'collecticon-humanitarian-basecamp' },
            { title: strings.catalogueOfSurgeServicesSelectorCash, hash: '#cash', icon: 'collecticon-humanitarian-cash' },
            { title: strings.catalogueOfSurgeServicesSelectorCommunity, hash: '#community', icon: 'collecticon-humanitarian-cea' },
            { title: strings.catalogueOfSurgeServicesSelectorCommunications, hash: '#communications', icon: 'collecticon-humanitarian-comms' },
            { title: strings.catalogueOfSurgeServicesSelectorHealth, hash: '#health', icon: 'collecticon-humanitarian-health' },
            { title: strings.catalogueOfSurgeServicesSelectorInformationMan, hash: '#informationMan', icon: 'collecticon-humanitarian-im' },
            { title: strings.catalogueOfSurgeServicesSelectorInformationTech, hash: '#informationTech', icon: 'collecticon-humanitarian-itt' },
            { title: strings.catalogueOfSurgeServicesSelectorLivelihoods, hash: '#livelihoods', icon: 'collecticon-humanitarian-livelihood' },
            { title: strings.catalogueOfSurgeServicesSelectorLogistics, hash: '#logistics', icon: 'collecticon-humanitarian-logs' },
            { title: strings.catalogueOfSurgeServicesSelectorOperations, hash: '#operations', icon: 'collecticon-humanitarian-opsmanagement' },
            { title: strings.catalogueOfSurgeServicesSelectorProtection, hash: '#protection', icon: 'collecticon-humanitarian-pgi' },
            { title: strings.catalogueOfSurgeServicesSelectorPlanning, hash: '#planning', icon: 'collecticon-humanitarian-pmer' },
            { title: strings.catalogueOfSurgeServicesSelectorRelief, hash: '#relief', icon: 'collecticon-humanitarian-relief' },
            { title: strings.catalogueOfSurgeServicesSelectorSecurity, hash: '#security', icon: 'collecticon-humanitarian-security' },
            { title: strings.catalogueOfSurgeServicesSelectorShelter, hash: '#shelter', icon: 'collecticon-humanitarian-shelter' },
            { title: strings.catalogueOfSurgeServicesSelectorWater, hash: '#water', icon: 'collecticon-humanitarian-wash' },
            { title: strings.catalogueOfSurgeServicesSelectorOther, hash: '#other', icon: 'collecticon-humanitarian-other' },
        ];
    }

    openNewTab(url, e) {
        e.preventDefault();
        if (url === undefined || url === null || url === "") {
            return;
        }
        if (url.startsWith('#')) {
            this.setState({ ...this.state, selectedService: url });
        } else {
            window.open(url, '_blank');
        }
    }

    backToClicked() {
        this.setState({ ...this.state, selectedService: ''});
    }

    renderCardContent(card, additionalResoruces) {
        const { strings } = this.context;
        if (card.cardType === "file") {
            return (
                <div className="cardElementContainer">
                    {card.elements.map((element, index) => (
                        <a key={index} href={element.url} onClick={e => this.openNewTab(element.url, e)} className="cardElement">
                            { element.url !== "" ? <span className="catalogueIcon collecticon-humanitarian-pdf"></span> : <></>}
                            <span className="cardElementText">{strings[element.name]}</span>
                            { element.url !== "" ? <span className="catalogueIcon collecticon-humanitarian-download"></span> : <></>}
                        </a>
                    ))}
                </div>
            );
        } else if (card.cardType === "textBtnPdf") {
            return (
                <div className="cardElementContainer">
                    <span className="cardText">{strings[card.cardText]}</span>
                    {card.buttons.map((btn, index) => (
                        <a key={index} href={btn.url} onClick={e => this.openNewTab(btn.url, e)} className="cardElement">
                            <span className="catalogueIcon collecticon-humanitarian-pdf"></span>
                            <span className="cardElementText">{strings[btn.btnText]}</span>
                            <span className="catalogueIcon collecticon-humanitarian-download"></span>
                        </a>
                    ))}
                </div>
            );
        } else if (card.cardType === "textBtn") {
            return (
                <div className="cardElementContainer">
                    <span className="cardText">{strings[card.cardText]}</span>
                    <button onClick={e => this.openNewTab(card.url, e)} className="cardBtn">
                        {additionalResoruces ? <span className="f-icon-arrow-right-diagonal"></span> : <></>}
                        {strings[card.cardBtnText]}
                    </button>
                </div>
            );
        } else {
            return (
                <></>
            );
        }
    }

    renderCards(cards, additionalResoruces) {
        const { strings } = this.context;
        return (
            <div className="cardsContainer row flex-sm">
                {cards.map((card, index) => {
                    return (
                        <div key={index} className={`col col-6-sm ${cards.length <= 2 ? "col-4-sm" : "col-4-mid"}`}>
                            <div className="cardContainer">
                                <div className="cardTitle">
                                    <span>{strings[card.cardTitle]}</span>
                                </div>
                                {this.renderCardContent(card, additionalResoruces)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderContent(hash) {
        const { strings } = this.context;
        var queriedData = CatalogueOfSurgeServicesContent.find(d => d.hash === hash);

        if (hash === "#catalogue") {
            return (
                <section>
                    <h1>{strings.catalogueOfSurgeServicesTitle}</h1>
                    <h3>{strings.catalogueOfSurgeServicesTitleSubtitle1}</h3>
                    <p>{strings.catalogueOfSurgeServicesTitleSubtitle1Text1}</p>
                    <p>{strings.catalogueOfSurgeServicesTitleSubtitle1Text2}</p>
                    <h3>{strings.catalogueOfSurgeServicesTitleSubtitle2}</h3>
                    <b><a bold='True' href={strings.catalogueOfSurgeServicesTitleSubtitle2LinkUrl1} >{strings.catalogueOfSurgeServicesTitleSubtitle2Link1} </a></b> {strings.catalogueOfSurgeServicesTitleSubtitle2Text1}
                    {/* <p>{strings.catalogueOfSurgeServicesTitleSubtitle2Text1}</p> */}
                </section>
            );
        }
        if (hash === "#informationMan") {
            return (
                <section>
                    <h1>{strings.catalogueOfSurgeServicesInformationManSubtitle1}</h1>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle1Text1}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle1Text2}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle1Text3}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle1Text4}</p>

                    <img src="/assets/graphics/content/Pyramid.png" width='80%' />
                    <h1> </h1>

                    <h1>{strings.catalogueOfSurgeServicesInformationManSubtitle2}</h1>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Text1}</p>
                    
                    <b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1}</p></b>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1Item3}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1Item4}</li>
                    </ul>
                    <b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2}</p></b>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item3}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item4}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item5}</li>
                    </ul>
                    <b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3}</p></b>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3Item3}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3Item4}</li>
                    </ul>
                    <b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4}</p></b>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4Item3}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4Item4}</li>
                    </ul>
                    <img src="/assets/graphics/content/IMRoles.jpg" width='80%' />
                    <h1> </h1>
                    <h1>{strings.catalogueOfSurgeServicesInformationManSubtitle3}</h1>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle3Text1}</p>
                    <b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group1}</p></b>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group1Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group1Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group1Item3}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group1Item4}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group1Item5}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group1Item6}</li>
                    </ul>

                    <b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group2}</p></b>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group2Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group2Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group2Item3}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group2Item4}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group2Item5}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group2Item6}</li>
                    </ul>

                    <b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group3}</p></b>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group3Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group3Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle3Group3Item3}</li>
                    </ul>
                    <img src="/assets/graphics/content/IFRC_Surge_01.jpg" width='80%' />
                    <h1> </h1>
                    <h1>{strings.catalogueOfSurgeServicesInformationManSubtitle4}</h1>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle4Text1}</p>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle4Group1Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle4Group1Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle4Group1Item3}</li>
                    </ul>

                    {strings.catalogueOfSurgeServicesInformationManSubtitle4Text2} <b><a href={strings.catalogueOfSurgeServicesInformationManSubtitle4Link1} >{strings.catalogueOfSurgeServicesInformationManSubtitle4Link1Text} </a></b>

                    <h1> </h1>
                    <h1>{strings.catalogueOfSurgeServicesInformationManSubtitle5}</h1>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle5Text1}</p>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle5Group1Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle5Group1Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle5Group1Item3}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle5Group1Item4}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle5Group1Item5}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle5Group1Item6}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle5Group1Item7}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle5Group1Item8}</li>
                    </ul>

                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle5Text2}</p>
                    <img src="/assets/graphics/content/IFRC_Surge_02.jpg" width='80%' />
                    {queriedData.sectionCards.map((sectionCard, index) => {
                    const additionalResoruces = sectionCard.cardsTitle === "catalogueOfSurgeServicesCardsTitleAdditionalResources" ? true : false;
                    return (
                        <div key={index}>
                            <h3 className="cardsTitle fold__header">{strings[sectionCard.cardsTitle]}</h3>
                            {this.renderCards(sectionCard.cards, additionalResoruces)}
                        </div>
                    );
                })}
                 
                    {/* <p>{strings.catalogueOfSurgeServicesTitleSubtitle2Text1}</p> */}
                </section>
            );
        }
        

        if (queriedData === undefined) {
            return (
                <></>
            );
        }

        return (
            <section>
                <h1>{strings[queriedData.sectionTitle]}</h1>
                <p>{strings[queriedData.sectionText]}</p>
                {queriedData.sectionCards.map((sectionCard, index) => {
                    const additionalResoruces = sectionCard.cardsTitle === "catalogueOfSurgeServicesCardsTitleAdditionalResources" ? true : false;
                    return (
                        <div key={index}>
                            <h3 className="cardsTitle fold__header">{strings[sectionCard.cardsTitle]}</h3>
                            {this.renderCards(sectionCard.cards, additionalResoruces)}
                        </div>
                    );
                })}
            </section>
        );
    }

    render() {
        const { strings } = this.context;
        const selectorMenuDetails = [...this.getSelectorMenuDetails()];
        const selectedMenu = selectorMenuDetails.find(menu => menu.hash === this.state.selectedSelector);
        let backToSelectedCatalogue;
        if (selectedMenu !== undefined) {
            backToSelectedCatalogue = 'Back to ' + selectedMenu.title;
        }

        return (
            <section className="cat-services-container">
                <div className="service-selector-container">
                    <div className="service-selector title" onClick={() => this.selectorClicked("#catalogue")}>
                        <span className="selectorTitle">
                            {strings.catalogueOfSurgeServicesSelectorTitle}
                        </span>
                    </div>
                    {selectorMenuDetails.map(menu =>
                    (
                        <div key={menu.hash}
                            className={this.state.selectedSelector === menu.hash ? "service-selector active" : "service-selector"}
                            onClick={() => this.selectorClicked(menu.hash)}>
                            <div className={`catalogueIcon ${menu.icon}`}></div>
                            <div className="serviceName">{menu.title}</div>
                            <div style={{visibility: 'hidden'}} className="activeIcon collecticon-chevron-right"></div>
                        </div>
                    ))}
                </div>
                <div className="selected-service-container">
                    {this.state.selectedService === '' ? 
                        this.renderContent(this.state.selectedSelector)
                        : (
                            <div>
                                <div className="backTo" onClick={() => this.backToClicked()}>
                                    <span className="collecticon-chevron-left icon"></span>
                                    <span>{backToSelectedCatalogue}</span>
                                </div>
                                <CatalogueOfSurgeServicesSubpage selectedService={this.state.selectedService} />
                            </div>
                        )
                    }
                </div>
            </section>
        );
    }
}
CatalogueOfSurgeServices.contextType = LanguageContext;