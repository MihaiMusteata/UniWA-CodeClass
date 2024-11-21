import {useState, useCallback, useEffect} from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import {useBoolean} from 'src/hooks/use-boolean';
import {useSetState} from 'src/hooks/use-set-state';

import {fIsAfter, fIsBetween} from 'src/utils/format-time';

import {toast} from 'src/components/snackbar';
import {Iconify} from 'src/components/iconify';
import {fileFormat} from 'src/components/file-thumbnail';
import {EmptyContent} from 'src/components/empty-content';
import {ConfirmDialog} from 'src/components/custom-dialog';
import {useTable, rowInPage, getComparator} from 'src/components/table';

import {FileManagerTable} from '../../file-manager/file-manager-table';
import {FileManagerNewFolderDialog} from '../../file-manager/file-manager-new-folder-dialog';
import axios from "../../../utils/axios";

// ----------------------------------------------------------------------

export function FileManagerView({lessonId, userRole}) {
  const table = useTable({defaultRowsPerPage: 10});
  const [newDocumentUploaded, setNewDocumentUploaded] = useState(false);

  const confirm = useBoolean();

  const upload = useBoolean();


  const [tableData, setTableData] = useState([]);

  const filters = useSetState({
    name: '',
    type: [],
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.type.length > 0 ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;


  const handleDeleteItem = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleNewDocumentUploaded = () => {
    setNewDocumentUploaded(!newDocumentUploaded);
  };

  const getLessonDocuments = useCallback(async () => {
    try {
      const res = await axios.get(`/api/lesson/${lessonId}/documents`);
      const data = res.data.map((item) => ({
        ...item,
        type: item.extension,
      }));

      setTableData(data);
    } catch (e) {
      console.log(`Error : ${e}`);
    }
  }, [lessonId]);

  useEffect(() => {
    getLessonDocuments();
  }, [newDocumentUploaded, getLessonDocuments]);

  return (
    <>
      {
        userRole === 'teacher' && (
          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{mb: 2}}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:cloud-upload-fill"/>}
              onClick={upload.onTrue}
            >
              Upload
            </Button>
          </Stack>
        )}

      {notFound ? (
        <EmptyContent filled sx={{py: 10}}/>
      ) : (
        <>
          <FileManagerTable
            table={table}
            dataFiltered={dataFiltered}
            onDeleteRow={handleDeleteItem}
            notFound={notFound}
          />
        </>
      )}

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} lessonId={lessonId} onNewDocumentUploaded={handleNewDocumentUploaded}/>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({inputData, comparator, filters, dateError}) {
  const {name, type, startDate, endDate} = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((file) => fIsBetween(file.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
