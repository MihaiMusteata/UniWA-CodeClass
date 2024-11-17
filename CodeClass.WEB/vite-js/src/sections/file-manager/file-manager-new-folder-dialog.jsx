import {useState, useEffect, useCallback} from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import {Upload} from 'src/components/upload';
import {Iconify} from 'src/components/iconify';
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------


export function FileManagerNewFolderDialog({
   open,
   onClose,
   onCreate,
   onUpdate,
   folderName,
   onChangeFolderName,
   lessonId,
   onNewDocumentUploaded,
   title = 'Upload files',
   ...other
 }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleUpload = async () => {
    if (!lessonId || !files.length) {
      console.error('No lesson ID or files to upload');
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        await axios.post(`/api/lesson/${lessonId}/document`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setFiles([]);
      onNewDocumentUploaded();
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{p: (theme) => theme.spacing(3, 3, 2, 3)}}> {title} </DialogTitle>

      <DialogContent dividers sx={{pt: 1, pb: 0, border: 'none'}}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{mb: 3}}
          />
        )}

        <Upload multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile}/>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill"/>}
          onClick={handleUpload}
          disabled={uploading} // Dezactivăm butonul în timpul upload-ului
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
