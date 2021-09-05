import React from 'react';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';
import { jsPDF } from 'jspdf';

import BlockLoading from '#components/block-loading';
import Container from '#components/Container';
import Page from '#components/Page';

import { useRequest } from '#utils/restRequest';
import { DrefApiFields } from '#views/DrefApplicationForm/common';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ drefId?: string }>;
  history: History;
  location: Location;
}

function DrefPdfExport(props: Props) {
  const {
    className,
    match,
  } = props;

  const { drefId } = match.params;
  const [pdfUrl, setPdfUrl] = React.useState<string | undefined>();

  const { pending } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
    onSuccess: (response) => {
      const responseKeys = Object.keys(response) as (keyof(typeof response))[];
      const pdfTextList: string[] = [];
      responseKeys.forEach((key) => {
        pdfTextList.push(key);
        pdfTextList.push(JSON.stringify(response[key]));
      });

      const pageWidth = 8.3;
      const pageHeight = 11.7;
      const lineHeight = 1.5;
      const pdf = new jsPDF({
        orientation: "portrait",
        format: [pageWidth, pageHeight],
        unit: "in",
      });
      pdf.setLineHeightFactor(lineHeight);
      const margin = 0.5;
      const maxLineWidth = pageWidth - (margin * 2);
      const ppi = 72;
      const fontSize = 11;

      let vOffset = margin;
      const pageBreak = 30;

      pdf.setFontSize(fontSize);
      pdfTextList.forEach((text, i) => {
        if (((i+1) % 2) === 0) {
          pdf.setTextColor('#000000');
        } else {
          pdf.setTextColor('#f5333f');
        }

        const textLines = pdf.splitTextToSize(text, maxLineWidth);
        pdf.text(textLines, margin, vOffset);

        if ((i + 1) % pageBreak === 0) {
          pdf.addPage();
          vOffset = margin;
        } else {
          vOffset += (textLines.length * fontSize * lineHeight) / ppi;
        }

        if (((i+1) % 2) === 0) {
          vOffset += fontSize / ppi;
        }
      });

      var blobPDF =  new Blob([ pdf.output() ], { type : 'application/pdf'});
      setPdfUrl(URL.createObjectURL(blobPDF));
    },
  });

  return (
    <Page
      className={className}
      heading="DREF Application"
    >
      {pending ? (
        <Container>
          <BlockLoading />
        </Container>
      ) : (
        <Container>
          <iframe
            className={styles.pdfPreview}
            src={pdfUrl}
          />
        </Container>
      )}
    </Page>
  );
}

export default DrefPdfExport;
