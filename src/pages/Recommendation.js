import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, Typography, CircularProgress } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IconButton from '@mui/material/IconButton';
import Heading from '../components/Heading';
import RestaurantList from "./RestaurantList";
import axios from 'axios';
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    getDoc,
    setDoc,
    doc,
    updateDoc,
    increment
} from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyD__H09LoNbgRXWF-Z1xGYRjO2XtDtRsuQ",
    authDomain: "whattoeat-7cff1.firebaseapp.com",
    projectId: "whattoeat-7cff1",
    storageBucket: "whattoeat-7cff1.appspot.com",
    messagingSenderId: "545758974700",
    appId: "1:545758974700:web:6ea7741cfc9dd73b144bc9",
    measurementId: "G-73KN1655CQ"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const LIMIT_RESULT_COUNT = 8

function Recommendation() {

    const menu = ['Taco', 'Fried Rice', 'Salad', 'Burrito', 'Burger', 'Pizza', 'Sandwich', 'Pasta']
    //yyy -> taco
    //yyn-> fried rice
    //yny ->salad bowl
    //ynn ->burrito
    //nyy ->burger
    //nyn ->pizza
    //nny ->sandwich
    //nnn ->pasta

    const menuOption1 = ['Fried Chicken', 'Burrito', 'Burger', 'Sushi'];
    const menuOption2 = ['Fish Salad', 'Steak Salad'];
    const menuOption3 = ['Salad', 'Vegetable Soup', 'Sashimi', 'Sandwich'];
    const menuOption4 = ['Burger', 'Ramen', 'Chicken', 'Taco', 'Sandwich', 'Pizza', 'Hot Dog'];
    const menuOption5 = ['Steak', 'Pasta', 'Burger', 'Fried Chicken', 'Ribs', 'Fried Rice'];

    const data = [

        { question: "Do you want something greasy?", choices: ['YES', 'NO'] },
        { question: "Do you want something simple and fast?", choices: ['YES', 'NO'] },
        { question: "What kind of body type do you want?", choices: ['Muscular', 'Slim', "Doesn't Matter"]}
    ]


    useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }, [])



    const [isLoading, setIsLoading] = useState(true)
    const [isDataLoading, setIsDataLoading] = useState(false)

    const [response, setResponse] = useState([])
    const [finished, setFinished] = useState(false)

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [keyword, setKeyword] = useState("")
    const [location, setLocation] = useState("42.54257%2C-72.59268"); // eagle brook
    const [radius, setRadius] = useState(5000);

    const [results, setResults] = useState([])

    useEffect(() => {
        if (isLoading === true) {
            setIsLoading(true)
            setTimeout(() => {
                setIsLoading(false)
            }, 2);
        }
    }, [isLoading])

    const getRestaurantData = async (searchKey) => {
        setIsDataLoading(true)
        const data = {
            keyword: searchKey, location, radius, apikey: process.env.REACT_APP_GOOGLE_API
        }
        try {
            console.log("Requesting with the keyword: ", searchKey)
            const res = await axios.post("https://ds-backend-test.herokuapp.com/whattoeatgoogleapi", data)

            const finalResult = JSON.parse(res.data.result).results.slice(0, LIMIT_RESULT_COUNT)
            console.log(finalResult)

            setResults(finalResult)
            // alert(JSON.stringify(finalResult[0].photos[0].photo_reference))

            // update results state with img field
            // for (let i = 0; i < finalResult.length; i++) {
            //     console.log(i)
            //getRestaurantImages(finalResult[0].photos[0].photo_reference)
            //}

            setIsDataLoading(false)
        }
        catch (error) {
            console.log(error)
        }
    }


    // const getRestaurantImages = async (photo_ref) => {
    //     const data = {
    //         photo_ref, apikey: process.env.REACT_APP_GOOGLE_API
    //     }
    //     try {
    //         const res = await axios.post("https://ds-backend-test.herokuapp.com/whattoeatgoogleapiimages", data)
    //         console.log((res.data.result).)

    //     }
    //     catch (error) {
    //         console.log(error)
    //     }

    // }


    const handleResponse = async(val) => {
        if (currentQuestionIndex + 1 < data.length) {
            setIsLoading(true)
            setResponse(prev => ([...prev, val]))
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        } else {
            // setIsLoading(true)
            setResponse(prev => ([...prev, val]))

            let results = ""
            for (let i of response) {
                if (i === "YES") {
                    results += "y"
                } else {
                    results += "n"
                }

            }
            //add last
            if (val === "Muscular") {
                results += "1"
            } else if(val === "Slim") {
                results += "2"

            }
            else
            {
                results += "3"
            }


            //yyy -> taco
            //yyn-> fried rice
            //yny ->salad bowl
            //ynn ->burrito
            //nyy ->burger
            //nyn ->pizza
            //nny ->sandwich
            //nnn ->pasta
            let searchKey = ""
            if (results === "yy1") {
                // Menu option1
                let output = menuOption1[Math.floor(Math.random()*menuOption1.length)];
                setKeyword(output)
                searchKey = output
            } else if (results === "nn1") {
                // Menu option2
                let output = menuOption2[Math.floor(Math.random()*menuOption2.length)];
                setKeyword(output)
                searchKey = output

            } else if (results === "nn2") {
                // Menu option3
                let output = menuOption3[Math.floor(Math.random()*menuOption3.length)];
                setKeyword(output)
                searchKey = output

            } else if (results === "yy3") {
                // Menu option4
                let output = menuOption4[Math.floor(Math.random()*menuOption4.length)];
                setKeyword(output)
                searchKey = output

            } else if (results === "yn3") {
                // Menu option5
                let output = menuOption5[Math.floor(Math.random()*menuOption5.length)];
                setKeyword(output)
                searchKey = output

            } else {
                // Menu option5
                let output = menuOption5[Math.floor(Math.random()*menuOption5.length)];
                setKeyword(output)
                searchKey = output

            }

            const docRef = doc(db, "cities", searchKey);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    count: increment(1)
                });
            } else {
              // Add a new document in collection "cities"
                await setDoc(doc(db, "trend", searchKey), {
                    name: searchKey,
                    count: 1
                });
            }            

            setFinished(true)
            getRestaurantData(searchKey)
        }
    }


    return (

        <Box sx={{ width: "100%", minHeight: "70vh" }}>
            <Box mt={15} mb={8} data-aos="fade-right" data-aos-duration="1000" display={'flex'} justifyContent='space-between'>
                <Heading title={"Recommendation"} content={finished ? `${keyword} is pretty good!` : "Which food type are you into?"} />
                <Box data-aos="fade-left" data-aos-duration="2000" mt={5}>
                    <IconButton color="primary" aria-label="reset" onClick={() => { setIsLoading(true); setFinished(false); setResponse([]); setCurrentQuestionIndex(0) }}>
                        <RestartAltIcon />
                    </IconButton>
                    <Typography variant={"overline"} sx={{ fontSize: "8px" }}>
                        Restart
                    </Typography>
                </Box>
            </Box>

            {
                (isLoading || isDataLoading) ?
                    <Box data-aos="fade-left" data-aos-duration="2500" data-aos-offset="300" display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={'center'}>
                        < img
                            alt={"loading"}
                            width={150}
                            src='./logo.png' >
                        </img >

                        <Box mt={5}>
                            <Typography variant={"overline"} color={'primary'}
                                sx={{ letterSpacing: "3px", fontSize: "18px" }}
                            >What To Eat?</Typography>
                            <Box m={5} display={"flex"} justifyContent={"center"}>
                                <CircularProgress size="1rem" color='primary' />
                            </Box>
                        </Box>
                    </Box >
                    :
                    <>

                        {finished ?
                            <>
                                <Box data-aos="fade-left" data-aos-duration="2500" data-aos-offset="300" display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={'center'}>
                                    < img
                                        alt={"loading"}
                                        width={100}
                                        src='./logo.png' >
                                    </img >

                                    <Box mt={0} mb={0} display={'flex'} flexDirection={"column"}>
                                        <Typography variant={"overline"} color={'#777'}
                                            sx={{ letterSpacing: "2px", fontSize: "16px", fontWeight: "bold" }}>
                                            What To Eat?
                                        </Typography>
                                        <Typography variant={"overline"} color={'#888'}
                                            sx={{ fontSize: "13px" }}>
                                            ○ We recommend <span style={{ fontWeight: "bold", color: "#555" }}>{keyword}</span> today based on your response!
                                        </Typography>
                                        <Typography variant={"overline"} color={'#888'}
                                            sx={{ fontSize: "13px" }}>
                                            ○ We found <span style={{ fontWeight: "bold", color: "#555" }}>{results.length} {keyword} restaurants</span> nearby!
                                        </Typography>
                                    </Box>
                                    <Box display='flex' flexDirection='column' mt={2} mb={2}>
                                        {response.map((v, i) => (
                                            <Box key={i.toString()} m={1} >
                                                <Typography variant={"overline"} color={'#777'}
                                                    sx={{ letterSpacing: "2px", fontSize: "12px" }}>
                                                    ○ {data[i].question}
                                                    <span style={{ color: "#444", fontWeight: "bold", marginLeft: 10 }}>{v}</span>
                                                </Typography>
                                            </Box>
                                        ))}

                                    </Box>
                                    <Box>
                                        <Typography variant={"overline"} color={'#888'}
                                            sx={{ letterSpacing: "2px", fontSize: "24px", border: "1px solid lightgrey", borderRadius: 3, padding: 1.2, pl: 3, pr: 3 }}>
                                            RESULT:  <span style={{ fontWeight: "bold", color: "#FF9457" }}>{keyword}</span>
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <RestaurantList data={results} keyword={keyword} />
                                    </Box>
                                </Box >
                            </>
                            :
                            <>
                                <Box mt={-2} mb={1} display='flex' flexDirection='column' data-aos="fade-right" data-aos-duration="900">
                                    <Typography variant={"overline"} color={'darkGrey'}
                                        sx={{ letterSpacing: "3px", fontSize: "18px" }}
                                    >Question {currentQuestionIndex + 1}.</Typography>
                                    <Typography variant={"overline"} color={'primary'}
                                        sx={{ letterSpacing: "3px", fontSize: "18px" }}
                                    >{data[currentQuestionIndex]['question']}</Typography>
                                </Box>
                                <Grid container mt={5} mb={10} justifyContent={"space-around"} wrap="nowrap" columnGap={{ xs: 4, md: 10 }}>

                                    {data[currentQuestionIndex]['choices'].map(((val, idx) => (
                                        <Grid item xs={6} key={idx.toString()} >
                                            <Button
                                                onClick={() => { handleResponse(val) }}
                                                data-aos={idx % 2 === 0 ? "fade-right" : "fade-left"} data-aos-duration="3000" data-aos-offset="300" sx={{
                                                    height: "200px", width: "100%", backgroundColor: "white", color: "#FF9457", fontSize: "22px",
                                                    boxShadow: "rgba(255,228,214,.75) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                                                }} >
                                                {val}
                                            </Button>
                                        </Grid>

                                    )))}
                                </Grid>
                            </>
                        }

                    </>
            }
        </Box >
    );
}

export default Recommendation;
