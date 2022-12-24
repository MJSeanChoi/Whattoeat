import { useState, useEffect, forwardRef, useCallback } from 'react';
import Box from '@mui/material/Box';

import { Button, Typography, Grid, TextField, CircularProgress, Rating } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, InfoWindowF } from '@react-google-maps/api';
import Clock from 'react-live-clock';
import { mapStyles } from "../components/GoogleMapsSchema"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axios from "axios";
import FullDialog from "../components/FullDialog";

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

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
    increment,
    orderBy,
    limit
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


const containerStyle = {
    width: '100%',
    height: '500px'

};

const divStyle = {
    background: `white`,
    border: `1px solid #dedede`,
    padding: 15,
    borderRadius: '5px'
}

const options = {
    styles: mapStyles,
};


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const radius = 6000
const menu = ['Taco', 'Fried Rice', 'Salad', 'Burrito', 'Burger', 'Pizza', 'Sandwich', 'Pasta']



function shuffle(array, seed) {                // <-- ADDED ARGUMENT
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(random(seed) * m--);        // <-- MODIFIED LINE

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
        ++seed                                     // <-- ADDED LINE
    }

    return array;
}

function random(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function Home() {

    const [trending, setTrending] = useState([]);

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };


    useEffect(() => {
        const today = new Date();
        const todayDate = today.getDate()
        let seed = today.getMonth()
        if (todayDate < 8) {
            shuffle(menu, seed)
        } else if (todayDate < 15) {
            shuffle(menu, seed + 1)
        } else if (todayDate < 22) {
            shuffle(menu, seed + 2)
        } else {
            shuffle(menu, seed + 3)
        }

        setFoodToday(menu[todayDate % menu.length])
    }, []);

    useEffect(() => {
        const getTrending = async() => {
            const docRef = collection(db, "trend");
            const q = query(docRef, orderBy("count", "desc"), limit(3));
            const querySnapshot = await getDocs(q);
            var tempArray = [];
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
                var data = doc.data();
                tempArray.push(data['name'])
            });
            setTrending(tempArray);
        }

        getTrending();
    }, [])

    const navigate = useNavigate()

    const [zipCodeLoaded, setZipCodeLoaded] = useState(true)
    const [zipCode, setZipCode] = useState('01342')
    const [location, setLocation] = useState()
    // const [dday, setDday] = useState(DDAY_VALUE);

    const [redirectTo, setRedirect] = useState("")


    const [foodToday, setFoodToday] = useState("");

    const [restaurantData, setRestaurantData] = useState([]);

    const [open, setOpen] = useState(false);

    const [map, setMap] = useState(null)

    const handleClickOpen = () => {
        if (zipCode) {
            getCoordinates(zipCode)
        } else {
            alert("Please provide your zipcode!")
        }
    };

    const handleClose = () => {
        setOpen(false);
        setZipCodeLoaded(true)
    };




    //detail fulldialog
    const [openDialog, setOpenDialog] = useState(false);
    const [clickedData, setClickedData] = useState({})
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    //detail fulldialog



    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API
    })
    // const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(location);
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])


    function getCoordinates(address) {


        setZipCodeLoaded(false);
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + '&key=' + process.env.REACT_APP_GOOGLE_API)
            .then(response => response.json())
            .then(data => {
                const lat = data.results[0].geometry.location.lat;
                const lng = data.results[0].geometry.location.lng;
                setLocation({ lat, lng })
                getRestaurantData(lat, lng);

            }).catch(e => { alert("Invalid Zipcode!"); setZipCodeLoaded(true); setZipCode("") })
    }


    const getRestaurantData = async (lat, lng) => {
        // setIsDataLoading(true)
        const data = {
            keyword: foodToday, location: `${lat}%2C${lng}`, radius, apikey: process.env.REACT_APP_GOOGLE_API
        }
        try {
            const res = await axios.post("https://ds-backend-test.herokuapp.com/whattoeatgoogleapi", data)

            console.log(JSON.parse(res.data.result).results)
            setRestaurantData(JSON.parse(res.data.result).results)
            setZipCodeLoaded(false);
            setOpen(true);

            // setIsDataLoading(false)
        }
        catch (error) {
            console.log(error)
        }

    }



    if (redirectTo !== "") {
        navigate(redirectTo)
    }

    return (
        <Box mt={-5}>
            <Box pb={5} pt={2}>
                {/* <MainCarousel /> */}


                <Grid container flexDirection={'column'} justifyContent={"center"} alignItems={"center"} rowGap={4} sx={{
                    backgroundColor: "white", color: '#616161', width: '100%', borderRadius: 3, borderTopLeftRadius: 1, borderTopRightRadius: 1,
                    boxShadow: "#F6f7f6 10px 10px 10px 10px",
                }}>

                    <Grid item p={6} pt={2} pb={12} justifyContent={"center"}>

                        < img width={200}
                            className="img-animation"
                            alt={"loading"}
                            src='./logo.png' style={{ position: "relative", top: 100 }} ></img >
                        {/* <Box mt={-25} >
                            <CountryChart data={dataCountry(data)} />
                        </Box> */}
                    </Grid>


                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>{"What To Eat?"} {foodToday}.</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Let's find the nearest {foodToday} restaurants around.
                                Check out the restaurants below and have a look!
                            </DialogContentText>
                            <br />
                            {isLoaded ?
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={location}
                                    onLoad={onLoad}
                                    options={options}
                                    onUnmount={onUnmount}
                                    zoom={13}
                                >
                                    { /* Child components, such as markers, info windows, etc. */}
                                    {/* <Marker key={marker_idx} position={{ location }} /> */}

                                    {restaurantData.map((marker, key) =>


                                        <InfoWindowF
                                            key={key.toString()}
                                            position={marker.geometry.location}
                                        >
                                            <div style={divStyle}>
                                                <Typography
                                                    onClick={() => { handleOpenDialog(); setClickedData(marker) }}
                                                    variant={'overline'} fontSize={"10px"} sx={{ textDecoration: "underline", cursor: "pointer", p: .2 }}>{marker.name}</Typography>
                                                <Box display={"flex"} flexDirection={"row"}>
                                                    <Box mr={.5}>
                                                        <Rating name="read-only" size='small' value={marker.rating} readOnly />
                                                    </Box>
                                                    <Box>
                                                        <Typography gutterBottom sx={{
                                                            fontSize: "12px",
                                                            fontWeight: 'medium',
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: "1",
                                                            WebkitBoxOrient: "vertical",
                                                        }} component="div" color={"#c9c9c9"}
                                                        >
                                                            ({marker.user_ratings_total})
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box display={"flex"} flexDirection={"row"}>
                                                    <Typography gutterBottom sx={{
                                                        fontSize: "12px",
                                                        fontWeight: 'medium',
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: "1",
                                                        WebkitBoxOrient: "vertical",
                                                    }} component="div" color={"#c9c9c9"}
                                                    >
                                                        {marker.vicinity} /
                                                    </Typography>
                                                    <Typography gutterBottom sx={{
                                                        fontSize: "12px",
                                                        fontWeight: 'medium',
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: "1",
                                                        WebkitBoxOrient: "vertical",
                                                        ml: .5
                                                    }} component="div" color={marker.opening_hours ? marker.opening_hours?.open_now ? "#4caf50" : "#ef5350" : "#ef5350"}
                                                    >
                                                        {marker.opening_hours ? marker.opening_hours.open_now ? "OPEN" : "CLOSED" : "NOT AVAILABLE"}
                                                    </Typography>

                                                </Box>
                                            </div>
                                        </InfoWindowF>

                                    )}
                                </GoogleMap>
                                : <p>Loading Google Maps...</p>}

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} >OK</Button>
                        </DialogActions>
                    </Dialog>


                    <Grid container spacing={{ xs: 10, sm: 20 }} justifyContent={"center"} flexDirection={"row"} pb={10} >
                        <Grid item flexDirection={'column'} >
                            <Grid item>
                                <Typography variant="body2" sx={{ color: "darkGrey" }}>Today's Recommendation</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" fontWeight={'bold'} color={'#333'}>{foodToday}</Typography>
                            </Grid>
                        </Grid>

                        <Grid item flexDirection={'column'} >
                            <Grid item>
                                <Typography variant="body2" sx={{ color: "darkGrey" }}>Trending</Typography>
                            </Grid>
                            <Grid item>
                                <div style={{width: 200}}>
                                    <Carousel
                                        responsive={responsive}
                                        arrows={false}
                                        swipeable={true}
                                        showDots={false}
                                        draggable={true}
                                        infinite={true}
                                        autoPlay={true}
                                        rewind={false}
                                        autoPlaySpeed={2000}
                                        rtl={true}
                                    >
                                        {
                                            trending.map((el, i) => (
                                                <Typography key={i} variant="body1" fontWeight={'bold'} color={'#333'} textAlign={'center'}>{el}</Typography>
                                            ))
                                        }
                                    </Carousel>
                                </div>
                            </Grid>
                        </Grid>


                        <Grid item flexDirection={'column'}>
                            <Grid item>
                                <Typography variant="body2" sx={{ color: "darkGrey" }}>Date / Time</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" fontWeight={'bold'} color={"#999"}>
                                    <span style={{ marginRight: 4, color: '#333' }}>{new Date().toDateString().slice(0, new Date().toDateString().length - 4)}</span>
                                    <Clock format={'h:mm:ss A'} ticking={true} />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item pb={10}>
                        <Grid container item flexDirection={'row'} columnGap={1} mt={-6}
                            sx={{ backgroundColor: "#f4f4f4", borderRadius: 2, p: 1.5 }}
                        >
                            <Grid item>
                                <TextField placeholder='ZIP Code (eg. 01342)' size='small' value={zipCode} sx={{ backgroundColor: "white", borderRadius: 1, input: { color: "#4e6b55", fontWeight: "bold", fontSize: "12px" } }} onChange={(e) => { setZipCode(e.target.value) }}></TextField>
                            </Grid>
                            <Grid item>
                                <Button disabled={!zipCodeLoaded} variant='contained' sx={{ height: "34px", fontSize: !zipCodeLoaded ? "9px" : "11px" }} className={"blinking"} onClick={handleClickOpen}>Find Restaurant {!zipCodeLoaded && <CircularProgress size=".5rem" sx={{ ml: .7 }} />}</Button>
                            </Grid>
                        </Grid>
                        <Typography sx={{ fontSize: "10px", color: "#a0a0a0" }}>☝️ Provide a zipcode above to find nearest restaurants with</Typography>
                        <Typography sx={{ fontSize: "10px", color: "#a0a0a0", mt: -.5, ml: 1.7 }}> today's special recommendation.</Typography>



                    </Grid>

                    <Grid item pb={10}>
                        <Grid container item flexDirection={'row'} columnGap={1} mt={-6}
                            sx={{ backgroundColor: "#f4f4f4", borderRadius: 2, p: 1.5 }}
                        >
                            <Grid item>
                                <Link to={`/recommendation`} style={{ textDecoration: "none" }}>
                                    <Button variant='contained' size="small" sx={{ height: "34px", fontSize: "16px" }} className={""}>What to eat?</Button>
                                </Link>
                            </Grid>
                        </Grid>
                        <Typography sx={{ fontSize: "10px", color: "#a0a0a0" }}>☝️ Find a new recommendation!</Typography>

                    </Grid>
                </Grid>


            </Box>
            <FullDialog data={clickedData} close={handleCloseDialog} open={openDialog} />
        </Box >
    );
}

export default Home;
