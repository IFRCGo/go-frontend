//TODO: breakdown to related component file
import {
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

import montserratFont from '#root/resources/montserrat.bold.ttf';
import openSansFont from '#root/resources/open-sans.regular.ttf';
import openSansBoldFont from '#root/resources/open-sans.bold.ttf';
import openSansItalicFont from '#root/resources/open-sans.italic.ttf';

import * as styles from './pdfVariables';

Font.register({
  family: 'Montserrat',
  src: montserratFont,
  fontWeight: 'bold',
});

Font.register({
  family: 'OpenSans',
  fonts: [
    {
      src: openSansFont,
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    {
      src: openSansBoldFont,
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
  ],
});

Font.register({
  family: 'OpenSans',
  src: openSansBoldFont,
  fontWeight: 'bold',
});

Font.register({
  family: 'OpenSans',
  src: openSansItalicFont,
  fontWeight: 'normal',
  fontStyle: 'italic',
});

const section = StyleSheet.create({
  style: {
    paddingVertical: styles.SECTION_PADDING,
  }
});

const subSection = StyleSheet.create({
  style: {
    paddingVertical: styles.SECTION_PADDING / 2,
  }
});

const heading = StyleSheet.create({
  style: {
    fontFamily: 'Montserrat',
    fontWeight: 'extrabold',
    color: styles.COLOR_SECONDARY,
    marginTop: styles.SPACING_MEDIUM,
    marginBottom: styles.SPACING_MEDIUM,
  }
});

const pdfStyles = StyleSheet.create({
  portraitPage: {
    fontSize: styles.FONT_SIZE_MEDIUM,
    fontFamily: 'OpenSans',
    fontWeight: 'medium',
    padding: styles.PAGE_PADDING,
    paddingBottom: styles.PAGE_PADDING * 2,
    color: styles.COLOR_TEXT,
  },

  section: {
    textAlign: 'justify',
  },

  subSection: {
    ...subSection.style,
  },

  sectionHeading: {
    ...heading.style,
    fontSize: styles.FONT_SIZE_SUPER_LARGE,
  },

  subSectionHeading: {
    ...heading.style,
    fontSize: styles.FONT_SIZE_LARGE,
    color: styles.COLOR_PRIMARY,
  },

  textOutputLabel: {
    fontFamily: 'OpenSans',
    fontWeight: 'medium',
  },

  text: {
    color: styles.COLOR_TEXT,
    textAlign: 'justify',
  },

  description: {
    color: styles.COLOR_TEXT,
  },

  textOutputValue: {
    fontFamily: 'OpenSans',
    fontWeight: 'extrabold',
  },

  pdfTitleContent: {
    width: '50vw',
    alignItems:'flex-end',
  },

  pageTitle: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: styles.FONT_SIZE_MEGA_LARGE,
    color: styles.COLOR_PRIMARY,
    textTransform: 'uppercase',
  },

  subTitle: {
    fontFamily: 'Montserrat',
    fontSize: styles.FONT_SIZE_LARGE,
    color: styles.COLOR_SECONDARY,
    textAlign: 'right',
    alignSelf:'flex-end',
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
    height: styles.FONT_SIZE_ULTRA_LARGE * 2,
  },

  coverImage: {
    width: 'auto',
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

  bannerImageContainer: {
    width: styles.SECTION_WIDTH,
    height: styles.SECTION_WIDTH * 0.75,
    alignItems: 'center',
    marginVertical: styles.SPACING_LARGE,
  },

  bannerImage: {
    backgroundColor: styles.COLOR_BACKGROUND,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  },

  mapImage: {
    width: 'auto',
    height: 400,
    objectFit: 'contain',
    objectPosition: 'center',
  },

  textLabelSection: {
    color: styles.COLOR_PRIMARY,
    fontWeight: 'extrabold',
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
    fontSize: styles.FONT_SIZE_SUPER_LARGE,
    fontFamily: 'Montserrat',
    color: styles.COLOR_PRIMARY,
  },

  heading: {
    fontSize: styles.FONT_SIZE_EXTRA_LARGE,
    fontFamily: 'Montserrat',
    color: styles.COLOR_PRIMARY,
    paddingVertical: styles.HEADING_VERTICAL_PADDING,
  },

  subHeading: {
    fontSize: styles.FONT_SIZE_LARGE,
    fontWeight: 'bold',
    paddingVertical: styles.SUBHEADING_VERTICAL_PADDING,
  },

  label: {
    fontFamily: 'Montserrat',
    fontSize: styles.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },

  textOutput: {
    backgroundColor: styles.COLOR_BACKGROUND,
    margin: 1,
    padding: styles.TABLE_CELL_PADDING / 3,
  },

  oneByFour: {
    width: '25%',
  },

  twoByFour: {
    width: '50%',
  },

  threeByFour: {
    width: '75%',
  },

  fourByFour: {
    width: '100%',
  },

  oneByTwo: {
    width: '50%',
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
    backgroundColor: styles.COLOR_BACKGROUND,
  },

  cellContent: {
    border: styles.TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5',
    width: '22%',
  },

  verticalRow: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: styles.SPACING_MEDIUM,
    width: 300,
  },

  cell: {
    border: styles.TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
    padding: styles.SPACING_SMALL,
    width: '50%',
  },

  strongCell: {
    border: styles.TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
    padding: styles.SPACING_SMALL,
    width: '50%',
    fontWeight: 'extrabold',
    textAlign: 'justify',
  },

  cellTitle: {
    border: styles.TABLE_BORDER,
    display: 'flex',
    justifyContent: 'center',
    width: '50%',
    padding: styles.SPACING_SMALL,
  },

  cellDescription: {
    fontWeight: 'medium',
  },

  header: {
    backgroundColor: styles.COLOR_BACKGROUND,
  },

  tpSection: {
    ...section.style,
    display: 'flex',
    flexDirection: 'column',
  },

  tpCell: {
    border: styles.TABLE_BORDER,
    display: 'flex',
    justifyContent: 'space-between',
  },

  tpHeaderCell: {
    border: styles.TABLE_BORDER,
    width: styles.SECTION_WIDTH * 0.3,
    padding: styles.SMALL_PADDING,
    textAlign: 'center',
    color: styles.COLOR_SECONDARY,
    fontWeight: 'bold',
  },

  tpContentCell: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    border: styles.TABLE_BORDER,
    width: styles.SECTION_WIDTH * 0.7,
  },

  tpSubRow: {
    flexBasis: '50%',
    diplay: 'flex',
    flexDirection: 'row',
  },

  tpSubCell: {
    border: styles.TABLE_BORDER,
    flexBasis: '50%',
    padding: styles.SMALL_PADDING,
  },

  qna: {
    paddingVertical: styles.SMALL_PADDING,
  },

  answer: {
    color: styles.COLOR_TEXT,
  },

  piSmallColumn: {
    display: 'flex',
    flexBasis: '40%',
    flexDirection: 'row',
  },
  piMediumColumn: {
    display: 'flex',
    flexBasis: '50%',
    flexDirection: 'row',
  },

  piLargeColumn: {
    display: 'flex',
    flexBasis: '60%',
    flexDirection: 'row',
  },

  piSection: {
    ...section.style,
    display: 'flex',
    flexDirection: 'column',
  },

  piOutput: {
    width: '100%',
    paddingVertical: styles.VERTICAL_MARGIN,
  },

  piRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: styles.COLOR_BACKGROUND,
  },

  piIconCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: styles.TABLE_BORDER,
    padding: styles.SMALL_PADDING,
    flexBasis: '30%',
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

  piMultiRow: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '60%',
  },

  piHeaderCell: {
    flexBasis: '70%',
    border: styles.TABLE_BORDER,
    padding: styles.SMALL_PADDING,
    color: styles.COLOR_SECONDARY,
    fontSize: styles.FONT_SIZE_LARGE,
    fontWeight: 'extrabold',
  },

  piContentCell: {
    flexBasis: '60%',
    display: 'flex',
    flexDirection: 'row',
  },

  piSubHeadingCell: {
    padding: styles.SMALL_PADDING,
    border: styles.TABLE_BORDER,
    flexBasis: '60%',
    fontWeight: 'extrabold',
  },

  piContentHeadingCell: {
    padding: styles.SMALL_PADDING,
    border: styles.TABLE_BORDER,
    fontWeight: 'extrabold',
    width: '100%'
  },

  piSubContentCell: {
    padding: styles.SMALL_PADDING,
    border: styles.TABLE_BORDER,
    flexBasis: '40%',
  },

  piBorderCell: {
    width: '100%',
    border: styles.TABLE_BORDER,
    padding: styles.SMALL_PADDING,
  },

  piPriorityCell: {
    display: 'flex',
    width: '100%',
    border: styles.TABLE_BORDER,
    padding: styles.SMALL_PADDING,
    fontWeight: 'extrabold',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  niOutput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: styles.COLOR_BACKGROUND,
  },

  niIconCell: {
    display: 'flex',
    justifyContent: 'flex-start',
    border: styles.TABLE_BORDER,
    padding: `0 ${styles.SMALL_PADDING}`,
  },

  niIcon: {
    width: 40,
    height: 40,
  },

  niHeaderCell: {
    padding: styles.SMALL_PADDING,
    border: styles.TABLE_BORDER,
    flexBasis: '30%',
    fontWeight: 'extrabold',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  niContentCell: {
    padding: styles.SMALL_PADDING,
    border: styles.TABLE_BORDER,
    flexBasis: '70%',
    textAlign: 'justify',
  },

  niFullWidthContentCell: {
    padding: styles.SMALL_PADDING,
    border: styles.TABLE_BORDER,
    flexBasis: '100%',
    textAlign: 'justify',
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
    textAlign: 'justify',
  },

  contactType: {
    fontWeight: 'extrabold',
    color: styles.COLOR_PRIMARY,
  },

  contactDetails: {
    marginLeft: styles.SPACING_SMALL,
  },

  fontWeightNormalAndSmall: {
    fontWeight: 'light',
  },

  fontWeightBoldAndLarge: {
    fontWeight: 'bold',
    fontSize: styles.FONT_SIZE_LARGE,
  },

  imagesSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  fullWidth: {
    width: '100%',
  },

  fontWeightBold: {
    fontWeight: 'extrabold',
  },

  niSection: {
    display: 'flex',
    flexDirection: 'column',
    padding: styles.SMALL_PADDING,
  },
  niContainer: {
    marginBottom: styles.PAGE_PADDING * 1.5,
  },
  niContentIconCell: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: styles.SMALL_PADDING,
  },
  niSubSectionHeading: {
    ...heading.style,
    fontSize: styles.FONT_SIZE_LARGE,
    color: styles.COLOR_PRIMARY,
    marginLeft: styles.SPACING_SMALL,
  },
  strategySubSectionHeading: {
    ...heading.style,
    fontSize: styles.FONT_SIZE_LARGE,
    color: styles.COLOR_PRIMARY,
  },

  niContentTextCell: {
    textAlign: 'justify',
  },

  color: {
    color: styles.COLOR_PRIMARY
  },

  disasterColorYellow: {
    color: '#ffc000',
  },

  disasterColorOrange: {
    color: '#ed7d31',
  },

  disasterColorRed: {
    color: '#f40d11',
  },

  budgetImage: {
    width: '100%',
  },

  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: styles.PAGE_PADDING,
  },

  pageNumber: {
    fontSize: styles.FONT_SIZE_MEDIUM / 1.3,
    color: styles.COLOR_PAGE_NUMBER,
    alignSelf: 'center',
  },

  footerLogo: {
    height: 40,
    width: 40,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },

  mainDonorText: {
    fontFamily: 'OpenSans',
    fontSize: styles.FONT_SIZE_MEDIUM,
    fontStyle: 'italic',
  },

  finalReportBannerImageContainer: {
    height: styles.SECTION_WIDTH * 0.60,
  },

  financialReportLink: {
    // TODO: absolute color variable
    color: '#2000ff',
    fontSize: styles.FONT_SIZE_MEDIUM,
    textDecoration: 'underline',
  }
});

export default pdfStyles;
