import React, { ElementType, ReactNode } from 'react';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
}

function Heading(props: Props) {
  const {
    className,
    level = 3,
    children,
  } = props;

  const levelStyle = styles[`level-${level}`];
  const HeadingTag = `h${level}` as ElementType;
  return (
    <HeadingTag className={_cs(styles.heading, levelStyle, className)}>
      {children}
    </HeadingTag>
  );
}

export default Heading;
