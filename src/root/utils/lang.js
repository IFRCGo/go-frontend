import React from 'react';
import { isDefined } from '@togglecorp/fujs';


export function resolveToString(template, params) {
  if (!isDefined(template)) {
    return '';
  }

  const parts = template.split('{');
  const resolvedParts = parts.map(part => {
    const endIndex = part.indexOf('}');

    if (endIndex === -1) {
      return part;
    }

    const key = part.substring(0, endIndex);
    if (!isDefined(params[key])) {
      console.error(`value for key "${key}" not provided`);
      return '';
    }

    return part.replace(`${key}}`, params[key]);
  });

  return resolvedParts.join('');
}

const emptyObject = {};
export function resolveToComponent(template, params=emptyObject) {
  if (!isDefined(template)) {
    return '';
  }

  const parts = template.split('{');
  const resolvedParts = parts.map(part => {
    const endIndex = part.indexOf('}');

    if (endIndex === -1) {
      return part;
    }

    const key = part.substring(0, endIndex);
    if (!isDefined(params[key])) {
      console.error(`value for key "${key}" not provided`);
      return null;
    }

    return (
      <React.Fragment>
        {/* And, replace with associated component */}
        { params[key] }
        {/* Remove the key */}
        { part.replace(`${key}}`, '')}
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      {resolvedParts.map((d,i) => (
        <React.Fragment key={i}>
          {d}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
