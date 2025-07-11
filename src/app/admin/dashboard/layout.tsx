"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import { Poppins, Inter } from 'next/font/google';
import { Container, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";
import { ArticlesIcons, CustomersIcon, DashboardIcon, ShoppingBagIcon, Notification, HomeSecondTopBar } from '../../../../components/icons/Svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AdminProvider, useAdminAuth } from '../../../../context/AdminContext';
import Link from 'next/link';
import { IAdmin } from '../../../../api/src/interfaces';

const poppins = Poppins({ subsets: ['latin'], display: 'swap', weight: "400" });
const inter = Inter({ subsets: ['latin'], display: 'swap', weight: "500" });

const items = [
  {
    name: "Dashboard",
    icon: (filled: boolean) => <DashboardIcon filled={filled} />,
    href: "/admin/dashboard",
    child: [
      { path: "/admin/dashboard", title: "Dashboard", order: 1 }
    ]
  },
  {
    name: "Ordenes",
    icon: (filled: boolean) => <ShoppingBagIcon filled={filled} />,
    href: "/admin/dashboard/orders",
    child: [
      { path: "/admin/dashboard/orders", title: "Ordenes", order: 1 },
      {
        isDynamic: true,
        path: "/admin/dashboard/orders/",
        match: (pathname: string) => pathname.startsWith("/admin/dashboard/orders/"),
        title: "Detalles orden",
        order: 3
      }
    ]
  },
  {
    name: "Clientes",
    icon: (filled: boolean) => <CustomersIcon filled={filled} />,
    href: "/admin/dashboard/users",
    child: [
      { path: "/admin/dashboard/users", title: "Clientes", order: 1 }
    ]
  },
  {
    name: "Artículos",
    icon: (filled: boolean) => <ArticlesIcons filled={filled} />,
    href: "/admin/dashboard/inventory",
    child: [
      { path: "/admin/dashboard/inventory", title: "Artículos", order: 1 },
      { path: "/admin/dashboard/inventory/newArticle", title: "Nuevo Artículo", order: 2 },
      {
        isDynamic: true,
        path: "/admin/dashboard/inventory/newArticle/",
        match: (pathname: string) => pathname.startsWith("/admin/dashboard/inventory/newArticle/"),
        title: "Editando Artículo",
        order: 3
      }
    ]
  }
];

export default function ProtectedAdminDashboard({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <AdminProvider>
      <LayoutAdminDashboard>{children}</LayoutAdminDashboard>
    </AdminProvider>
  );
}

function LayoutAdminDashboard({ children }: Readonly<{ children: React.ReactNode; }>) {
  const pathName = usePathname();
  const { currentAdmin } = useAdminAuth() as { currentAdmin: IAdmin | null };
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [hideMenuNames, setHideMenuNames] = React.useState(false);
  const router = useRouter();

  const mainPath = items.find((main) =>
    main.child.some((child) =>
      child.isDynamic ? child.match?.(pathName) : child.path === pathName
    )
  );

  const currentItem: any = mainPath?.child.find((child) =>
    child.isDynamic ? child.match?.(pathName) : child.path === pathName
  );

  return (
    <Box sx={style.boxLayout}>

      <Box sx={style.sidebar}>
        <Image alt="Logo" width={38} height={38} src="/flash-lines.png" style={{ marginLeft: "auto", marginRight: "auto" }} />
        <Box sx={style.boxLi} >
          {items.map((item, key) => {
            const isActive = item.child.some((child) =>
              child.isDynamic ? child.match?.(pathName) : child.path === pathName
            );
            return (
              <Box
                key={key}
                sx={{
                  ...style.li,
                  backgroundColor: isActive ? "#5570F1" : "transparent"
                }}
                onClick={() => item.href && router.push(item.href)}
              >
                {item.icon(isActive)}
                {!hideMenuNames && <Typography sx={{ ...style.menuText, pr: 1.70, color: isActive ? "#FFFFFF" : "#45464E" }}>{item.name}</Typography>}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <List>
          {items.map((item, index) => {
            return (
              <ListItem key={index} onClick={() => { router.push(item.href); setMobileOpen(false); }}>
                <ListItemIcon>{item.icon(false)}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box width="100%" height="100%">
        <Box sx={style.topBar}>
          <Container sx={style.topBarMain}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>

              <MenuIcon sx={{ display: { xs: 'none', md: 'block' }, mr: 2, color: "#5570F1", cursor: "pointer" }} onClick={() => setHideMenuNames(!hideMenuNames)} />
              <MenuIcon sx={{ display: { xs: 'block', md: 'none' }, mr: 2, color: "#5570F1", cursor: "pointer" }} onClick={() => setMobileOpen(true)} />
              <Typography variant='h3' sx={style.titleTopBar}>{currentItem?.title}</Typography>

            </Box>

            <Box sx={{ ...style.boxRightUser, width: { xs: "100px", md: "auto" } }}>
              <Box sx={{ ...style.boxRight, ml: { xs: 6, md: 0 }, mr: 1 }}>
                <Typography variant='h2' sx={{ ...style.tyUser, fontSize: { xs: 10, md: 14 } }}>{currentAdmin?.fullName}</Typography>
                <KeyboardArrowDownIcon />
              </Box>
              <Box ml={0} mr={1}>
                <Notification filled={true} />
              </Box>
              <Image alt="Profile" width={32} height={32} src="/profile.png" style={{ objectFit: "contain" }} />
            </Box>
          </Container>
        </Box>

        <Container sx={style.topBarSecondBar}>
          <HomeSecondTopBar filled={true} />
          {mainPath && currentItem && (() => {
            const breadcrumbItems = mainPath.child
              .filter((child: any) => child.order <= currentItem.order!)
              .sort((a: any, b: any) => a.order - b.order);
            return breadcrumbItems.map((item, key) => (
              <React.Fragment key={key}>
                <Typography sx={{ ...style.tyUser, ...style.slash }}>/</Typography>
                <Typography sx={{ ...style.tyUser, ...style.slash, color: "#5570F1" }}>
                  <Link href={item.path}>{item.title}</Link>
                </Typography>
              </React.Fragment>
            ));
          })()}
        </Container>

        <Box sx={style.mainLayoutContainer}>{children}</Box>
      </Box>
    </Box>
  );
}

const style = {
  sidebar: {
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    p: 2,
    borderRight: '1px solid #F1F3F9'
  },
  boxRightUser: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "240px"
  },
  slash: {
    color: "#8B8D97",
    marginLeft: "11px"
  },
  boxRight: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "154px",
    height: "32px",
    backgroundColor: "#FEF5EA",
    borderRadius: "8px",
    padding: "5px 12px"
  },
  tyUser: {
    fontSize: { xs: 12, sm: 14 },
    fontFamily: inter.style.fontFamily,
    color: "#1C1D22"
  },
  topBarSecondBar: {
    display: "flex",
    alignItems: "center",
    minWidth: "100% !important",
    height: 24,
    borderTop: "1px solid #F1F3F9",
    backgroundColor: "#FFFFFF",
    padding: "4px 21px"
  },
  titleTopBar: {
    fontSize: { xs: 12, sm: 20 },
    fontFamily: poppins.style.fontFamily,
    letterSpacing: "2%",
    color: "#45464E"
  },
  topBarMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "60px",
    minWidth: "100% !important",
    padding: "14px 21px"
  },
  mainLayoutContainer: {
    padding: "23px 21px 0px 21px",
    margin: 0,
    width: "100% !important",
    minHeight: "100% !important",
    backgroundColor: "#F4F5FA"
  },
  boxLayout: {
    width: "100% !important",
    display: "flex",
    minHeight: "100% !important"
  },
  topBar: {
    width: "100%",
    minWidth: "100% !important",
    height: "66px",
    backgroundColor: "#FFFFFF"
  },
  boxLi: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  li: {
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },
  menuText: {
    display: { xs: "none", md: "block" },
    fontSize: "14px",
    fontFamily: poppins.style.fontFamily,
    color: "#1C1D22"
  }
};
