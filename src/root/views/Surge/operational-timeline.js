import React from "react";
import { ReactComponent as OperationalTimelineTitleSvg } from '../../../assets/graphics/content/operational_timeline_title.svg';
import { ReactComponent as OperationalTimelineBodySvg } from "../../../assets/graphics/content/operational_timeline_body.svg";
import { ReactComponent as OperationalTimelineLegend } from '../../../assets/graphics/content/operational_timeline_legend.svg';

let originalTextContainerColor = "";
let originalCircleContainerColor = "";

export default class OperationalTimeline extends React.Component {

    componentDidMount() {
        this.createEventListeners();
    }

    createEventListeners() {
        const svg = document.getElementById('OperationalTimelineToolbox');
        if (svg === undefined || svg === null) {
            return;
        }

        // click
        /* URL needed... And uncomment this line cursor: pointer; in _operationalTimeline.scss
        svg.addEventListener('click', function (event) {
            var foundParent = false;
            var clickedElement = event.target;
            var id = "";
            while (!foundParent) {
                if (clickedElement.parentElement.tagName === "svg") {
                    return;
                }
                id = clickedElement.parentElement.getAttribute("id");
                if (id.startsWith("surge table / element") || id.startsWith("surge_table/element")) {
                    clickedElement = clickedElement.parentElement;
                    foundParent = true;
                } else if (id.startsWith("surge table / tooltips") || id.startsWith("surge_table/tooltips")) {
                    clickedElement = clickedElement.parentElement;
                    foundParent = true;
                }
                if (!foundParent) {
                    clickedElement = clickedElement.parentElement;
                }
            }

            var baseUrl = "https://www.google.com/search?q=";
            window.open(baseUrl + id, '_blank');
        });
        */

        // hover
        svg.addEventListener("mouseover", function (event) {
            var foundParent = false;
            var mouseOverElement = event.target;
            var id = "";
            while (!foundParent) {
                if (mouseOverElement.parentElement.tagName === "svg") {
                    return;
                }
                id = mouseOverElement.parentElement.getAttribute("id");
                if (id.startsWith("surge table / element") || id.startsWith("surge_table/element")) {
                    mouseOverElement = mouseOverElement.parentElement;
                    foundParent = true;
                } else if (id.startsWith("surge table / tooltips") || id.startsWith("surge_table/tooltips")) {
                    mouseOverElement = mouseOverElement.parentElement;
                    foundParent = true;
                }
                if (!foundParent) {
                    mouseOverElement = mouseOverElement.parentElement;
                }
            }

            var textContainerElement;
            var circleElement;
            if (id.startsWith("surge table / element") || id.startsWith("surge_table/element")) {
                // color text container
                textContainerElement = mouseOverElement.firstElementChild;
                originalTextContainerColor = textContainerElement.style.fill;
                textContainerElement.style.fill = "#FEEFF0";

                // hide underline under text container
                var underLineElement = textContainerElement.nextElementSibling;
                underLineElement.style.visibility = "hidden";

                // color circle container
                circleElement = underLineElement.nextElementSibling.nextElementSibling.firstElementChild;
                originalCircleContainerColor = circleElement.style.fill;
                circleElement.style.fill = "#F5333F";
            } else if (id.startsWith("surge table / tooltips") || id.startsWith("surge_table/tooltips")) {
                // color text container
                textContainerElement = mouseOverElement.firstElementChild.firstElementChild;
                originalTextContainerColor = textContainerElement.style.fill;
                textContainerElement.style.fill = "#FEEFF0";

                // color circle element
                circleElement = mouseOverElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild;
                if (circleElement.tagName === 'g') {
                    circleElement = circleElement.firstElementChild;
                }
                originalCircleContainerColor = circleElement.style.fill;
                circleElement.style.fill = "#F5333F";
            }
        });
        svg.addEventListener("mouseout", function (event) {
            var foundParent = false;
            var mouseOutElement = event.target;
            var id = "";
            while (!foundParent) {
                if (mouseOutElement.parentElement.tagName === "svg") {
                    return;
                }
                id = mouseOutElement.parentElement.getAttribute("id");
                if (id.startsWith("surge table / element") || id.startsWith("surge_table/element")) {
                    mouseOutElement = mouseOutElement.parentElement;
                    foundParent = true;
                } else if (id.startsWith("surge table / tooltips") || id.startsWith("surge_table/tooltips")) {
                    mouseOutElement = mouseOutElement.parentElement;
                    foundParent = true;
                }
                if (!foundParent) {
                    mouseOutElement = mouseOutElement.parentElement;
                }
            }

            var textContainerElement;
            var circleElement;
            if (id.startsWith("surge table / element") || id.startsWith("surge_table/element")) {
                // color back text container
                textContainerElement = mouseOutElement.firstElementChild;
                textContainerElement.style.fill = originalTextContainerColor;
                originalTextContainerColor = "";

                // unhide underline under text container
                var underLineElement = textContainerElement.nextElementSibling;
                underLineElement.style.visibility = "visible";

                // color back circle container
                circleElement = underLineElement.nextElementSibling.nextElementSibling.firstElementChild;
                circleElement.style.fill = originalCircleContainerColor;
                originalCircleContainerColor = "";
            } else if (id.startsWith("surge table / tooltips") || id.startsWith("surge_table/tooltips")) {
                // color text container
                textContainerElement = mouseOutElement.firstElementChild.firstElementChild;
                textContainerElement.style.fill = originalTextContainerColor;
                originalTextContainerColor = "";

                // color back circle element
                circleElement = mouseOutElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild;
                if (circleElement.tagName === 'g') {
                    circleElement = circleElement.firstElementChild;
                }
                circleElement.style.fill = originalCircleContainerColor;
                originalCircleContainerColor = "";
            }
        });
    }

    render() {
        return (
            <div className="operationalTimelineContainer">
                <OperationalTimelineLegend/>
                <div className="svgHeader">
                    <OperationalTimelineTitleSvg/>
                </div>
                <div className="svgBody">
                    <OperationalTimelineBodySvg/>
                </div>
            </div>
        );
    }
}