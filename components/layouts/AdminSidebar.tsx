"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { Poppins } from 'next/font/google';
import { Typography } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation'
import Image from "next/image";
import { ArticlesIcons, CustomersIcon, DashboardIcon, ShoppingBagIcon } from '../icons/Svg';

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: "500"
})


const items = [
    {
        name: "",
        icon: (filled: boolean) => <DashboardIcon filled={filled} />,
        href: "/admin/dashboard"
    },
    {
        name: "",
        icon: (filled: boolean) => <ShoppingBagIcon filled={filled} />,
        href: "/admin/dashboard/articles"
    },
    {
        name: "",
        icon: (filled: boolean) => <CustomersIcon filled={filled} />,
        href: "/admin/dashboard/users"
    },
    {
        name: "",
        icon: (filled: boolean) => <ArticlesIcons filled={filled} />,
        href: "/admin/dashboard/users"
    }
]

const Li = ({ name, icon, href }: { name?: string, icon: Function, href?: string }) => {
    const router = useRouter()
    const pathName = usePathname();

    return (
        <Box sx={{
            ...style.li,
            backgroundColor: pathName === href ? "#5570F1" : "transparent",
            width: 50,
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}
            onClick={() => {
                href && router.push(href)
            }}
        >
            {icon(pathName === href)}

            {name && <Typography sx={style.ty}>{name}</Typography>}
        </Box>
    )
}


export default function AdminSidebar() {

    return (
        <React.Fragment>

            <Box sx={style.box}>

                <Image
                    alt={"5slim.do. logo"}
                    width={38}
                    height={38}
                    src={"/flash-lines.png"}
                />

                <Box sx={style.boxLi}>
                    {items.map((item, key) => (
                        <Li icon={item.icon} href={item.href} name={item.name} key={key} />
                    ))}
                </Box>

            </Box>

        </React.Fragment>
    );
}

const style = {
    boxLi: {
        marginTop: "62px",
        width: "100%",
        textAlign: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    image: {
        marginTop: "24px",
        objectFit: "contain"
    },
    box: {
        backgroundColor: "#FFFFFF",
        width: "88px",
        minWidth: "88px",
        maxWidth: "88px",
        paddingTop: 5,
        height: "100%",
        textAlign: "center"
    },
    li: {
        borderRadius: "12px"
    },
    ty: {
        display: "inline",
        fontFamily: poppins.style.fontFamily,
        marginLeft: "21px",
    }
};