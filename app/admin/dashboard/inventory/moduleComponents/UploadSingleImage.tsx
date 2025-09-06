import { Box, Typography } from "@mui/material";
import { DownloadCloudIcon, TrashIcon, UploadImageIcon } from "../../../../../components/icons/Svg";
import axios from "../../../../../context/adminAxiosInstance";
import Image from "next/image";
import { eventBus } from "../../../../utils/broadcaster";
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

export function UploadSingleImage({ imageUrl, onImageChange, aspectRatio = "1:1" }: { imageUrl: string, onImageChange: Function, aspectRatio?: string }) {
    const refInput = React.useRef<HTMLInputElement>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files;
            if (!file || file.length === 0) return;

            const formData = new FormData();
            formData.append("0", file[0]);

            const { data }: { data: any } = await axios.post("/admin/private/images/upload", formData);
            const result = data.data[0];

            onImageChange(result.url);

        } catch (error) {
            eventBus.emit("notify", { message: "Ha ocurrido un error al subir la imagen.", open: true, type: "error", title: "Upss!" })
        } finally {
            if (refInput.current) {
                refInput.current.value = "";
            }
        }
    }

    const handleDeleteImage = async () => {
        try {
            if (imageUrl) {
                const imageId = imageUrl.split('/').pop()?.split('.')[0];
                if (imageId) {
                    await axios.delete(`/admin/private/images/delete/${imageId}`);
                }
            }
            onImageChange("");
        } catch (error) {
            eventBus.emit("notify", { message: "Ha ocurrido un error al eliminar la imagen.", open: true, type: "error", title: "Upss!" })
        }
    }

    const getAspectRatioStyle = () => {
        const [width, height] = aspectRatio.split(':').map(Number);
        return { aspectRatio: `${width}/${height}` };
    };

    return (
        <Box>
            <input
                type="file"
                style={{ display: "none" }}
                id="upload-single-image"
                accept="image/*"
                multiple={false}
                onChange={handleChange}
                ref={refInput}
            />
            
            <Box 
                width="100%" 
                height={200} 
                bgcolor="#F4F5FA" 
                borderRadius="12px" 
                border="1px solid #E0E0E0" 
                display="flex" 
                justifyContent="center" 
                alignItems="center"
                position="relative"
                sx={getAspectRatioStyle()}
            >
                {imageUrl ? (
                    <Box width="100%" height="100%">
                        <Box position="absolute" top="8px" right="8px" display="flex" zIndex={1}>
                            <Box 
                                sx={{ cursor: "pointer" }}
                                component="label"
                                htmlFor="upload-single-image"
                            >
                                <DownloadCloudIcon />
                            </Box>
                            <Box 
                                ml="8px" 
                                sx={{ cursor: "pointer" }}
                                onClick={handleDeleteImage}
                            >
                                <TrashIcon />
                            </Box>
                        </Box>
                        <Image
                            alt="Imagen"
                            style={{ objectFit: "contain" }}
                            fill
                            src={imageUrl}
                        />
                    </Box>
                ) : (
                    <Box 
                        textAlign="center"
                        component="label" 
                        htmlFor="upload-single-image"
                        sx={{ cursor: "pointer" }}
                    >
                        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                            <UploadImageIcon filled={false} />
                            <Typography 
                                fontFamily={inter.style.fontFamily} 
                                fontSize="14px" 
                                color="#5570F1" 
                                fontWeight="500" 
                                ml="8px"
                            >
                                Subir Imagen
                            </Typography>
                        </Box>
                        <Typography 
                            fontFamily={inter.style.fontFamily} 
                            fontSize="12px" 
                            color="#8B8D97" 
                            fontWeight="400"
                        >
                            Formato: jpeg, png
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}