import { ErrorMessage, useField } from "formik";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Switch, SwitchProps, TextField, styled } from "@mui/material";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: "600"
})

const CustomError = ({ name, customErrorText }: any) => (
  <ErrorMessage name={name}>
    {(formikError) => (
      <>
        {customErrorText && (
          <span style={{ color: "red", fontSize: "15px" }} inert><ReportProblemIcon sx={{ fontSize: '13px', marginRight: "3px", marginTop: "3px" }} />{customErrorText}</span>
        )}
        {formikError && (
          <span style={{ color: "red", fontSize: "15px" }} inert><ReportProblemIcon sx={{ fontSize: '13px', marginRight: "3px", marginTop: "3px" }} />{formikError}</span>
        )}
      </>
    )}
  </ErrorMessage>
);


export const CustomField = ({ name, customErrorText, value, label, ...props }: any) => {
  const [field] = useField(name);
  return (
    <>

      <TextField
        {...field}
        variant="outlined"
        size="small"
        name={name}
        placeholder={label}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '52px',
            '& fieldset': {
              border: 'none', // mismo color en hover para que no cambie
            },
            '&:hover fieldset': {
              border: 'none', // mismo color en hover para que no cambie
            },
            '&.Mui-focused fieldset': {
              border: 'none', // mismo color en hover para que no cambie
            },
          },

        }}
        InputProps={{
          style: {
            height: "52px",
            borderRadius: "8px",
            outline: "none",
            fontSize: "16x",
            fontFamily: inter.style.fontFamily,
            color: "#ABAFB1",
            backgroundColor: "#EFF1F999"

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



export const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#5570F1',
  },
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    marginTop: 4,
    marginLeft: 4,
    transitionDuration: '300ms',

    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#5570F1',
      '& + .MuiSwitch-track': {
        backgroundColor: '#5570F166',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 18,
    height: 18,
    backgroundColor: '#5570F1',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#5570F166',
  },
}));
