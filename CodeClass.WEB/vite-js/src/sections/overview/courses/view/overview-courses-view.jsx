import {useCallback, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import {cardClasses} from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";

import {CONFIG} from 'src/config-global';
import {DashboardContent} from 'src/layouts/dashboard';
import {useAuthContext} from 'src/auth/hooks';
import axios from 'src/utils/axios';
import {CoursesList} from '../courses-list';
import {varAlpha} from "../../../../theme/styles/index";


// ----------------------------------------------------------------------

export function OverviewCoursesView() {
  const {user} = useAuthContext();
  const [courses, setCourses] = useState([]);
  const [updateCourses, setUpdateCourses] = useState(false);

  const handleEnroll = async (courseId) => {
    console.log('Click')
    try {
      await axios.post(`/api/course/${courseId}/enroll/${user.id}`);
      setUpdateCourses(!updateCourses);
      } catch (e) {
      console.log(`Error : ${e}`);
    }
  }

  const getCourses = useCallback(async () => {
    try {
      const res = await axios.get(`/api/course/${user.id}/courses`);
      setCourses(res.data);
    } catch (e) {
      console.log(`Error : ${e}`);
    }
  }, [user.id]);

  useEffect(() => {
    getCourses();
  }, [updateCourses, getCourses]);

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
            tableData={courses}
            onEnroll={handleEnroll}
            headLabel={[
              {id: 'id', label: 'Course ID'},
              {id: 'teacherName', label: 'Teacher Name'},
              {id: 'name', label: 'Course Name'},
              {id: 'category', label: 'Category'},
              {id: 'isEnrolled', label: 'Enroll Status'},
              {id: 'action', label: 'Action'},
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
