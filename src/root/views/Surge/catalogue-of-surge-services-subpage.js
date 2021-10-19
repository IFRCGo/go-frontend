import { environment } from "#config";
import LanguageContext from "#root/languageContext";
import { PropTypes as T } from 'prop-types';
import React from "react";
import CatalogueOfSurgeServiceSubpageContent from "./contentData/catalogue-of-surge-service-subpage-content";

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
                                {strings[listItem]}
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
                                    {strings[listItem]}
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
                {content.textSection.unosat !== undefined ?
                <div>
                    <p> <br/></p>
                    <h3>MapSwipe</h3>
                    <p><a href="https://mapswipe.org/en/index.html"><u>https://mapswipe.org</u></a>
                    </p>
                    <p>
                    <span>MapSwipe
                        is a community-based satellite imagery analysis tool supported by the
                        British Red Cross. Anyone in the humanitarian sector is able to add
                        projects which will then be completed by the users of the app. The
                        main applications are:</span></p>
                    <ul>
                        <li><p>
                        <span>Finding and identifying features - e.g. buildings, roads, waste</span></p></li>
                        <li><p>Change detection of before and after imagery - e.g. damage assessment</p></li>
                    </ul>
                    <p>To request a project email <a href="mailto:info@mapswipe.org"><u>info@mapswipe.org</u></a>.
                        You can find more information and data from the projects <a
                            href="https://mapswipe.org/en/index.html"><u>on the website</u></a>.</p>
                    <p><br/></p>
                    <h2>Imagery Sources</h2>
                    <p>
                    <span
                    >Sometimes
                        it may be necessary to get access to the raw imagery for our own
                        analysis or mapping. Commercial satellite organisations are
                        increasingly making their imagery freely available for disaster
                        events. If this is not available then IFRC also has partnerships that
                        can be activated.</span></p>
                    <h3>Openly available</h3>
                    <p> <b>Maxar</b> and <b>Planet</b> both
                        have programs to openly release their high resolution imagery for
                        select sudden onset major crisis events - often for pre and post
                        disaster. You can check their websites for the latest activations and
                        sign up there to receive email alerts for new imagery.</p>
                    <ul>
                        <li><p><b>Maxar
                            Open Data - </b><a href="https://www.maxar.com/open-data"><u>https://www.maxar.com/open-data</u></a>
                        </p></li>
                        <li><p><b>Planet Disaster Datasets - </b><a
                            href="https://www.planet.com/disasterdata"><u>https://www.planet.com/disasterdata</u></a>
                        </p></li>
                    </ul>
                    <p>There
                        is also the community-based <a href="https://openaerialmap.org/">Open Aerial Map</a> that
                        provides openly licensed satellite and unmanned aerial vehicle (UAV)
                        imagery and is worth checking for your area of interest.</p>
                    <h3>IFRC Partnerships</h3>
                    <p>If
                        none of the above sources have the imagery required, IFRC can
                        activate the following partnerships to gain access to more imagery.</p>
                    <h3>International
                        Space Charter and Major Disasters</h3>
                    <p><a
                        href="https://disasterscharter.org/web/guest/home"><u>
                        https://disasterscharter.org/web/guest/home</u></a>
                    </p>
                    <p>The
                        Charter is a worldwide collaboration, through which satellite data
                        from a wide range of commercial organisations are made available for
                        the benefit of disaster management. The raw imagery is normally made
                        available to the requesting organisation, who can then make the
                        derived data openly available.</p>
                    <p>IFRC
                        is able to activate the Charter through UNOSAT - who will then assist
                        in the analysis if required. The process for activation is the same
                        as above for UNOSAT assistance.</p>
                    <p>
                        Check the Charter website for a list of the latest activations:</p>
                    <p><a
                        href="https://disasterscharter.org/web/guest/charter-activations">https://disasterscharter.org/web/guest/charter-activations</a>
                    </p>
                    <p>
                        If it has been activated, but the data is not available, IFRC can also
                        request this from UNOSAT.</p>
                    <h3>Airbus Foundation</h3>
                    <p><a
                        href="https://www.intelligence-airbusds.com/airbus-foundation/">https://www.intelligence-airbusds.com/airbus-foundation/</a>
                    </p>
                    <p>
                        IFRC
                        has €100,000 of Airbus imagery credits available per year that are
                        available for any use across the Movement. The Airbus platform has a
                        huge catalogue that is constantly updated with new imagery. This can
                        be useful for regular updates post-disaster or frequently checking if
                        imagery isn’t available at first - e.g. due to cloud cover.</p>
                    <p>First check if the imagery is available and if so, send a request
                        to <a href="mailto:im@ifrc.org">im@ifrc.org</a> to purchase the imagery using the credits.</p>
                    <p>To check:</p>
                    <ul>
                        <li><p>
                            Go to <a
                            href="https://www.intelligence-airbusds.com/airbus-foundation/">Airbus
                            Foundation portal</a></p></li>
                        <li><p>
                            Upload or manually draw an AOI</p></li>
                        <ul>
                            <li><p>
                                This is used to calculate cost, so keep this area as small as possible</p></li>
                        </ul>
                        <li><p>
                            Image results will load and can then be sorted / filtered by:</p></li>
                        <ul>
                            <li><p>
                                Date - to get the latest imagery</p></li>
                            <li><p>
                                Cloud cover - % coverage for each image</p></li>
                            <li><p>
                                Incidence angle - higher incidence will distort the image</p></li>
                            <li><p>
                                Resolution - higher resolution = more detail</p></li>
                        </ul>
                        <li><p>
                            You can then preview each image to see if it meets the need</p></li>
                        <li><p>
                            If the image is suitable, record the image ID:</p></li>
                        <ul>
                            <li><p>
                                e.g. DS_PHR1B_202109251030026_FR1_PX_E003N19_0123_01804
                            </p></li>
                        </ul>
                        <li><p>
                            Send request to <a href="mailto:im@ifrc.org">im@ifrc.org</a> with:</p></li>
                        <ul>
                            <li><p>
                                Operation the data will support</p></li>
                            <li><p>
                                Area of interest (KML, SHP, etc.)</p></li>
                            <li><p>
                                ID of images needed</p></li>
                            <li><p>
                                How will the data be used?</p></li>
                            <li><p>
                                What do you need to see? What Questions are you trying to answer?</p></li>
                        </ul>
                    </ul>
                    <p>
                        If
                        all requirements are met, the imagery will then be purchased by IFRC
                        Geneva IM team and the download link forwarded on.</p>
                    <p><br/>
                    </p>
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
                                    {strings[section.text]}
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