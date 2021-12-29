import { StyleSheet } from '@react-pdf/renderer';

const PAGE_PADDING = 20;
const FULL_WIDTH = 595;
const SECTION_PADDING = 20;
const VERTICAL_MARGIN = 10;
const TABLE_CELL_PADDING = 10;
const HEADING_VERTICAL_PADDING = 10;
const SUBHEADING_VERTICAL_PADDING = 5;
const SECTION_WIDTH = FULL_WIDTH - SECTION_PADDING * 2 - PAGE_PADDING* 2;
const SMALL_PADDING = 7;
const TABLE_BORDER = '1px solid #ffffff';
// const FONT_SIZE_SMALL = 6;
const FONT_SIZE_MEDIUM = 8;
const FONT_SIZE_LARGE = 10;
const FONT_SIZE_EXTRA_LARGE = 14;
const FONT_SIZE_SUPER_LARGE = 20;

const pdfStyles = StyleSheet.create({
  page: {
    fontSize: FONT_SIZE_MEDIUM,
    fontFamily: 'OpenSans',
    fontWeight: 'medium',
    padding: SECTION_PADDING,
  },
  mapImage: {
    width: '100%',
    height: 200,
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
  verticalSection: {
    paddingHorizontal: SECTION_PADDING,
    paddingVertical: SECTION_PADDING / 2,
  },
  basicInfoTable: {
    width: '100%',
  },
  compactSection: {
    display: 'flex',
    justifyItem: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'row',
    width: '100%',
  },
  bannerImage: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    height: 300,
    objectFit: 'contain',
    objectPosition: 'center',
  },
  textLabelSection: {
    color: '#011e41',
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 90,
    objectFit: 'contain',
    objectPosition: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: FONT_SIZE_SUPER_LARGE,
    fontFamily: 'Montserrat',
    color: '#f5333f',
  },
  heading: {
    fontSize: FONT_SIZE_EXTRA_LARGE,
    fontFamily: 'Montserrat',
    color: '#f5333f',
    paddingVertical: HEADING_VERTICAL_PADDING,
  },
  subHeading: {
    fontSize: FONT_SIZE_LARGE,
    fontWeight: 'bold',
    paddingVertical: SUBHEADING_VERTICAL_PADDING,
  },
  value: {
    fontFamily: 'Montserrat',
    fontSize: FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
  textOutput: {
    backgroundColor: '#f0f0f0',
    margin: 1,
    padding: TABLE_CELL_PADDING,
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
    fontSize: FONT_SIZE_MEDIUM,
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
    backgroundColor: '#f0f0f0',
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
    fontSize: FONT_SIZE_LARGE,
    fontWeight: 'bold',
    color: "#1a245c",
    margin: 8
  },
  tableText: {
    margin: 10,
    fontSize: FONT_SIZE_MEDIUM,
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
    color: '#011e41',
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
  },
  piOutput: {
    width: '100%',
    paddingVertical: VERTICAL_MARGIN,
  },
  piRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  piIconCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  piIcon: {
    width: 20,
    height: 20,
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
    backgroundColor: '#f0f0f0',
  },
  niIconCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  niIcon: {
    width: 20,
    height: 20,
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
    paddingTop: 2,
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
    fontFamily: 'Montserrat',
    marginRight: SMALL_PADDING,
  },
});

export default pdfStyles;

