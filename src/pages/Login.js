import React, { useState } from "react";
import Box from '@mui/material/Box';
import { CircularProgress, Typography, TextField, Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                            <Button variant='contained' size={'small'}  sx={{ fontSize: "11px", marginTop: 1 }} className={"blinking"}>Login</Button>
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