import { Box, Button, Grid, Typography } from "@mui/material";
import { FilterDateIcon, FilterIcon } from "../../../../../../components/icons/Svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchTableClients from "./SearchTableClients";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export default function TableClientsList() {
    return (
        <Box padding={"22px 21px"} bgcolor={"#FFFFFF"} borderRadius={"12px"} >

            <Grid container item xs={12} justifyContent={"space-between"} alignItems={"center"}>

                <Typography fontFamily={"Inter"}>Clientes</Typography>

                <Box display={"flex"} alignItems={"center"}>

                    <Box width={"250px"} m={1}>
                        <SearchTableClients onChange={() => { }} />
                    </Box>

                    <Box m={1}>
                        <Button variant="outlined" sx={{ ...styles.btnAdd }}
                            startIcon={<FilterIcon filled />}
                        >
                            Filtrar
                        </Button>
                    </Box>


                    <Box m={1}>
                        <Button variant="outlined" sx={{ ...styles.btnAdd }}
                            startIcon={<FilterDateIcon filled />}
                        >
                            Filtrar
                        </Button>
                    </Box>

                    <Box m={1}>
                        <Button variant="outlined" sx={{ ...styles.btnAdd }}
                            endIcon={<KeyboardArrowDownIcon fontSize="medium" />}
                        >
                            Acciones
                        </Button>
                    </Box>
                </Box>

            </Grid>


        </Box>
    )
}

const styles = {
    btnAdd: {
        fontSize: "14px",
        fontFamily: inter.style.fontFamily,
        height: "33px",
        textTransform: "none",
        borderRadius: "4px",
        padding: "8px",
        "&:hover": {
            backgroundColor: "transparent",
        },
        borderColor: "#53545C",
        color: "#53545C"
    }
}