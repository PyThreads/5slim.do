import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { Poppins } from "next/font/google";
import Image from "next/image";


const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})


const poppins1 = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: "900"
})


export default function Content() {
    return (
        <Container sx={{ marginTop: "35px" }}>
            <Container>

                <Image
                    alt={"5slim.do. logo"}
                    style={{ objectFit: "contain" }}
                    width={135}
                    height={54}
                    src={"/5slim-logo.png"}
                />

                <Typography
                    sx={{
                        color: "#BEBEBE",
                        fontStyle: "italic",
                        marginTop: "50px",
                        fontSize: 24,
                        fontFamily: poppins.style.fontFamily

                    }}
                >
                    -Coming Soon-
                </Typography>

                <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} md={5} lg={5}>

                        <Typography
                            sx={{
                                color: "#001987",
                                fontSize: { xs: 30, sm: 45, md: 50, lg: 65 },
                                fontFamily: poppins1.style.fontFamily,
                                textTransform: "capitalize",
                            }}

                        >
                            Recibe una Notificación de nuestro Lanzamiento
                        </Typography>

                        <Box sx={{ position: "relative", height: 60 }}>

                            <TextField placeholder="Ingresa tu Email"
                                sx={{height: "100%"}}
                                fullWidth
                                InputProps={
                                    {
                                        style: {
                                            paddingLeft:10,
                                            borderRadius: 60,
                                            border: "solid 1px #BEBEBE",
                                            outline:"none",
                                            height: "100%"
                                        }
                                    }
                                }
                            />

                            <Button
                                sx={{
                                    position: "absolute",
                                    right: 0,
                                    height: "100%",
                                    backgroundColor: "#001987",
                                    borderRadius: 60,
                                    textTransform: "inherit",
                                    color: "white",
                                    fontWeight: "500",
                                    ":hover":{
                                        backgroundColor:"#001987"
                                    },
                                    width:{ xs: 30, sm: 45, md: 50, lg: 200 }
                                }}
                                startIcon={
                                    <Image
                                        alt={"5slim.do. logo"}
                                        style={{ objectFit: "contain" }}
                                        width={25}
                                        height={25}
                                        src={"/flash-lines.png"}
                                    />
                                }
                            >
                                Notificarme
                            </Button>

                        </Box>

                    </Grid>

                    <Grid item xs={12} sm={7} md={7} lg={7} textAlign={"center"}
                        sx={{
                            display: { xs: "none", sm: "none", md: "inline" }
                        }}
                    >
                        <Image
                            alt={"5slim.do. logo"}
                            style={{ objectFit: "contain", marginTop: "-75px" }}
                            width={450}
                            height={450}
                            src={"/flat-dia-cliente-illustration-1.png"}
                            className="bouncing-shadow"
                        />
                    </Grid>


                </Grid>

            </Container>
        </Container >
    )
}