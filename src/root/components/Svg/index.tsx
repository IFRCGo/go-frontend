import React, { useState, useEffect } from 'react';
import { randomString, _cs } from '@togglecorp/fujs';
import SVGInjector from 'svg-injector';

import styles from './styles.module.scss';

interface Props extends React.SVGProps<SVGSVGElement> {
  className?: string;
  evalScripts?: 'always' | 'once' | 'never';
  fallback?: string;
  onInject?: () => void;
  src: string;
  elementId?: string;
}

function Svg(props: Props) {
  const {
    className,
    src,
    evalScripts,
    fallback,
    onInject,
    elementId,

    ...otherProps
  } = props;

  const [id] = useState(() => elementId ?? randomString(16));

  useEffect(() => {
    const svg = document.getElementById(id);
    if (svg) {
      svg.setAttribute('data-src', src);
      const options = {
        evalScripts,
      };

      SVGInjector(svg, options, onInject);
    }

    return () => {
      if (svg) {
        svg.remove();
      }
    };
  }, [evalScripts, id, onInject, src]);

  return (
    <div
      className={_cs(className, styles.svgContainer)}
    >
      <svg
        className={styles.svg}
        id={id}
        data-src={src}
        data-fallback={fallback}
        {...otherProps}
      />
    </div>
  );
}

export default Svg;
