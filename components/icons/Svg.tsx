import React from "react";
import { FC } from "react";

interface MiIconoProps {
    filled: boolean;
    strokeBold?: boolean,
    color?: string,
    type?: "success" | "error"
}

export const CreditCardIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_64_24826)">
            <path
                d="M17.5006 3.33337H2.50065C1.58018 3.33337 0.833984 4.07957 0.833984 5.00004V15C0.833984 15.9205 1.58018 16.6667 2.50065 16.6667H17.5006C18.4211 16.6667 19.1673 15.9205 19.1673 15V5.00004C19.1673 4.07957 18.4211 3.33337 17.5006 3.33337Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M0.833984 8.33337H19.1673"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_64_24826">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export const LocationPinIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.0827 8.75038C12.0827 7.59932 11.15 6.66663 9.99977 6.66663C8.84871 6.66663 7.91602 7.59932 7.91602 8.75038C7.91602 9.9006 8.84871 10.8333 9.99977 10.8333C11.15 10.8333 12.0827 9.9006 12.0827 8.75038Z"
            stroke="#130F26"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.99959 17.5C9.00086 17.5 3.75 13.2486 3.75 8.80274C3.75 5.3222 6.54758 2.5 9.99959 2.5C13.4516 2.5 16.25 5.3222 16.25 8.80274C16.25 13.2486 10.9983 17.5 9.99959 17.5Z"
            stroke="#130F26"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const UserIconOrder = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M13.9958 17.7037C8.96402 17.7037 4.66602 18.4971 4.66602 21.6704C4.66602 24.8449 8.93718 25.6662 13.9958 25.6662C19.0277 25.6662 23.3257 24.8741 23.3257 21.6996C23.3257 18.5251 19.0557 17.7037 13.9958 17.7037Z"
            fill="#130F26"
        />
        <path
            opacity="0.4"
            d="M13.9963 14.681C17.4239 14.681 20.1703 11.9335 20.1703 8.50701C20.1703 5.08051 17.4239 2.33301 13.9963 2.33301C10.5698 2.33301 7.82227 5.08051 7.82227 8.50701C7.82227 11.9335 10.5698 14.681 13.9963 14.681Z"
            fill="#130F26"
        />
    </svg>
);

export const ShoppingCartIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_513_725)">
            <path
                d="M16.6663 18.3333C17.1266 18.3333 17.4997 17.9602 17.4997 17.5C17.4997 17.0397 17.1266 16.6666 16.6663 16.6666C16.2061 16.6666 15.833 17.0397 15.833 17.5C15.833 17.9602 16.2061 18.3333 16.6663 18.3333Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.50033 18.3333C7.96056 18.3333 8.33366 17.9602 8.33366 17.5C8.33366 17.0397 7.96056 16.6666 7.50033 16.6666C7.04009 16.6666 6.66699 17.0397 6.66699 17.5C6.66699 17.9602 7.04009 18.3333 7.50033 18.3333Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M0.833008 0.833374H4.16634L6.39967 11.9917C6.47588 12.3754 6.6846 12.72 6.9893 12.9653C7.29399 13.2106 7.67526 13.3409 8.06634 13.3334H16.1663C16.5574 13.3409 16.9387 13.2106 17.2434 12.9653C17.5481 12.72 17.7568 12.3754 17.833 11.9917L19.1663 5.00004H4.99967"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_513_725">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export const BagOrderIcon = () => (
    <svg width="45" height="50" viewBox="0 0 45 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M44.7832 35.7868L42.8609 20.3002C41.6899 14.7741 38.3757 12.5 35.2161 12.5H9.82928C6.62555 12.5 3.20086 14.6149 2.2066 20.3002L0.262262 35.7868C-1.32856 47.1574 4.52654 50 12.1713 50H32.8962C40.5189 50 46.1972 45.8839 44.7832 35.7868ZM15.2425 25.3714C14.0222 25.3714 13.033 24.3533 13.033 23.0973C13.033 21.8414 14.0222 20.8232 15.2425 20.8232C16.4627 20.8232 17.452 21.8414 17.452 23.0973C17.452 24.3533 16.4627 25.3714 15.2425 25.3714ZM27.5051 23.0973C27.5051 24.3533 28.4943 25.3714 29.7145 25.3714C30.9348 25.3714 31.924 24.3533 31.924 23.0973C31.924 21.8414 30.9348 20.8232 29.7145 20.8232C28.4943 20.8232 27.5051 21.8414 27.5051 23.0973Z"
            fill="#BEC0CA"
        />
        <path
            opacity="0.4"
            d="M34.9347 11.9358C34.9425 12.1297 34.9053 12.3228 34.8258 12.5H31.233C31.1634 12.3199 31.1266 12.1288 31.1242 11.9358C31.1242 7.14206 27.2247 3.25596 22.4144 3.25596C17.6041 3.25596 13.7046 7.14206 13.7046 11.9358C13.7376 12.1224 13.7376 12.3134 13.7046 12.5H10.0247C9.99176 12.3134 9.99176 12.1224 10.0247 11.9358C10.3043 5.26477 15.8125 0 22.5124 0C29.2122 0 34.7204 5.26477 35 11.9358H34.9347Z"
            fill="#BEC0CA"
        />
    </svg>
);

export const DownloadCloudIcon = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="8" fill="#55615750" />
        <g clipPath="url(#clip0_342_7540)">
            <path
                d="M19.3337 19.3333L16.0003 16L12.667 19.3333"
                stroke="#1C1D22"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 16V23.5"
                stroke="#1C1D22"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M22.9919 21.3249C23.8047 20.8818 24.4467 20.1806 24.8168 19.3321C25.1868 18.4835 25.2637 17.5359 25.0354 16.6388C24.807 15.7417 24.2865 14.9462 23.5558 14.3778C22.8251 13.8094 21.9259 13.5005 21.0002 13.4999H19.9502C19.698 12.5243 19.2278 11.6185 18.5752 10.8507C17.9225 10.0829 17.1042 9.47311 16.182 9.06708C15.2597 8.66104 14.2573 8.46937 13.2503 8.50647C12.2433 8.54358 11.2578 8.80849 10.3679 9.28129C9.47795 9.7541 8.7068 10.4225 8.1124 11.2362C7.51799 12.05 7.11579 12.9879 6.93603 13.9794C6.75627 14.9709 6.80363 15.9903 7.07456 16.961C7.34548 17.9316 7.83291 18.8281 8.50021 19.5832"
                stroke="#1C1D22"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.3337 19.3333L16.0003 16L12.667 19.3333"
                stroke="#1C1D22"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_342_7540">
                <rect width="20" height="20" fill="white" transform="translate(6 6)" />
            </clipPath>
        </defs>
    </svg>
);
export const TrashIcon = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="32" height="32" rx="8" fill="#55615750" />
        <path
            d="M22.1042 13.8906C22.1042 13.8906 21.6517 19.5031 21.3892 21.8673C21.2642 22.9965 20.5667 23.6581 19.4242 23.679C17.25 23.7181 15.0733 23.7206 12.9 23.6748C11.8008 23.6523 11.115 22.9823 10.9925 21.8731C10.7283 19.4881 10.2783 13.8906 10.2783 13.8906"
            stroke="#130F26"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M23.2567 11.1999H9.125"
            stroke="#130F26"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M20.5335 11.2C19.8793 11.2 19.316 10.7375 19.1877 10.0966L18.9852 9.08331C18.8602 8.61581 18.4368 8.29248 17.9543 8.29248H14.4268C13.9443 8.29248 13.521 8.61581 13.396 9.08331L13.1935 10.0966C13.0652 10.7375 12.5018 11.2 11.8477 11.2"
            stroke="#130F26"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const UploadImageIcon: FC<MiIconoProps> = () => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_331_7227)">
                <path
                    d="M13.3337 13.3333L10.0003 10L6.66699 13.3333"
                    stroke="#5570F1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M10 10V17.5"
                    stroke="#5570F1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16.9919 15.3249C17.8047 14.8818 18.4467 14.1806 18.8168 13.3321C19.1868 12.4835 19.2637 11.5359 19.0354 10.6388C18.807 9.7417 18.2865 8.94616 17.5558 8.37778C16.8251 7.80939 15.9259 7.50052 15.0002 7.4999H13.9502C13.698 6.52427 13.2278 5.61852 12.5752 4.85073C11.9225 4.08295 11.1042 3.47311 10.182 3.06708C9.25967 2.66104 8.25734 2.46937 7.25031 2.50647C6.24328 2.54358 5.25777 2.80849 4.36786 3.28129C3.47795 3.7541 2.7068 4.42249 2.1124 5.23622C1.51799 6.04996 1.11579 6.98785 0.936028 7.9794C0.756269 8.97095 0.803632 9.99035 1.07456 10.961C1.34548 11.9316 1.83291 12.8281 2.50021 13.5832"
                    stroke="#5570F1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M13.3337 13.3333L10.0003 10L6.66699 13.3333"
                    stroke="#5570F1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_331_7227">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}


export const DownImageSnack: FC<MiIconoProps> = ({ filled, color }) => {
    return (
        <svg
            width="54"
            height="50"
            viewBox="0 0 54 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_104_41)">
                <path
                    d="M26.087 29.0318C23.587 29.0318 4.8791 25.0238 0.0870423 28.0318C-0.579624 34.6984 2.28704 48.5318 19.087 50.5318H48.087C45.5715 45.4375 37.587 37.0318 35.087 35.0318C32.587 33.0318 33.087 28.5318 35.087 26.0318C37.087 23.5318 41.587 24.0318 44.587 22.5318C47.587 21.0318 49.587 18.1318 49.587 14.5318C49.587 10.0318 46.087 4.53178 40.087 5.03178C34.087 5.53178 31.087 11.5318 31.587 14.5318C32.087 17.5318 35.087 22.0318 31.587 26.0318C28.087 30.0318 28.587 29.0318 26.087 29.0318Z"
                    fill={color ? color : "none"}
                />
                <circle cx="51.25" cy="32.25" r="2.25" />
                <circle cx="12.5" cy="5.5" r="5.5" fill={color ? color : "none"} />
            </g>
            <defs>
                <clipPath id="clip0_104_41">
                    <rect width="53.5" height="50.5318" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}




export const ErrorIconSnack: FC<MiIconoProps> = ({ filled, color, type }) => {
    return (
        <svg
            width="42"
            height="54"
            viewBox="0 0 42 54"
            fill={color ? color : "none"}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_103_88)">
                <path
                    d="M23.2563 38.6904C24.6205 39.3026 24.855 41.1407 23.6882 42.0757L14.6175 49.3448C13.3986 50.3216 11.5805 49.5867 11.3828 48.0372L9.8484 36.0091C9.65074 34.4597 11.2261 33.2919 12.6511 33.9314L23.2563 38.6904Z"
                    fill={color ? color : "none"}
                />
                <circle cx="21" cy="21" r="21" fill={color ? color : "none"} />

                {
                    type === "error" ?

                        <React.Fragment>
                            <path
                                d="M25 17L17 25"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M17 17L25 25"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </React.Fragment>
                        :
                        <path d="M27 16.5L18.75 24.75L15 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                }
            </g>
            <defs>
                <clipPath id="clip0_103_88">
                    <rect width="42" height="53.7175" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
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

export const ArticlesIcons: FC<MiIconoProps> = ({ filled, color }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M37.419 31.732C37.419 35.31 35.31 37.419 31.732 37.419H23.95C20.363 37.419 18.25 35.31 18.25 31.732V23.932C18.25 20.359 19.564 18.25 23.143 18.25H25.143C25.861 18.251 26.537 18.588 26.967 19.163L27.88 20.377C28.312 20.951 28.988 21.289 29.706 21.29H32.536C36.123 21.29 37.447 23.116 37.447 26.767L37.419 31.732Z"
                stroke={filled ? color ? color : "#FFFFFF" : color ? color : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M23.4814 30.4629H32.2164"
                stroke={filled ? color ? color : "#99A9F7" : color ? color : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export const CustomersIcon: FC<MiIconoProps> = ({ filled, strokeBold, color }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd" d="M25.591 31.2068C29.28 31.2068 32.433 31.7658 32.433 33.9988C32.433 36.2318 29.301 36.8068 25.591 36.8068C21.901 36.8068 18.749 36.2528 18.749 34.0188C18.749 31.7848 21.88 31.2068 25.591 31.2068Z"
                stroke={filled ? "#FFFFFF" : color ? color : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fill={filled ? "#99A9F7" : "transparent"}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.5911 28.0198C23.1691 28.0198 21.2051 26.0568 21.2051 23.6348C21.2051 21.2128 23.1691 19.2498 25.5911 19.2498C28.0121 19.2498 29.9761 21.2128 29.9761 23.6348C29.9851 26.0478 28.0351 28.0108 25.6221 28.0198H25.5911Z"
                stroke={filled ? "#99A9F7" : color ? color : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fill={filled ? "#99A9F7" : "transparent"}
                d="M32.4824 26.8815C34.0834 26.6565 35.3164 25.2825 35.3194 23.6195C35.3194 21.9805 34.1244 20.6205 32.5574 20.3635"
                stroke={filled ? "#99A9F7" : color ? color : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M34.5947 30.7322C36.1457 30.9632 37.2287 31.5072 37.2287 32.6272C37.2287 33.3982 36.7187 33.8982 35.8947 34.2112"
                stroke={filled ? "#FFFFFF" : color ? color : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    )
}

export const ShoppingBagIcon: FC<MiIconoProps> = ({ filled, strokeBold, color }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32.5134 37.4998H24.1655C21.0992 37.4998 18.7468 36.3922 19.415 31.9346L20.193 25.8934C20.6049 23.6691 22.0237 22.8179 23.2685 22.8179H33.447C34.7102 22.8179 36.0466 23.7332 36.5225 25.8934L37.3006 31.9346C37.8681 35.8888 35.5797 37.4998 32.5134 37.4998Z"
                stroke={filled ? "#FFFFFF" : color ? color : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M32.6502 22.5982C32.6502 20.2122 30.716 18.2779 28.3299 18.2779V18.2779C27.1809 18.273 26.0773 18.726 25.2631 19.5368C24.4489 20.3475 23.9912 21.4492 23.9912 22.5982V22.5982"
                stroke={filled ? "#99A9F7" : color ? color : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M31.296 27.1017H31.2502"
                stroke={filled ? "#99A9F7" : color ? color : "#53545C"}
                strokeWidth={strokeBold ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M25.4649 27.1017H25.4192"
                stroke={filled ? "#99A9F7" : color ? color : "#53545C"}
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

export const ProfileIcon: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28 31.2068C31.689 31.2068 34.842 31.7658 34.842 33.9988C34.842 36.2318 31.71 36.8068 28 36.8068C24.31 36.8068 21.158 36.2528 21.158 34.0188C21.158 31.7848 24.289 31.2068 28 31.2068Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28 28.0198C25.578 28.0198 23.614 26.0568 23.614 23.6348C23.614 21.2128 25.578 19.2498 28 19.2498C30.421 19.2498 32.385 21.2128 32.385 23.6348C32.394 26.0478 30.444 28.0108 28.031 28.0198H28Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={filled ? "#99A9F7" : "transparent"}
            />
        </svg>
    );
};

export const EmployeesIcon: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 31.2068C22.689 31.2068 24.842 31.7658 24.842 33.9988C24.842 36.2318 22.71 36.8068 20 36.8068C17.31 36.8068 15.158 36.2528 15.158 34.0188C15.158 31.7848 17.289 31.2068 20 31.2068Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 28.0198C17.578 28.0198 15.614 26.0568 15.614 23.6348C15.614 21.2128 17.578 19.2498 20 19.2498C22.421 19.2498 24.385 21.2128 24.385 23.6348C24.394 26.0478 22.444 28.0108 20.031 28.0198H20Z"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={filled ? "#99A9F7" : "transparent"}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M36 31.2068C38.689 31.2068 40.842 31.7658 40.842 33.9988C40.842 36.2318 38.71 36.8068 36 36.8068C33.31 36.8068 31.158 36.2528 31.158 34.0188C31.158 31.7848 33.289 31.2068 36 31.2068Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M36 28.0198C33.578 28.0198 31.614 26.0568 31.614 23.6348C31.614 21.2128 33.578 19.2498 36 19.2498C38.421 19.2498 40.385 21.2128 40.385 23.6348C40.394 26.0478 38.444 28.0108 36.031 28.0198H36Z"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={filled ? "#99A9F7" : "transparent"}
            />
        </svg>
    );
};

export const UserManagementIcon: FC<MiIconoProps> = ({ filled }) => {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill={filled ? "#FFFFFF" : "none"} xmlns="http://www.w3.org/2000/svg" cursor={"pointer"}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28 31.2068C31.689 31.2068 34.842 31.7658 34.842 33.9988C34.842 36.2318 31.71 36.8068 28 36.8068C24.31 36.8068 21.158 36.2528 21.158 34.0188C21.158 31.7848 24.289 31.2068 28 31.2068Z"
                stroke={filled ? "#FFFFFF" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28 28.0198C25.578 28.0198 23.614 26.0568 23.614 23.6348C23.614 21.2128 25.578 19.2498 28 19.2498C30.421 19.2498 32.385 21.2128 32.385 23.6348C32.394 26.0478 30.444 28.0108 28.031 28.0198H28Z"
                stroke={filled ? "#99A9F7" : "#53545C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={filled ? "#99A9F7" : "transparent"}
            />
            <circle cx="38" cy="20" r="8" fill={filled ? "#5570F1" : "#E3F2FD"} stroke={filled ? "#FFFFFF" : "#5570F1"} strokeWidth="1.5"/>
            <path d="M35 20L37 22L41 18" stroke={filled ? "#FFFFFF" : "#5570F1"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};