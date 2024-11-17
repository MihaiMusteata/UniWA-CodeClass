import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useGetCourses } from 'src/actions/course';

import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product shop - ${CONFIG.appName}` };

export default function Page() {
  const { products, productsLoading } = useGetCourses();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductShopView products={products} loading={productsLoading} />
    </>
  );
}
