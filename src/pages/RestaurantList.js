import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Typography, CardActionArea, Rating } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import FullDialog from "../components/FullDialog"
import Heading from '../components/Heading';

function RestaurantList({ data, keyword }) {


    useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })


    }, [])

    const [open, setOpen] = useState(false);
    const [clickedData, setClickedData] = useState({})
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // alert(JSON.stringify(data[0].photos[0].photo_reference))

    return (

        <Box sx={{ width: "100%" }}>
            <Box mt={7} mb={10} display={"flex"}>
                <Heading title={"Nearby " + keyword + " Restaurants"} content={"Check out these " + data.length + " " + keyword + " restaurants!"} />
            </Box>
            <Box mt={10} mb={5}>
                <Grid container spacing={4} >
                    {data
                        .map((restaurant, idx) => {
                            return (
                                <Grid item md={4} xs={6} key={restaurant.img + idx.toString()}>
                                    <Card sx={{ maxWidth: { xs: 245, md: 345 } }}>
                                        <CardActionArea onClick={() => { handleOpen(); setClickedData(restaurant) }} >
                                            <Box position={"absolute"} sx={{ right: 15, top: 15 }}>

                                            </Box>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={restaurant.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API}` : "./logo.png"} // || 

                                                alt="Image"
                                            >
                                            </CardMedia>
                                            <CardContent sx={{ minHeight: 121 }}>
                                                <Box display={"flex"} flexDirection={"row"}>

                                                    <Box mr={.5}>
                                                        <Rating name="read-only" size='small' value={restaurant.rating} readOnly />
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
                                                            ({restaurant.user_ratings_total})
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
                                                        {restaurant.vicinity} /
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
                                                    }} component="div" color={restaurant.opening_hours ? restaurant.opening_hours.open_now ? "#4caf50" : "#ef5350" : "#ef5350"}
                                                    >
                                                        {restaurant.opening_hours ? restaurant.opening_hours.open_now ? "OPEN" : "CLOSED" : "NOT AVAILABLE"}
                                                    </Typography>

                                                </Box>
                                                <Box display={'flex'} flexDirection={"row"} justifyContent={"space-between"}>
                                                    <Typography gutterBottom variant="h6" component="div" color={"#555656"}
                                                        sx={{
                                                            fontWeight: 'medium',
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: "2",
                                                            WebkitBoxOrient: "vertical",
                                                        }}
                                                    >
                                                        {restaurant.name}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {restaurant.description}
                                                </Typography>
                                                <Typography variant="overline" color="text.secondary">
                                                    {restaurant.date}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                        {/* </Link> */}

                                    </Card>
                                </Grid>
                            )
                        })}
                </Grid>
                <FullDialog data={clickedData} close={handleClose} open={open} />
            </Box>
        </Box>
    );
}

export default RestaurantList;
