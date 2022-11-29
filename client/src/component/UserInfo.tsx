import {useState} from 'react'
import Axios from 'axios'

//mui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


export function UserInfo(){

    return  <Box>
                <Grid container spacing={3}  direction="row" justifyContent="flex-start" alignItems="stretch">
                    <Grid item xs>
                        <Box></Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper sx={{  minWidth: '100%', minHeight:'100%' }}>             

                        </Paper>
                    </Grid>
                    <Grid item xs>
                        <Box></Box>
                    </Grid>
                </Grid>
            </Box>
}

export default UserInfo;