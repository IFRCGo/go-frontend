import { Text, View } from '@react-pdf/renderer';
import React from 'react';
import pdfStyles from 'src/styles/pdf/pdfStyles';

export function PdfTextOutput(props: {
  label?: string;
  value?: string;
  columns?: '1/4' | '2/4' | '3/4' | '4/4' | '1/2';
}) {
  const {
    label,
    value,
    columns = '1/4',
  } = props;

  const styleMap = {
    '1/4': pdfStyles.oneByFour,
    '2/4': pdfStyles.twoByFour,
    '3/4': pdfStyles.threeByFour,
    '4/4': pdfStyles.fourByFour,
    '1/2': pdfStyles.oneByTwo,
  };

  return (
    <View
      style={[
        pdfStyles.textOutput,
        styleMap[columns] ?? pdfStyles.oneByFour,
      ]}
    >
      <Text style={pdfStyles.textOutputLabel}>
        {label}
      </Text>
      <Text style={pdfStyles.textOutputValue}>
        {value}
      </Text>
    </View>
  );
}
