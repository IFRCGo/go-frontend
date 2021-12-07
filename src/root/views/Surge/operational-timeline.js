import React from "react";
// import { ReactComponent as OperationalTimelineTitleSvg } from '../../../assets/graphics/content/operational_timeline_title.svg';
// import { ReactComponent as OperationalTimelineBodySvg } from "../../../assets/graphics/content/operational_timeline_body.svg";
import Svg from '#components/Svg';
import OperationTimelineContent from './contentData/operation-timeline-content';
import LanguageContext from "#root/languageContext";

let originalTextContainerColor = "";
let originalCircleContainerColor = "";

export default class OperationalTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.titleSvgLoaded = false;
    this.bodySvgLoaded = false;
  }

  componentDidMount() {
    this.createEventListeners();

    // open accordion
    const accordion = document.getElementsByClassName('accordion')[0];
    this.accordionClick(accordion);
  }

  findParentObjectById(target) {
    var foundParent = false;
    while (!foundParent) {
      if (target.parentElement.tagName === "svg") {
        return undefined;
      }
      var id = target.parentElement.getAttribute("id");

      if (id.startsWith("surge_table/element")) {
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
    var textContainerElement, circleElement;

    if (event.type === 'mouseover') {
      // color text container
      textContainerElement = hoveredElement.firstElementChild;
      originalTextContainerColor = textContainerElement.style.fill;
      textContainerElement.style.fill = "#FEEFF0";

      // color circle container
      circleElement = textContainerElement.nextElementSibling.nextElementSibling.firstElementChild;
      originalCircleContainerColor = circleElement.style.fill;
      circleElement.style.fill = "#F5333F";
    } else if (event.type === 'mouseout') {
      // color back text container
      textContainerElement = hoveredElement.firstElementChild;
      textContainerElement.style.fill = originalTextContainerColor;
      originalTextContainerColor = "";

      // color back circle container
      circleElement = textContainerElement.nextElementSibling.nextElementSibling.firstElementChild;
      circleElement.style.fill = originalCircleContainerColor;
      originalCircleContainerColor = "";
    }
  }

  accordionClick(btn) {
    var panel = btn.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      btn.lastElementChild.className = 'f-icon-sm-triangle-up icon';
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      btn.lastElementChild.className = 'f-icon-sm-triangle-down icon';
    }
  }

  createEventListeners() {
    if (!this.titleSvgLoaded || !this.bodySvgLoaded) {
      return;
    }

    const svg = document.getElementById('OperationalTimelineToolbox');
    if (svg === undefined || svg === null) {
      return;
    }

    svg.addEventListener('click', this.onClick);
    svg.addEventListener("mouseover", this.onHover);
    svg.addEventListener("mouseout", this.onHover);
  }

  handleTitleSvgLoad = () => {
    this.titleSvgLoaded = true;
    this.createEventListeners();
  }

  handleBodySvgLoad = () => {
    this.bodySvgLoaded = true;
    this.createEventListeners();
  }

  render() {
    const { strings } = this.context;
    return (
      <div className="operationalTimelineContainer">
        <h1>{strings.operationalToolboxH1}</h1>
        <h3>{strings.operationalToolboxH3}</h3>
        <div className="accordion" onClick={(e) => this.accordionClick(e.target)}>
          <span>{strings.operationalToolboxAccordionBtnText}</span>
          <span></span>
        </div>
        <div className="accordionPanel">
          <div>
            <span>{strings.operationalToolboxAccordionPanelText1}</span>
            <div className="listContainer">
              <span><b>{strings.operationalToolboxAccordionPanelText2}</b></span>
              <span>{strings.operationalToolboxAccordionPanelText3}</span>
              <span><b>{strings.operationalToolboxAccordionPanelText4}</b></span>
              <span>{strings.operationalToolboxAccordionPanelText5}</span>
            </div>
            <span>{strings.operationalToolboxAccordionPanelText6}</span>
          </div>
        </div>
        <div className="svgHeader margin-2-t">
          <Svg
            onInject={this.handleTitleSvgLoad}
            src="/assets/graphics/content/operational_timeline_title.svg"
          />
        </div>
        <div className="svgBody">
          <Svg
            elementId="OperationalTimelineToolbox"
            onInject={this.handleBodySvgLoad}
            src="/assets/graphics/content/operational_timeline_body.svg"
          />
        </div>
        <div className="margin-2-t">
          <p>{strings.operationalToolboxFooterText}</p>
          <p><a href="mailto:antoine.belair@ifrc.go">antoine.belair@ifrc.go</a></p>
          <p><a href="mailto:betisa.egea@ifrc.go">betisa.egea@ifrc.go</a></p>
        </div>
      </div>
    );
  }
}
OperationalTimeline.contextType = LanguageContext;
