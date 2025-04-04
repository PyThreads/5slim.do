"use client"
import { useRouter } from "next/navigation";
import { Button, Container, FilledInput, Grid, Typography } from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Image from "next/image";
import { FormEvent, useState } from "react";


export default function LoginPage() {

    const router = useRouter()
    const [showPass, setShowPass] = useState(false);


    const handleShowP = (param: boolean) => {
        setShowPass(param)
    }

    const submit =  (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')

        router.push("/admin/dashboard")   
    }

    const forgotPass = ()=>{
        router.push("/admin/enterEmail")   
    }

    return (
        <Container sx={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>

            <Grid item xs={12} textAlign={"center"} sx={{ maxWidth: "380px" }}>

                <Image
                    alt={"5slim.do logo"}
                    width={300}
                    height={120}
                    src={"/5slim-logo.png"}
                    priority
                />

                <form onSubmit={submit}>
                    <FilledInput
                        fullWidth
                        required
                        name="email"
                        type="email"
                        hiddenLabel
                        size="small"
                        placeholder="Usuario"
                        disableUnderline
                        autoComplete={"true"}
                        sx={{ height: 36, fontSize: 13, mt: 4, borderRadius: "10px" }}
                        autoFocus
                    />

                    <FilledInput
                        fullWidth
                        required
                        name="password"
                        hiddenLabel
                        size="small"
                        placeholder="Clave"
                        disableUnderline
                        autoComplete={"true"}
                        endAdornment={
                            showPass ?
                                <RemoveRedEyeIcon sx={{ color: "#677185", cursor: "pointer",fontSize: "10px"  }} onClick={() => handleShowP(false)} />
                                :
                                <VisibilityOffIcon sx={{ color: "#677185", cursor: "pointer",fontSize: "10px" }} onClick={() => handleShowP(true)} />
                        }
                        type={showPass ? "text" : "password"}
                        sx={{ height: 36, fontSize: 13, mt: 2, borderRadius: "10px" }}
                    />

                    <Typography sx={{ color: "#C7C7C7", fontSize: 12, mt: 2, textDecoration: "underline", textAlign: "right", cursor: "pointer" }} onClick={forgotPass}>Olvido su clave clave?</Typography>

                    <Button
                        type="submit"
                        fullWidth
                        sx={{
                            height: 36,
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
                        Iniciar Sesión
                    </Button>
                </form>
            </Grid>


        </Container>
    )
}