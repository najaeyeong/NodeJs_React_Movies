
import React, {  useState } from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";




export default function MenuBar() {
  const [UserId ,setUserId] = useState(sessionStorage.getItem("user_id"))

  if (UserId === null ){
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
            <Button color="inherit" href='/login'>Login</Button>
            <Button color="inherit" href='/register'>register</Button>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }else{
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
            <Button color="inherit">{UserId}</Button>
            <Button color="inherit" onClick={()=>{ setUserId(null); sessionStorage.removeItem('user_id') }}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>
    );

  }

}
