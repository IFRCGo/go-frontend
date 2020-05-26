import React from 'react';
import _cs from 'classnames';
import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  Layer,
  Label,
  Rectangle,
} from 'recharts';

import styles from './styles.module.scss';

function SankeyNode (p) {
  const { x, y, width, height, index, payload } = p;
  if (payload.value === 0) {
    return null;
  }

  const isOut = (x + width) > window.innerWidth / 2;

  return (
    <Layer key={`sankey-node-${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width} height={height}
        fill="#5192ca"
        fillOpacity="1"
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 4}
        fontSize="12"
        fill="#000"
        strokeWidth={0}
        pointerEvents="none"
      >
        {payload.name} ({payload.value})
      </text>
    </Layer>
  );
}

function SankeyLink (p) {
  const {
    sourceX,
    targetX,
    sourceY,
    targetY,
    sourceControlX,
    targetControlX,
    linkWidth,
    index,
  } = p;

  const isLeft = targetX < window.innerWidth / 2;

  return (
    <Layer key={`CustomLink${index}`}>
      <path
        className={_cs(styles.sankeyLink, isLeft && styles.sankeyLinkLeft)}
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

function GlobalThreeWSankey (p) {
  const {
    className,
    data,
  } = p;

  return (
    <div className={_cs(className, styles.globalThreeWSankey)}>
      { data.length === 0 ? (
        <div className={styles.emptyMessage}>
          Not enough data to show the chart!
        </div>
      ) : (
        <ResponsiveContainer>
          <Sankey
            data={data}
            link={SankeyLink}
            node={SankeyNode}
          >
            <Tooltip />
            <Label />
          </Sankey>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default React.memo(GlobalThreeWSankey);
