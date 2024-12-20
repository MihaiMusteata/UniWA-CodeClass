import {useState, useCallback} from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import {useTheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableRow, {tableRowClasses} from '@mui/material/TableRow';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import AvatarGroup, {avatarGroupClasses} from '@mui/material/AvatarGroup';

import {useBoolean} from 'src/hooks/use-boolean';
import {useDoubleClick} from 'src/hooks/use-double-click';
import {useCopyToClipboard} from 'src/hooks/use-copy-to-clipboard';

import {fData} from 'src/utils/format-number';
import {fDate, fTime} from 'src/utils/format-time';

import {varAlpha} from 'src/theme/styles';

import {toast} from 'src/components/snackbar';
import {Iconify} from 'src/components/iconify';
import {ConfirmDialog} from 'src/components/custom-dialog';
import {FileThumbnail} from 'src/components/file-thumbnail';
import {usePopover, CustomPopover} from 'src/components/custom-popover';

import {FileManagerShareDialog} from './file-manager-share-dialog';
import {FileManagerFileDetails} from './file-manager-file-details';
import {DocumentPreview} from "../product/document-preview";
import {useAuthContext} from "../../auth/hooks";

// ----------------------------------------------------------------------

export function FileManagerTableRow({row, selected, onSelectRow, onDeleteRow}) {
  const theme = useTheme();

  const {copy} = useCopyToClipboard();

  const {user} = useAuthContext();

  const [inviteEmail, setInviteEmail] = useState('');

  const documentDialog = useBoolean();

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const handleCopy = useCallback(() => {
    toast.success('Copied!');
    copy(row.url);
  }, [copy, row.url]);

  const defaultStyles = {
    borderTop: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
  };

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {backgroundColor: 'background.paper', boxShadow: theme.customShadows.z20},
          },
          [`& .${tableCellClasses.root}`]: {...defaultStyles},
          ...(details.value && {[`& .${tableCellClasses.root}`]: {...defaultStyles}}),
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onDoubleClick={() => console.info('ON DOUBLE CLICK')}
            onClick={onSelectRow}
            inputProps={{id: `row-checkbox-${row.id}`, 'aria-label': `row-checkbox`}}
          />
        </TableCell>

        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={row.type}/>

            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && {fontWeight: 'fontWeightBold'}),
              }}
            >
              {row.name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="right" sx={{px: 1, whiteSpace: 'nowrap'}}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill"/>
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{arrow: {placement: 'right-top'}}}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              documentDialog.onTrue();
            }}
          >
            <Iconify icon="eva:eye-fill"/>
            Open for preview
          </MenuItem>

          {
            user.role === "teacher" && (
              <>
                <Divider sx={{borderStyle: 'dashed'}}/>

                <MenuItem
                  onClick={() => {
                    confirm.onTrue();
                    popover.onClose();
                  }}
                  sx={{color: 'error.main'}}
                >
                  <Iconify icon="solar:trash-bin-trash-bold"/>
                  Delete
                </MenuItem>
              </>
            )
          }
        </MenuList>
      </CustomPopover>

      <FileManagerShareDialog
        open={share.value}
        shared={row.shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />

      <DocumentPreview dialog={documentDialog} fileExtension={row.type} folder={row.id} fileName={row.name}/>
    </>
  );
}
