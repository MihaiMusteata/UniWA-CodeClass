import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CardHeader from "@mui/material/CardHeader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Card from "@mui/material/Card";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import LinearProgress from "@mui/material/LinearProgress";

import {Iconify} from 'src/components/iconify';

import {Scrollbar} from "../../components/scrollbar";
import {TableHeadCustom} from "../../components/table";
import {Label} from "../../components/label";

// ----------------------------------------------------------------------

const mockData = {
  title: "Enrolled Students",
  subheader: "Overview of student progress",
  headLabel: [
    {id: 'index', label: 'No.', align: 'left'},
    {id: 'studentName', label: 'Student Name', align: 'left'},
    {id: 'progress', label: 'Progress', align: 'center'},
  ],
  tableData: [
    {studentName: "John Doe", progress: 82},
    {studentName: "Jane Smith", progress: 100},
    {studentName: "Alice Johnson", progress: 45},
  ],
};

export function ProductDetailsReview() {
  const {title, subheader, headLabel, tableData} = mockData;

  return (
    <Card sx={{mt: 3}}>
      <CardHeader title={title} subheader={subheader} sx={{mb: 3}}/>

      <Scrollbar sx={{height: 700}}>
        <Table>
          <TableHeadCustom headLabel={headLabel}/>

          <TableBody>
            {tableData.map((row, index) => (
              <RowItem key={index} index={index} row={row}/>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider sx={{borderStyle: 'dashed'}}/>

      <Box sx={{p: 2, textAlign: 'right'}}>
        <Button
          size="small"
          color="inherit"
          endIcon={
            <Iconify
              icon="eva:arrow-ios-forward-fill"
              width={18}
              sx={{ml: -0.5}}
            />
          }
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

function RowItem({index, row}) {
  return (
    <TableRow sx={{m:10}}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.studentName}</TableCell>
      <TableCell>
        <Stack
          justifyContent="center"
          sx={{typography: 'caption', color: 'text.secondary'}}
        >{
          row.progress === 100 ? <Label
              variant="soft"
              color="success"
              sx={{mb: 1}}
            >Completed</Label>
            :
            <LinearProgress
              value={row.progress}
              variant="determinate"
              color={
                row.progress < 30
                  ? 'error'
                  : row.progress < 70
                    ? 'warning'
                    : 'success'
              }
              sx={{mb: 1, width: 1, height: 6}}
            />}
          Student progress: {row.progress}%
        </Stack>
      </TableCell>
    </TableRow>
  );
}


