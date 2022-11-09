
import React, {  useState,useEffect } from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { useSelector,useDispatch } from 'react-redux';
import {RootState} from '../store/store'
import userIdSlice from '../store/userIdSlice';



export default function MenuBar() {
  //const [UserId ,setUserId] = useState(sessionStorage.getItem("user_id"))
  const UserId =  useSelector<RootState,string|null>(state=>{return state.userId.Id})
  const dispatch = useDispatch()
  const [logined,setLogined] = useState<boolean>(false)

  useEffect(()=>{
    if(UserId === null && (sessionStorage.getItem("user_id") !== null)){
      dispatch(userIdSlice.actions.login(sessionStorage.getItem("user_id")))
      sessionStorage.removeItem('user_id')
    }
  })

  useEffect(()=>{
    if(UserId === null){
      setLogined(false)
    }else{
      setLogined(true)
    }
  },[UserId])





  //dispatch({type:'userIdSlice/login',payload:{id:id}})
  //dispatch(userIdSlice.actions.logout(null))

    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              blog
            </Typography>
            {(logined)?<>
                        <Button color="inherit">{UserId}</Button>
                        <Button color="inherit" onClick={()=>{ dispatch(userIdSlice.actions.login(null))}}>Logout</Button>
                      </>
                      :<>
                        <Button color="inherit" href='/login'>Login</Button>
                        <Button color="inherit" href='/register'>register</Button>
                      </>}
          </Toolbar>
        </AppBar>
      </Box>
    );

  }


