import { FC } from "react";

interface MiIconoProps {
    filled: boolean;
    strokeBold?: boolean
}




export const SortTableIcon: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M14 5.1665H2C1.72667 5.1665 1.5 4.93984 1.5 4.6665C1.5 4.39317 1.72667 4.1665 2 4.1665H14C14.2733 4.1665 14.5 4.39317 14.5 4.6665C14.5 4.93984 14.2733 5.1665 14 5.1665Z"
                fill="#00092E"
            />
            <path
                d="M12 8.5H4C3.72667 8.5 3.5 8.27333 3.5 8C3.5 7.72667 3.72667 7.5 4 7.5H12C12.2733 7.5 12.5 7.72667 12.5 8C12.5 8.27333 12.2733 8.5 12 8.5Z"
                fill="#00092E"
            />
            <path
                d="M9.33366 11.8335H6.66699C6.39366 11.8335 6.16699 11.6068 6.16699 11.3335C6.16699 11.0602 6.39366 10.8335 6.66699 10.8335H9.33366C9.60699 10.8335 9.83366 11.0602 9.83366 11.3335C9.83366 11.6068 9.60699 11.8335 9.33366 11.8335Z"
                fill="#00092E"
            />
        </svg>
    )
}

export const FilterDateIcon: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M2.06152 6.7698H13.9442" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.961 9.37331H10.9672" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.00298 9.37331H8.00915" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.03813 9.37331H5.04431" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.961 11.9641H10.9672" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.00298 11.9641H8.00915" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.03813 11.9641H5.04431" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.6955 1.8335V4.02735" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.31075 1.8335V4.02735" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.8255 2.88623H5.18064C3.22285 2.88623 2 3.97685 2 5.98158V12.0147C2 14.0509 3.22285 15.1668 5.18064 15.1668H10.8193C12.7833 15.1668 14 14.0698 14 12.0651V5.98158C14.0062 3.97685 12.7895 2.88623 10.8255 2.88623Z"
                stroke="#53545C"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
export const FilterIcon: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.6663 2.5H1.33301L6.66634 8.80667V13.1667L9.33301 14.5V8.80667L14.6663 2.5Z" stroke="#53545C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}



export const HomeSecondTopBar: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.09615 13.8549V11.8103C6.09614 11.2922 6.51744 10.8713 7.03928 10.868H8.9554C9.47957 10.868 9.9045 11.2899 9.9045 11.8103V13.849C9.90449 14.2983 10.2697 14.6636 10.7223 14.6668H12.0295C12.6401 14.6684 13.2262 14.4287 13.6584 14.0006C14.0907 13.5726 14.3337 12.9913 14.3337 12.3852V6.57739C14.3336 6.08775 14.115 5.6233 13.7367 5.30916L9.29564 1.78301C8.51933 1.16624 7.41057 1.18617 6.65725 1.83042L2.31167 5.30916C1.91549 5.61404 1.67869 6.07987 1.66699 6.57739V12.3793C1.66699 13.6426 2.69858 14.6668 3.97111 14.6668H5.24852C5.46644 14.6684 5.67598 14.5835 5.83064 14.4311C5.9853 14.2787 6.07228 14.0713 6.07227 13.8549H6.09615Z" fill="#5570F1" />
        </svg>
    )
}


export const Notification: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill={filled ? "#5570F1" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                d="M16.4749 9.70428C15.8662 8.99341 15.5896 8.37738 15.5896 7.3308V6.97495C15.5896 5.61112 15.2757 4.73239 14.5932 3.85367C13.5414 2.489 11.7706 1.6665 10.0372 1.6665H9.96347C8.26645 1.6665 6.55121 2.45123 5.48115 3.76051C4.76143 4.65686 4.4111 5.57335 4.4111 6.97495V7.3308C4.4111 8.37738 4.15269 8.99341 3.52573 9.70428C3.06441 10.228 2.91699 10.9011 2.91699 11.6296C2.91699 12.3589 3.15635 13.0497 3.63671 13.6111C4.26367 14.2842 5.14904 14.7139 6.05345 14.7886C7.36287 14.938 8.67228 14.9943 10.0007 14.9943C11.3284 14.9943 12.6378 14.9003 13.948 14.7886C14.8516 14.7139 15.737 14.2842 16.3639 13.6111C16.8435 13.0497 17.0837 12.3589 17.0837 11.6296C17.0837 10.9011 16.9362 10.228 16.4749 9.70428Z"
                fill="#5570F1"
            />
            <path
                opacity="0.4"
                d="M11.6745 16.0233C11.2579 15.9343 8.71937 15.9343 8.30278 16.0233C7.94664 16.1055 7.56152 16.2969 7.56152 16.7165C7.58223 17.1168 7.81661 17.4702 8.14128 17.6943L8.14045 17.6951C8.56035 18.0224 9.05314 18.2306 9.56912 18.3053C9.84409 18.343 10.124 18.3414 10.4089 18.3053C10.9241 18.2306 11.4169 18.0224 11.8368 17.6951L11.836 17.6943C12.1606 17.4702 12.395 17.1168 12.4157 16.7165C12.4157 16.2969 12.0306 16.1055 11.6745 16.0233Z"
                fill="#5570F1"
            />

        </svg>
    )
}

export const ArticlesIcons: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M37.419 31.732C37.419 35.31 35.31 37.419 31.732 37.419H23.95C20.363 37.419 18.25 35.31 18.25 31.732V23.932C18.25 20.359 19.564 18.25 23.143 18.25H25.143C25.861 18.251 26.537 18.588 26.967 19.163L27.88 20.377C28.312 20.951 28.988 21.289 29.706 21.29H32.536C36.123 21.29 37.447 23.116 37.447 26.767L37.419 31.732Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M23.4814 30.4629H32.2164"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export const CustomersIcon: FC<MiIconoProps> = ({ filled, strokeBold }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd" d="M25.591 31.2068C29.28 31.2068 32.433 31.7658 32.433 33.9988C32.433 36.2318 29.301 36.8068 25.591 36.8068C21.901 36.8068 18.749 36.2528 18.749 34.0188C18.749 31.7848 21.88 31.2068 25.591 31.2068Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fill={filled ? "#99A9F7" : "transparent"}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.5911 28.0198C23.1691 28.0198 21.2051 26.0568 21.2051 23.6348C21.2051 21.2128 23.1691 19.2498 25.5911 19.2498C28.0121 19.2498 29.9761 21.2128 29.9761 23.6348C29.9851 26.0478 28.0351 28.0108 25.6221 28.0198H25.5911Z"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fill={filled ? "#99A9F7" : "transparent"}
                d="M32.4824 26.8815C34.0834 26.6565 35.3164 25.2825 35.3194 23.6195C35.3194 21.9805 34.1244 20.6205 32.5574 20.3635"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M34.5947 30.7322C36.1457 30.9632 37.2287 31.5072 37.2287 32.6272C37.2287 33.3982 36.7187 33.8982 35.8947 34.2112"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    )
}

export const ShoppingBagIcon: FC<MiIconoProps> = ({ filled, strokeBold }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32.5134 37.4998H24.1655C21.0992 37.4998 18.7468 36.3922 19.415 31.9346L20.193 25.8934C20.6049 23.6691 22.0237 22.8179 23.2685 22.8179H33.447C34.7102 22.8179 36.0466 23.7332 36.5225 25.8934L37.3006 31.9346C37.8681 35.8888 35.5797 37.4998 32.5134 37.4998Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M32.6502 22.5982C32.6502 20.2122 30.716 18.2779 28.3299 18.2779V18.2779C27.1809 18.273 26.0773 18.726 25.2631 19.5368C24.4489 20.3475 23.9912 21.4492 23.9912 22.5982V22.5982"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M31.296 27.1017H31.2502"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M25.4649 27.1017H25.4192"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* 
            <rect x="32" y="1" width="24" height="24" rx="12" fill="#FFCC91" />
            <path d="M44.032 17.1193C43.4695 17.1193 42.968 17.0227 42.5277 16.8295C42.0902 16.6364 41.7422 16.3679 41.4837 16.0241C41.228 15.6776 41.0888 15.2756 41.0661 14.8182H42.1399C42.1626 15.0994 42.2592 15.3423 42.4297 15.5469C42.6001 15.7486 42.8232 15.9048 43.0987 16.0156C43.3743 16.1264 43.6797 16.1818 44.0149 16.1818C44.3899 16.1818 44.7223 16.1165 45.0121 15.9858C45.3018 15.8551 45.5291 15.6733 45.6939 15.4403C45.8587 15.2074 45.9411 14.9375 45.9411 14.6307C45.9411 14.3097 45.8615 14.027 45.7024 13.7827C45.5433 13.5355 45.3104 13.3423 45.0036 13.2031C44.6967 13.0639 44.3217 12.9943 43.8786 12.9943H43.1797V12.0568H43.8786C44.2251 12.0568 44.5291 11.9943 44.7905 11.8693C45.0547 11.7443 45.2607 11.5682 45.4084 11.3409C45.5589 11.1136 45.6342 10.8466 45.6342 10.5398C45.6342 10.2443 45.5689 9.98722 45.4382 9.76847C45.3075 9.54972 45.1229 9.37926 44.8842 9.2571C44.6484 9.13494 44.37 9.07386 44.049 9.07386C43.7479 9.07386 43.4638 9.12926 43.1967 9.24006C42.9325 9.34801 42.7166 9.50568 42.549 9.71307C42.3814 9.91761 42.2905 10.1648 42.2763 10.4545H41.2536C41.2706 9.99716 41.4084 9.59659 41.6669 9.25284C41.9254 8.90625 42.2635 8.63636 42.6811 8.44318C43.1016 8.25 43.5632 8.15341 44.0661 8.15341C44.6058 8.15341 45.0689 8.26278 45.4553 8.48153C45.8416 8.69744 46.1385 8.98295 46.3459 9.33807C46.5533 9.69318 46.657 10.0767 46.657 10.4886C46.657 10.9801 46.5277 11.3991 46.2692 11.7457C46.0135 12.0923 45.6655 12.3324 45.2251 12.4659V12.5341C45.7763 12.625 46.2067 12.8594 46.5163 13.2372C46.826 13.6122 46.9808 14.0767 46.9808 14.6307C46.9808 15.1051 46.8516 15.5312 46.593 15.9091C46.3374 16.2841 45.9879 16.5795 45.5447 16.7955C45.1016 17.0114 44.5973 17.1193 44.032 17.1193Z" fill="#1C1D22" />
        */}
        </svg>

    )
}

export const DashboardIcon: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 22.5C19 19.8748 19.0281 19 22.5 19C25.9719 19 26 19.8748 26 22.5C26 25.1252 26.0111 26 22.5 26C18.9889 26 19 25.1252 19 22.5Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill={filled ? "#99A9F7" : "transparent"}
                d="M30 22.5C30 19.8748 30.0281 19 33.5 19C36.9719 19 37 19.8748 37 22.5C37 25.1252 37.0111 26 33.5 26C29.9889 26 30 25.1252 30 22.5Z"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 33.5C19 30.8748 19.0281 30 22.5 30C25.9719 30 26 30.8748 26 33.5C26 36.1252 26.0111 37 22.5 37C18.9889 37 19 36.1252 19 33.5Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30 33.5C30 30.8748 30.0281 30 33.5 30C36.9719 30 37 30.8748 37 33.5C37 36.1252 37.0111 37 33.5 37C29.9889 37 30 36.1252 30 33.5Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};