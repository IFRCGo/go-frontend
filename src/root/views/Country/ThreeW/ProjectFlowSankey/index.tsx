import React from 'react';
import {
  _cs,
} from '@togglecorp/fujs';
import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  Layer,
  Label,
  Rectangle,
} from 'recharts';

import type {
  SankeyNode as SankeyNodeFields,
  SankeyLink as SankeyLinkFields,
} from '../common';

import styles from './styles.module.scss';

function EmptySankey ({ className } : { className?: string}) {
  return (
    <div className={_cs(styles.emptySankey, className)}>
      Not enough data to view the chart!
    </div>
  );
}

function SankeyNode (props: {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: any;
}) {
  const { x, y, width, height, index, payload } = props;

  if (payload.value === 0) {
    return null;
  }

  const isOut = (x + width) > window.innerWidth / 2;

  return (
    <Layer key={`sankey-node-${index}`}>
      <Rectangle
        className={styles.nodeBlock}
        x={x}
        y={y}
        width={width}
        height={height}
      />
      <text
        className={styles.label}
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 4}
      >
        {payload.name} ({payload.value})
      </text>
    </Layer>
  );
}

function SankeyLink (props: {
    sourceX: number;
    targetX: number;
    sourceY: number;
    targetY: number;
    sourceControlX: number;
    targetControlX: number;
    linkWidth: number;
    index: number;
}) {
  const {
    sourceX,
    targetX,
    sourceY,
    targetY,
    sourceControlX,
    targetControlX,
    linkWidth,
    index,
  } = props;

  const isLeft = targetX < window.innerWidth / 2;

  return (
    <Layer key={`sankey-link-${index}`}>
      <path
        className={_cs(
          styles.sankeyLink,
          isLeft && styles.left,
        )}
        d={`
          M${sourceX},${sourceY + linkWidth / 2}
          C${sourceControlX},${sourceY + linkWidth / 2}
            ${targetControlX},${targetY + linkWidth / 2}
            ${targetX},${targetY + linkWidth / 2}
          L${targetX},${targetY - linkWidth / 2}
          C${targetControlX},${targetY - linkWidth / 2}
            ${sourceControlX},${sourceY - linkWidth / 2}
            ${sourceX},${sourceY - linkWidth / 2}
          Z
        `}
        strokeWidth={0}
      />
    </Layer>
  );
}

interface Props {
  className?: string;
  data?: {
    nodes: SankeyNodeFields[];
    links: SankeyLinkFields[];
  };
}

function ProjectFlowSankey(props: Props) {
  const {
    className,
    data,
  } = props;

  if (!data) {
    return <EmptySankey className={className} />;
  }

  if (!data.links || data.links.length === 0) {
    return <EmptySankey className={className} />;
  }

  if (!data.nodes || data.nodes.length === 0) {
    return <EmptySankey className={className} />;
  }

  return (
    <ResponsiveContainer
      className={_cs(styles.projectFlowSankey, className)}
    >
      <Sankey
        data={data}
        // NOTE: recharts has wrong typing for node
        node={SankeyNode as unknown as object}
        link={SankeyLink}
      >
        <Tooltip />
        <Label />
      </Sankey>
    </ResponsiveContainer>
  );
}

export default ProjectFlowSankey;
