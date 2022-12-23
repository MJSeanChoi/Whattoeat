import { useEffect, useState } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import { Container } from "@mui/system";
import {
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import Home from "./pages/Home"
import RestaurantList from "./pages/RestaurantList"
import Login from "./pages/Login";
import Register from './pages/Register';

import theme from "./theme"

import InitialLoading from "./components/InitialLoading";
import Recommendation from './pages/Recommendation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from "firebase/app";
import {
    getAuth
} from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";

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

function App() {


  const [isLoading, setIsLoading] = useState(true) // Checks whether to show the loading page or not
  const [loggedIn, setLoggedIn] = useState(false);

  const [user, loading, error] = useAuthState(auth);


  useEffect(() => {
    AOS.init(); // Initializing the animate on scroll library
  })
  useEffect(() => {

    setIsLoading(false)
    setTimeout(() => {

      setIsLoading(false)

    }, 2000); // This will show the loading page for 2 seconds.


  }, [])


  useEffect(() => {
    console.log(user);
    console.log(loading);
    console.log('working');
  }, [user, loading])



  return (
    <>
      <ThemeProvider theme={theme}> 


        {isLoading ?
          <InitialLoading />
          :
          !user ?
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Routes>
          :
          <>
            <Navbar></Navbar>
            <Container sx={{
              mt: 10, mb: 10, backgroundColor: "#F6f7f6", borderRadius: 6,
              borderTopLeftRadius: 2, borderTopRightRadius: 2,
              boxShadow: "#F6f7f6 10px 10px 10px 10px"
            }}>

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="restaurants" element={<RestaurantList />} />
                <Route path="recommendation" element={<Recommendation />} />
              </Routes>
            </Container>
            <Footer></Footer>
          </>
        }
      </ThemeProvider>
      <ToastContainer />
    </>
  );
}


export default App;
