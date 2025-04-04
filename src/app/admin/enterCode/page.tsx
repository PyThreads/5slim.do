"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { FormEvent } from "react";


export default function LoginPage() {

    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")



    const submit = (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')
        router.push(`/admin/setNewPassword?email=${email}`)

    }

    if(!email){
        router.push("/admin/login")
    }

    return (
        <Container sx={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>

            <Grid item xs={12} textAlign={"center"} sx={{ maxWidth: "380px", textAlign: "center" }}>

                <Grid item width={300} textAlign={"center"} sx={{ marginLeft: "auto", marginRight: "auto" }}>
                    <Typography variant="h4" fontWeight={"bold"} fontSize={24}>Ingresa el código</Typography>
                    <Typography variant="h6" mt={2} fontSize={12}>Hemos enviado el código al correo : </Typography>
                </Grid>


                <form onSubmit={submit}>
                    <TextField
                        fullWidth
                        required
                        name="email"
                        type="email"
                        hiddenLabel
                        size="small"
                        placeholder="Ingresa tu correo"
                        autoComplete={"true"}
                        sx={{ height: 36, fontSize: 13, mt: 4, borderRadius: "10px" }}
                        autoFocus
                        variant="standard"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        sx={{
                            height: 45,
                            backgroundColor: "#001987",
                            textTransform: "inherit",
                            color: "white",
                            ":hover": {
                                backgroundColor: "#001987"
                            },
                            marginTop: 2,
                            borderRadius: "10px",
                            fontWeight: "bold"
                        }}
                    >
                        Enviar código de 6 dígitos
                    </Button>
                </form>
            </Grid>


        </Container>
    )
}