import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function ChartColumnStacked({ chart }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.grey[700],
  ];

  const chartOptions = useChart({
    chart: { stacked: true },
    colors: chartColors,
    stroke: { width: 0 },
    legend: {
      show: true,
      position: 'right',
      itemMargin: { vertical: 8 },
    },
    xaxis: {
      type: 'text',
      categories: chart.categories,
    },
    plotOptions: { bar: { columnWidth: '36%' } },
  });

  return <Chart type="bar" series={chart.series} options={chartOptions} height={320} />;
}
