import {  ErrorMessage,useField } from "formik";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { InputLabel, TextField } from "@mui/material";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: "600"
})

const CustomError = ({ name, customErrorText }: any) => (
    <ErrorMessage name={name}>
        {(formikError) => (
            <>
                {customErrorText && (
                    <span style={{ color: "red", fontSize: "15px" }} inert><ReportProblemIcon sx={{ fontSize: '13px', marginRight: "3px", marginTop: "3px" }}  />{customErrorText}</span>
                )}
                {formikError && (
                    <span style={{ color: "red", fontSize: "15px" }} inert><ReportProblemIcon sx={{ fontSize: '13px', marginRight: "3px", marginTop: "3px" }}  />{formikError}</span>
                )}
            </>
        )}
    </ErrorMessage>
);


export const CustomField = ({ name, customErrorText,value, label, ...props }: any) => {
    const [field] = useField(name);
    return (
        <>
           
            <InputLabel sx={{fontFamily: poppins.style.fontFamily,fontSize: "15px"}}>{label}</InputLabel>
            <TextField
                {...field}
                variant="outlined"
                size="small"
                name={name}
                sx={{
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
                    style: {
                        height: "40px",
                        borderRadius: "10px",
                        outline: "none",
                    },
                }}
                {...props}
            />
            <CustomError name={name} customErrorText={customErrorText} inert />
        </>
    );
};

export default CustomField;


export const InputValitaionMessage = ({ message }: any) => {
    return (
        <span style={{ color: "red", fontSize: "15px" }} ><ReportProblemIcon style={{ fontSize: '13px', marginRight: "3px", marginTop: "3px" }} />{message}</span>
    )

}
