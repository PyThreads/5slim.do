import { Button, Grid, TextField, Typography } from "@mui/material"
import { Poppins } from "next/font/google"
import AddIcon from '@mui/icons-material/Add';
import TableArticle from "../../../../../components/tables/TableArticle";
import SearchIcon from '@mui/icons-material/Search';

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: "600"
})

export default function AdminArticles() {
    return (
        <Grid item>

            <Typography sx={{ ...style.title }}>Listado de Articulos</Typography>

            <Grid item container justifyContent={"space-between"} alignItems={"center"}>
                <Button variant="contained" sx={{ ...style.addButton }}
                    startIcon={<AddIcon />}
                >
                    Agregar Artículo
                </Button>

                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar"
                    sx={{
                        width: '230px',
                        '& .MuiOutlinedInput-root': {
                            height: '42px',
                            '& fieldset': {
                                border: '1px solid rgba(0, 0, 0, 0.23)', // mismo color en hover para que no cambie
                            },
                            '&:hover fieldset': {
                                border: '1px solid rgba(0, 0, 0, 0.23)', // mismo color en hover para que no cambie
                            },
                            '&.Mui-focused fieldset': {
                                border: '1px solid rgba(0, 0, 0, 0.23)', // mismo color en hover para que no cambie
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{marginRight: "4px", color: "#B5B7C0"}}/>,
                        style: style.searchInput,
                    }}
                    autoFocus
                />


            </Grid>

            <Grid item mt={"48px"}>
                <TableArticle />
            </Grid>

        </Grid>
    )
}

const style = {
    searchInput: {
        height: "40px",
        borderRadius: "10px",
        outline: "none"
    },
    addButton: {
        marginTop: "13px",
        backgroundColor: "#001987",
        fontSize: "10px",
        fontFamily: poppins.style.fontFamily,
        height: "40px",
        textTransform: "none",
        borderRadius: "10px",
        "&:hover": {
            backgroundColor: "#001987",
        }
    },
    title: {
        fontFamily: poppins.style.fontFamily,
        fontSize: 32,
        color: "#001B66",
    }
}