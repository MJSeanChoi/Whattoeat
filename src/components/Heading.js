import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
function Heading({ title, content }) {
    return (

        <Box sx={{ dislpay: "flex", flexDirection: "column" }}>
            <Box >
                <Typography variant={"overline"} color={"primary"} sx={{ fontSize: 26, mb: 0, fontWeight: '500' }}>
                    {title}
                </Typography>
                <Box sx={{ height: 10, width: "100%", mt: -4.5 }} backgroundColor="#fce4d7" />

            </Box>

            <Box mt={2}>
                <Typography variant={"overlilne"} sx={{ fontSize: 16, color: "gray" }}>
                    {content}
                </Typography>
            </Box>

        </Box >

    );
}

export default Heading;
