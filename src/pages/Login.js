import React, { useState } from "react";
import Box from '@mui/material/Box';
import { CircularProgress, Typography, TextField, Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword
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

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async() => {
        if(email == "")
        {
            alert("Please input an email.");
            return;
        }
        else if(password == "")
        {
            alert("Please input a password");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (err) {
            console.error(err);
            alert(err.message);
          }
    }

    return (
        <Box width={"100vw"} height={"100vh"} backgroundColor={"#FF9457"} display={"flex"} flexDirection={'column'} justifyContent="center" alignItems={'center'}>
            < img
                alt={"loading"}
                width={250}
                src='./logo.png' ></img >
            <div data-aos="fade-up" data-aos-duration="2000">
                <Box mt={5}>
                    <div
                        style = {{
                            backgroundColor: 'white',
                            boxShadow: "rgba(255,228,214,.75) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                            padding: 20,
                            borderRadius: 10
                        }}
                    >
                        <div
                            style={{
                                textAlign: 'center', 
                                marginBottom: 10,
                                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                                fontWeight: 'bold'
                            }}
                        >
                            LOGIN
                        </div>
                        <div>
                            <TextField placeholder='Email' size='small' value={email} sx={{ backgroundColor: "white", borderRadius: 1, input: { color: "#4e6b55", fontWeight: "bold", fontSize: "12px" } }} onChange={(e) => { setEmail(e.target.value) }}></TextField>
                        </div>
                        <div>
                            <TextField placeholder='Password' type="password" size='small' value={password} sx={{ backgroundColor: "white", borderRadius: 1, marginTop: 1, input: { color: "#4e6b55", fontWeight: "bold", fontSize: "12px" } }} onChange={(e) => { setPassword(e.target.value) }}></TextField>
                        </div>
                        <div
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            <Button variant='contained' size={'small'}  sx={{ fontSize: "11px", marginTop: 1 }} className={"blinking"} onClick={() => {login();}}>Login</Button>
                        </div>
                    </div>
                </Box>
                <div
                    style={{
                        fontSize: 11,
                        marginTop: 10
                    }}
                >
                    Dont' have an account? <Link to={`/register`} style={{ textDecoration: "none", textDecorationLine: 'underline' }}>Sign Up</Link>
                </div>
            </div>
        </Box >
    )
}