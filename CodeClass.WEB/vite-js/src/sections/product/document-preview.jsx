import {forwardRef} from 'react';

import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import {Iconify} from 'src/components/iconify';
import {EmptyContent} from "../../components/empty-content";

// ----------------------------------------------------------------------

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ----------------------------------------------------------------------

export function DocumentPreview({dialog, folder, fileName, fileExtension}) {

  const filePath = `${folder}/${fileName}${fileExtension}`;
  return (
    <>
      <Dialog
        fullScreen
        open={dialog.value}
        onClose={dialog.onFalse}
        TransitionComponent={Transition}
      >
        <AppBar position="relative" color="default">
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={dialog.onFalse}>
              <Iconify icon="mingcute:close-line"/>
            </IconButton>

            <Typography variant="h6" sx={{flex: 1, ml: 2}}>
              Attachment
            </Typography>

            <Button autoFocus color="inherit" variant="contained" onClick={dialog.onFalse}>
              Done
            </Button>
          </Toolbar>
        </AppBar>


        {
          fileExtension === '.pdf' && (
            <Box>
              <Typography variant="subtitle2">PDF Preview</Typography>
              <embed
                src={`http://localhost:3000/${filePath}`}
                type="application/pdf"
                width="100%"
                height='900'
              />
            </Box>
          )
        }
        {
          (fileExtension === '.jpg' || fileExtension === '.png') && (
            <Box>
              <Typography variant="subtitle2">Image Preview</Typography>
              <img
                src={`http://localhost:3000/${filePath}`}
                alt="Preview"
              />
            </Box>
          )
        }
        {
          (fileExtension === '.mp4' || fileExtension === '.mov') && (
            <Box>
              <Typography variant="subtitle2">Video Preview</Typography>
              <video
                src={`http://localhost:3000/${filePath}`}
                controls
                width="100%"
                height='900'
              />
            </Box>
          )
        }
        {
          fileExtension === '.mp3' && (
            <Box>
              <Typography variant="subtitle2">Audio Preview</Typography>
              <audio
                src={`http://localhost:3000/${filePath}`}
                controls
              >
                <track
                  kind="captions"
                  srcLang="en"
                  default
                />
                Your browser does not support the audio element.
              </audio>

            </Box>
          )
        }

        {
          (fileExtension !== '.pdf' && fileExtension !== '.jpg' && fileExtension !== '.png' && fileExtension !== '.mp4' && fileExtension !== '.mov' && fileExtension !== '.mp3') && (
            <>
              <EmptyContent filled sx={{m: 3}} title='Preview not available' />
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
              >
                <Button
                  variant="contained"
                  color="primary"
                  href={`http://localhost:3000/${filePath}`}
                  download
                  sx={{mb:3, width:'50%'}}
                  startIcon={
                    <Iconify icon="eva:cloud-download-fill"/>}
                >
                  Download
                </Button>
              </Box>
            </>
          )
        }

      </Dialog>
    </>
  );
}
