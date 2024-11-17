import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import {useGetCourse} from 'src/actions/course';

import { CourseDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { course, courseLoading, courseError } = useGetCourse(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CourseDetailsView course={course} loading={courseLoading} error={courseError} />
    </>
  );
}
