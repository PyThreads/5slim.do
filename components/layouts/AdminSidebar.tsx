"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { Poppins } from 'next/font/google';
import { Typography } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation'
import Image from "next/image";
import { ArticlesIcons, CustomersIcon, DashboardIcon, EmployeesIcon, ShoppingBagIcon } from '../icons/Svg';
import { useAdminAuth } from '../../context/AdminContext';

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
        icon: (filled: boolean) => <EmployeesIcon filled={filled} />,
        href: "/admin/dashboard/employees"
    },
    {
        name: "",
        icon: (filled: boolean) => <ArticlesIcons filled={filled} />,
        href: "/admin/dashboard/inventory"
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
    const { currentAdmin } = useAdminAuth() as { currentAdmin: any };

    const getLogoSrc = () => {
        // Si es cliente, usar el logo del owner
        if (currentAdmin?.userType === 'Cliente' && currentAdmin?.ownerLogo) {
            return currentAdmin.ownerLogo;
        }
        // Si es owner o cliente con logo propio
        if (currentAdmin?.logo) {
            return currentAdmin.logo;
        }
        // Logo por defecto
        return "/flash-lines.png";
    };

    return (
        <React.Fragment>

            <Box sx={style.box}>

                <Image
                    key={getLogoSrc()}
                    alt={"Logo"}
                    width={38}
                    height={38}
                    src={getLogoSrc()}
                    style={{ objectFit: 'contain' }}
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