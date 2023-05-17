import React from 'react';
import {
  Text,
  View,
} from '@react-pdf/renderer';
import pdfStyles from '#utils/pdf/pdfStyles';
import { reTab } from '#utils/common';

export function PdfTextOutput(props: {
  color?: 'Yellow' | 'Red' | 'Orange' | 'Text';
  label?: string | null;
  value?: string | null;
  columns?: '1/4' | '2/4' | '3/4' | '4/4' | '1/2' | '1/3' | '2/3' | '3/3';
  wrap?: boolean;
}) {
  const {
    color = 'Text',
    label,
    value,
    columns = '1/4',
    wrap,
  } = props;

  const styleMap = {
    '1/4': pdfStyles.oneByFour,
    '2/4': pdfStyles.twoByFour,
    '3/4': pdfStyles.threeByFour,
    '4/4': pdfStyles.fourByFour,
    '1/2': pdfStyles.oneByTwo,
    '1/3': pdfStyles.oneByThree,
    '2/3': pdfStyles.twoByThree,
    '3/3': pdfStyles.twoByThree,
  };
  const colorMap = {
    'Yellow': pdfStyles.disasterColorYellow,
    'Red': pdfStyles.disasterColorRed,
    'Orange': pdfStyles.disasterColorOrange,
    'Text': pdfStyles.text,
  };

  return (
    <View
      style={[
        pdfStyles.textOutput,
        styleMap[columns],
      ]}
      wrap={wrap}
    >
      <Text
        style={pdfStyles.textOutputLabel}
      >
        {label}
      </Text>
      <Text
        style={[
          pdfStyles.textOutputValue,
          colorMap[color],
        ]}>
        {reTab(value)}
      </Text>
    </View>
  );
}
