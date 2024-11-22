import {useState, useEffect, useCallback} from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {paths} from 'src/routes/paths';
import {RouterLink} from 'src/routes/components';

import {useTabs} from 'src/hooks/use-tabs';

import {varAlpha} from 'src/theme/styles';
import {DashboardContent} from 'src/layouts/dashboard';

import {Iconify} from 'src/components/iconify';
import {EmptyContent} from 'src/components/empty-content';

import {ProductDetailsSkeleton} from '../product-skeleton';
import {ProductDetailsReview} from '../product-details-review';
import {ProductDetailsToolbar} from '../product-details-toolbar';
import {useAuthContext} from "../../../auth/hooks/index";
import LessonDetails from "./lesson-details-view";

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export function CourseDetailsView({course, error, loading}) {
  const tabs = useTabs('lessons');
  const {user} = useAuthContext();
  if (loading) {
    return (
      <DashboardContent sx={{pt: 5}}>
        <ProductDetailsSkeleton/>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent sx={{pt: 5}}>
        <EmptyContent
          filled
          title="Course not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill"/>}
              sx={{mt: 3}}
            >
              Back to list
            </Button>
          }
          sx={{py: 10, height: 'auto', flexGrow: 'unset'}}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl" sx={{
      borderTop: (theme) => ({
        lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
      }),
    }}>
      <ProductDetailsToolbar
        backLink={paths.dashboard.product.root}
        editLink={paths.dashboard.product.edit(`${course?.id}`)}
        liveLink={paths.product.details(`${course?.id}`)}
      />

      <Box sx={{mb: 2}}>
        <Typography variant="h4" sx={{mb: 1}}>
          Hey {user.displayName} 👋
        </Typography>
        <Typography
          sx={{color: 'text.secondary'}}
        >Here is the details for the course: {course.name}</Typography>
      </Box>

      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            {value: 'lessons', label: 'Lessons'},
            user.role === 'teacher' && {value: 'enrolledStudents', label: `Enrolled students (${course?.enrolledStudents})`},
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label}/>
          ))}
        </Tabs>
      </Card>

      {tabs.value === 'lessons' && (
        <LessonDetails courseId={course.id}/>
      )}

      {tabs.value === 'enrolledStudents' && (
        <ProductDetailsReview
          enrolledStudents={course?.enrolledStudents}
        />
      )}
    </DashboardContent>
  );
}
