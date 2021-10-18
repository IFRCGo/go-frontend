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
                { /* temporary text begins */ }
                <p> </p>
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
                    <li><p
                    >
                        <span
                        >Finding
	and identifying features - e.g. buildings, roads, waste</span></p></li>
                    <li><p
                    >
                        <span
                        >Change
	detection of before and after imagery - e.g. damage assessment</span></p></li>
                </ul>
                <p>To request a project email <a href="mailto:info@mapswipe.org"><u>info@mapswipe.org</u></a>.
                    You can find more information and data from the projects <a
                        href="https://mapswipe.org/en/index.html"><u>on the website</u></a>.</p>
                <p><br/></p>
                <h2><span
                    >Imagery Sources</span></h2>
                <p>
                    <span
                    >Sometimes
it may be necessary to get access to the raw imagery for our own
analysis or mapping. Commercial satellite organisations are
increasingly making their imagery freely available for disaster
events. If this is not available then IFRC also has partnerships that
can be activated.</span></p>
                <h3><span
                    >Openly available</span></h3>
                <p><span><span><span
                ><b><span
                >Maxar</span></b></span></span></span><span
                ><span><span
                >
</span></span></span><span><span
                ><span
                ><span><span> and
</span></span></span></span></span><span><span
                ><span
                ><b><span> Planet</span></b></span></span></span><span
                ><span><span
                >
</span></span></span><span><span
                ><span
                ><span><span> both
have programs to openly release their high resolution imagery for
select sudden onset major crisis events - often for pre and post
disaster. You can check their websites for the latest activations and
sign up there to receive email alerts for new imagery.</span></span></span></span></span></p>
                <ul>
                    <li><p>
	<span><span><span><b><span
    >Maxar
	Open Data - </span></b></span></span></span><a href="https://www.maxar.com/open-data"><span
                    ><span><span><u><span
                    ><span
                    >https://www.maxar.com/open-data</span></span></u></span></span></span></a>
                    </p></li>
                    <li><p
                    >
	<span><span><span><b><span
    >Planet
	Disaster Datasets - </span></b></span></span></span><a
                        href="https://www.planet.com/disasterdata"><u>https://www.planet.com/disasterdata</u></a>
                    </p></li>
                </ul>
                <p>There
is also the community-based <a href="https://openaerialmap.org/">Open Aerial Map</a> that
provides openly licensed satellite and unmanned aerial vehicle (UAV)
imagery and is worth checking for your area of interest.</p>
                <h3><span
                    >IFRC
Partnerships</span></h3>
                <p>
                    <span
                    >If
none of the above sources have the imagery required, IFRC can
activate the following partnerships to gain access to more imagery.</span></p>
                <h3>
                    <span
                    >International
Space Charter and Major Disasters</span></h3>
                <p><a
                    href="https://disasterscharter.org/web/guest/home"><span><span><span
                ><u><span><span
                >https://disasterscharter.org/web/guest/home</span></span></u></span></span></span></a>
                </p>
                <p>
                    <span
                    >The
Charter is a worldwide collaboration, through which satellite data
from a wide range of commercial organisations are made available for
the benefit of disaster management. The raw imagery is normally made
available to the requesting organisation, who can then make the
derived data openly available.</span></p>
                <p>
                    <span
                    >IFRC
is able to activate the Charter through UNOSAT - who will then assist
in the analysis if required. The process for activation is the same
as above for UNOSAT assistance.</span></p>
                <p>
                    <span
                    >Check
the Charter website for a list of the latest activations:</span></p>
                <p><a
                    href="https://disasterscharter.org/web/guest/charter-activations"><span
                ><span><span><u><span
                ><span
                >https://disasterscharter.org/web/guest/charter-activations</span></span></u></span></span></span></a>
                </p>
                <p>
                    <span
                    >If
it has been activated, but the data is not available, IFRC can also
request this from UNOSAT.</span></p>
                <h3>
                    <span
                    >Airbus
Foundation</span></h3>
                <p><a
                    href="https://www.intelligence-airbusds.com/airbus-foundation/"><span
                ><span><span><u><span
                ><span
                >https://www.intelligence-airbusds.com/airbus-foundation/</span></span></u></span></span></span></a>
                </p>
                <p>
                    <span
                    >IFRC
has €100,000 of Airbus imagery credits available per year that are
available for any use across the Movement. The Airbus platform has a
huge catalogue that is constantly updated with new imagery. This can
be useful for regular updates post-disaster or frequently checking if
imagery isn’t available at first - e.g. due to cloud cover.</span></p>
                <p><span><span><span
                ><span><span>First
check if the imagery is available and if so, send a request to
</span></span></span></span></span> <a href="mailto:im@ifrc.org"><span><span><span
                ><u><span><span
                >im@ifrc.org</span></span></u></span></span></span></a> <span
                ><span><span
                >
</span></span></span><span><span
                ><span
                ><span><span>to
purchase the imagery using the credits.</span></span></span></span></span></p>
                <p>
                    <span
                    >To
check:</span></p>
                <ul>
                    <li><p
                    >
	<span><span><span><span
    ><span>Go
	to </span></span></span></span></span><a
                        href="https://www.intelligence-airbusds.com/airbus-foundation/"><span
                    ><span><span><u><span
                    ><span>Airbus
	Foundation portal</span></span></u></span></span></span></a></p></li>
                    <li><p
                    >
                        <span
                        >Upload
	or manually draw an AOI</span></p></li>
                    <ul>
                        <li><p
                        >
                            <span
                            >This
		is used to calculate cost, so keep this area as small as possible</span></p></li>
                    </ul>
                    <li><p
                    >
                        <span
                        >Image
	results will load and can then be sorted / filtered by:</span></p></li>
                    <ul>
                        <li><p
                        >
                            <span
                            >Date
		- to get the latest imagery</span></p></li>
                        <li><p
                        >
                            <span
                            >Cloud
		cover - % coverage for each image</span></p></li>
                        <li><p
                        >
                            <span
                            >Incidence
		angle - higher incidence will distort the image</span></p></li>
                        <li><p
                        >
                            <span
                            >Resolution
		- higher resolution = more detail</span></p></li>
                    </ul>
                    <li><p
                    >
                        <span
                        >You
	can then preview each image to see if it meets the need</span></p></li>
                    <li><p
                    >
                        <span
                        >If
	the image is suitable, record the image ID:</span></p></li>
                    <ul>
                        <li><p
                        >
                            <span
                            >e.g.
		</span><span
                        > DS_PHR1B_202109251030026_FR1_PX_E003N19_0123_01804</span>
                        </p></li>
                    </ul>
                    <li><p
                    >
	<span><span><span><span
    ><span>Send
	request to </span></span></span></span></span><a href="mailto:im@ifrc.org"><span
                    ><span><span><u><span
                    ><span>im@ifrc.org</span></span></u></span></span></span></a> <span
                    ><span><span><span
                    ><span>
	with:</span></span></span></span></span></p></li>
                    <ul>
                        <li><p
                        >
                            <span
                            >Operation
		the data will support</span></p></li>
                        <li><p
                        >
                            <span
                            >Area
		of interest (KML, SHP, etc.)</span></p></li>
                        <li><p
                        >
                            <span
                            >ID
		of images needed</span></p></li>
                        <li><p
                        >
                            <span
                            >How
		will the data be used?</span></p></li>
                        <li><p
                        >
                            <span
                            >What
		do you need to see? What Questions are you trying to answer?</span></p></li>
                    </ul>
                </ul>
                <p>
                    <span
                    >If
all requirements are met, the imagery will then be purchased by IFRC
Geneva IM team and the download link forwarded on.</span></p>
                <p><br/>
                </p>

                { /* temporary text ends */ }
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