import { StyleSheet } from "@react-pdf/renderer";
import * as styles from '#utils/pdf/pdfVariables';

const pdfStyles = StyleSheet.create({

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
  textOutput: {
    backgroundColor: styles.COLOR_BACKGROUND,
    margin: 1,
    padding: styles.TABLE_CELL_PADDING,
  },

  textOutputLabel: {
    fontFamily: 'OpenSans',
    fontWeight: 'medium',
  },

  textOutputValue: {
    fontFamily: 'OpenSans',
    fontWeight: 'extrabold',
  },
});

export default pdfStyles;
