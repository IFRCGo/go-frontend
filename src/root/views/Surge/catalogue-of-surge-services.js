import LanguageContext from "#root/languageContext";
import React from "react";
import { Link } from 'react-router-dom';
import {  Route, Switch } from 'react-router-dom';
import CatalogueOfSurgeServicesSubpage from "./catalogue-of-surge-services-subpage";
import CatalogueOfSurgeServicesContent from './contentData/catalogue-of-surge-services-content';
import SharepointLink from './contentData/map-pdf-to-sharepoint';

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
            { title: strings.catalogueOfSurgeServicesSelectorInformationMan, hash: '#infoMgt', icon: 'collecticon-humanitarian-im' },
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

    openNewTab(hash, url, e) {
        e.preventDefault();
        if (url === undefined || url === null || url === "") {
            return;
        }
        if (url.startsWith('#')) {
            this.props.history.push(`/deployments/catalogue/${hash.replace('#', '')}/${url.replace('#', '')}`);
            // this.setState({ ...this.state, selectedService: url });
        } else {
            window.open(url, '_blank');
        }
    }

    backToClicked() {
        this.setState({ ...this.state, selectedService: ''});
    }

    renderCardContent(hash, card, additionalResources) {
        const { strings } = this.context;
        if (card.cardType === "file") {
            return (
                <div className="cardElementContainer">
                    {card.elements.map((element, index) => (
                        <a key={index} href={element.url} onClick={e => this.openNewTab(hash, element.url, e)} className="cardElement">
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
                        <a key={index} href={btn.url} onClick={e => this.openNewTab(hash, btn.url, e)} className="cardElement">
                            <span className="catalogueIcon collecticon-humanitarian-pdf"></span>
                            <span className="cardElementText">{strings[btn.btnText]}</span>
                            <span className="catalogueIcon collecticon-humanitarian-download"></span>
                        </a>
                    ))}
                </div>
            );
        } else if (card.cardType === "textFolder") {
            return (
                <div className="cardElementContainer">
                    {card.folders.map((btn, index) => (
                        <a key={index} href={btn.url} onClick={e => this.openNewTab(hash, btn.url, e)} className="cardElement">
                            <span className="catalogueIcon collecticon-globe"></span>
                            <span className="cardElementText">{strings[btn.btnText]}</span>
                        </a>
                    ))}
                </div>
            );
        } else if (card.cardType === "textBtn") {
            return (
                <div className="cardElementContainer">
                    <span className="cardText">{strings[card.cardText]}</span>
                    <button onClick={e => this.openNewTab(hash, card.url, e)} className="cardBtn">
                        {additionalResources ? <span className="f-icon-arrow-right-diagonal"></span> : <></>}
                        {strings[card.cardBtnText]}
                    </button>
                </div>
            );
        }
        else if (card.cardType === "textBtnSimple") {
            return (
                <div className="cardElementContainer">
                    <span className="cardText">{strings[card.cardText]}</span>
                    <button onClick={e => this.openNewTab(hash, card.url, e)} className="cardBtn">

                        {strings[card.cardBtnText]}
                    </button>
                </div>
            );
        } else if (card.cardType === "textBtnExt") {
            return (
                <div className="cardElementContainer">
                    <span className="cardText">{strings[card.cardText]}</span>
                    <button onClick={e => this.openNewTab(hash, card.url, e)} className="cardBtn">
                         <span className="f-icon-arrow-right-diagonal"></span> 
                        {strings[card.cardBtnText]}
                    </button>
                </div>
            );
        }
        else {
            return (
                <></>
            );
        }
    }

    renderCards(hash, cards, additionalResources) {
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
                                {this.renderCardContent(hash, card, additionalResources)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderContent(hash) {
        console.log('render content', hash);
        const { strings } = this.context;
        var queriedData = CatalogueOfSurgeServicesContent.find(d => d.hash === hash);

        if (hash === "#catalogue" || hash === "") {
            return (
                <section>
                    <h1>{strings.catalogueOfSurgeServicesTitle}</h1>
                    <h3>{strings.catalogueOfSurgeServicesTitleSubtitle1}</h3>
                    <p>{strings.catalogueOfSurgeServicesTitleSubtitle1Text1}</p>
                    <p>{strings.catalogueOfSurgeServicesTitleSubtitle1Text2}</p>
                    <h3>{strings.catalogueOfSurgeServicesTitleSubtitle2}</h3>
                    <p><a href={SharepointLink['Core competency framework.pdf']} > <u>{strings.catalogueOfSurgeServicesTitleSubtitle2Link1} </u> </a> {strings.catalogueOfSurgeServicesTitleSubtitle2Text1}</p>
                    <p>{strings.catalogueOfSurgeServicesTitleSubtitle3Text1}<a href="https://surgelearning.ifrc.org/resources/minimum-training-required-surge-personnel"><u>{strings.catalogueOfSurgeServicesTitleSubtitle3Link1}</u></a>{strings.catalogueOfSurgeServicesTitleSubtitle3Text2}</p>
                </section>
            );
        }
        if (hash === "#infoMgt") {
            return (
                <section>

                    <h1>{strings.catalogueOfSurgeServicesInformationManSubtitle1}</h1>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle1Text1}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle1Text2}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle1Text3}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle1Text4}</p>

                    <img src="/assets/graphics/content/Pyramid.png" width='80%' />
                    <h1> </h1>
                    <p>{strings[queriedData.sectionText]}</p>
                      {queriedData.sectionCards.map((sectionCard, index) => {
                    const additionalResources = sectionCard.cardsTitle === "catalogueOfSurgeServicesCardsTitleAdditionalResources" ? true : false;
                    return (
                        <div key={index}>
                            <h3 className="cardsTitle fold__header">{strings[sectionCard.cardsTitle]}</h3>
                            {this.renderCards(hash, sectionCard.cards, additionalResources)}
                        </div>
                    );
                })}

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
                    const additionalResources = sectionCard.cardsTitle === "catalogueOfSurgeServicesCardsTitleAdditionalResources" ? true : false;
                    return (
                        <div key={index}>
                            <h3 className="cardsTitle fold__header">{strings[sectionCard.cardsTitle]}</h3>
                            {this.renderCards(hash, sectionCard.cards, additionalResources)}
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
        window.scrollTo(0,500);
        return (
            <section className="cat-services-container">
                <div className="service-selector-container">
                    <div className="service-selector title">
                        <Link to="/deployments/catalogue">
                            <span className="selectorTitle">
                                {strings.catalogueOfSurgeServicesSelectorTitle}
                            </span>
                        </Link>
                    </div>
                    {selectorMenuDetails.map(menu =>
                    (
                        <Link key={menu.hash} to={`/deployments/catalogue/${menu.hash.replace('#', '')}`}>
                            <div className={this.state.selectedSelector === menu.hash ? "service-selector active" : "service-selector"}>
                                <div className={`catalogueIcon ${menu.icon}`}></div>
                                <div className="serviceName">{menu.title}</div>
                                <div style={{visibility: 'hidden'}} className="activeIcon collecticon-chevron-right"></div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="selected-service-container">
                    <Switch>
                        <Route exact path="/deployments/catalogue">
                            { this.renderContent('') }
                        </Route>
                        <Route path="/deployments/catalogue/:selectedSelector/:selectedService"
                            children={({ match }) => (
                                <div>
                                    <div className="backTo">
                                        <Link to={`/deployments/catalogue/${match.params.selectedSelector}`}>
                                            <span className="collecticon-chevron-left icon"></span>
                                            <span>{backToSelectedCatalogue}</span>
                                        </Link>
                                    </div>
                                    <CatalogueOfSurgeServicesSubpage selectedService={`#${match.params.selectedService}`} />                               
                                </div>
                            )}
                        />
                        <Route path="/deployments/catalogue/:selectedSelector"
                            children={({ match }) => (
                                <>
                                    { this.renderContent('#' + match.params.selectedSelector) }
                                </>
                            )}
                        />
                    </Switch>
                </div>
            </section>
        );
    }
}
CatalogueOfSurgeServices.contextType = LanguageContext;
