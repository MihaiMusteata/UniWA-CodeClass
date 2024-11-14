import Box from '@mui/material/Box';
import {cardClasses} from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";

import {CONFIG} from 'src/config-global';
import {DashboardContent} from 'src/layouts/dashboard';
import {useAuthContext} from 'src/auth/hooks';
import {CoursesList} from '../courses-list';
import {varAlpha} from "../../../../theme/styles/index";


// ----------------------------------------------------------------------

export function OverviewCoursesView() {
  const {user} = useAuthContext();
  const course_data = [
    {
      id: 'C-101',
      teacher: 'John Doe',
      name: 'Introduction to Computer Science',
      category: 'Computer Science',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-102',
      teacher: 'Jane Smith',
      name: 'Data Structures and Algorithms',
      category: 'Software Engineering',
      enrollStatus: 'Not Enrolled',
    },
    {
      id: 'C-103',
      teacher: 'Alice Johnson',
      name: 'Machine Learning Basics',
      category: 'Artificial Intelligence',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-104',
      teacher: 'Michael Brown',
      name: 'Web Development Fundamentals',
      category: 'Web Development',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-105',
      teacher: 'Emma Wilson',
      name: 'Introduction to Databases',
      category: 'Database Management',
      enrollStatus: 'Not Enrolled',
    },
    {
      id: 'C-106',
      teacher: 'Daniel Lee',
      name: 'Cybersecurity Essentials',
      category: 'Cybersecurity',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-106',
      teacher: 'Daniel Lee',
      name: 'Cybersecurity Essentials',
      category: 'Cybersecurity',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-106',
      teacher: 'Daniel Lee',
      name: 'Cybersecurity Essentials',
      category: 'Cybersecurity',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-106',
      teacher: 'Daniel Lee',
      name: 'Cybersecurity Essentials',
      category: 'Cybersecurity',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-106',
      teacher: 'Daniel Lee',
      name: 'Cybersecurity Essentials',
      category: 'Cybersecurity',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-106',
      teacher: 'Daniel Lee',
      name: 'Cybersecurity Essentials',
      category: 'Cybersecurity',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-106',
      teacher: 'Daniel Lee',
      name: 'Cybersecurity Essentials',
      category: 'Cybersecurity',
      enrollStatus: 'Enrolled',
    },
    {
      id: 'C-106',
      teacher: 'Daniel Lee',
      name: 'Cybersecurity Essentials',
      category: 'Cybersecurity',
      enrollStatus: 'Enrolled',
    },
  ];

  return (

    <DashboardContent maxWidth="xl" sx={{
      borderTop: (theme) => ({
        lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
      }),
    }}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Box sx={{mb: 2}}>
            <Typography variant="h4" sx={{mb: 1}}>
              Hi, {user.displayName} 👋
            </Typography>
            <Typography
              sx={{color: 'text.secondary'}}
            >Here is the full list of available courses!</Typography>
          </Box>

          <CoursesList
            title="Courses List"
            tableData={course_data}
            headLabel={[
              {id: 'id', label: 'Course ID'},
              {id: 'teacher', label: 'Teacher Name'},
              {id: 'name', label: 'Course Name'},
              {id: 'category', label: 'Category'},
              {id: 'enrollStatus', label: 'Enroll Status'},
              {id: 'action', label: 'Action'},
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
