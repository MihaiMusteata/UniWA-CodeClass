import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import { sumBy } from 'src/utils/helper';
import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import { ProductReviewList } from './product-review-list';
import { ProductReviewNewForm } from './product-review-new-form';

// ----------------------------------------------------------------------

export function ProductDetailsReview({ enrolledStudents }) {

  const renderSummary = (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Typography variant="subtitle2">Total enrolled students</Typography>

      <Typography variant="h2">
        {enrolledStudents}
      </Typography>

    </Stack>
  );

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ py: { xs: 5, md: 0 } }}
      >
        {renderSummary}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

    </>
  );
}
