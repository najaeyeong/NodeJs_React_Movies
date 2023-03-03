import  {useEffect, useState}from 'react';
import axios from 'axios';
import {useDropzone} from 'react-dropzone'
import Input from '@mui/material/Input';
import { Button, Fab, IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';




export function AcceptFile({ onDrop, accept}:any){
    const { getRootProps, getInputProps, open, isDragActive, acceptedFiles } = useDropzone({accept,onDrop,})

    return  <>
        <Box component="div" sx={{m:1,width:'90%',textAlign:"center", border:2,borderColor:"blue", borderStyle:"dashed"}}{...getRootProps({ className: "dropzone" })}>
            <input className="input-zone" {...getInputProps()} />
            <div className="text-center">
                <p className="dropzone-content">
                    Drag’n’drop some files here, or click to select files
                </p>
            </div>
            <Button >
                <AttachFileIcon /> Upload file
            </Button >
        </Box>
    {/* <Box sx={{width:'90%'}}>
                {getFileList()}
            </Box>
     <Box component="div" {...getRootProps({ className: "dropzone" })}>
        <input
            {...getInputProps()}
        />
        <Button onClick={open}>
            <AttachFileIcon /> Upload file
        </Button >
        <label htmlFor="upload-files">
            <Fab
                color="secondary"
                size="small"
                component="span"
                aria-label="add"
                variant="extended"
            >
                <AttachFileIcon /> Upload file
            </Fab>
            <Fab color="primary" size="small" component="span" aria-label="add">
                <AttachFileIcon />
            </Fab>
        </label> 
    </Box>*/}
    </>
}

export default AcceptFile