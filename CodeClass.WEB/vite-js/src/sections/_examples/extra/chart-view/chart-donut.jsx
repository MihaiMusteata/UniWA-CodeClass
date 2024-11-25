import {useTheme, alpha as hexAlpha} from '@mui/material/styles';

import {Chart, useChart, ChartLegends} from 'src/components/chart';

import {Box} from '@mui/material';

// ----------------------------------------------------------------------

export function ChartDonut({chart}) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.grey[700],
  ];

  const chartOptions = useChart({
    chart: {sparkline: {enabled: true}},
    colors: chartColors,
    labels: chart.categories,
    stroke: {width: 0},
    plotOptions: {pie: {donut: {size: '72%'}}},
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
        <Chart
          type="donut"
          series={chart.series}
          options={chartOptions}
          width={240}
          height={240}
          sx={{
            my: 3,
            mx: 'auto',
          }}
        />

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
      </Box>
    </>
  );
}
