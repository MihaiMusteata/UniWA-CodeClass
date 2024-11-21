import React, {useCallback, useEffect, useState} from 'react';
import {z as zod} from 'zod';
import {Box, Card, Typography, Button, IconButton, TextField, Grid} from '@mui/material';
import Divider from '@mui/material/Divider';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, Field, schemaHelper} from 'src/components/hook-form';
import axios from 'src/utils/axios';
import {Label} from "../../../components/label/index";
import {ArrowButton} from "../../../components/carousel/index";
import {Markdown} from "../../../components/markdown/index";
import {FileManagerView} from "./file-manager-view";
import {LessonQuizzesView} from "./lesson-quizzes-view";
import {useAuthContext} from "../../../auth/hooks";

const lessonDataSchema = zod.object({
  name: zod.string().min(1, {message: 'Name is required!'}),
  description: zod.string().min(1, {message: 'Description is required!'}),
});


const LessonDetails = ({courseId}) => {
  const [lessonsData, setLessonsData] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newLessonAdded, setNewLessonAdded] = useState(false);
  const { user } = useAuthContext();

  const defaultValues = {
    name: '',
    description: '',
    courseId,
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(lessonDataSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: {isSubmitting},
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.courseId = courseId;
      const res = await axios.post(`/api/lesson/create`, data);
      setIsFormVisible(false);
      setNewLessonAdded(!newLessonAdded);
    } catch (e) {
      console.log(`Error : {e}`);
    }
  })

  const handleNext = () => {
    if (currentLessonIndex < lessonsData.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      setIsFormVisible(true);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const getLessonData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/course/${courseId}/lessons`);
      setLessonsData(res.data);
    } catch (e) {
      console.log(`Error : ${e}`);
    }
  }, [courseId]);

  useEffect(() => {
    getLessonData();
  }, [newLessonAdded, getLessonData]);

  return (

    <>
      <Divider sx={{mt: 2}}/>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{my: 2}}>
        <ArrowButton
          variant="prev"
          disabled={currentLessonIndex === 0}
          onClick={handlePrev}
        />

        <Button variant="contained" onClick={handleNext} disabled={currentLessonIndex === lessonsData.length - 1 && user.role !== 'teacher'}>
          {
            currentLessonIndex < lessonsData.length - 1 ? 'Next' :
              user.role === 'teacher' ? 'Add New Lesson' : 'No more lessons'
          }
        </Button>

        <ArrowButton
          variant="next"
          disabled={currentLessonIndex === lessonsData.length - 1}
          onClick={handleNext}
        />
      </Box>

      <Divider sx={{mb: 2}}/>

      {
        !isFormVisible ? (
            <>
              <Card sx={{px: 3, pt: 2, pb: 3}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1}}>
                  <Typography variant="h4">Lesson : {lessonsData[currentLessonIndex]?.name}</Typography>
                  <Label variant="filled" size="small" color="primary">
                    Details section
                  </Label>
                </Box>
                <Divider sx={{marginY: 2}}/>
                <Markdown children={lessonsData[currentLessonIndex]?.description}/>
              </Card>

              <Divider sx={{marginY: 2}}/>

              <Card sx={{px: 3, pt: 2, pb: 3}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1}}>
                  <Typography variant="h4">Attached documents</Typography>
                  <Label variant="filled" size="small" color="info">
                    Documents section
                  </Label>
                </Box>
                <Divider sx={{marginY: 2}}/>

                <FileManagerView lessonId={lessonsData[currentLessonIndex]?.id} userRole={user.role}/>
              </Card>

              <Divider sx={{marginY: 2}}/>


              <Card sx={{px: 3, pt: 2, pb: 3}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1}}>
                  <Typography variant="h4">Quizzes</Typography>
                  <Label variant="filled" size="small" color="secondary">
                    Quizzes section
                  </Label>
                </Box>
                <Divider sx={{marginY: 2}}/>

                <LessonQuizzesView lessonId={lessonsData[currentLessonIndex]?.id}/>
              </Card>

              <Divider sx={{marginY: 2}}/>

            </>
          ) :
          (
            <Card sx={{p: 3}}>
              <Form methods={methods} onSubmit={onSubmit}>
                <Grid container spacing={3} sx={{p: 3}}>
                  <Box
                    sx={{width: '100%'}}
                    rowGap={3}
                    display="grid"
                  >

                    <Typography variant="h5" sx={{mb: 2}}>
                      Add new lesson
                    </Typography>

                    <Field.Text name="name" label="Name"/>
                    <Field.Editor name="description" sx={{maxHeight: 480}}/>

                    <Button type="submit" variant="contained" fullWidth>
                      Create lesson
                    </Button>
                  </Box>
                </Grid>
              </Form>
            </Card>
          )
      }
    </>
  )
    ;
};

export default LessonDetails;
