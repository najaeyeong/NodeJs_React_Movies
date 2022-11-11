import { Box, Grid } from "@mui/material";


export function Footer(){

    return <>
    <Grid  container
            direction="column"
            justifyContent="center"
            alignItems="center"
            height={200}
            sx={{bgcolor: "#c5cae9"}}
            >
        <Box >
            주소: 번호: 팩스: 이메일:
        </Box>
    </Grid>
    </>
}


export default Footer;