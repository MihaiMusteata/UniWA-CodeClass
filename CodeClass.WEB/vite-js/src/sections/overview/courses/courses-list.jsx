import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import {fCurrency} from 'src/utils/format-number';

import {Label} from 'src/components/label';
import {Iconify} from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';
import {TableHeadCustom} from 'src/components/table';
import {usePopover, CustomPopover} from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function CoursesList({title, onEnroll, subheader, tableData, headLabel, ...other}) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{mb: 3}}/>

      <Scrollbar sx={{minHeight: 402}}>
        <Table sx={{minWidth: 680}}>
          <TableHeadCustom headLabel={headLabel}/>

          <TableBody>
            {tableData.map((row) => (
              <RowItem key={row.id} row={row} handleClick={row.isEnrolled ? null : onEnroll}/>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider sx={{borderStyle: 'dashed'}}/>

      <Box sx={{p: 2, textAlign: 'right'}}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ml: -0.5}}/>}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

function RowItem({row, handleClick}) {

  return (
    <>
      <TableRow>
        <TableCell>{row.id}</TableCell>

        <TableCell>{row.teacherName}</TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.category}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={row.isEnrolled ? 'success' : 'warning'}
          >
            {row.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
          </Label>
        </TableCell>

        <TableCell>
          <Button variant="contained" color={row.isEnrolled ? 'success' : 'warning'} onClick={() => handleClick(row.id)}>
            {row.isEnrolled ? 'View' : 'Enroll'}
          </Button>
        </TableCell>
      </TableRow>

    </>
  );
}
