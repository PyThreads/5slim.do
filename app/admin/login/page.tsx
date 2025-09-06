"use client"
import { Button, CircularProgress, Container, FilledInput, Grid, Typography } from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Image from "next/image";
import { useState } from "react";
import axios from "axios";


export default function LoginPage() {

    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({ email: "", password: "" });
    const [sendCode, setSendCode] = useState(false);
    const [error, setError] = useState("");

    const handleShowP = (param: boolean) => {
        setShowPass(param)
    }

    const submit = async () => {
        try {
            setLoading(true)
            await axios.post(process.env.NEXT_PUBLIC_API_URL + "/admin/public/sendEmailCode", { username: user.email })
            setSendCode(true)
        } catch (error) {
            return
        } finally {
            setLoading(false)
        }
    }

    const sendMailPass = async () => {
        try {
            setLoading(true)
            const { data } = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/admin/public/login", { username: user.email, password: user.password })
            localStorage.setItem("TKN-5SL-M0",data.data.token);
            window.location.href = "/admin/dashboard"
        } catch (error: any) {
            setError(error?.response?.data?.message || "Ha ocurrido un error al enviar el código.")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setUser(prev => ({ ...prev, [field]: value }));
    };

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
                    value={user.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />

                {
                    sendCode && (
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
                                    <RemoveRedEyeIcon sx={{ color: "#677185", cursor: "pointer", fontSize: "10px" }} onClick={() => handleShowP(false)} />
                                    :
                                    <VisibilityOffIcon sx={{ color: "#677185", cursor: "pointer", fontSize: "10px" }} onClick={() => handleShowP(true)} />
                            }
                            type={showPass ? "text" : "password"}
                            sx={{ height: 36, fontSize: 13, mt: 2, borderRadius: "10px" }}
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                        />
                    )
                }

                {
                    error && (
                        <Typography
                            variant="h1"
                            sx={{
                                color: "#c75223",
                                marginTop: "10px",
                                fontSize: 12,
                                fontFamily: "Poppins"
                            }}
                        >
                            {error}
                        </Typography>
                    )
                }

                {
                    sendCode ? (
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
                            onClick={sendMailPass}
                        >
                            {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Iniciar Sesión"}
                        </Button>
                    )
                        :
                        (
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
                                onClick={submit}
                            >

                                {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Continuar"}
                            </Button>
                        )
                }
            </Grid>
        </Container>
    )
}