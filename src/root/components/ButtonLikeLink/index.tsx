import React from 'react';
import { Link } from 'react-router-dom';

import {
  useButtonFeatures,
  ButtonFeatureProps
} from '#components/Button';

function ButtonLikeLink(props: ButtonFeatureProps<undefined> & {
  to: string;
  external?: boolean;
}) {
  const {
    external,
    to,
    ...buttonFeatureProps
  } = props;

  const linkProps = useButtonFeatures(buttonFeatureProps);

  if (external) {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={to}
        {...linkProps}
      />
    );
  }

  return (
    <Link
      to={to}
      {...linkProps}
    />
  );
}

export default ButtonLikeLink;
