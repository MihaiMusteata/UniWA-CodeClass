import {useState, useEffect, useCallback} from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  DataGrid,
  gridClasses,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';

import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hooks';
import {RouterLink} from 'src/routes/components';

import {useBoolean} from 'src/hooks/use-boolean';
import {useSetState} from 'src/hooks/use-set-state';

import {useGetProducts} from 'src/actions/product';
import {DashboardContent} from 'src/layouts/dashboard';

import {toast} from 'src/components/snackbar';
import {Iconify} from 'src/components/iconify';
import {EmptyContent} from 'src/components/empty-content';
import {ConfirmDialog} from 'src/components/custom-dialog';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import {ProductTableFiltersResult} from '../product-table-filters-result';
import {varAlpha} from "../../../theme/styles/index";

// ----------------------------------------------------------------------
const mockData = [
  {
    id: 1,
    name: 'JavaScript Basics',
    category: 'Programming',
    totalLessons: 10,
    enrolledStudents: 120,
  },
  {
    id: 2,
    name: 'Introduction to Data Science',
    category: 'Data Science',
    totalLessons: 15,
    enrolledStudents: 80,
  },
  {
    id: 3,
    name: 'Advanced React',
    category: 'Programming',
    totalLessons: 20,
    enrolledStudents: 150,
  },
  {
    id: 4,
    name: 'Graphic Design for Beginners',
    category: 'Design',
    totalLessons: 12,
    enrolledStudents: 60,
  },
  {
    id: 5,
    name: 'Machine Learning Foundations',
    category: 'AI & Machine Learning',
    totalLessons: 25,
    enrolledStudents: 200,
  },
];

export function ProductListView() {
  const confirmRows = useBoolean();

  const router = useRouter();

  const {products, productsLoading} = useGetProducts();

  const filters = useSetState({publish: [], stock: []});

  const [tableData, setTableData] = useState(mockData);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [filterButtonEl, setFilterButtonEl] = useState(null);

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({inputData: tableData, filters: filters.state});

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds]
  );

  const columns = [
    {field: 'id', headerName: 'Course ID', filterable: false},
    {
      field: 'name',
      headerName: 'Course Name',
      flex: 1,
      minWidth: 300,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 220,
    },
    {
      field: 'totalLessons',
      headerName: 'Total Lessons',
      width: 160,
    },
    {
      field: 'enrolledStudents',
      headerName: 'Enrolled Students',
      width: 160,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold"/>}
          label="View"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold"/>}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold"/>}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
          sx={{color: 'error.main'}}
        />,
      ],
    },
  ];

  return (
    <>
      <DashboardContent
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          borderTop: (theme) => ({
            lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
          }),
        }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {name: 'Dashboard', href: paths.dashboard.root},
            {name: 'Course', href: paths.dashboard.product.root},
            {name: 'List'},
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line"/>}
            >
              New course
            </Button>
          }
          sx={{mb: {xs: 3, md: 5}}}
        />

        <Card
          sx={{
            flexGrow: {md: 1},
            display: {md: 'flex'},
            height: {xs: 800, md: 2},
            flexDirection: {md: 'column'},
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={productsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{pagination: {paginationModel: {pageSize: 10}}}}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent/>,
              noResultsOverlay: () => <EmptyContent title="No results found"/>,
            }}
            slotProps={{
              panel: {anchorEl: filterButtonEl},
              toolbar: {setFilterButtonEl},
            }}
            sx={{[`& .${gridClasses.cell}`]: {alignItems: 'center', display: 'inline-flex'}}}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  )
    ;
}

function CustomToolbar({
                         filters,
                         canReset,
                         selectedRowIds,
                         filteredResults,
                         setFilterButtonEl,
                         onOpenConfirmDeleteRows,
                       }) {
  return (
    <>
      <GridToolbarContainer>

        <GridToolbarQuickFilter/>

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold"/>}
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarFilterButton ref={setFilterButtonEl}/>
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{p: 2.5, pt: 0}}
        />
      )}
    </>
  );
}

function applyFilter({inputData, filters}) {

  return inputData;
}
