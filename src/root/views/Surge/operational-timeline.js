import React from "react";
import { ReactComponent as OperationalTimelineTitleSvg } from '../../../assets/graphics/content/operational_timeline_title.svg';
import { ReactComponent as OperationalTimelineBodySvg } from "../../../assets/graphics/content/operational_timeline_body.svg";
import { ReactComponent as OperationalTimelineLegend } from '../../../assets/graphics/content/operational_timeline_legend.svg';
import OperationTimelineContent from './contentData/operation-timeline-content';

let originalTextContainerColor = "";
let originalCircleContainerColor = "";

export default class OperationalTimeline extends React.Component {

    componentDidMount() {
        this.createEventListeners();
    }

    findParentObjectById(target) {
        var foundParent = false;
        while (!foundParent) {
            if (target.parentElement.tagName === "svg") {
                return undefined;
            }
            var id = target.parentElement.getAttribute("id");

            if (id.startsWith("surge_table/element") || id.startsWith("surge_table/tooltips")) {
                target = target.parentElement;
                foundParent = true;
            }

            if (!foundParent) {
                target = target.parentElement;
            }
        }

        return target;
    }

    onClick = (event) => {
        var clickedElement = this.findParentObjectById(event.target);
        if (clickedElement === undefined) {
            return;
        }
        
        var clickedObject = OperationTimelineContent.find(d => d.id === clickedElement.getAttribute("id"));
        if (clickedObject !== undefined && clickedObject.url !== '') {
            window.open(clickedObject.url, '_blank');
        }
    }

    onHover = (event) => {
        var hoveredElement = this.findParentObjectById(event.target);
        if (hoveredElement === undefined) {
            return;
        }
        var id = hoveredElement.getAttribute("id");
        var textContainerElement, circleElement, underLineElement;

        if (event.type === 'mouseover') {

            if (id.startsWith("surge_table/element")) {
                // color text container
                textContainerElement = hoveredElement.firstElementChild;
                originalTextContainerColor = textContainerElement.style.fill;
                textContainerElement.style.fill = "#FEEFF0";

                // hide underline under text container
                underLineElement = textContainerElement.nextElementSibling;
                underLineElement.style.visibility = "hidden";

                // color circle container
                circleElement = underLineElement.nextElementSibling.nextElementSibling.firstElementChild;
                originalCircleContainerColor = circleElement.style.fill;
                circleElement.style.fill = "#F5333F";
            } else if (id.startsWith("surge_table/tooltips")) {
                // color text container
                textContainerElement = hoveredElement.firstElementChild.firstElementChild;
                originalTextContainerColor = textContainerElement.style.fill;
                textContainerElement.style.fill = "#FEEFF0";

                // color circle element
                circleElement = hoveredElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild;
                if (circleElement.tagName === 'g') {
                    circleElement = circleElement.firstElementChild;
                }
                originalCircleContainerColor = circleElement.style.fill;
                circleElement.style.fill = "#F5333F";
            }

        } else if (event.type === 'mouseout') {

            if (id.startsWith("surge_table/element")) {
                // color back text container
                textContainerElement = hoveredElement.firstElementChild;
                textContainerElement.style.fill = originalTextContainerColor;
                originalTextContainerColor = "";

                // unhide underline under text container
                underLineElement = textContainerElement.nextElementSibling;
                underLineElement.style.visibility = "visible";

                // color back circle container
                circleElement = underLineElement.nextElementSibling.nextElementSibling.firstElementChild;
                circleElement.style.fill = originalCircleContainerColor;
                originalCircleContainerColor = "";
            } else if (id.startsWith("surge_table/tooltips")) {
                // color text container
                textContainerElement = hoveredElement.firstElementChild.firstElementChild;
                textContainerElement.style.fill = originalTextContainerColor;
                originalTextContainerColor = "";

                // color back circle element
                circleElement = hoveredElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild;
                if (circleElement.tagName === 'g') {
                    circleElement = circleElement.firstElementChild;
                }
                circleElement.style.fill = originalCircleContainerColor;
                originalCircleContainerColor = "";
            }

        }
    }

    createEventListeners() {
        const svg = document.getElementById('OperationalTimelineToolbox');
        if (svg === undefined || svg === null) {
            return;
        }

        svg.addEventListener('click', this.onClick);
        svg.addEventListener("mouseover", this.onHover);
        svg.addEventListener("mouseout", this.onHover);
    }

    render() {
        return (
            <div className="operationalTimelineContainer">
                <OperationalTimelineLegend />
                <div className="svgHeader">
                    <OperationalTimelineTitleSvg />
                </div>
                <div className="svgBody">
                    <OperationalTimelineBodySvg />
                </div>
            </div>
        );
    }
}