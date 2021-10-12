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