import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import {Typography} from '@mui/material';
import {Iconify} from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';

const quizSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answers: z
    .array(
      z.object({
        optionText: z.string().min(1, 'Option is required'),
        isCorrect: z.boolean(),
      })
    )
    .min(2, 'At least two options are required')
    .refine((options) => options.some((opt) => opt.isCorrect), {
      message: 'At least one option must be correct',
    }),
});


export function QuizForm({onAddQuiz}) {
  const [answers, setAnswers] = useState([{optionText: '', isCorrect: false}]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
    reset,
  } = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      question: '',
      answers,
    },
  });

  const handleAddOption = () => {
    setAnswers([...answers, {optionText: '', isCorrect: false}]);
  };

  const handleRemoveOption = (index) => {
    setAnswers(answers.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index, value) => {
    const updatedAnswers = answers.map((opt, idx) =>
      idx === index ? {...opt, optionText: value} : opt
    );
    setAnswers(updatedAnswers);
  };

  const handleCheckboxChange = (index) => {
    const updatedAnswers = answers.map((opt, idx) =>
      idx === index ? {...opt, isCorrect: !opt.isCorrect} : opt
    );
    setAnswers(updatedAnswers);
  };

  const onSubmit = (data) => {
    const newQuiz = {
      question: data.question,
      answers,
    };
    onAddQuiz(newQuiz);
    setAnswers([{optionText: '', isCorrect: false}]);
    reset();
  };

  useEffect(() => {
    setValue('answers', answers);
  }, [answers, setValue]);

  useEffect(() => {
    if (errors.answers?.message === 'At least one option must be correct') {
      toast.warning('At least one option must be correct');
    } else if (errors.answers?.message === 'At least two options are required') {
      toast.warning('At least two options are required');
    }
  }, [errors.answers]);

  return (
    <Box
      sx={{
        mt: 4,
        border: '1px solid',
        borderColor: 'grey.700',
        borderRadius: 2,
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">Add new question</Typography>
        <Button variant="contained" color="success" onClick={handleSubmit(onSubmit)}>
          Add Quiz
        </Button>
      </Box>

      <Controller
        name="question"
        control={control}
        render={({field}) => (
          <TextField
            label="Question"
            fullWidth
            {...field}
            error={!!errors.question}
            helperText={errors.question?.message}
            sx={{mb: 2}}
          />
        )}
      />

      {answers.map((opt, index) => (
        <Box key={index} sx={{display: 'flex', alignItems: 'center', mb: 1}}>
          <TextField
            fullWidth
            label={`Option ${index + 1}`}
            value={opt.optionText}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            sx={{mr: 2}}
            error={!!errors.answers?.[index]?.optionText}
            helperText={errors.answers?.[index]?.optionText?.message}
          />
          <Checkbox
            checked={opt.isCorrect}
            onChange={() => handleCheckboxChange(index)}
          />
          <IconButton onClick={() => handleRemoveOption(index)}>
            <Iconify icon="eva:trash-2-outline"/>
          </IconButton>
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAddOption} fullWidth>
        Add Option
      </Button>
    </Box>
  );
}
