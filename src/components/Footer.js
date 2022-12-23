import * as React from 'react';
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import ListItemButton from '@mui/material/ListItemButton';
import { Link } from "react-router-dom";

function Footer() {

    const navItems = ['Home', 'EAT!'];
    const navItemsPath = ['', 'recommendation'];


    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            backgroundColor={"secondary"}
            sx={{ height: "20vh", paddingTop: 0 }}
        >
            <Typography variant={"body2"} color={"secondary.main"} className="img-animation">What To Eat? @EAGLE BROOK SCHOOL</Typography>
            <Grid container direction="row" justifyContent={"center"}>

                {navItems.map((item, idx) => (
                    <Link key={idx.toString()} to={navItemsPath[idx]} style={{ textDecoration: 'none' }}>
                        <ListItemButton><Typography variant={"overline"} color={"secondary.main"}>{item}</Typography>
                        </ListItemButton>
                    </Link>

                ))}
            </Grid>

        </Grid >
    );
}

export default Footer;
