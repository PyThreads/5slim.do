import { Container, Grid, Typography } from "@mui/material";
import { Roboto } from "next/font/google";
import Image from "next/image";


const roboto = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})


const roboto1 = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: "900"
})


export default function Content() {
    return (
        <Container sx={{ marginTop: 3 }}>
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
                        marginTop: 3,
                        fontSize: 24,
                        fontFamily: roboto.style.fontFamily

                    }}

                >
                    -Coming Soon-
                </Typography>

                <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} md={6} lg={6}>

                        <Typography
                            sx={{
                                color: "#001987",
                                fontSize: 24,
                                fontFamily: roboto1.style.fontFamily,
                                textTransform: "capitalize"
                            }}

                        >
                            Recibe una Notificación de nuestro Lanzamiento
                        </Typography>

                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>

                        <Image
                            alt={"5slim.do. logo"}
                            style={{ objectFit: "contain" }}
                            width={619}
                            height={683}
                            src={"/flat-dia-cliente-illustration-1.png"}
                            className="bouncing-shadow"
                        />

                    </Grid>


                </Grid>

            </Container>
        </Container>
    )
}