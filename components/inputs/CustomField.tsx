import { ErrorMessage, useField } from "formik";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { FormControlLabel, Switch, SwitchProps, TextField, Typography, styled } from "@mui/material";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: "600"
})

export const CustomError = ({ name, customErrorText }: any) => (
  <ErrorMessage name={name}>
    {(formikError) => (
      <>
        {customErrorText && (
          <Typography >{customErrorText}</Typography>
        )}
        {formikError && (
          <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#f74343"}>{formikError}</Typography>
        )}
      </>
    )}
  </ErrorMessage>
);


export const CustomField = ({ name, customErrorText, ...props }: any) => {
  const [field] = useField(name);
  return (
    <>

      <TextField
        {...field}
        variant="outlined"
        size="small"
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
            '& input::placeholder': {
              color: '#929596',
              opacity: 1, // Quita opacidad
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
            color: "#929596",
            backgroundColor: "#EFF1F999",
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

export const DefaultSwitch = ({ checked, setChecked, label }: { label: string, checked: boolean, setChecked: Function }) => {
  return (
    <FormControlLabel
      control={
        <IOSSwitch checked={checked} onChange={(event) => {
          setChecked(event.target.checked)
        }
        } />
      }
      label={label}
      labelPlacement="start"

      sx={{
        margin: 0,
        '.MuiFormControlLabel-label': {
          fontFamily: inter.style.fontFamily,
          fontSize: "14px",
          color: "#2B2F32",
          margin: "0px 20px 0px 0px"
        }
      }}
    />
  )
}

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 40,
  height: 20,
  padding: 0,
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#5570F1',
  },
  '& .MuiSwitch-switchBase': {
    padding: 0,
    marginTop: 1.8,
    marginLeft: 3,
    marginRight: 14,
    transitionDuration: '300ms',

    '&.Mui-checked': {
      transform: 'translateX(18px)',
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
    width: 16,
    height: 16,
    backgroundColor: '#5570F1',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#5570F166',
  },
}));
