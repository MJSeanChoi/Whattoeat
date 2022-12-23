import { Button, Divider, Typography, Box } from '@mui/material';
import { Link } from "react-router-dom";

export default function RestaurantDetail({ id, index, title, date, author, content, topImg, bottomImg }) {

    return (
        <>

            <Typography variant="h4">
                {title}
            </Typography>


            <Box display="flex" flexDirection="row" m={2} ml={0} justifyContent={"space-between"}>
                <Box>
                    <Typography variant="subtitle1" color="#737373" mr={1}>
                        {author}
                    </Typography>
                    <Typography variant="subtitle1" color="#bdbdbd">
                        {date}
                    </Typography>
                </Box>
                <Box hidden={index != 0}>
                    <Link to={`/tickets/${id}`} style={{ textDecoration: "none" }}>
                        <Button size="medium" variant="outlined">Buy Ticket</Button>
                    </Link>
                </Box>
            </Box>
            <Divider sx={{ m: 2, ml: 0 }} />
            <Box>
                <Box sx={{ textAlign: "center", m: 5 }}>
                    <img alt={"img"}
                        style={{ objectFit: "cover", borderRadius: "10px", maxWidth: "80%" }} src={topImg} />
                </Box>
                <Typography variant="body1" color="#404040" sx={{ lineHeight: 2 }}>
                    {content}
                </Typography>
                <Box sx={{ textAlign: "center", m: 5 }}>
                    {bottomImg && <img alt={"img"} height={400} src={bottomImg} style={{ borderRadius: "10px", objectFit: "cover", maxWidth: "50%" }} />
                    }
                </Box>
            </Box>
        </>
    );
};


