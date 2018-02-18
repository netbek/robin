import {assign} from 'lodash';

// *
// * Colors
// *
const colors = [
  '#252525',
  '#525252',
  '#737373',
  '#969696',
  '#bdbdbd',
  '#d9d9d9',
  '#f0f0f0'
];

const charcoal = '#252525';

// *
// * Typography
// *
const sansSerif = '"Roboto", Helvetica, Arial, sans-serif';
const serif = '"Roboto Slab", Georgia, Times, serif';
const monospace = 'Consolas, "Liberation Mono", Menlo, Courier, monospace';
const letterSpacing = 'normal';
const fontSize = 12;

// *
// * Layout
// *
const baseProps = {
  width: 450,
  height: 300,
  padding: 50,
  colorScale: colors
};

// *
// * Labels
// *
const baseLabelStyles = {
  fontFamily: monospace,
  fontSize: fontSize,
  letterSpacing: letterSpacing,
  padding: 10,
  fill: charcoal,
  stroke: 'transparent'
};

const centeredLabelStyles = assign({textAnchor: 'middle'}, baseLabelStyles);

// *
// * Strokes
// *
const strokeDasharray = '3, 3';
const strokeLinecap = 'round';
const strokeLinejoin = 'round';

export default {
  area: assign(
    {
      style: {
        data: {
          fill: charcoal
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  axis: assign(
    {
      style: {
        axis: {
          fill: 'transparent',
          shapeRendering: 'crispEdges',
          stroke: charcoal,
          strokeWidth: 1,
          strokeLinecap: strokeLinecap,
          strokeLinejoin: strokeLinejoin
        },
        axisLabel: assign({}, centeredLabelStyles, {
          padding: 25
        }),
        grid: {
          fill: 'none',
          shapeRendering: 'crispEdges',
          stroke: '#CCC',
          // strokeDasharray: strokeDasharray,
          strokeLinecap: strokeLinecap,
          strokeLinejoin: strokeLinejoin,
          pointerEvents: 'visible'
        },
        ticks: {
          fill: 'transparent',
          shapeRendering: 'crispEdges',
          size: 5,
          stroke: charcoal,
          strokeWidth: 1,
          strokeLinecap: strokeLinecap,
          strokeLinejoin: strokeLinejoin
        },
        tickLabels: baseLabelStyles
      }
    },
    baseProps
  ),
  bar: assign(
    {
      style: {
        data: {
          fill: charcoal,
          padding: 8,
          shapeRendering: 'crispEdges',
          strokeWidth: 0
        },
        labels: baseLabelStyles
      }
    },
    baseProps
  ),
  candlestick: assign(
    {
      style: {
        data: {
          stroke: charcoal,
          strokeWidth: 1
        },
        labels: centeredLabelStyles
      },
      candleColors: {
        positive: '#ffffff',
        negative: charcoal
      }
    },
    baseProps
  ),
  chart: baseProps,
  errorbar: assign(
    {
      borderWidth: 8,
      style: {
        data: {
          fill: 'transparent',
          stroke: charcoal,
          strokeWidth: 2
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  group: assign(
    {
      colorScale: colors
    },
    baseProps
  ),
  line: assign(
    {
      style: {
        data: {
          fill: 'transparent',
          stroke: charcoal,
          strokeWidth: 2
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  pie: {
    style: {
      data: {
        padding: 10,
        stroke: 'transparent',
        strokeWidth: 1
      },
      labels: assign({}, baseLabelStyles, {padding: 20})
    },
    colorScale: colors,
    width: 400,
    height: 400,
    padding: 50
  },
  scatter: assign(
    {
      style: {
        data: {
          fill: charcoal,
          stroke: 'transparent',
          strokeWidth: 0
        },
        labels: centeredLabelStyles
      }
    },
    baseProps
  ),
  stack: assign(
    {
      colorScale: colors
    },
    baseProps
  ),
  tooltip: {
    style: assign({}, centeredLabelStyles, {
      fill: charcoal,
      padding: 7,
      pointerEvents: 'none'
    }),
    flyoutStyle: {
      fill: '#FFF',
      pointerEvents: 'none',
      shapeRendering: 'geometricPrecision',
      stroke: charcoal
    },
    cornerRadius: 3,
    pointerLength: 7
  },
  voronoi: assign(
    {
      style: {
        data: {
          fill: 'transparent',
          stroke: 'transparent',
          strokeWidth: 0
        },
        labels: assign({}, centeredLabelStyles, {
          padding: 5,
          pointerEvents: 'none'
        }),
        flyout: {
          stroke: charcoal,
          strokeWidth: 1,
          fill: '#f0f0f0',
          pointerEvents: 'none'
        }
      }
    },
    baseProps
  ),
  legend: {
    colorScale: colors,
    gutter: 10,
    orientation: 'vertical',
    titleOrientation: 'top',
    style: {
      data: {
        type: 'circle'
      },
      labels: baseLabelStyles,
      title: assign({}, baseLabelStyles, {padding: 5})
    }
  }
};
