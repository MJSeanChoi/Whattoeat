import * as React from 'react';
import Box from '@mui/material/Box';
import "../App.css"
import { CircularProgress, Typography } from '@mui/material';

function InitialLoading() {
    return (
        <Box width={"100vw"} height={"100vh"} backgroundColor={"#FF9457"} display={"flex"} flexDirection={'column'} justifyContent="center" alignItems={'center'}>
            < img
                style={{ marginTop: 100 }}
                alt={"loading"}
                width={250}
                src='./logo.png' ></img >

            <Box mt={5}>
                <Typography variant={"overline"} color={'secondary'}
                    sx={{ letterSpacing: "3px", fontSize: "18px" }}
                >What To Eat?</Typography>
                <Box m={5} display={"flex"} justifyContent={"center"}>
                    <CircularProgress size="1rem" color='secondary' />
                </Box>
            </Box>
        </Box >
    );
}

export default InitialLoading;
