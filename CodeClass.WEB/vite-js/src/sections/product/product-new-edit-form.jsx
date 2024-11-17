import {z as zod} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMemo, useState, useEffect} from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hooks';

import {
  COURSE_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock/_course';

import {toast} from 'src/components/snackbar';
import {Form, Field, schemaHelper} from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';
import axios, {endpoints} from "../../utils/axios";

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  name: zod.string().min(1, {message: 'Name is required!'}),
  // Not required
  category: zod.string(),
});

// ----------------------------------------------------------------------

export function ProductNewEditForm({currentProduct}) {
  const router = useRouter();

  const { user } = useAuthContext();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      //
      category: currentProduct?.category || COURSE_CATEGORY_GROUP_OPTIONS[0].classify[1],
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: {isSubmitting},
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    data.userId = user.id;
    data.category = `${data.category}`
    console.log('DATA', data)
    try {
      const res = await axios.post(endpoints.course.create, data);
      console.log('RES', res)
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Think of a name for your new course" sx={{mb: 3}}/>

      <Divider/>

      <Stack spacing={3} sx={{p: 3}}>
        <Field.Text name="name" label="Course name"/>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Properties"
        subheader="Additional attributes"
        sx={{mb: 3}}
      />

      <Divider/>

      <Stack spacing={3} sx={{p: 3}}>
        <Box
          columnGap={3}
          rowGap={3}
          display="grid"
        >
          <Field.Select native name="category" label="Category" InputLabelProps={{shrink: true}}>
            {COURSE_CATEGORY_GROUP_OPTIONS.map((category) => (
              <optgroup key={category.group} label={category.group}>
                {category.classify.map((classify) => (
                  <option key={classify} value={classify}>
                    {classify}
                  </option>
                ))}
              </optgroup>
            ))}
          </Field.Select>
        </Box>

      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create course' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{xs: 3, md: 5}}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Stack>
    </Form>
  );
}
