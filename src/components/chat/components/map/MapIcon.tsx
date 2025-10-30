import React from "react";
import { motion } from "motion/react";

interface MapIconProps {
  size?: number;
  className?: string;
  show: boolean;
}

export const MapIcon: React.FC<MapIconProps> = ({
  size = 98,
  className,
  show,
}) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 98 98"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} relative`}
      >
        <g filter="url(#filter0_d_7_56)">
          <mask
            id="path-1-outside-1_7_56"
            maskUnits="userSpaceOnUse"
            x="4"
            y="0"
            width="90"
            height="90"
            fill="black"
          >
            <rect fill="white" x="4" width="90" height="90" />
            <path d="M79 2C86.1797 2 92 7.8203 92 15V75C92 82.1797 86.1797 88 79 88H19C11.9326 88 6.18208 82.3604 6.00391 75.3359L6 75V15C6 7.8203 11.8203 2 19 2H79Z" />
          </mask>
          <path
            d="M79 2C86.1797 2 92 7.8203 92 15V75C92 82.1797 86.1797 88 79 88H19C11.9326 88 6.18208 82.3604 6.00391 75.3359L6 75V15C6 7.8203 11.8203 2 19 2H79Z"
            fill="#8BF565"
          />
          <path
            d="M92 15L94 15V15L92 15ZM79 88L79 90H79L79 88ZM6.00391 75.3359L4.00404 75.3592L4.0042 75.3729L4.00455 75.3867L6.00391 75.3359ZM6 75H4V75.0116L4.00014 75.0233L6 75ZM19 2L19 0L19 0L19 2ZM79 2V4C85.0751 4 90 8.92487 90 15L92 15L94 15C94 6.71573 87.2843 0 79 0V2ZM92 15H90V75H92H94V15H92ZM92 75H90C90 81.0751 85.0751 86 79 86L79 88L79 90C87.2843 90 94 83.2843 94 75H92ZM79 88V86H19V88V90H79V88ZM19 88V86C13.0201 86 8.154 81.2279 8.00326 75.2852L6.00391 75.3359L4.00455 75.3867C4.21016 83.4929 10.8451 90 19 90V88ZM6.00391 75.3359L8.00377 75.3127L7.99986 74.9767L6 75L4.00014 75.0233L4.00404 75.3592L6.00391 75.3359ZM6 75H8V15H6H4V75H6ZM6 15H8C8 8.92487 12.9249 4 19 4L19 2L19 0C10.7157 3.34518e-07 4 6.71573 4 15H6ZM19 2V4H79V2V0H19V2Z"
            fill="white"
            mask="url(#path-1-outside-1_7_56)"
          />
        </g>
        <rect x="30" y="2" width="13" height="86" fill="white" />
        <rect
          x="27"
          y="43.3153"
          width="13"
          height="73.914"
          transform="rotate(-52.5124 27 43.3153)"
          fill="white"
        />
        <rect
          x="5"
          y="50.9991"
          width="13"
          height="31.6679"
          transform="rotate(-89.3274 5 50.9991)"
          fill="white"
        />
        <mask
          id="path-6-outside-2_7_56"
          maskUnits="userSpaceOnUse"
          x="70"
          y="0"
          width="24"
          height="31"
          fill="black"
        >
          <rect fill="white" x="70" width="24" height="31" />
          <path d="M80 2C86.6274 2 92 7.37258 92 14V27.75C90.25 28.5529 88.318 28.9999 86.2861 29C78.3964 29 72 22.2843 72 14C72 9.09328 74.2438 4.73669 77.7129 2H80Z" />
        </mask>
        {show && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: 0.1,
            }}
          >
            <path
              d="M80 2C86.6274 2 92 7.37258 92 14V27.75C90.25 28.5529 88.318 28.9999 86.2861 29C78.3964 29 72 22.2843 72 14C72 9.09328 74.2438 4.73669 77.7129 2H80Z"
              fill="#FF3D3D"
            />
            <path
              d="M92 14L94 14V14L92 14ZM92 27.75L92.8341 29.5678L94 29.0328V27.75H92ZM86.2861 29L86.2861 31L86.2862 31L86.2861 29ZM77.7129 2V0H77.019L76.4742 0.429782L77.7129 2ZM80 2V4C85.5228 4 90 8.47715 90 14L92 14L94 14C94 6.26801 87.732 0 80 0V2ZM92 14H90V27.75H92H94V14H92ZM92 27.75L91.1659 25.9322C89.6694 26.6189 88.0211 26.9999 86.2861 27L86.2861 29L86.2862 31C88.6149 30.9999 90.8307 30.487 92.8341 29.5678L92 27.75ZM86.2861 29V27C79.5917 27 74 21.2727 74 14H72H70C70 23.2958 77.201 31 86.2861 31V29ZM72 14H74C74 9.70952 75.9602 5.93007 78.9516 3.57022L77.7129 2L76.4742 0.429782C72.5274 3.54332 70 8.47704 70 14H72ZM77.7129 2V4H80V2V0H77.7129V2Z"
              fill="white"
              mask="url(#path-6-outside-2_7_56)"
            />
          </motion.g>
        )}
        <rect
          x="32"
          y="2"
          width="9"
          height="63"
          fill="url(#paint0_linear_7_56)"
        />
        <g filter="url(#filter1_d_7_56)">
          <circle
            cx="36.5"
            cy="71.5"
            r="10.5"
            fill="url(#paint1_radial_7_56)"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M41.8831 74.8665L36.6858 72.7815L36.5002 72.7073L36.3137 72.7815L31.1165 74.8655L36.5002 65.8938L41.8831 74.8665Z"
            fill="white"
            stroke="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_7_56"
            x="0"
            y="0"
            width="98"
            height="98"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_7_56"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_7_56"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_d_7_56"
            x="21"
            y="60"
            width="31"
            height="31"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_7_56"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_7_56"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_7_56"
            x1="36.5"
            y1="2"
            x2="36.5"
            y2="65"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0288462" stopColor="#52B2F7" />
            <stop offset="1" stopColor="#4596D0" />
          </linearGradient>
          <radialGradient
            id="paint1_radial_7_56"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(36.5 71.5) rotate(90) scale(9.5)"
          >
            <stop stopColor="#306991" />
            <stop offset="1" stopColor="#52B2F7" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};
