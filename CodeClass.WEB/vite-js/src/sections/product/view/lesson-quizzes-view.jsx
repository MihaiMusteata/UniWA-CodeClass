import React, {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import axios from 'src/utils/axios';
import { QuizAccordion } from '../quiz-accordion';
import { QuizForm } from '../quiz-form';
const initialData = [
  {
    id: 1,
    heading: 'What is the capital of France?',
    question: 'What is the capital of France?',
    options: [
      { option: 'Paris', isCorrect: true },
      { option: 'Berlin', isCorrect: false },
      { option: 'Madrid', isCorrect: false },
    ],
  },
  {
    id: 2,
    heading: 'What is 2 + 2?',
    question: 'What is 2 + 2?',
    options: [
      { option: '3', isCorrect: false },
      { option: '4', isCorrect: true },
      { option: '5', isCorrect: false },
    ],
  },
];

export function LessonQuizzesView({lessonId}) {
  const [quizzes, setQuizzes] = useState([]);

  const handleAddQuiz = (newQuiz) => {
    newQuiz.lessonId = lessonId;
    console.log(newQuiz);
  };

  const getLessonQuizzes = useCallback(async () => {
    try {
      const res = await axios.get(`/api/lesson-quiz/${lessonId}/quizzes`);
      setQuizzes(res.data);
    } catch (e) {
      console.log(`Error : {e}`);
    }
  }, [lessonId]);

  useEffect(() => {
    getLessonQuizzes();
  }, [getLessonQuizzes]);

  return (
    <Box>
      {quizzes.map((quiz, index) => (
        <QuizAccordion key={quiz.id} quiz={quiz} index={index} />
      ))}

      <QuizForm onAddQuiz={handleAddQuiz} />
    </Box>
  );
}
