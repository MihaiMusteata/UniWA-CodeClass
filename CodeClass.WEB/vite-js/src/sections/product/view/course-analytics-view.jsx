import {useCallback, useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import axios from 'src/utils/axios';
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
import {ChartColumnStacked} from "../../_examples/extra/chart-view/chart-column-stacked";

export function CourseAnalyticsView() {
  const {user} = useAuthContext();
  const {id = ''} = useParams();
  const [courseAnalytics, setCourseAnalytics] = useState(null);

  const getCourseAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(`/api/course/${id}/analytics?userId=${user.id}`);
      const data = response.data;
      data.notStartedLessons = data.totalLessons - data.completedLessons - data.inProgressLessons;
      data.questionsNotAnswered = data.totalQuestions - data.completedQuestions;
      console.log('data', data);
      setCourseAnalytics(data);
    } catch (error) {
      console.error(error);
    }
  }, [id, user.id]);

  useEffect(() => {
    getCourseAnalytics();
  }, [id, getCourseAnalytics]);

  return (
    <>
      {
        courseAnalytics === null ? (
          <Typography>Loading...</Typography>
        ) : (
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
              <ChartSemiCircleGauge chart={{series: [courseAnalytics.totalProgress]}}/>
            </Card>

            <Card sx={{my: 2, p: 2}}>
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
                    flexBasis: {xs: '100%', md: '20%'},
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{mb: 2}}
                  >
                    Lessons
                  </Typography>
                  <ChartDonut
                    chart={{
                      categories: ['Completed Lessons', 'In Progress Lessons', 'Not Started Lessons'],
                      series: [courseAnalytics.completedLessons, courseAnalytics.inProgressLessons, courseAnalytics.notStartedLessons],
                    }}
                  />
                </Box>

                <Divider
                  orientation="vertical"
                  sx={{
                    height: '240px',
                    display: {xs: 'none', md: 'block'},
                    borderStyle: 'dashed'
                  }}
                />
                <Divider
                  orientation="orizontal"
                  sx={{
                    width: '100%',
                    display: {xs: 'block', md: 'none'},
                    borderStyle: 'dashed'
                  }}
                />

                <Box
                  sx={{
                    flexBasis: {xs: '100%', md: '20%'},
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{mb: 2}}
                  >
                    Answered Questions
                  </Typography>
                  <ChartPie
                    chart={{
                      categories: ['Correctly', 'Partially Correctly', 'Incorrectly', 'Not Answered'],
                      series: [courseAnalytics.questionsAnsweredCorrectly, courseAnalytics.questionsAnsweredPartiallyCorrectly, courseAnalytics.questionsAnsweredWrong, courseAnalytics.questionsNotAnswered],
                    }}
                  />
                </Box>
              </Box>
            </Card>

            <Card sx={{my: 2, p: 2}}>
              <ChartColumnStacked
                chart={{
                  categories: [
                    ...Array.from({length: Object.keys(courseAnalytics.lessonProgress).length}, (_, i) => `Lesson ${i + 1}`),
                  ],
                  series: [
                    {
                      name: 'Questions Answered Correctly',
                      data: Object.values(courseAnalytics.lessonProgress).map(
                        (lesson) => lesson.questionsAnsweredCorrectly || 0
                      ),
                    },
                    {
                      name: 'Questions Answered Partially Correctly',
                      data: Object.values(courseAnalytics.lessonProgress).map(
                        (lesson) => lesson.questionsAnsweredPartiallyCorrectly || 0
                      ),
                    },
                    {
                      name: 'Questions Answered Incorrectly',
                      data: Object.values(courseAnalytics.lessonProgress).map(
                        (lesson) => lesson.questionsAnsweredWrong || 0
                      ),
                    },
                    {
                      name: 'Questions Not Answered',
                      data: Object.values(courseAnalytics.lessonProgress).map(
                        (lesson) =>
                          lesson.totalQuestions -
                          (lesson.completedQuestions || 0) || 0
                      ),
                    },
                  ],
                }}
              />
            </Card>

          </DashboardContent>
        )}
    </>
  );
}
