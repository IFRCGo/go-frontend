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
    var siblingElement;

    // console.log('parent: ' + hoveredElement.id);

    if (event.type === 'mouseover') {
      // color text container
      textContainerElement = hoveredElement.firstElementChild;

      if (!textContainerElement.id.startsWith('Sign up for Surge'))
      {
      originalTextContainerColor = textContainerElement.style.fill;
      textContainerElement.style.fill = "#FEEFF0";
                
      // color sibling text container
      siblingElement = this.getSibling(textContainerElement.id);
      
      if (siblingElement !== "") {
        siblingElement.style.fill = "#FEEFF0";
        // color the sibling's circle container
        if (siblingElement.nextElementSibling !== null && siblingElement.nextElementSibling.nextElementSibling !==null )
        {
          circleElement = siblingElement.nextElementSibling.nextElementSibling.firstElementChild;
        }
              
        if (circleElement !== undefined)
        {
          originalCircleContainerColor = circleElement.style.fill;
          circleElement.style.fill = "#F5333F";
        }
      }


      // color the circle container
      if (textContainerElement.nextElementSibling !== null && textContainerElement.nextElementSibling.nextElementSibling !==null )
      {
        circleElement = textContainerElement.nextElementSibling.nextElementSibling.firstElementChild;
      }
            
      if (circleElement !== undefined)
      {
        originalCircleContainerColor = circleElement.style.fill;
        circleElement.style.fill = "#F5333F";
      }
    }
      


    } else if (event.type === 'mouseout') {
      // color back text container
      textContainerElement = hoveredElement.firstElementChild;
      if (!textContainerElement.id.startsWith('Sign up for Surge'))
      {
      textContainerElement.style.fill = originalTextContainerColor;

      siblingElement = this.getSibling(textContainerElement.id);
      if (siblingElement !== "") {
        siblingElement.style.fill = originalTextContainerColor;
        // color back the sibling's circle container
        if (siblingElement.nextElementSibling !== null && siblingElement.nextElementSibling.nextElementSibling !==null )
        {
          circleElement = siblingElement.nextElementSibling.nextElementSibling.firstElementChild;
        }
              
        if (circleElement !== undefined)
        {
          circleElement.style.fill = originalCircleContainerColor;
          originalCircleContainerColor = "";
        }
      }

      originalTextContainerColor = "";

      // color back circle container
      if (textContainerElement.nextElementSibling !== null && textContainerElement.nextElementSibling.nextElementSibling !==null )
      {
        circleElement = textContainerElement.nextElementSibling.nextElementSibling.firstElementChild;
      }
      if (circleElement !== undefined)
      {
        circleElement.style.fill = originalCircleContainerColor;
        originalCircleContainerColor = "";
      }
     }
    }
  }

  getSibling(id){
    let siblingId= "";
    if(id === 'Rectangle 32_7') {siblingId = document.getElementById('Rectangle 32_8');} else
    if(id === 'Rectangle 32_8') {siblingId = document.getElementById('Rectangle 32_7');} else
    if(id === 'Rectangle 32_16') {siblingId = document.getElementById('Rectangle 32_17');} else
    if(id === 'Rectangle 32_17') {siblingId = document.getElementById('Rectangle 32_16');} else
    if(id === 'Rectangle 32_25') {siblingId = document.getElementById('Rectangle 32_26');} else
    if(id === 'Rectangle 32_26') {siblingId = document.getElementById('Rectangle 32_25');} else
    if(id === 'Rectangle 32_27') {siblingId = document.getElementById('Rectangle 32_28');} else
    if(id === 'Rectangle 32_28') {siblingId = document.getElementById('Rectangle 32_27');} else
    if(id === 'Rectangle 32_29') {siblingId = document.getElementById('Rectangle 32_30');} else
    if(id === 'Rectangle 32_30') {siblingId = document.getElementById('Rectangle 32_29');} else
    if(id === 'Rectangle 32_47') {siblingId = document.getElementById('Rectangle 32_48');} else
    if(id === 'Rectangle 32_56') {siblingId = document.getElementById('Rectangle 32_57');} else
    if(id === 'Rectangle 32_57') {siblingId = document.getElementById('Rectangle 32_56');} else
    if(id === 'Rectangle 32_58') {siblingId = document.getElementById('Rectangle 32_59');} else
    if(id === 'Rectangle 32_59') {siblingId = document.getElementById('Rectangle 32_58');} else
    if(id === 'Rectangle 32_48') {siblingId = document.getElementById('Rectangle 32_47');} 
    
    return siblingId;
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
          <p><a href="mailto:antoine.belair@ifrc.go">antoine.belair@ifrc.org</a></p>
          <p><a href="mailto:betisa.egea@ifrc.go">betisa.egea@ifrc.org</a></p>
        </div>

        <div className="margin-2-t">
          <p>{strings.operationalToolboxFooterTextPer1Text} <a href="https://eur02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fifrcorg.sharepoint.com%2Fsites%2FIFRCSharing%2FNS%2520Preparedness%2FForms%2FAllItems.aspx%3Fid%3D%252Fsites%252FIFRCSharing%252FNS%2520Preparedness%252FNSP%2520sharing%252FPER%2520into%2520Operations%26p%3Dtrue%26originalPath%3DaHR0cHM6Ly9pZnJjb3JnLnNoYXJlcG9pbnQuY29tLzpmOi9zL0lGUkNTaGFyaW5nL0VoZm1ycHprMk14RnNrMFFxal9Qb1RzQk1ubF9COUwzVHcyVGRzSXlWTnpQWmc_cnRpbWU9VXF4SjhtT08yVWc&data=04%7C01%7CAnaMaria.ESCOBAR%40ifrc.org%7Ced517ec29d684796fe4908d99aefff43%7Ca2b53be5734e4e6cab0dd184f60fd917%7C0%7C0%7C637711177887192449%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&sdata=As8%2BYejx8Jna%2BN07mYjGtATYFaR9GBkl1qImOYnD8dU%3D&reserved=0">{strings.operationalToolboxFooterTextPer2LinkText}</a>  {strings.operationalToolboxFooterTextPer3Text} </p>
          <ol style={{ listStyleType: "lower-alpha" }}>
            <li>{strings.operationalToolboxFooterTextList1Part1} <b>{strings.operationalToolboxFooterTextList1Part2Bold} </b> {strings.operationalToolboxFooterTextList1Part3}</li>
            <li>{strings.operationalToolboxFooterTextList2Part1} <b>{strings.operationalToolboxFooterTextList2Part1Bold}</b> {strings.operationalToolboxFooterTextList2Part3} <b>{strings.operationalToolboxFooterTextList2Part4Bold} </b>, </li>
            <li>{strings.operationalToolboxFooterTextList3Part1} <a href="https://go.ifrc.org/preparedness#resources-catalogue">{strings.operationalToolboxFooterTextList3Part2Link}</a></li>
            <li>{strings.operationalToolboxFooterTextList4Part1} <b>{strings.operationalToolboxFooterTextList4Part2Bold}</b></li>
            <li>{strings.operationalToolboxFooterTextList5Part1} <a href="https://go.ifrc.org/preparedness#operational-learning">{strings.operationalToolboxFooterTextList5Part2Link}</a> {strings.operationalToolboxFooterTextList5Part3} <a href="https://eur02.safelinks.protection.outlook.com/ap/w-59584e83/?url=https%3A%2F%2Fifrcorg.sharepoint.com%2F%3Aw%3A%2Fr%2Fsites%2FIFRCSharing%2F_layouts%2F15%2FDoc.aspx%3Fsourcedoc%3D%257B649265AA-DCEE-467D-99FC-EEA27C53B2B1%257D%26file%3D3.4%2520Discussion%2520points%2520for%2520DREF%2520operations%2520Lessons%2520Learnt%2520exercise.docx%26action%3Ddefault%26mobileredirect%3Dtrue&data=04%7C01%7CAnaMaria.ESCOBAR%40ifrc.org%7Ced517ec29d684796fe4908d99aefff43%7Ca2b53be5734e4e6cab0dd184f60fd917%7C0%7C0%7C637711177887192449%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&sdata=Qgqny5AAgYRT4jV5mrfSxXZENXUMO4ufXeexPr0Dkg8%3D&reserved=0">{strings.operationalToolboxFooterTextList5Part4Link}</a> {strings.operationalToolboxFooterTextList5Part5}</li>
            <li>{strings.operationalToolboxFooterTextList6Part1} <b>{strings.operationalToolboxFooterTextList6Part2Bold}</b></li>
          </ol>

          {strings.operationalToolboxFooterTextGeneralInfoPart1} 
          <a href="https://www.ifrc.org/disaster-preparedness"> {strings.operationalToolboxFooterTextGeneralInfoPart2Link} </a>
          {strings.operationalToolboxFooterTextGeneralInfoPart3} 
          <a href="https://go.ifrc.org/preparedness#global-summary"> {strings.operationalToolboxFooterTextGeneralInfoPart4Link} </a>
          {strings.operationalToolboxFooterTextGeneralInfoPart5} 
          <a href="https://go.ifrc.org/preparedness#global-performance"> {strings.operationalToolboxFooterTextGeneralInfoPart6Link} </a>
          {strings.operationalToolboxFooterTextGeneralInfoPart7} 
          <a href="mailto:Marjorie.sotofranco@ifrc.org"> Marjorie.sotofranco@ifrc.org </a>
          

        </div>

      </div>
    );
  }
}
OperationalTimeline.contextType = LanguageContext;
