import React from 'react';
import sanitizeHtml from 'sanitize-html';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

function useSanitizedHtml(rawHtml: string) {
  const sanitizedHtml = React.useMemo(() => (
    sanitizeHtml(
      rawHtml,
      {
        allowedTags: ['b', 'h', 'p', 'bold', 'strong', 'li', 'ul', 'a'],
        allowedAttributes: {
          a: ['href'],
        },
      },
    )
  ), [rawHtml]);

  return sanitizedHtml;
}

interface Props extends Omit<React.HTMLProps<HTMLDivElement>, 'dangerouslySetInnerHTML'>{
  value: string;
}

function RichTextOutput(props: Props) {
  const {
    className,
    value,
    ...otherProps
  } = props;

  const sanitizedValue = useSanitizedHtml(value);

  return (
    <div
      className={_cs(styles.richTextOutput, className)}
      dangerouslySetInnerHTML={{
        __html: sanitizedValue,
      }}
    />
  );
}

export default RichTextOutput;
