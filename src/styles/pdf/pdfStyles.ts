import {
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

import montserratFont from '#root/resources/montserrat.bold.ttf';
import openSansFont from '#root/resources/open-sans.regular.ttf';
import openSansBoldFont from '#root/resources/open-sans.bold.ttf';

import * as styles from './pdfVariables';

Font.register({
  family: 'Montserrat',
  src: montserratFont,
  fontWeight: 'bold',
});

Font.register({
  family: 'OpenSans',
  src: openSansFont,
  fontWeight: 'bold',
});
Font.register({
  family: 'OpenSans',
  src: openSansBoldFont,
  fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: styles.COLOR_SECONDARY,
    marginTop: styles.SPACING_LARGE,
    marginBottom: styles.SPACING_MEDIUM,
  }
});

const pdfStyles = StyleSheet.create({
  portraitPage: {
    fontSize: styles.FONT_SIZE_MEDIUM,
    fontFamily: 'OpenSans',
    fontWeight: 'medium',
    padding: styles.SPACING_SUPER_LARGE,
    color: styles.COLOR_TEXT,
  },

  section: {
    ...section.style,
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
  },

  description: {
    color: styles.COLOR_TEXT,
  },

  textOutputValue: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    fontSize: styles.FONT_SIZE_LARGE,
    color: styles.COLOR_SECONDARY,
    textAlign: 'right',
    marginTop: styles.SPACING_MEDIUM,
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
    height: styles.FONT_SIZE_ULTRA_LARGE,
  },

  mapImage: {
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

  bannerImage: {
    backgroundColor: styles.COLOR_BACKGROUND,
    width: '100%',
    height: 300,
    objectFit: 'contain',
    objectPosition: 'center',
  },
  textLabelSection: {
    color: styles.COLOR_PRIMARY,
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
    padding: styles.TABLE_CELL_PADDING,
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
    fontWeight: 'bold',
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
    justifyContent: 'flex-start',
    border: styles.TABLE_BORDER,
    padding: styles.SMALL_PADDING,
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
    flexBasis: styles.SECTION_WIDTH * 0.3,
    border: styles.TABLE_BORDER,
    padding: styles.SMALL_PADDING,
    color: styles.COLOR_SECONDARY,
    fontSize: styles.FONT_SIZE_LARGE,
    fontWeight: 'bold',
  },
  piContentCell: {
    flexBasis: styles.SECTION_WIDTH * 0.7,
    display: 'flex',
    flexDirection: 'row',
  },
  piSubHeadingCell: {
    padding: styles.SMALL_PADDING,
    border: styles.TABLE_BORDER,
    flexBasis: '30%',
    fontWeight: 'bold',
  },
  piSubContentCell: {
    padding: styles.SMALL_PADDING,
    border: styles.TABLE_BORDER,
    flexBasis: '70%',
  },
  piBorderCell: {
    width: '100%',
    border: styles.TABLE_BORDER,
    padding: styles.SMALL_PADDING,
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
    fontWeight: 'bold',
  },
  niContentCell: {
    padding: styles.SMALL_PADDING,
    border: styles.TABLE_BORDER,
    flexBasis: '70%',
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
    fontWeight: 'bold',
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
});

export default pdfStyles;
