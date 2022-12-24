import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import { Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signOut
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD__H09LoNbgRXWF-Z1xGYRjO2XtDtRsuQ",
    authDomain: "whattoeat-7cff1.firebaseapp.com",
    projectId: "whattoeat-7cff1",
    storageBucket: "whattoeat-7cff1.appspot.com",
    messagingSenderId: "545758974700",
    appId: "1:545758974700:web:6ea7741cfc9dd73b144bc9",
    measurementId: "G-73KN1655CQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const drawerWidth = 240;
const navItems = ['Home', 'EAT!'];
const navItemsPath = ['', 'recommendation'];


function Navbar(props) {
    const { window } = props;

    const [mobileOpen, setMobileOpen] = React.useState(false);


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const logout = () => {
        signOut(auth);
    }


    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }} >
            <Typography variant="overline" sx={{ my: 2, color: 'grey' }}>
                What To Eat?
            </Typography>
            <Divider />
            {navItems.map((item, idx) => (
                <Link key={idx.toString()} to={navItemsPath[idx]} style={{ textDecoration: 'none', color: "green" }}>
                    <ListItemButton >
                        <Typography variant="body2" color={"primary"}>
                            {item}
                        </Typography>

                    </ListItemButton>
                </Link>
            ))
            }
        </Box >
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>
            <AppBar component="nav" sx={{ bgcolor: "white", background: "transparent", zIndex: { xs: "-1", sm: "999", md: "999" }, backdropFilter: { xs: "blur(0px)", sm: "blur(4px)", md: "blur(4px)", }, boxShadow: "rgba(246,247,246,.1) 1px 1px 1px 1px", transition: "1000ms" }} >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon color='primary' />
                    </IconButton>
                    <Typography
                        variant="overline"
                        component="div"
                        color="primary"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, fontSize: "16px" }}
                    >
                        <Link to={navItemsPath[0]} style={{ textDecoration: "none", color: "#FF9457", display: "flex", flexDirection: "row" }}>
                            < img width={40} height={35}
                                style={{ margin: 2, marginRight: 4 }}
                                className="img-animation"
                                alt={"loading"}
                                src='./logo.png'></img >
                            <Box>
                                What To Eat?
                            </Box>
                        </Link>

                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, transition: '2000ms' }}>
                        {navItems.map((item, idx) => (
                            <Link key={idx.toString()} to={navItemsPath[idx]} style={{ textDecoration: 'none', color: "green" }}>
                                <Button key={item}>
                                    <Typography color="primary">{item}</Typography>
                                </Button>
                            </Link>

                        ))}
                        <Button onClick = {() => {logout();}}>
                            <Typography color="primary">Sign Out</Typography>
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </>

    );
}

export default Navbar;
