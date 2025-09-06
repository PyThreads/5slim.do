import { Box, Grid, Typography } from "@mui/material";
import { DownloadCloudIcon, TrashIcon, UploadImageIcon } from "../../../../../components/icons/Svg";
import axios from "../../../../../context/adminAxiosInstance";
import Image from "next/image";
import { IArticleImages } from "../../../../../api/src/interfaces";
import { eventBus } from "../../../../utils/broadcaster";
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})


export function UploadArticlesPictures({ images, setImages }: { images: IArticleImages[], setImages: Function }) {

    const refInput = React.useRef<HTMLInputElement>(null);
    const primaryImage = images.length > 0 ? images.find(image => image.primary) : null;


    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary = false) => {
        try {


            const file = e.target.files;
            if (!file || file.length === 0) return;

            const formData = new FormData();

            for (const i in file) {
                formData.append(i, file[i]);
            }

            const { data }: { data: any } = await axios.post("/admin/private/images/upload", formData);
            const result = data.data as IArticleImages[]

            if (isPrimary) {
                result.forEach((image, index) => {
                    if (index === 0) {
                        image.primary = true;
                    } else {
                        image.primary = false;
                    }
                });

                for (const image of images) {
                    image.primary = false;
                }
            }


            setImages([...result, ...images]);

        } catch (error) {

            eventBus.emit("notify", { message: "Ha ocurrido un error al subir la imagen.", open: true, type: "error", title: "Upss!" })

        } finally {
            if (refInput.current) {
                refInput.current.value = "";
            }
        }
    }

    const handleDeleteImage = async (id: string) => {
        try {

            await axios.delete(`/admin/private/images/delete/${id}`);
            setImages(images.filter(image => image.id !== id));
        } catch (error) {
            eventBus.emit("notify", { message: "Ha ocurrido un error al eliminar la imagen.", open: true, type: "error", title: "Upss!" })
        }
    }

    return (
        <Grid container item xs={12} md={4}  >
            <Grid container item xs={12} >
                <Box borderRadius={"12px"} padding={"25px"} minHeight={"145px"} margin={0} width={"100%"} bgcolor={"#FFF"} >

                    <Grid item xs={12}  >

                        <input
                            type="file"
                            style={{ display: "none" }}
                            id="upload-image-main"
                            accept="image/*"
                            multiple={false}
                            onChange={(e) => handleChange(e, true)}
                            ref={refInput}

                        />
                        <Box width={"100%"} height={372} bgcolor={"#F4F5FA"} borderRadius={"12px"} border={"1px"} display={"flex"} justifyContent={"center"} alignItems={"center"}

                            position={"relative"}
                        >
                            {

                                primaryImage ? (
                                    <Box width={"100%"}>
                                        <Box position={"absolute"} top={"17px"} right={"19px"} display={"flex"} zIndex={1}>

                                            <Box sx={{ cursor: "pointer" }}
                                                component={"label"}
                                                htmlFor="upload-image-main"
                                            >
                                                <DownloadCloudIcon />
                                            </Box>

                                            <Box ml={"12px"} sx={{ cursor: "pointer" }}
                                                onClick={() => handleDeleteImage(primaryImage.id)}
                                            >
                                                <TrashIcon />
                                            </Box>

                                        </Box>
                                        <Image
                                            alt={"5slim main article picture"}
                                            style={{ objectFit: "contain" }}
                                            fill
                                            src={primaryImage.url}
                                        />
                                    </Box>

                                )
                                    :
                                    (

                                        <Box textAlign={"center"}
                                            component={"label"} htmlFor="upload-image-main"
                                        >

                                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt={"30px"}>

                                                <UploadImageIcon filled={false} />

                                                <Typography fontFamily={inter.style.fontFamily} fontSize={"17px"} color={"#5570F1"} fontWeight={"500"} ml={"12px"}>
                                                    Subir Imagen
                                                </Typography>


                                            </Box>

                                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt={"12px"}>

                                                <Typography fontFamily={inter.style.fontFamily} fontSize={"14px"} color={"#8B8D97"} fontWeight={"400"} margin={"0px 20px"}>
                                                    Sube una imagen de portada para el artículo.
                                                    <br />
                                                    Formato de imagen <strong>jpeg, png</strong> Tamaño recomendado <strong>600x600px (1:1)</strong>
                                                </Typography>

                                            </Box>

                                        </Box>
                                    )
                            }

                        </Box>
                    </Grid>


                    <Typography fontFamily={inter.style.fontFamily} fontSize={"17px"} color={"#45464E"} fontWeight={"400"} mt={"12px"} >
                        Fotos adicionales
                    </Typography>

                    <Grid container item xs={12} justifyContent={"left"} spacing={1} >

                        <Grid item xs={12} sm={12} md={12} lg={6} >

                            <input
                                type="file"
                                style={{ display: "none" }}
                                id="upload-image-main-secondary"
                                accept="image/*"
                                multiple={true}
                                onChange={(e) => handleChange(e, false)}
                                ref={refInput}

                            />

                            <Box component={"label"} htmlFor="upload-image-main-secondary" width={"100%"} sx={{ height: { xs: "145px", sm: "145px", md: "175px" } }} bgcolor={"#F4F5FA"} borderRadius={"12px"} border={"1px"} display={"flex"} justifyContent={"center"} alignItems={"center"} mt={"12px"}>
                                <Box textAlign={"center"}>
                                    <Image
                                        alt={"5slim.do. logo"}
                                        style={{ objectFit: "cover" }}
                                        width={46}
                                        height={46}
                                        src={"/Image.svg"}
                                    />

                                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt={"12px"}>

                                        <UploadImageIcon filled={false} />

                                        <Typography fontFamily={inter.style.fontFamily} sx={{ fontSize: { xs: "12px", sm: "11px", md: "13" } }} color={"#5570F1"} fontWeight={"500"} ml={"12px"}>
                                            Subir Imagen
                                        </Typography>

                                    </Box>

                                </Box>

                            </Box>
                        </Grid>

                        {
                            images.filter(image => !image.primary).map((image, index) => {
                                return (
                                    <Grid item xs={12} sm={12} md={12} lg={6} key={index} >
                                        <Box position={"relative"} width={"100%"}  sx={{ height: { xs: "145px", sm: "145px", md: "175px" } }} bgcolor={"#F4F5FA"} borderRadius={"12px"} border={"1px"} display={"flex"} justifyContent={"center"} alignItems={"center"} mt={"12px"}>

                                            <Box position={"absolute"} top={"17px"} right={"19px"} display={"flex"} zIndex={1}>
                                                <Box sx={{ cursor: "pointer" }}
                                                    onClick={() => handleDeleteImage(image.id)}
                                                >
                                                    <TrashIcon />
                                                </Box>
                                            </Box>

                                            <Image
                                                alt="Image Artículo"
                                                src={image.url}
                                                fill
                                                style={{ objectFit: "contain" }}
                                            />

                                        </Box>

                                    </Grid>
                                )
                            })
                        }


                    </Grid>

                </Box>
            </Grid >

        </Grid >
    )
}