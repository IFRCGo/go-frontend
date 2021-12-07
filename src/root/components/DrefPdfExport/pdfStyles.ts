import { StyleSheet } from '@react-pdf/renderer';

const FULL_WIDTH = 595;
const SECTION_PADDING = 20;
const VERTICAL_MARGIN = 10;
const HEADING_VERTICAL_PADDING = 10;
const SECTION_WIDTH = FULL_WIDTH - SECTION_PADDING * 2;
const SMALL_PADDING = 5;
const TABLE_BORDER = '1px solid #000000';

const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'OpenSans',
    fontSize: 10,
  },
  mapImage: {
    width: 240,
    height: 360,
    objectFit: 'contain',
    objectPosition: 'center',
  },
  section: {
    padding: SECTION_PADDING,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  compactSection: {
    display: 'flex',
    justifyItem: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'row',
    width: '100%',
  },
  bannerImage: {
    width: 400,
    height: 300,
    objectFit: 'contain',
    objectPosition: 'center',
  },
  textSection: {
    padding: SECTION_PADDING,
  },
  textLabelSection: {
    paddingTop: SECTION_PADDING,
  },
  logo: {
    width: 100,
    height: 100,
  },
  icon: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Montserrat',
    color: '#f5333f',
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Montserrat',
    color: '#f5333f',
    paddingVertical: HEADING_VERTICAL_PADDING,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    fontFamily: 'OpenSans',
  },
  value: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },
  textOutput: {
    backgroundColor: '#f0f0f0',
    margin: 1,
    padding: 10,
  },
  oneByThree: {
    width: '33%',
  },
  twoByThree: {
    width: '66%',
  },
  threeByThree: {
    width: '99%',
  },
  oneByTwo: {
    width: '50%',
  },

  table: {
    fontSize: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "stretch",
    flexWrap: "nowrap",
    alignItems: "stretch",
  },

  row: {
    display: "flex",
    flexDirection: "row",
    minWidth: '100%',
    width: '100%',
  },
  cellContent: {
    border: TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5',
    minWidth: '22%',
    maxWidth: '22%',
  },
  verticalRow: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 10,
    width: 300,
  },
  cell: {
    border: TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5',
    minWidth: '49%',
    maxWidth: '49%',
  },
  header: {
    backgroundColor: "#eee"
  },
  headerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: "#1a245c",
    margin: 8
  },
  tableText: {
    margin: 10,
    fontSize: 10,
  },
  tpSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  tpCell: {
    border: TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
  },
  tpHeaderCell: {
    border: TABLE_BORDER,
    width: SECTION_WIDTH * 0.3,
    padding: SMALL_PADDING,
    textAlign: 'center',
  },
  tpContentCell: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    border: TABLE_BORDER,
    width: SECTION_WIDTH * 0.7,
  },
  tpSubRow: {
    flexBasis: '50%',
    diplay: 'flex',
    flexDirection: 'row',
  },
  tpSubCell: {
    border: TABLE_BORDER,
    flexBasis: '50%',
    padding: SMALL_PADDING,
  },
  qna: {
    paddingVertical: SMALL_PADDING,
  },
  question: {
    color: '#818181',
  },
  answer: {
    color: '#212121',
  },
  piSection: {
    display: 'flex',
    flexDirection: 'column',
    padding: SECTION_PADDING,
    width: '100%',
  },
  piOutput: {
    width: '100%',
    paddingVertical: VERTICAL_MARGIN,
  },
  piRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  piSubRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  piHeaderCell: {
    flexBasis: SECTION_WIDTH * 0.3,
    border: TABLE_BORDER,
    padding: SMALL_PADDING,
  },
  piContentCell: {
    flexBasis: SECTION_WIDTH * 0.7,
    display: 'flex',
    flexDirection: 'row',
  },
  piSubHeadingCell: {
    padding: SMALL_PADDING,
    border: TABLE_BORDER,
    flexBasis: '30%',
  },
  piSubContentCell: {
    padding: SMALL_PADDING,
    border: TABLE_BORDER,
    flexBasis: '70%',
  },
  piBorderCell: {
    width: '100%',
    border: TABLE_BORDER,
    padding: SMALL_PADDING,
  },

  niSection: {
    display: 'flex',
    flexDirection: 'column',
    padding: SECTION_PADDING,
    width: '100%',
  },
  niOutput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  niHeaderCell: {
    padding: SMALL_PADDING,
    border: TABLE_BORDER,
    flexBasis: '30%',
  },
  niContentCell: {
    padding: SMALL_PADDING,
    border: TABLE_BORDER,
    flexBasis: '70%',
  },
  nsaOutput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  ciRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  contactSection: {
    display: 'flex',
    flexDirection: 'column',
  },

  contactList: {
    display: 'flex',
    flexDirection: 'column',
  },

  contactType: {
    fontWeight: 'bold',
    marginRight: SMALL_PADDING,
  },
});

export default pdfStyles;

