import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetCourse } from 'src/actions/course';
import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { product } = useGetCourse(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductEditView product={product} />
    </>
  );
}
