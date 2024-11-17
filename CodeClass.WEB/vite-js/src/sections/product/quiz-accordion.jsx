import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { Iconify } from 'src/components/iconify';

export function QuizAccordion({ index, quiz }) {
  return (
    <Accordion key={quiz.id}>
      <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
        <Typography variant="subtitle1">{`Question ${index + 1}`}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Typography variant="body1">{quiz.question}</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          {quiz.answers.map((opt, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox checked={opt.isCorrect} />}
              label={opt.optionText}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
