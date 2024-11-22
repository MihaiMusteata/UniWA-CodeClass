import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import {useParams} from "../../../routes/hooks";
import {ChartSemiCircleGauge} from "../../_examples/extra/chart-view/chart-semi-circle-gauge";
import {varAlpha} from "../../../theme/styles";
import {DashboardContent} from "../../../layouts/dashboard";
import {ProductDetailsToolbar} from "../product-details-toolbar";
import {paths} from "../../../routes/paths";
import {useAuthContext} from "../../../auth/hooks";
import {ChartDonut} from "../../_examples/extra/chart-view/chart-donut";
import {ChartColumnSingle} from "../../_examples/extra/chart-view/chart-column-single";
import {ChartPie} from "../../_examples/extra/chart-view/chart-pie";

export function CourseAnalyticsView() {
  const {user} = useAuthContext();
  const {id = ''} = useParams();
  console.log("CourseAnalyticsView id", id);
  return (
    <>
      <DashboardContent maxWidth="xl" sx={{
        borderTop: (theme) => ({
          lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        }),
      }}>
        <ProductDetailsToolbar
          backLink={paths.dashboard.product.root}
        />

        <Box sx={{display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', mb: 2}}>
          <div>
            <Typography variant="h4" sx={{mb: 1}}>
              Hey {user.displayName} 👋
            </Typography>
            <Typography sx={{color: 'text.secondary'}}>
              Now you can see the analytics for the course
            </Typography>
          </div>
        </Box>
        <Card sx={{my: 2}}>
          <ChartSemiCircleGauge chart={{series: [10]}}/>
        </Card>
        <Card sx={{ my: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box
              sx={{
                flexBasis: { xs: '100%', md: '32%' },
                flexGrow: 1,
              }}
            >
              <ChartDonut
                chart={{
                  categories: ['Series A', 'Series B', 'Series C', 'Series D'],
                  series: [44, 55, 13, 43],
                }}
              />
            </Box>

            <Box
              sx={{
                flexBasis: { xs: '100%', md: '32%' },
                flexGrow: 1,
              }}
            >
              <ChartColumnSingle
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                  series: [{ data: [32, 40, 28, 42, 64, 72, 56, 80, 100] }],
                }}
              />
            </Box>

            <Box
              sx={{
                flexBasis: { xs: '100%', md: '32%' },
                flexGrow: 1,
              }}
            >
              <ChartPie
                chart={{
                  categories: ['Series A', 'Series B', 'Series C', 'Series D'],
                  series: [44, 55, 13, 43],
                }}
              />
            </Box>
          </Box>
        </Card>

      </DashboardContent>
    </>
  );
}
