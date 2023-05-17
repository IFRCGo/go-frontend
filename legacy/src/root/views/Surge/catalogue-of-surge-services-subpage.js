import { environment } from "#config";
import LanguageContext from "#root/languageContext";
import { PropTypes as T } from 'prop-types';
import React from "react";
import CatalogueOfSurgeServiceSubpageContent from "./contentData/catalogue-of-surge-service-subpage-content";
import Gallery from 'react-grid-gallery';

export default class CatalogueOfSurgeServicesSubPage extends React.Component {

    openNewTab(url, e) {
        e.preventDefault();
        if (url === undefined || url === null || url === "") {
            return;
        }

        window.open(url, '_blank');
    }

    renderListItemsFromTo(listItems, from, to){
        const { strings } = this.context;
        const row  = [];
        for (let i = from; i < to; i++) {
            row.push(<li key={i}>{strings[listItems[i]]}</li>);
        }
        return row;
    }

    renderContentAdditionalResources(content, title) {
        const { strings } = this.context;
        return (
            <>
                <h3 className="margin-4-t">{title}</h3>
                {content.listItems !== undefined ?
                    <ul>
                        {content.listItems.map((listItem, index) => (
                            <li key={index}>
                                {strings[listItem] + ' '}
                                <a href={content.listItemsUrls[index].url} onClick={e => this.openNewTab(content.listItemsUrls[index].url, e)}>
                                    {strings[content.listItemsUrls[index].text]}
                                </a>
                            </li>
                        ))}
                    </ul>
                    : <></>
                }
                {content.text !== undefined ?
                    <p>
                        {strings[content.text]}
                        <a href={content.textUrl.url} onClick={e => this.openNewTab(content.textUrl.url, e)}>
                            {strings[content.textUrl.text]}
                        </a>
                    </p>
                    : <></>
                }
            </>
        );
    }
   
    renderContentSpecifications(content, title) {
        const { strings } = this.context;
        return (
            <>
                <h3 className="margin-4-t">{title}</h3>
                {content.weight !== undefined ?
                    <>
                        <p><strong>{strings['catalogueSpecificationSubTitle1']}</strong></p>
                        <p>{strings[content.weight]}</p>
                    </>
                    : <></>
                }
                {content.volume !== undefined ?
                    <>
                        <p><strong>{strings['catalogueSpecificationSubTitle2']}</strong></p>
                        <p>{strings[content.volume]}</p>
                    </>
                    : <></>
                }
                {content.cost !== undefined ?
                    <>
                        <p><strong>{strings['catalogueSpecificationSubTitle3']}</strong></p>
                        <p>{strings[content.cost]}</p>
                    </>
                    : <></>
                }
                {content.nationalSocieties !== undefined ?
                    <>
                        <p><strong>{strings['catalogueSpecificationSubTitle4']}</strong></p>
                        <p>{strings[content.nationalSocieties]}</p>
                    </>
                    : <></>
                }
                {content.subText !== undefined ?
                    <p style={{ fontStyle: 'italic' }}>{strings[content.subText]}</p>
                    : <></>
                }
            </>
        );
    }

    renderContentWithOrder(content) {
        const { strings } = this.context;
        return (
            <>
                {content.textsOrder.map((order, index) => {
                    return (
                        <div key={index}>
                            <p>{strings[content.texts[order.text]]}</p>
                            {order.listStart !== undefined ?
                                <ul>
                                    {this.renderListItemsFromTo(content.listItems, order.listStart, order.listEnd)}
                                </ul>
                                : <></>
                            }
                        </div>
                    );
                })}
            </>
        );
    }

    renderCapacityWithUrls(content) {
        const { strings } = this.context;
        return (
            <>
                <p>
                    {content.textsWithUrlOrder.map((order, index) => (
                        <span key={index}>
                            {strings[content.texts[order.text]]}
                            <a href={content.urls[order.url].url} onClick={e => this.openNewTab(content.urls[order.url].url, e)}>
                                {strings[content.urls[order.url].text]}
                            </a>
                        </span>
                    ))}
                </p>
            </>
        );
    }

    renderContent(content, title) {
        const { strings } = this.context;
        let mainText;
        if (content.textsWithUrlOrder !== undefined) {
            mainText = this.renderCapacityWithUrls(content);
        } else if (content.textsOrder !== undefined) {
            mainText = this.renderContentWithOrder(content);
        } else {
            mainText = (
                <>
                    {content.text !== undefined ?
                        <p>{strings[content.text]}</p> : <></>
                    }
                    {content.listItemsBoldStart !== undefined ?
                        <ul>
                            {content.listItems.map((listItem, index) => (
                                <li key={index}>
                                    <strong>{strings[content.listItemsBoldStart[index]]}</strong>
                                    {' ' + strings[listItem]}
                                </li>
                            ))}
                        </ul>
                        : content.listItems !== undefined ?
                            <ul>
                                {this.renderListItemsFromTo(content.listItems, 0, content.listItems.length)}
                            </ul>
                            : <></>
                    }
                </>
            );
        }

        return (
            <>
                <h3 className="margin-4-t">{title}</h3>
                {mainText}
                {content.assessment !== undefined ?
                    <>
                        <p><strong>{strings['catalogueDesignedSubTitle1']}</strong></p>
                        <p>{strings[content.assessment]}</p>
                    </>
                    : <></>
                }
                {content.responseAnalysis !== undefined ?
                    <>
                        <p><strong>{strings['catalogueDesignedSubTitle2']}</strong></p>
                        <p>{strings[content.responseAnalysis]}</p>
                    </>
                    : <></>
                }
                {content.setupAndImplementation !== undefined ?
                    <>
                        <p><strong>{strings['catalogueDesignedSubTitle3']}</strong></p>
                        <p>{strings[content.assessment]}</p>
                    </>
                    : <></>
                }
                {content.monitoringAndEvaluation !== undefined ?
                    <>
                        <p><strong>{strings['catalogueDesignedSubTitle4']}</strong></p>
                        <p>{strings[content.assessment]}</p>
                    </>
                    : <></>
                }
                {content.total !== undefined ?
                    <>
                        <p><strong>{strings['cataloguePersonnelSubTitle1']}</strong></p>
                        <p>{strings[content.total]}</p>
                    </>
                    : <></>
                }
                {content.composition !== undefined ?
                    <>
                        <p><strong>{strings['cataloguePersonnelSubTitle2']}</strong></p>
                        <p>{strings[content.composition]}</p>
                    </>
                    : <></>
                }
                {content.compositions !== undefined ?
                    <>
                        <p><strong>{strings['cataloguePersonnelSubTitle2']}</strong></p>
                        <ul>
                            {this.renderListItemsFromTo(content.compositions, 0, content.compositions.length)}
                        </ul>
                    </>
                    : <></>
                }
                {content.subText !== undefined ?
                    <p style={{ fontStyle: 'italic' }}>{strings[content.subText]}</p>
                    : <></>
                }
            </>
        );
    }

    renderCatalogueServices(content) {
        const { strings } = this.context;
        return (
            <div className="catalogueServicePage">
                <h1>{strings[content.title]}</h1>
                {content.images !== undefined ?
                    <div className="row flex-sm margin-2-t">
                        {content.images.map((image, index) => (
                            <img key={index} className={`margin-2-b col col-6-sm ${content.images.length <= 2 ? "col-4-sm" : "col-3-mid"}`} src={image} />
                        ))}
                    </div>
                    : <></>
                }
                {content.imgs !== undefined ?
                <>
                    <div className="row">
                    <Gallery images={content.imgs} enableImageSelection={false}/>
                    </div>
                    
                </>
                    : <></>
                
                }
               
                {content.textSection.capacity !== undefined ?
                    this.renderContent(content.textSection.capacity, strings['catalogueCapcityTitle'])
                    : <></>
                }
                {content.textSection.emergencyServices !== undefined ?
                    this.renderContent(content.textSection.emergencyServices, strings['catalogueEmergencyTitle'])
                    : <></>
                }
                {content.textSection.designedFor !== undefined ?
                    this.renderContent(content.textSection.designedFor, strings['catalogueDesignedTitle'])
                    : <></>
                }
                {content.textSection.personnel !== undefined ?
                    this.renderContent(content.textSection.personnel, strings['cataloguePersonnelTitle'])
                    : <></>
                }
                {content.textSection.standardComponents !== undefined ?
                    this.renderContent(content.textSection.standardComponents, strings['catalogueStandardCompTitle'])
                    : <></>
                }
                {content.textSection.specifications !== undefined ?
                    this.renderContentSpecifications(content.textSection.specifications, strings['catalogueSpecificationTitle'])
                    : <></>
                }
                {content.textSection.variationOnConfiguration !== undefined ?
                    this.renderContent(content.textSection.variationOnConfiguration, strings['catalogueVariationTitle'])
                    : <></>
                }
                {content.textSection.additionalResources !== undefined ?
                    this.renderContentAdditionalResources(content.textSection.additionalResources, strings['catalogueAdditionalResTitle'])
                    : <></>
                }
                {content.textSection.additionalNotes !== undefined ?
                    this.renderContent(content.textSection.additionalNotes, strings['catalogueAdditionalNoteTitle'])
                    : <></>
                }
                {content.textSection.satelliteImagery !== undefined ?
                    this.renderContent(content.textSection.satelliteImagery, strings[''])
                    : <></>
                }
                {content.textSection.whatsNeeded !== undefined ?
                    this.renderContent(content.textSection.whatsNeeded, strings['catalogueOfSurgeServicesInformationManSatelliteImageryTitle1'])
                    : <></>
                }
                {content.textSection.analysisSources !== undefined ?
                    this.renderContent(content.textSection.analysisSources, strings['catalogueOfSurgeServicesInformationManSatelliteImageryTitle2'])
                    : <></>
                }
                {content.textSection.unosat !== undefined ?
                    this.renderContent(content.textSection.unosat, strings['catalogueOfSurgeServicesInformationManSatelliteImageryTitle3'])
                    : <></>
                }

                {content.textSection.rolesAndResps !== undefined ?
                    <><h1>{strings.catalogueOfSurgeServicesInformationManSubtitle2}</h1><p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Text1}</p><b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1}</p></b><ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1Item3}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group1Item4}</li>
                    </ul><b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2}</p></b><ul className="list_uo">
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item1}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item2}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item3}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item4}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group2Item5}</li>
                        </ul><b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3}</p></b><ul className="list_uo">
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3Item1}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3Item2}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3Item3}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group3Item4}</li>
                        </ul><b><p>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4}</p></b>
                        <ul className="list_uo">
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4Item1}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4Item2}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4Item3}</li>
                            <li>{strings.catalogueOfSurgeServicesInformationManSubtitle2Group4Item4}</li>
                        </ul></>
                    : <></>
                }

                {content.textSection.imSupportForOp !== undefined ?
                    <><h1>{strings.catalogueOfSurgeServicesInformationManSubtitle3}</h1>
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
                    <img src="/assets/graphics/content/IFRC_Surge_01.jpg" width='80%' /></>
                    : <></>
                }

                {content.textSection.ifrcGenevaIm !== undefined ?
                    <><h1>{strings.catalogueOfSurgeServicesInformationManSubtitle4}</h1>
                    <p>{strings.catalogueOfSurgeServicesInformationManSubtitle4Text1}</p>
                    <ul className="list_uo">
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle4Group1Item1}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle4Group1Item2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSubtitle4Group1Item3}</li>
                    </ul>

                    {strings.catalogueOfSurgeServicesInformationManSubtitle4Text2} <b><a href={strings.catalogueOfSurgeServicesInformationManSubtitle4Link1} >{strings.catalogueOfSurgeServicesInformationManSubtitle4Link1Text} </a></b>
                    </>
                    : <></>
                }
                
                {content.textSection.compositionOfImRes !== undefined ?
                    <><h1>{strings.catalogueOfSurgeServicesInformationManSubtitle5}</h1>
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
                    <img src="/assets/graphics/content/IFRC_Surge_02.jpg" width='80%' /> </>
                    : <></>
                }


                {content.textSection.unosat !== undefined ?
                <div>
                    <p> <br/></p>
                    <h3>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSTitle1}</h3>
                    <p><a href="https://mapswipe.org/en/index.html"><u>https://mapswipe.org</u></a>
                    </p>
                    <p>
                    <span>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText1}</span></p>
                    <ul>
                        <li>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText2}</li>
                        <li>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText3}</li>
                    </ul>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText4} <a href="mailto:info@mapswipe.org"><u>info@mapswipe.org</u></a>. {strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText5} <a href="https://mapswipe.org/en/index.html"><u>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText6}</u></a>.</p>
                    <p><br/></p>
                    <h2>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSTitle2}</h2>
                    <p>
                    <span>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText7}</span></p>
                    <h3>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSTitle2}</h3>
                    <p> <b>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText8} </b> {strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText9} <b>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText10} </b> {strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText11}</p>
                    <ul>
                        <li><p><b>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText12} - </b><a href="https://www.maxar.com/open-data"><u>https://www.maxar.com/open-data</u></a>
                        </p></li>
                        <li><p><b>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText13} - </b><a
                            href="https://www.planet.com/disasterdata"><u>https://www.planet.com/disasterdata</u></a>
                        </p></li>
                    </ul>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText14} <a href="https://openaerialmap.org/">{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText15} </a>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText16}</p>
                    <h3>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSTitle4}</h3>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText17}</p>
                    <h3>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSTitle5}</h3>
                    <p><a
                        href="https://disasterscharter.org/web/guest/home"><u>
                        https://disasterscharter.org/web/guest/home</u></a>
                    </p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText18}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText19}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText20}</p>
                    <p><a href="https://disasterscharter.org/web/guest/charter-activations">https://disasterscharter.org/web/guest/charter-activations</a></p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText21}</p>
                    <h3>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSTitle6}</h3>
                    <p><a href="https://www.intelligence-airbusds.com/airbus-foundation/">https://www.intelligence-airbusds.com/airbus-foundation/</a></p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText22}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText23} <a href="mailto:im@ifrc.org">im@ifrc.org</a> {strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText24}</p>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText25}</p>
                    <ul>
                        <li><p>
                        {strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText26} <a href="https://www.intelligence-airbusds.com/airbus-foundation/">{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText27}</a></p></li>
                        <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText28}</p></li>
                        <ul>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText29}</p></li>
                        </ul>
                        <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText30}</p></li>
                        <ul>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText31}</p></li>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText32}</p></li>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText33}</p></li>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText34}</p></li>
                        </ul>
                        <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText35}</p></li>
                        <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText36}</p></li>
                        <ul>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText37}</p></li>
                        </ul>
                        <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText38} <a href="mailto:im@ifrc.org">im@ifrc.org</a> {strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText39}</p></li>
                        <ul>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText40}</p></li>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText41}</p></li>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText42}</p></li>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText43}</p></li>
                            <li><p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText44}</p></li>
                        </ul>
                    </ul>
                    <p>{strings.catalogueOfSurgeServicesInformationManSatelliteImageryMSText45}</p>
                    <p><br/></p>
                </div>
                    : <></> }
            </div>
        );
    }

    renderOtherCatalogueServices(content) {
        const { strings } = this.context;
        return (
            <div className="catalogueServicePage">
                <h1>{strings[content.title]}</h1>
                {content.textSection.map((section, sectionIndex) => {
                    if (section.urls.length === 0) {
                        return (
                            <div key={sectionIndex}>
                                <h3 className="margin-4-t">{strings[section.title]}</h3>
                                <p>{strings[section.text]}</p>
                            </div>
                        );
                    } else if (section.urls.length === 1) {
                        return (
                            <div key={sectionIndex}>
                                <h3 className="margin-4-t">{strings[section.title]}</h3>
                                <p>
                                    {strings[section.text] + ' '}
                                    <a href={section.urls[0].url} onClick={e => this.openNewTab(section.urls[0].url, e)}>{strings[section.urls[0].text]}</a>
                                </p>
                            </div>
                        );
                    } else {
                        return (
                            <div key={sectionIndex}>
                                <h3 className="margin-4-t">{strings[section.title]}</h3>
                                <p>{strings[section.text]}</p>
                                <ul>
                                    {section.urls.map((url, index) => (
                                        <li key={index}>
                                            <a href={url.url} onClick={e => this.openNewTab(url.url, e)}>{strings[url.text]}</a>
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
        const content = CatalogueOfSurgeServiceSubpageContent.find(content => content.hash === this.props.selectedService);
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