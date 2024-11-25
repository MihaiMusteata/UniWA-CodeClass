import {useTheme, alpha as hexAlpha} from '@mui/material/styles';

import {Chart, useChart, ChartLegends} from 'src/components/chart';

import {Box} from '@mui/material';

// ----------------------------------------------------------------------

export function ChartPie({chart}) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.grey[700],
  ];

  const chartOptions = useChart({
    chart: {sparkline: {enabled: true}},
    colors: chartColors,
    labels: chart.categories,
    stroke: {width: 0},
    dataLabels: {
      enabled: true,
      dropShadow: {enabled: false},
    },
    plotOptions: {pie: {donut: {labels: {show: false}}}},
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <ChartLegends
          labels={chartOptions?.labels}
          colors={chartOptions?.colors}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            p: 3,
            gap: 1,
          }}
        />

        <Chart
          type="pie"
          series={chart.series}
          options={chartOptions}
          width={240}
          height={240}
          sx={{
            my: 3,
            mx: 'auto',
          }}
        />
      </Box>
    </>
  );
}
