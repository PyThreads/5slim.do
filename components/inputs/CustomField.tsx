import { ErrorMessage, useField, useFormikContext } from "formik";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { FormControlLabel, InputAdornment, Switch, SwitchProps, TextField, Typography, styled, Autocomplete } from "@mui/material";
import { Inter } from "next/font/google";
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import React from "react";
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


export const AutocompleteCustom = ({
  onChange,
  options,
  getOptionLabel,
  isOptionEqualToValue,
  getDefaultValue,
  size = "medium",
  customErrorText,
  renderOption,
  label,
  onSearch
}: {
  size: "small" | "medium";
  onChange: (event: any, newValue: any) => void;
  options: any[];
  getOptionLabel: (option: any) => any;
  isOptionEqualToValue: (option: any, value: any) => boolean;
  customErrorText?: string;
  getDefaultValue: () => any
  renderOption: (props: any, option: any) => React.ReactNode
  label: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => any
}) => {
  return (
    <React.Fragment>
      <Autocomplete
        options={options}
        renderOption={renderOption}
        getOptionLabel={getOptionLabel}
        onChange={onChange}
        fullWidth
        size={size}
        sx={{
          borderRadius: "8px",
          backgroundColor: "#EFF1F999"
        }}
        isOptionEqualToValue={isOptionEqualToValue}
        defaultValue={getDefaultValue()}
        renderInput={(params) => (
          <CustomField
            {...params}
            placeholder="Seleccionar cliente"
            label={label}
            fullWidth
            noValidate
            size="small"
            onChange={onSearch}
          />

        )}
      />
      {customErrorText && <Typography fontFamily={"Inter"} fontSize={"12px"} color={"#f74343"}>{customErrorText}</Typography>}
    </React.Fragment>
  );
};


export const CustomField = ({
  name,
  customErrorText,
  noValidate = false,
  startAdornment,
  endAdornment,
  styles = {},
  ...props
}: any) => {
  const formik = useFormikContext();
  const isInsideFormik = !!formik;

  let fieldProps: any = {};

  if (!noValidate && isInsideFormik) {
    const [field] = useField(name);
    fieldProps = field;
  }

  return (
    <>
      <TextField
        {...fieldProps}
        value={fieldProps.value || props.value || ''}
        size="medium"
        name={name}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused fieldset': { border: 'none' },
            '& input::placeholder': {
              color: '#929596',
              opacity: 1,
            },
          },
        }}
        InputProps={{
          style: {
            borderRadius: '8px',
            outline: 'none',
            fontSize: '16px',
            fontFamily: inter.style.fontFamily,
            color: '#929596',
            backgroundColor: '#EFF1F999',
            ...styles
          },
          startAdornment: startAdornment ? (
            <Box sx={{ margin: 0, marginRight: '4px' }}>{startAdornment}</Box>
          ) : null,
          endAdornment: endAdornment ? (
            <Box sx={{ margin: 0, marginRight: '4px' }}>{endAdornment}</Box>
          ) : null,
        }}
        {...props}
      />

      {!noValidate && isInsideFormik ? (
        <CustomError name={name} customErrorText={customErrorText} inert />
      ) : customErrorText ? (
        <Typography fontFamily="Inter" fontSize="12px" color="#f74343">
          {customErrorText}
        </Typography>
      ) : null}
    </>
  );
};

export default CustomField;


export const DefaultSwitch = ({ checked, setChecked, label, stylesLabel = {} }: { label: string, checked: boolean, setChecked: Function, stylesLabel?: any }) => {
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
          margin: "0px 20px 0px 0px",
          ...stylesLabel
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


export const MultipleSelectChip = ({ name, customErrorText, items, getLabel, selected, setSelected, label }: any) => {


  return (
    <React.Fragment>
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          name={name}
          multiple
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          input={<OutlinedInput id="select-multiple-chip" label={label} />}
          fullWidth
          sx={{
            borderRadius: "8px",
            outline: "none",
            fontSize: "16x",
            fontFamily: inter.style.fontFamily,
            color: "#929596",
            backgroundColor: "#EFF1F999",
            border: "none",
            '& .MuiOutlinedInput-notchedOutline': {
              border: "none"
            }
          }}
          SelectDisplayProps={{
            style: {
              borderRadius: "8px",
              outline: "none",
              fontSize: "16x",
              fontFamily: inter.style.fontFamily,
              color: "#929596",
              backgroundColor: "#EFF1F999",
              border: "none"
            }
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value: any) => (
                <Chip key={value} label={getLabel(items.find((item: any) => item._id === value))} />
              ))}
            </Box>
          )}
          MenuProps={
            {
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              }
            }
          }
        >
          {items.map((value: any) => (
            <MenuItem
              key={value._id}
              value={value._id}
            >
              {getLabel(value)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <CustomError name={name} customErrorText={customErrorText} inert />
    </React.Fragment>
  )
}
