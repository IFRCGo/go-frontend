import { Text, View } from '@react-pdf/renderer';
import React from 'react';
import pdfStyles from 'src/styles/pdf/pdfStyles';

export function PdfTextOutput(props: {
  label: string;
  value?: string;
  columns?: '1/3' | '2/3' | '3/3' | '1/2';
}) {
  const {
    label,
    value,
    columns = '1/3',
  } = props;

  const styleMap = {
    '1/3': pdfStyles.oneByThree,
    '2/3': pdfStyles.twoByThree,
    '3/3': pdfStyles.threeByThree,
    '1/2': pdfStyles.oneByTwo,
  };

  return (
    <View
      style={[
        pdfStyles.textOutput,
        styleMap[columns] ?? pdfStyles.oneByThree,
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
