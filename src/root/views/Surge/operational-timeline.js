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
        svg.addEventListener('click', function (event) {
            var foundParent = false;
            var clickedElement = event.target;
            var id = "";
            while (!foundParent) {
                if (clickedElement.parentElement.tagName === "svg") {
                    break;
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

            if (!foundParent) {
                return;
            }

            var clickedObject = data.find(d => d.id === id);
            if (clickedObject !== undefined && clickedObject.url !== '') {
                window.open("https://ifrcorg.sharepoint.com/sites/" + clickedObject.url, '_blank');
            } else {
                return;
            }
        });

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

const data = [
    {
        id: 'surge table / element 1',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F01%2E%20Assessments%2F01%2E01%20Conduct%20Initial%20Assessment',
        name: 'Conduct Initial Assessment'
    },
    {
        id: 'surge table / element 2',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F01%2E%20Assessments%2F01%2E02%20Conduct%20Multi%2DSector%20Rapid%20Assessment',
        name: 'Conduct Multi-Sector Rapid Assessment'
    },
    {
        id: 'surge table / element 3',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F01%2E%20Assessments%2F01%2E03%20Conduct%20In%2DDepth%20Multi%2DSector%20Assessment%20%26%20Produce%20Report',
        name: 'Conduct In-Depth Multi-Sector Assessment & Produce Report'
    },
    {
        id: 'surge table / element 4',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F02%2E%20Planning%2F02%2E01%20Launch%20DREF',
        name: 'Launch DREF'
    },
    {
        id: 'surge table / element 5',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F02%2E%20Planning%2F02%2E02%20Establish%20EA%20Funding%20Requirements',
        name: 'Establish EA Funding Requirements'
    },
    {
        id: 'surge table / element 6',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F02%2E%20Planning%2F02%2E03%20Launch%20EA',
        name: 'Launch EA'
    },
    {
        id: 'surge table / tooltips top',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F02%2E%20Planning%2F02%2E04%20Develop%20Response%20Options',
        name: 'Develop Response Options'
    },
    {
        id: 'surge table / tooltips top_12',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F02%2E%20Planning%2F02%2E05%20Complete%20EPoA',
        name: 'Complete EPoA'
    },
    {
        id: 'surge table / tooltips top_13',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F02%2E%20Planning%2F02%2E07%20Create%20Risk%20Register',
        name: 'Create Risk Register'
    },
    {
        id: 'surge table / element 4_2',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F02%2E%20Planning%2F02%2E08%20Create%20Transition%20Plan',
        name: 'Create Transition Plan'
    },
    {
        id: 'surge table / element 5_2',
        url: '', 
        name: 'Hold revised response options and planning workshops'
    },
    {
        id: 'surge table / element 6_2', 
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F02%2E%20Planning%2F02%2E09%20Revision%20to%20Emergency%20Appeal',
        name: 'Revision to Emergency Appeal'
    },
    {
        id: 'surge table / element 7', 
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F02%2E%20Planning%2F02%2E10%20Develop%20Initial%20Recovery%20Approach', 
        name: 'Develop Initial Recovery Approach'
    },
    {
        id: 'surge table / element 8',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F03%2E%20Coordination%2F03%2E01%20Establish%20Task%20Forces',
        name: 'Establish Task Forces'
    },
    {
        id: 'surge table / tooltips top_2',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F03%2E%20Coordination%2F03%2E02%20Hold%20in%2Dcountry%20Movement%20Partner%20Meetings',
        name: 'Hold in-country Movement Partner Meetings'
    },
    {
        id: 'surge table / element 11',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F03%2E%20Coordination%2F03%2E02%20Hold%20in%2Dcountry%20Movement%20Partner%20Meetings',
        name: 'Hold in-country Movement Partner Meetings'
    },
    {
        id: 'surge table / element 9',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F03%2E%20Coordination%2F03%2E03%20Activate%20Shelter%20Cluster',
        name: 'Activate Shelter Cluster'
    },
    {
        id: 'surge table / tooltips left_5',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F03%2E%20Coordination%2F03%2E04%20Hold%20Mini%20Summit',
        name: 'Hold Mini Summit'
    },
    {
        id: 'surge table / tooltips left',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F03%2E%20Coordination%2F03%2E05%20Create%20External%20Coordination%20Engagement%20Plan',
        name: 'Create External Coordination Engagement Plan'
    },
    {
        id: 'surge table / element 10',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F03%2E%20Coordination%2F03%2E06%20Revise%20Movement%20Coordination%20Framework',
        name: 'Revise Movement Coordination Framework'
    },
    {
        id: 'surge table / element 30',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F03%2E%20Coordination%2F03%2E07%20Create%20Federation%2DWide%20Joint%20Response%20Plan%2C%20Movement%20Picture',
        name: 'Create Federation-Wide Joint Response Plan, Movement Picture'
    },
    {
        id: 'surge table / element 12',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F04%2E%20HR%2F04%2E01%20Send%20Surge%20Alert',
        name: 'Send Surge Alert'
    },
    {
        id: 'surge table / element 13',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F04%2E%20HR%2F04%2E02%20Setup%20HR%20Plan',
        name: 'Setup HR Plan'
    },
    {
        id: 'surge table / tooltips left_6',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F04%2E%20HR%2F04%2E03%20Create%20Staff%20Care%20and%20Duty%20of%20Care%20Advice',
        name: 'Create Staff Care and Duty of Care Advice'
    },
    {
        id: 'surge table / element 14',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F04%2E%20HR%2F04%2E04%20Identify%20Surge%20Needs%20for%20Future%20Rotations',
        name: 'Identify Surge Needs for Future Rotations'
    },
    {
        id: 'surge table / tooltips left_2',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F04%2E%20HR%2F04%2E05%20Organigram%20for%20NS%20%26%20IFRC',
        name: 'Organigram for NS & IFRC'
    },
    {
        id: 'surge table / element 15',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F04%2E%20HR%2F04%2E06%20Post%20JDs%20for%20Standard%20Role%20Profiles',
        name: 'Post JDs for Standard Role Profiles'
    },
    {
        id: 'surge table / element 16',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F04%2E%20HR%2F04%2E07%20Complete%20End%20of%20Mission%20Steps',
        name: 'Complete End of Mission Steps'
    },
    {
        id: 'surge table / tooltips left_3',
        url: '',
        name: 'Update Organigram'
    },{
        id: 'surge table / tooltips left_4',
        url: '',
        name: 'Update Organigram'
    },
    {
        id: 'surge table / element 17',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F05%2E%20Monitoring%20Evaluation%20%26%20Reporting%2F05%2E01%20Create%20Sitreps',
        name: 'Create Sitreps'
    },
    {
        id: 'surge table / tooltips top_3',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F05%2E%20Monitoring%20Evaluation%20%26%20Reporting%2F05%2E02%20Develop%20Ops%20Update%201%20%26%202',
        name: 'Develop Ops Update 1 & 2'
    },
    {
        id: 'surge table / tooltips left_7',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F05%2E%20Monitoring%20Evaluation%20%26%20Reporting%2F05%2E02%20Develop%20Ops%20Update%201%20%26%202',
        name: 'Develop Ops Update 1 & 2'
    },
    {
        id: 'surge table / tooltips left_8',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F05%2E%20Monitoring%20Evaluation%20%26%20Reporting%2F05%2E03%20Develop%20M%26E%20Plan',
        name: 'Develop M&E Plan'
    },
    {
        id: 'surge table / element 18',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F05%2E%20Monitoring%20Evaluation%20%26%20Reporting%2F05%2E04%20Create%20Indicator%20Tracking%20Table',
        name: 'Create Indicator Tracking Table'
    },
    {
        id: 'surge table / element 19',
        url: '',
        name: 'Revise M&E Plan'
    },
    {
        id: 'surge table / element 20',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F05%2E%20Monitoring%20Evaluation%20%26%20Reporting%2F05%2E05%20Conduct%20Federation%2DWide%20Reporting',
        name: 'Conduct Federation-Wide Reporting'
    },
    {
        id: 'surge table / element 21',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F05%2E%20Monitoring%20Evaluation%20%26%20Reporting%2F05%2E06%20Conduct%20RTE',
        name: 'Conduct RTE'
    },
    {
        id: 'surge table / tooltips left_9',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F06%2E%20IM%2F06%2E01%20Define%20IM%20Strategy',
        name: 'Define IM Strategy'
    },
    {
        id: 'surge table / tooltips left_23',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F06%2E%20IM%2F06%2E02%20Activate%20SIMS',
        name: 'Activate SIMS'
    },
    {
        id: 'surge table / tooltips left_24',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F06%2E%20IM%2F06%2E03%20Produce%204W%20Map',
        name: 'Produce 4W Map'
    },
    {
        id: 'surge table / tooltips left_25',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F06%2E%20IM%2F06%2E04%20Produce%20Presence%20and%20%26%20Response%20Map',
        name: 'Produce Presence and & Response Map'
    },
    {
        id: 'surge table / tooltips top_11',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F06%2E%20IM%2F06%2E05%20Setup%20Dashboards%20and%20Visualization%20%28GO%29',
        name: 'Setup Dashboards and Visualization (GO)'
    },
    {
        id: 'surge table / element 22',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E01%20Develop%20DREF%20Project%20Agreement',
        name: 'Develop DREF Project Agreement'
    },
    {
        id: 'surge table / element 23',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E02%20Develop%20Operating%20Budget',
        name: 'Develop Operating Budget'
    },
    {
        id: 'surge table / tooltips left_10',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E03%20Revise%20Operating%20Budget',
        name: 'Revise Operating Budget'
    },
    {
        id: 'surge table / element 25',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E04%20Develop%20Appeal%20Project%20Agreement',
        name: 'Develop Appeal Project Agreement'
    },
    {
        id: 'surge table / tooltips top_8',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E05%20Revise%20Operating%20Budget',
        name: 'Revise Operating Budget'
    },
    {
        id: 'surge table / tooltips top_9',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E05%20Revise%20Operating%20Budget',
        name: 'Revise Operating Budget'
    },
    {
        id: 'surge table / tooltips top_10',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E05%20Revise%20Operating%20Budget',
        name: 'Revise Operating Budget'
    },
    {
        id: 'surge table / element 24',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E07%20PEAR',
        name: 'PEAR'
    },
    {
        id: 'surge table / tooltips left_11',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E08%20Develop%20Plan%20of%20Arrival',
        name: 'Develop Plan of Arrival'
    },
    {
        id: 'surge table / element 27',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E09%20Partners%20Call',
        name: 'Partners Call'
    },
    {
        id: 'surge table / tooltips left_12',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E10%20Develop%20Resource%20Mobilization%20Plan',
        name: 'Develop Resource Mobilization Plan'
    },
    {
        id: 'surge table / element 28',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E11%20Update%20Resource%20Mobilization%20Tracking%20and%20Pledge%20Status',
        name: 'Update Resource Mobilization Tracking and Pledge Status'
    },
    {
        id: 'surge table / tooltips left_13',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E12%20Establish%20Welcome%20Service',
        name: 'Establish Welcome Service'
    },
    {
        id: 'surge table / element 29',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F07%2E%20Finance%2C%20Admin%2C%20Resource%20planning%2F07%2E13%20Monitor%20Pledges%2C%20Donors%20Requirements%2C%20and%20Interest',
        name: 'Monitor Pledges, Donors Requirements, and Interest'
    },
    {
        id: 'surge table / tooltips left_14',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F08%2E%20Logistics%2F08%2E01%20Review%20Custom%20Regulations%20and%20Clearance',
        name: 'Review Custom Regulations and Clearance'
    },
    {
        id: 'surge table / element 26',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F08%2E%20Logistics%2F08%2E02%20Mobilization%20Table%20in%20Place%20%26%20Modified%20as%20Operations%20Progresses',
        name: 'Mobilization Table in Place & Modified as Operations Progresses'
    },
    {
        id: 'surge table / tooltips left_15',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F08%2E%20Logistics%2F08%2E03%20Set%20Up%20Fleet%20Plan',
        name: 'Set Up Fleet Plan'
    },
    {
        id: 'surge table / tooltips left_20',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F08%2E%20Logistics%2F08%2E04%20Set%20Up%20Fleet%2C%20Start%20Mobilization%20of%20Regional%20Fleet',
        name: 'Set Up Fleet, Start Mobilization of Regional Fleet'
    },
    {
        id: 'surge table / tooltips left_16',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F08%2E%20Logistics%2F08%2E05%20Create%20Logistics%20Plan',
        name: 'Create Logistics Plan'
    },
    {
        id: 'surge table / tooltips left_22',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F08%2E%20Logistics%2F08%2E06%20Set%20Up%20Procurement%20Plan',
        name: 'Set Up Procurement Plan'
    },
    {
        id: 'surge table / tooltips left_21',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F08%2E%20Logistics%2F08%2E07%20Revise%20Procurement%20Plan',
        name: 'Revise Procurement Plan'
    },
    {
        id: 'surge table / tooltips left_17',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F09%2E%20Duty%20of%20care%2F09%2E01%20Develop%20Security%20Plan',
        name: 'Develop Security Plan'
    },
    {
        id: 'surge table / tooltips left_19',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F09%2E%20Duty%20of%20care%2F09%2E02%20Develop%20Medevac',
        name: 'Develop Medevac'
    },
    {
        id: 'surge table / tooltips left_18',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F09%2E%20Duty%20of%20care%2F09%2E03%20Review%20Security%20Plan%20and%20Regulation',
        name: 'Review Security Plan and Regulation'
    },
    {
        id: 'surge table / tooltips top_4',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F10%2E%20Other%2F10%2E01%20Define%20Key%20Messages%20%26%20Reactive%20Lines',
        name: 'Define Key Messages & Reactive Lines'
    },
    {
        id: 'surge table / tooltips top_5',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F10%2E%20Other%2F10%2E02%20Develop%20Communications%20Plan%20%26%20Strategy',
        name: 'Develop Communications Plan & Strategy'
    },
    {
        id: 'surge table / tooltips top_6',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F10%2E%20Other%2F10%2E03%20Create%20Environmental%20Impact%20Plan',
        name: 'Create Environmental Impact Plan'
    },
    {
        id: 'surge table / tooltips top_7',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F10%2E%20Other%2F10%2E04%20Establish%20Compliance%20Steps',
        name: 'Establish Compliance Steps'
    },
    {
        id: 'notExists',
        url: 'IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?RootFolder=/sites%2FIFRCSharing%2FShared%20Documents%2FGLOBAL%20SURGE%2FOPERATIONAL%20TOOLBOX%2F1%2E%20Timeline%20documents%2F10%2E%20Other%2F10%2E05%20Preparedness%20for%20Effective%20Response%20%28PER%29',
        name: 'Preparedness for Effective Response (PER)'
    }
];