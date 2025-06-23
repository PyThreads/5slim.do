import { TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


export default function SearchTable({onChange}: {onChange: Function}) {
    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar"
            fullWidth
            sx={{
                borderRadius: "6px",
                '& .MuiOutlinedInput-root': {
                    height: '33px',
                    '& fieldset': {
                        border: '1px solid #CFD3D4', // mismo color en hover para que no cambie
                    },
                    '&:hover fieldset': {
                        border: '1px solid #CFD3D4', // mismo color en hover para que no cambie
                    },
                    '&.Mui-focused fieldset': {
                        border: '1px solid #CFD3D4', // mismo color en hover para que no cambie
                    },
                }

            }}
            InputProps={{
                startAdornment: <SearchIcon sx={{ marginRight: "4px",marginLeft: "-2px"}} />,
                style: {
                    height: "33px",
                    borderRadius: "4px",
                    outline: "none",
                    color: "#ABAFB1",
                    fontSize: "14px",
                    fontFamily: "Inter"
                }
            }}
            autoFocus
            onChange={(e)=>{onChange(e)}}
        />
    )
}


