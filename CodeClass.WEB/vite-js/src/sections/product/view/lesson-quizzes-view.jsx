import React, {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import {Alert} from "@mui/material";
import axios from 'src/utils/axios';
import {QuizAccordion} from '../quiz-accordion';
import {QuizForm} from '../quiz-form';
import {useAuthContext} from "../../../auth/hooks";

export function LessonQuizzesView({lessonId}) {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuizAdded, setNewQuizAdded] = useState(false);
  const [finalGrade, setFinalGrade] = useState(-1.0);
  const [newAnswerAdded, setNewAnswerAdded] = useState(false);
  const {user} = useAuthContext();
  const handleAddQuiz = async (newQuiz) => {
    newQuiz.lessonId = lessonId;
    try {
      await axios.post(`/api/lesson-quiz/create`, newQuiz);
      setNewQuizAdded(!newQuizAdded);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  };

  const handleAddAnswer = () => {
    setNewAnswerAdded(!newAnswerAdded);
  }

  const getMyFinalGrade = useCallback(async () => {
    try {
      const res = await axios.get(`/api/lesson/${lessonId}/my-grade?userId=${user.id}`);
      setFinalGrade(res.data);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }, [lessonId, user.id, newAnswerAdded]);

  const getLessonQuizzes = useCallback(async () => {
    try {
      const res = await axios.get(`/api/lesson-quiz/${lessonId}/quizzes`);
      setQuizzes(res.data);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }, [lessonId]);


  useEffect(() => {
    getLessonQuizzes();
  }, [newQuizAdded, getLessonQuizzes]);

  useEffect(() => {
    if (user.role === 'student') {
      getMyFinalGrade();
    }
  }, [newAnswerAdded, getMyFinalGrade, user.role]);

  return (
    <Box>
      {quizzes.map((quiz, index) => (
        <QuizAccordion key={quiz.id} quiz={quiz} index={index} userRole={user.role} userId={user.id}  onAddAnswer={handleAddAnswer}/>
      ))}

      {user.role === 'teacher' && (
        <QuizForm onAddQuiz={handleAddQuiz}/>
      )}

      {user.role === 'student' && (
        finalGrade === -1.0 ? (
            <Alert severity="info">You can only see your grade after you answer all the quizzes</Alert>)
          :
          (

            <Alert severity="success">Your final grade is {finalGrade}</Alert>
          )
      )}
    </Box>
  );
}
