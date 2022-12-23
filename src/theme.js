import { createTheme } from '@mui/material';
let theme = createTheme({

    palette: {
        primary: { main: "#FF9457", contrastText: "#fff" },
        secondary: { main: "#FFE4D6", contrastText: "#fff" },

        whattoeat: {
            primary: {
                main: "#FF9457"
            },
            secondary: {
                main: "#FFE4D6",
            },
            light: {
                main: "rgb(244, 249, 244)"
            },
            lighter: {
                main: "#f7f6f2"
            },

        }



    },

    typography: {
        body1: {
            lineHeight: 1.75,
        },
        body2: {
            lineHeight: 1.75,
        }
    },
});



export default theme