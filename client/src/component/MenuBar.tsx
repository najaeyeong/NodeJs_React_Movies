
import React, {  useState,useEffect } from 'react';
import { Link} from "react-router-dom"

//mui
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

//redux store
import { useSelector,useDispatch } from 'react-redux';
import {RootState} from '../store/store'
import menuSlice from '../store/menuSlice';
import userIdSlice from '../store/userIdSlice';

export default function MenuBar() {
  const [UserId ,setUserId] = useState(sessionStorage.getItem("user_id"))
  //const UserId =  useSelector<RootState,string|null>(state=>{return state.userId.Id})
  const genre = useSelector<RootState,string|null>(state=>{return state.search.genre})
  const userId = useSelector<RootState,string>(state=>{return state.userId.id})
  const dispatch = useDispatch()
  const [logined,setLogined] = useState<boolean>(false)

  useEffect(()=>{
    if(UserId === null && (sessionStorage.getItem("user_id") !== null)){
      //dispatch(userIdSlice.actions.login(sessionStorage.getItem("user_id")))
      sessionStorage.removeItem('user_id')
    }
  })

  useEffect(()=>{
    if(UserId === null){
      setLogined(false)
    }else{
      setLogined(true)
    }
  },[sessionStorage.getItem("user_id")])





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
              <Button style={{ textDecoration: 'none', color:"inherit" }} onClick={()=>{sessionStorage.removeItem('genre');
                                                                                  sessionStorage.removeItem('sort');
                                                                                  sessionStorage.removeItem('rating');
                                                                                  sessionStorage.removeItem('term');
                                                                                  sessionStorage.removeItem('year');
                                                                                  sessionStorage.removeItem('page');
                                                                                  sessionStorage.removeItem('lastpagenumber')
                                                                                  sessionStorage.removeItem('backlist')
                                                                                  window.location.replace("/home/movie");}}>home</Button>
              {/* <Link style={{ textDecoration: 'none', color:"inherit" }} to={'/'} onClick={()=>{sessionStorage.removeItem('genre');
                                                                                              sessionStorage.removeItem('sort');
                                                                                              sessionStorage.removeItem('rating');
                                                                                              sessionStorage.removeItem('term');
                                                                                              sessionStorage.removeItem('year')}} > Home </Link> */}
            </Typography>
            {(logined)?<>
                        <Button color="inherit" onClick={()=>{dispatch(menuSlice.actions.userInfo())}}>{UserId} , {userId}</Button>
                        <Button color="inherit" onClick={()=>{ setUserId(null); 
                          sessionStorage.removeItem("user_id");
                          dispatch(userIdSlice.actions.logout()) }}>Logout</Button>
                      </>
                      :<>
                        <Button color="inherit" href='/login'>Login{userId}</Button>
                        <Button color="inherit" href='/register'>register</Button>
                      </>}
          </Toolbar>
        </AppBar>
      </Box>
    );

  }


  