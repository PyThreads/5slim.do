import React from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})

interface SearchTableProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick?: (e: any) => void;
}

const SearchTable: React.FC<SearchTableProps> = ({ onChange, handleClick }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Buscar"
      fullWidth
      onChange={onChange}
      onFocus={(e)=>{
        handleClick && handleClick(e)
      }}
      sx={{
        borderRadius: "6px",
        '& .MuiOutlinedInput-root': {
          height: '33px',
          '& fieldset': {
            border: '1px solid #CFD3D4',
          },
          '&:hover fieldset': {
            border: '1px solid #CFD3D4',
          },
          '&.Mui-focused fieldset': {
            border: '1px solid #CFD3D4',
          },
        }
      }}
      InputProps={{
        startAdornment: <SearchIcon sx={{ marginRight: "4px", marginLeft: "-2px" }} />,
        style: {
          height: "33px",
          borderRadius: "4px",
          outline: "none",
          color: "#ABAFB1",
          fontSize: "14px",
          fontFamily: inter.style.fontFamily
        }
      }}
    />
  );
};

export default SearchTable;
