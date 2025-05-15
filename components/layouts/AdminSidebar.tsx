"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { Poppins } from 'next/font/google';
import { Typography } from '@mui/material';
import { useRouter,usePathname } from 'next/navigation'
import ListIcon from '@mui/icons-material/List';
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';


const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})


const items= [
    {
        name: "Dashboard",
        icon: ()=><GridViewIcon/>,
        href: "/admin/dashboard"
    },
    {
        name: "Artículos",
        icon: ()=><ListIcon/>,
        href: "/admin/dashboard/articles"
    },
    {
        name: "Usuarios",
        icon: ()=><PeopleAltIcon/>,
        href: "/admin/dashboard/users"
    }
]

const Li = ({ name, icon, href }: { name: string, icon: Function, href?: string }) => {
    const router = useRouter()
    const pathName = usePathname();

    return (
        <Box sx={{...style.li, 
            backgroundColor: pathName === href ? "#001987" : "transparent",
            color: pathName === href ? "white" : "black"
        }}
            onClick={() => {
                href && router.push(href)
            }}
        >
            {icon()}
            <Typography sx={style.ty}>{name}</Typography>
        </Box>
    )
}


export default function AdminSidebar() {

    return (
        <React.Fragment>
            <Box sx={style.box}>
                {items.map((item) => (
                    <Li icon={item.icon} href={item.href} name={item.name} key={item.name} />
                ))}
            </Box>
        </React.Fragment>
    );
}


const style = {
    box: {
        backgroundColor: "#F0F0F08F",
        width: 238,
        paddingTop: 5
    },
    li: {
        display: "flex",
        backgroundColor: "#001987",
        color: "white",
        paddingLeft: "31px",
        alignItems: "center",
        width: "100%",
        height: 48,
        borderTopRightRadius: 100,     // Redondea la esquina superior derecha
        borderBottomRightRadius: 100,  // Redondea la esquina inferior derecha
        cursor: "pointer",
        margin: "5px 0px",
        fontSize: "16px"
    },
    ty: {
        display: "inline",
        fontFamily: poppins.style.fontFamily,
        marginLeft: "21px",
    }
};