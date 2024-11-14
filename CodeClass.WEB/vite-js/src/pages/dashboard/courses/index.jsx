import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {OverviewCoursesView} from "../../../sections/overview/courses/view/index";

// ----------------------------------------------------------------------

const metadata = { title: `Courses | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewCoursesView />
    </>
  );
}
