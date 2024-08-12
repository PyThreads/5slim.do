import { Container, Grid, Typography } from "@mui/material";
import { Poppins } from "next/font/google";
import Image from "next/image";
import NotifySubscribed from "./Notify";


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
                    variant="h1"
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

                    <Grid item xs={12} sm={12} md={5} lg={5} mt={2}>

                        <Typography
                            variant="h2"
                            sx={{
                                color: "#001987",
                                fontSize: { xs: 33, sm: 45, md: 50, lg: 55 },
                                fontFamily: poppins1.style.fontFamily,
                                textTransform: "capitalize",
                                lineHeight: { sm: "65px", lg: "75px" }
                            }}

                        >
                            Recibe una Notificación de nuestro Lanzamiento
                        </Typography>

                        <NotifySubscribed />


                    </Grid>

                    <Grid item xs={12} sm={7} md={7} lg={7} textAlign={"center"}
                        sx={{
                            display: { xs: "none", sm: "none", md: "inline" }
                        }}
                    >
                        <Image
                            alt={"5slim.do. logo"}
                            style={{ objectFit: "cover", marginTop: "-120px" }}
                            width={500}
                            height={620}
                            src={"/flat-dia-cliente-illustration-1.png"}
                            className="bouncing-shadow"
                        />
                    </Grid>


                </Grid>



            </Container>
        </Container >
    )
}