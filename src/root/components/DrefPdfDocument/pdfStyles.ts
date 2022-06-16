import { StyleSheet } from '@react-pdf/renderer';

const PAGE_PADDING = 20;
const FULL_WIDTH = 600;
const VERTICAL_MARGIN = 10;
const TABLE_CELL_PADDING = 10;
const HEADING_VERTICAL_PADDING = 10;
const SUBHEADING_VERTICAL_PADDING = 5;
const SMALL_PADDING = 7;
const TABLE_BORDER = '1px solid #ffffff';

// const FONT_SIZE_SMALL = 8;
const FONT_SIZE_MEDIUM = 10;
const FONT_SIZE_LARGE = 12;
const FONT_SIZE_EXTRA_LARGE = 15;
const FONT_SIZE_SUPER_LARGE = 20;
const FONT_SIZE_MEGA_LARGE = 27;
const FONT_SIZE_ULTRA_LARGE = 40;

const SPACING_SMALL = 6;
const SPACING_MEDIUM = 10;
const SPACING_LARGE = 16;
// const SPACING_EXTRA_LARGE = 24;
const SPACING_SUPER_LARGE = 32;
const SECTION_PADDING = SPACING_LARGE;

const SECTION_WIDTH = FULL_WIDTH - PAGE_PADDING * 2;

const COLOR_PRIMARY = '#f5333f';
const COLOR_SECONDARY = '#011e41';
const COLOR_TEXT = '#212121';
const COLOR_BACKGROUND = '#f0f0f0';

const section = StyleSheet.create({
  style: {
    paddingVertical: SECTION_PADDING,
  }
});

const subSection = StyleSheet.create({
  style: {
    paddingVertical: SECTION_PADDING / 2,
  }
});

const heading = StyleSheet.create({
  style: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: COLOR_SECONDARY,
    marginTop: SPACING_LARGE,
    marginBottom: SPACING_MEDIUM,
  }
});

const pdfStyles = StyleSheet.create({
  portraitPage: {
    fontSize: FONT_SIZE_MEDIUM,
    fontFamily: 'OpenSans',
    fontWeight: 'medium',
    padding: SPACING_SUPER_LARGE,
    color: COLOR_TEXT,
  },

  section: {
    ...section.style,
  },

  subSection: {
    ...subSection.style,
  },

  sectionHeading: {
    ...heading.style,
    fontSize: FONT_SIZE_SUPER_LARGE,
  },

  subSectionHeading: {
    ...heading.style,
    fontSize: FONT_SIZE_LARGE,
    color: COLOR_PRIMARY,
  },

  textOutputLabel: {
    fontFamily: 'OpenSans',
    fontWeight: 'medium',
  },

  text: {
    color: COLOR_TEXT,
  },

  description: {
    color: COLOR_TEXT,
  },

  textOutputValue: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },

  pageTitle: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: FONT_SIZE_MEGA_LARGE,
    color: COLOR_PRIMARY,
    textTransform: 'uppercase',
  },

  subTitle: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: FONT_SIZE_LARGE,
    color: COLOR_SECONDARY,
    textAlign: 'right',
    marginTop: SPACING_MEDIUM,
  },

  strong: {
    fontWeight: 'bold',
  },

  titleSection: {
    ...section.style,
  },

  logoAndTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  titleIfrcLogo: {
    height: FONT_SIZE_ULTRA_LARGE,
  },

  mapImage: {
    width: '100%',
    height: 200,
    objectFit: 'contain',
    objectPosition: 'center',
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
    backgroundColor: COLOR_BACKGROUND,
    width: '100%',
    height: 300,
    objectFit: 'contain',
    objectPosition: 'center',
  },
  textLabelSection: {
    color: COLOR_PRIMARY,
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
    color: COLOR_PRIMARY,
  },
  heading: {
    fontSize: FONT_SIZE_EXTRA_LARGE,
    fontFamily: 'Montserrat',
    color: COLOR_PRIMARY,
    paddingVertical: HEADING_VERTICAL_PADDING,
  },
  subHeading: {
    fontSize: FONT_SIZE_LARGE,
    fontWeight: 'bold',
    paddingVertical: SUBHEADING_VERTICAL_PADDING,
  },
  label: {
    fontFamily: 'Montserrat',
    fontSize: FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
  textOutput: {
    backgroundColor: COLOR_BACKGROUND,
    margin: 1,
    padding: TABLE_CELL_PADDING,
  },
  oneByThree: {
    width: '33.33%',
  },
  twoByThree: {
    width: '66.66%',
  },
  threeByThree: {
    width: '99.99%',
  },
  oneByTwo: {
    width: '50%',
  },
  poSection: {
    ...section.style,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'stretch',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: '100%',
    backgroundColor: COLOR_BACKGROUND,
  },
  cellContent: {
    border: TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5',
    width: '22%',
  },
  verticalRow: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: SPACING_MEDIUM,
    width: 300,
  },
  cell: {
    border: TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
    padding: SPACING_SMALL,
    width: '50%',
  },
  strongCell: {
    border: TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
    padding: SPACING_SMALL,
    width: '50%',
    fontWeight: 'bold',
  },
  cellTitle: {
    border: TABLE_BORDER,
    display: 'flex',
    justifyContent: 'center',
    width: '50%',
    padding: SPACING_SMALL,
  },
  cellDescription: {
    fontWeight: 'medium',
  },
  header: {
    backgroundColor: COLOR_BACKGROUND,
  },
  tpSection: {
    ...section.style,
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
    color: COLOR_SECONDARY,
    fontWeight: 'bold',
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
  answer: {
    color: COLOR_TEXT,
  },

  piSection: {
    ...section.style,
    display: 'flex',
    flexDirection: 'column',
  },
  piOutput: {
    width: '100%',
    paddingVertical: VERTICAL_MARGIN,
  },
  piRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLOR_BACKGROUND,
  },
  piIconCell: {
    display: 'flex',
    justifyContent: 'flex-start',
    border: TABLE_BORDER,
    padding: `0 ${SMALL_PADDING}`,
  },
  piIcon: {
    width: 40,
    height: 40,
  },
  piSubRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  piHeaderCell: {
    flexBasis: SECTION_WIDTH * 0.3,
    padding: SMALL_PADDING,
    border: TABLE_BORDER,
    color: COLOR_SECONDARY,
    fontSize: FONT_SIZE_LARGE,
    fontWeight: 'bold',
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
    fontWeight: 'bold'
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
    ...section.style,
    display: 'flex',
    flexDirection: 'column',
  },

  niOutput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLOR_BACKGROUND,
  },
  niIconCell: {
    display: 'flex',
    justifyContent: 'flex-start',
    border: TABLE_BORDER,
    padding: `0 ${SMALL_PADDING}`,
  },
  niIcon: {
    width: 40,
    height: 40,
  },
  niHeaderCell: {
    padding: SMALL_PADDING,
    border: TABLE_BORDER,
    flexBasis: '30%',
    fontWeight: 'bold',
  },
  niContentCell: {
    padding: SMALL_PADDING,
    border: TABLE_BORDER,
    flexBasis: '70%',
  },

  budgetOverview: {
    height: 680,
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
    ...section.style,
    display: 'flex',
    flexDirection: 'column',
  },

  contactList: {
    ...subSection.style,
    display: 'flex',
    flexDirection: 'column',
  },

  contactType: {
    fontWeight: 'bold',
  },

  contactDetails: {
    marginLeft: SPACING_SMALL,
  },

  fontWeightNormalAndSmall: {
    fontWeight: 'light',
  },

  fontWeightBoldAndLarge: {
    fontWeight: 'bold',
    fontSize: FONT_SIZE_LARGE,
  },
});

export default pdfStyles;

