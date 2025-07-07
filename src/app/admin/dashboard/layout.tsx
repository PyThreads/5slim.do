"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import { Poppins, Inter } from 'next/font/google';
import { Container, Typography } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";
import { ArticlesIcons, CustomersIcon, DashboardIcon, ShoppingBagIcon, Notification, HomeSecondTopBar } from '../../../../components/icons/Svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AdminProvider, useAdminAuth } from '../../../../context/AdminContext';
import Link from 'next/link';
import { IAdmin } from '../../../../api/src/interfaces';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: "400"
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: "500"
});

const items = [
  {
    name: "Dashboard",
    showName: false,
    icon: (filled: boolean) => <DashboardIcon filled={filled} />,
    href: "/admin/dashboard",
    child: [
      {
        path: "/admin/dashboard",
        title: "Dashboard",
        order: 1
      }
    ]
  },
  {
    name: "Ordenes",
    showName: false,
    icon: (filled: boolean) => <ShoppingBagIcon filled={filled} />,
    href: "/admin/dashboard/orders",
    child: [
      {
        path: "/admin/dashboard/orders",
        title: "Ordenes",
        order: 1
      },
      {
        isDynamic: true,
        path: "/admin/dashboard/orders/",
        match: (pathname: string) =>
          pathname.startsWith("/admin/dashboard/orders/"),
        title: "Detalles orden",
        order: 3
      }
    ]
  },
  {
    name: "Clientes",
    showName: false,
    icon: (filled: boolean) => <CustomersIcon filled={filled} />,
    href: "/admin/dashboard/users",
    child: [
      {
        path: "/admin/dashboard/users",
        title: "Clientes",
        order: 1
      }
    ]
  },
  {
    name: "Artículos",
    showName: false,
    icon: (filled: boolean) => <ArticlesIcons filled={filled} />,
    href: "/admin/dashboard/inventory",
    child: [
      {
        path: "/admin/dashboard/inventory",
        title: "Artículos",
        order: 1
      },
      {
        path: "/admin/dashboard/inventory/newArticle",
        title: "Nuevo Artículo",
        order: 2
      },
      {
        isDynamic: true,
        path: "/admin/dashboard/inventory/newArticle/",
        match: (pathname: string) =>
          pathname.startsWith("/admin/dashboard/inventory/newArticle/"),
        title: "Editando Artículo",
        order: 3
      }
    ]
  }
];

const Li = ({ name, icon, href, showName, child }: { name: string, icon: Function, href?: string, showName?: boolean, child: any[] }) => {
  const router = useRouter();
  const pathName = usePathname();

  const setBackground = child.some((child) =>
    child.isDynamic ? child.match?.(pathName) : child.path === pathName
  );

  return (
    <Box
      sx={{
        ...style.li,
        backgroundColor: setBackground || pathName === href ? "#5570F1" : "transparent",
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      onClick={() => {
        href && router.push(href);
      }}
    >
      {icon(setBackground)}

      {showName && <Typography sx={style.ty}>{name}</Typography>}
    </Box>
  );
};

export default function ProtectedAdminDashboard({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <AdminProvider>
      <LayoutAdminDashboard>{children}</LayoutAdminDashboard>
    </AdminProvider>
  );
}

function LayoutAdminDashboard({ children }: Readonly<{ children: React.ReactNode; }>) {
  const pathName = usePathname();
  const { currentAdmin } = useAdminAuth() as { currentAdmin: IAdmin | null };

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
      <Box sx={style.box}>
        <Image alt={"5slim.do. logo"} width={38} height={38} src={"/flash-lines.png"} />

        <Box sx={style.boxLi}>
          {items.map((item, key) => (
            <Li
              icon={item.icon}
              href={item.href}
              name={item.name}
              key={key}
              showName={item.showName}
              child={item.child}
            />
          ))}
        </Box>
      </Box>

      <Box width={"100%"} height={"100%"}>
        <Box sx={style.topBar}>
          <Container sx={style.topBarMain}>
            <Typography variant='h3' sx={style.titleTopBar}>
              {currentItem?.title}
            </Typography>

            <Box sx={style.boxRightUser}>
              <Box sx={style.boxRight}>
                <Typography variant='h2' sx={style.tyUser}>
                  {currentAdmin?.fullName}
                </Typography>
                <KeyboardArrowDownIcon />
              </Box>

              <Box>
                <Notification filled={true} />
              </Box>

              <Box>
                <Image
                  alt={"5slim.do. logo"}
                  width={32}
                  height={32}
                  src={"/profile.png"}
                  style={{ objectFit: "contain" }}
                />
              </Box>
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
    fontSize: "14px",
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
    padding: "4px,21px,4px,21px !important"
  },
  titleTopBar: {
    fontSize: "20px",
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
    padding: "14px,21px,14px,21px !important"
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
    height: "66px",
    backgroundColor: "#FFFFFF"
  },
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
    paddingTop: 3,
    textAlign: "center",
    minHeight: "100vh"
  },
  li: {
    borderRadius: "12px"
  },
  ty: {
    display: "inline",
    fontFamily: poppins.style.fontFamily,
    marginLeft: "21px"
  }
};
