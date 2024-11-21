import {useCallback, useState, useEffect} from "react";
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Iconify} from 'src/components/iconify';
import {toast} from 'src/components/snackbar';
import axios from 'src/utils/axios';
import {Alert} from '@mui/material';

const successToastMessages = [
  'Congratulations! 🎉',
  'Well done! 🎉',
  'You are doing great! 🎉',
  'Keep up the good work! 🎉',
  'You are on fire ! 🔥',
  'You are a star! 🌟',
];

const warningToastMessages = [
  'Oops! 😅',
  'Be careful! ',
  'Watch out! ',
  'You did pretty well! But you can do better, right? ',
  'Be cautious! ',
  'Be aware! ',
  'Next time you will definitely do better! ',
];

const errorToastMessages = [
  'Oh no! 😱',
  'Try to learn from your mistakes! ',
  'You should review the material again! ',
  'Don\'t be discouraged! ',
  'Don\'t give up! ',
  'You can do it! ',
  'Good luck next time! ',
];

export function QuizAccordion({index, quiz, userRole, userId, onAddAnswer}) {
  const [expanded, setExpanded] = useState(userRole === "student");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [prevAnswers, setPrevAnswers] = useState([]);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleSelectAnswer = (answerId) => {
    if (prevAnswers.length > 0) {
      return;
    }
    setSelectedAnswers((prev) => {
      if (prev.includes(answerId)) {
        return prev.filter((id) => id !== answerId);
      }
      return [...prev, answerId];
    });
  }

  const checkAnswer = async () => {
    const params = {
      userId,
      lessonQuizId: quiz.id,
      givenAnswerIds: selectedAnswers,
    };

    try {
      await axios.post(`/api/lesson-quiz/answer`, params);

      const newPrevAnswers = selectedAnswers.map((answerId) => {
        const answer = quiz.answers.find((opt) => opt.id === answerId);
        return {
          id: answerId,
          isCorrect: answer?.isCorrect || false,
        };
      });

      const resultStatus = newPrevAnswers.every((answer) => answer.isCorrect) &&
      newPrevAnswers.length === quiz.answers.filter((answer) => answer.isCorrect).length
        ? 'success'
        : newPrevAnswers.some((answer) => answer.isCorrect)
          ? 'warning'
          : 'error'

      switch (resultStatus) {
        case 'success':
          toast.success(successToastMessages[Math.floor(Math.random() * successToastMessages.length)]);
          break;
        case 'warning':
          toast.warning(warningToastMessages[Math.floor(Math.random() * warningToastMessages.length)]);
          break;
        case 'error':
          toast.error(errorToastMessages[Math.floor(Math.random() * errorToastMessages.length)]);
          break;
        default:
          break;
      }

      setPrevAnswers(newPrevAnswers);
      onAddAnswer();
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  };


  const getPrevAnswers = useCallback(async () => {
    try {
      const res = await axios.get(`/api/lesson-quiz/${quiz.id}/my-answers?userId=${userId}`);
      setPrevAnswers(res.data);
      setSelectedAnswers(res.data.map((answer) => answer.id));
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }, [quiz.id, userId]);

  useEffect(() => {
    getPrevAnswers();
  }, [expanded, getPrevAnswers]);

  return (
    <Accordion expanded={expanded} onChange={handleToggle}>
      <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill"/>}>
        <Typography variant="subtitle1">{`Question ${index + 1}`}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Typography variant="body1">{quiz.question}</Typography>

        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, mt: 2}}>
          {quiz.answers.map((opt, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  checked={
                    userRole === "teacher" ? opt.isCorrect : selectedAnswers.includes(opt.id)
                  }
                  onChange={() => handleSelectAnswer(opt.id)}
                  disabled={userRole === "teacher"}
                  sx={{
                    '&.Mui-checked': {
                      color: prevAnswers.some((answer) => answer.id === opt.id)
                        ? opt.isCorrect ? 'success.main' : 'error.main'
                        : 'default',
                    },
                  }}
                />
              }
              label={opt.optionText}
            />
          ))}
          {
            userRole === "student" && prevAnswers.length > 0 && (
              <Alert
                severity={
                  prevAnswers.every((answer) => answer.isCorrect) &&
                  prevAnswers.length === quiz.answers.filter((answer) => answer.isCorrect).length
                    ? 'success'
                    : prevAnswers.some((answer) => answer.isCorrect)
                      ? 'warning'
                      : 'error'
                }
              >
                {
                  prevAnswers.every((answer) => answer.isCorrect) &&
                  prevAnswers.length === quiz.answers.filter((answer) => answer.isCorrect).length
                    ? 'All correct!'
                    : prevAnswers.some((answer) => answer.isCorrect)
                      ? `Partially correct. The correct answers are: ${quiz.answers.filter((answer) => answer.isCorrect).map((answer) => answer.optionText).join(', ')}`
                      : `Incorrect answers. The correct answers are: ${quiz.answers.filter((answer) => answer.isCorrect).map((answer) => answer.optionText).join(', ')}`
                }
              </Alert>
            )
          }
        </Box>

        {userRole === "student" && (
          <>
            <Button variant="outlined" sx={{mt: 2}} onClick={checkAnswer} disabled={prevAnswers.length > 0}>
              {
                prevAnswers.length > 0
                  ? "Question submitted"
                  : "Check Answer"
              }
            </Button>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
