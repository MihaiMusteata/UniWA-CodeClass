import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetCourse } from 'src/actions/course';

import { ProductShopDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product details - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { product, productLoading, productError } = useGetCourse(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductShopDetailsView product={product} loading={productLoading} error={productError} />
    </>
  );
}
