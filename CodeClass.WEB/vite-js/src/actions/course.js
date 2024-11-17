import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetCourses(teacherId) {
  const url = `/api/course/list/${teacherId}`

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      courses: data || [],
      coursesLoading: isLoading,
      coursesError: error,
      coursesValidating: isValidating,
      coursesEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCourse(id) {
  const url = id ? [endpoints.course.details, { params: { id } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      course: data,
      courseLoading: isLoading,
      courseError: error,
      courseValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const url = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
