import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Avatar, Chip, DialogContent, Rating } from '@mui/material';
import { GoogleMap, useJsApiLoader, InfoWindowF } from '@react-google-maps/api';
import { mapStyles } from "./GoogleMapsSchema"
import axios from "axios"
import Heading from "./Heading"
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const containerStyle = {
    width: '100%',
    height: '300px'

};
const options = {
    styles: mapStyles,
};


const divStyle = {
    background: `white`,
    border: `1px solid #dedede`,
    padding: 15,
    borderRadius: '2px'
}



export default function FullDialog({ data, open, close }) {
    const [scroll, setScroll] = React.useState('paper');

    const descriptionElementRef = React.useRef(null);

    const [detailedData, setDetailedData] = React.useState()


    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));

    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    // const [location, setLocation] = React.useState({})
    React.useEffect(() => {

        if (data.place_id !== undefined) {
            getDetailedData()
        }

    }, [data]);

    const getDetailedData = async () => {
        const sendData = {
            place_id: data.place_id, apikey: process.env.REACT_APP_GOOGLE_API
        }
        try {
            const res = await axios.post("https://ds-backend-test.herokuapp.com/whattoeatgoogleapidetailed", sendData)

            const finalResult = JSON.parse(res.data.result)
            console.log(finalResult)
            setDetailedData(finalResult.result)

        }
        catch (error) {
            console.log(error)
        }
    }
    //maps

    //maps
    const [map, setMap] = React.useState(null)


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API
    })

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(data.geometry ? data.geometry.location : { lat: 0, lng: 0 });
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])


    if (detailedData !== undefined) {
        return (
            <div>
                <Dialog
                    fullScreen={sm ? false : true}
                    open={open}
                    onClose={close}
                    TransitionComponent={Transition}
                    scroll={scroll}

                >
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={close}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                {data.name}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <Box minHeight={"80vh"}>

                            {isLoaded ?
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={data.geometry ? data.geometry.location : { lat: 0, lng: 0 }}
                                    zoom={18}
                                    onLoad={onLoad}
                                    options={options}
                                    onUnmount={onUnmount}
                                >
                                    <Box>
                                        <InfoWindowF
                                            position={data.geometry ? data.geometry.location : { lat: 0, lng: 0 }}
                                        >
                                            <Typography
                                                variant={'overline'} fontSize={"10px"} sx={{ p: .2 }}>{data.name}
                                            </Typography>
                                        </InfoWindowF>
                                    </Box>

                                </GoogleMap>
                                : <p>Loading Google Map</p>}


                            <Box style={divStyle} >
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box>
                                        <Typography
                                            variant={'overline'} fontSize={"12px"} color={'primary'} sx={{ p: .2, fontWeight: "bold" }}>
                                            {data.name}
                                        </Typography>
                                        <Box display={"flex"} flexDirection={"row"}>
                                            <Box mr={.5}>
                                                <Rating name="read-only" size='small' value={data.rating} readOnly />
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
                                                    ({data.user_ratings_total})
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
                                                {data.vicinity} /
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
                                            }} component="div" color={data.opening_hours ? data.opening_hours.open_now ? "#4caf50" : "#ef5350" : "#ef5350"}
                                            >
                                                {data.opening_hours ? data.opening_hours.open_now ? "OPEN" : "CLOSED" : "NOT AVAILABLE"}
                                            </Typography>

                                        </Box>

                                        <Box >
                                            <Typography variant={"body2"}>{detailedData.formatted_phone_number}</Typography>
                                        </Box>
                                        <Box display={"flex"} flexDirection={"row"} mt={1}>
                                            {detailedData.dine_in &&
                                                <Chip size='small' sx={{ mr: 1 }} label={detailedData.dine_in === true ? "Dine In" : "No Dine In"} />
                                            }
                                            {detailedData.delivery &&
                                                <Chip size='small' sx={{ mr: 1 }} label={detailedData.delivery === true ? "Delivery" : "No Delivery"} />
                                            }
                                            {detailedData.takeout &&
                                                <Chip size='small' label={detailedData.takeout === true ? "Takeout" : "No Takeout"} />
                                            }
                                        </Box>

                                    </Box>
                                    <Box>
                                        <img
                                            width={80}
                                            style={{ borderRadius: 5 }}
                                            alt={"img"} src={data.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API}` : "./logo.png"}></img>
                                    </Box>

                                </Box>

                                <Box>
                                    <Box display={"flex"} flexDirection={"column"} mt={1}>
                                        {
                                            detailedData.current_opening_hours &&
                                            <>
                                                <Box mt={1} mb={1} display={"flex"}>
                                                    <Heading title={"Operating Hours"} content={""} />
                                                </Box>                                                <Box ml={.2}>
                                                    {detailedData.current_opening_hours.weekday_text.map((d, i) => (
                                                        <Typography key={d} sx={{ fontSize: "12px" }}>{d}</Typography>
                                                    ))}
                                                </Box>
                                            </>
                                        }
                                    </Box>
                                </Box>



                                <Box>
                                    <Box display={"flex"} flexDirection={"column"} mt={1}>
                                        {
                                            detailedData.reviews &&
                                            <>
                                                <Box display={'flex'}>
                                                    <Box mt={1} mb={1} display={"flex"}>
                                                        <Heading title={"Reviews"} content={""} />
                                                    </Box>
                                                </Box>
                                                <Box ml={.2}>
                                                    {detailedData.reviews.map((d, i) => (
                                                        <Box mb={3} key={d.author_name + i.toString()}>
                                                            <Box display={"flex"} flexDirection={"row"}>
                                                                <Avatar src={d.profile_photo_url} sx={{ width: 24, height: 24 }}></Avatar>
                                                                <Typography sx={{ fontSize: "12px", ml: 1 }}>{d.author_name}</Typography>
                                                            </Box>
                                                            <Box mt={.8}>
                                                                <Rating name="read-only" sx={{ fontSize: ".8rem" }} value={d.rating} readOnly />
                                                                <Typography sx={{ fontSize: "10px", mt: -.5, color: "#999" }}>{d.relative_time_description}</Typography>
                                                                <Typography sx={{ fontSize: "11px", mt: .5 }}>{d.text}</Typography>

                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </>
                                        }
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                    </DialogContent>


                </Dialog>
            </div >
        );
    } else {
        return (<></>)
    }
}
