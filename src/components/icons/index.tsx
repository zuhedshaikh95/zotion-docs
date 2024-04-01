import React from "react";

interface DiamondIconProps {}

export const DiamondIcon: React.FC<DiamondIconProps> = ({}) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.84023 7.1842L4.76734 3.21844C5.3329 2.45219 6.22869 2 7.18106 2H16.8189C17.7713 2 18.6671 2.45219 19.2327 3.21844L22.1598 7.1842C22.9535 8.25957 22.9401 9.73033 22.1269 10.791L14.3808 20.8946C13.18 22.4609 10.82 22.4609 9.61918 20.8946L1.87314 10.791C1.05992 9.73033 1.0465 8.25957 1.84023 7.1842Z"
        fill="#6889FF"
      />
      <path
        d="M22.7458 9H1.2541C1.24684 8.36315 1.44181 7.72409 1.83994 7.18453L4.76729 3.21844C5.33285 2.45219 6.22864 2 7.18101 2H16.8189C17.7713 2 18.667 2.45219 19.2326 3.21844L22.1597 7.1842L22.1607 7.18557C22.5583 7.72491 22.7531 8.36356 22.7458 9Z"
        fill="#B6B2FF"
      />
    </svg>
  );
};

interface HomeIconProps {}

export const HomeIcon: React.FC<HomeIconProps> = ({}) => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 11.3361C2 10.4856 2.36096 9.67515 2.99311 9.10622L9.9931 2.80622C11.134 1.7794 12.866 1.7794 14.0069 2.80622L21.0069 9.10622C21.639 9.67515 22 10.4856 22 11.3361V19C22 20.6569 20.6569 22 19 22H16L15.9944 22H8.00558L8 22H5C3.34315 22 2 20.6569 2 19V11.3361Z"
        className={`dark:fill-[#2B2939] fill-[#D3D3D3] text-xl transition-all group-hover/native:fill-washed-purple-400`}
      />
      <path
        d="M9 16C9 14.8954 9.89543 14 11 14H13C14.1046 14 15 14.8954 15 16V22H9V16Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
    </svg>
  );
};

interface MarketPlaceIconProps {}

export const MarketPlaceIcon: React.FC<MarketPlaceIconProps> = ({}) => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.67151 8.6279C3.85917 7.12661 5.13538 6 6.64835 6H17.3517C18.8646 6 20.1408 7.12661 20.3285 8.6279L21.5785 18.6279C21.8023 20.4185 20.4061 22 18.6017 22H5.39835C3.59385 22 2.19769 20.4185 2.42151 18.6279L3.67151 8.6279Z"
        className={`dark:fill-[#2B2939] fill-[#D3D3D3] text-xl transition-all group-hover/native:fill-washed-purple-400`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V8C16 8.55228 15.5523 9 15 9C14.4477 9 14 8.55228 14 8V6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6V8C10 8.55228 9.55228 9 9 9C8.44772 9 8 8.55228 8 8V6Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
    </svg>
  );
};

interface MessageIconProps {}

export const MessageIcon: React.FC<MessageIconProps> = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="3"
        className={`dark:fill-[#2B2939] fill-[#D3D3D3] text-xl transition-all group-hover/native:fill-washed-purple-400`}
      />
      <path
        d="M10.91 12.2915L2 6.5C2 5.11929 3.11929 4 4.5 4H19.5C20.8807 4 22 5.11929 22 6.5L13.09 12.2915C12.4272 12.7223 11.5728 12.7223 10.91 12.2915Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
    </svg>
  );
};

interface PageIconProps {}

export const PageIcon: React.FC<PageIconProps> = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 5C3 3.34315 4.34315 2 6 2H15.7574C16.553 2 17.3161 2.31607 17.8787 2.87868L20.1213 5.12132C20.6839 5.68393 21 6.44699 21 7.24264V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5Z"
        className={`dark:fill-[#2B2939] fill-[#D3D3D3] text-xl transition-all group-hover/native:fill-washed-purple-400`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 11C7 10.4477 7.44772 10 8 10H16C16.5523 10 17 10.4477 17 11C17 11.5523 16.5523 12 16 12H8C7.44772 12 7 11.5523 7 11Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 15C7 14.4477 7.44772 14 8 14H12C12.5523 14 13 14.4477 13 15C13 15.5523 12.5523 16 12 16H8C7.44772 16 7 15.5523 7 15Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
      <path
        d="M17.7071 2.70711L20.2929 5.29289C20.7456 5.74565 21 6.35971 21 7H18C16.8954 7 16 6.10457 16 5V2C16.6403 2 17.2544 2.25435 17.7071 2.70711Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
    </svg>
  );
};

interface ProfileIconProps {}

export const ProfileIcon: React.FC<ProfileIconProps> = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="12"
        cy="7"
        r="5"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
      <path
        d="M3 19V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V19C21 16.2386 18.7614 14 16 14H8C5.23858 14 3 16.2386 3 19Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
        fillOpacity="0.827451"
      />
    </svg>
  );
};

interface SettingsIconProps {}

export const SettingsIcon: React.FC<SettingsIconProps> = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.99243 4.78709C8.49594 4.50673 8.91192 4.07694 9.09416 3.53021L9.48171 2.36754C9.75394 1.55086 10.5182 1 11.3791 1H12.621C13.4819 1 14.2462 1.55086 14.5184 2.36754L14.906 3.53021C15.0882 4.07694 15.5042 4.50673 16.0077 4.78709C16.086 4.83069 16.1635 4.87553 16.2403 4.92159C16.7349 5.21857 17.3158 5.36438 17.8811 5.2487L19.0828 5.00279C19.9262 4.8302 20.7854 5.21666 21.2158 5.96218L21.8368 7.03775C22.2672 7.78328 22.1723 8.72059 21.6012 9.36469L20.7862 10.2838C20.4043 10.7144 20.2392 11.2888 20.2483 11.8644C20.2498 11.9548 20.2498 12.0452 20.2483 12.1356C20.2392 12.7111 20.4043 13.2855 20.7862 13.7162L21.6012 14.6352C22.1723 15.2793 22.2672 16.2167 21.8368 16.9622L21.2158 18.0378C20.7854 18.7833 19.9262 19.1697 19.0828 18.9971L17.8812 18.7512C17.3159 18.6356 16.735 18.7814 16.2403 19.0784C16.1636 19.1244 16.086 19.1693 16.0077 19.2129C15.5042 19.4933 15.0882 19.9231 14.906 20.4698L14.5184 21.6325C14.2462 22.4491 13.4819 23 12.621 23H11.3791C10.5182 23 9.75394 22.4491 9.48171 21.6325L9.09416 20.4698C8.91192 19.9231 8.49594 19.4933 7.99243 19.2129C7.91409 19.1693 7.83654 19.1244 7.7598 19.0784C7.2651 18.7814 6.68424 18.6356 6.11895 18.7512L4.91726 18.9971C4.07387 19.1697 3.21468 18.7833 2.78425 18.0378L2.16326 16.9622C1.73283 16.2167 1.82775 15.2793 2.39891 14.6352L3.21393 13.7161C3.59585 13.2854 3.7609 12.7111 3.75179 12.1355C3.75035 12.0452 3.75035 11.9548 3.75179 11.8644C3.76091 11.2889 3.59585 10.7145 3.21394 10.2838L2.39891 9.36469C1.82775 8.72059 1.73283 7.78328 2.16326 7.03775L2.78425 5.96218C3.21468 5.21665 4.07387 4.8302 4.91726 5.00278L6.11903 5.24871C6.68431 5.36439 7.26517 5.21857 7.75986 4.9216C7.83658 4.87554 7.91411 4.83069 7.99243 4.78709Z"
        className={`dark:fill-[#2B2939] fill-[#D3D3D3] text-xl transition-all group-hover/native:fill-washed-purple-400`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
    </svg>
  );
};

interface TemplateIconProps {}

export const TemplateIcon: React.FC<TemplateIconProps> = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.12132 2.87868C5.68393 2.31607 6.44699 2 7.24264 2H16.7574C17.553 2 18.3161 2.31607 18.8787 2.87868L21.2164 5.21639C21.7181 5.71813 22 6.39863 22 7.10819V7.10819C22 7.60072 21.6007 8 21.1082 8H2.89181C2.39928 8 2 7.60072 2 7.10819V7.10819C2 6.39863 2.28187 5.71813 2.78361 5.21639L5.12132 2.87868Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
      <path
        d="M2 7C2 6.44772 2.44772 6 3 6H21C21.5523 6 22 6.44772 22 7V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V7Z"
        className={`dark:fill-[#2B2939] fill-[#D3D3D3] text-xl transition-all group-hover/native:fill-washed-purple-400`}
      />
      <path
        d="M13.002 10.9996C13.002 10.4473 12.5542 9.99957 12.002 9.99957C11.4497 9.99957 11.002 10.4473 11.002 10.9996V15.0859L10.2071 14.291C9.81658 13.9005 9.18342 13.9005 8.79289 14.291C8.40237 14.6816 8.40237 15.3147 8.79289 15.7052L10.5877 17.5C11.3687 18.2811 12.635 18.2811 13.4161 17.5L15.2071 15.709C15.5976 15.3185 15.5976 14.6853 15.2071 14.2948C14.8166 13.9043 14.1834 13.9043 13.7929 14.2948L13.002 15.0858V10.9996Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
    </svg>
  );
};

interface TrashIconProps {}

export const TrashIcon: React.FC<TrashIconProps> = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 7H20V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7Z"
        className={`dark:fill-[#2B2939] fill-[#D3D3D3] text-xl transition-all group-hover/native:fill-washed-purple-400`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 10C9.55228 10 10 10.4477 10 11V18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18V11C8 10.4477 8.44772 10 9 10Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 10C15.5523 10 16 10.4477 16 11V18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18V11C14 10.4477 14.4477 10 15 10Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 5C7 3.34315 8.34315 2 10 2H14C15.6569 2 17 3.34315 17 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5H7ZM10 4H14C14.5523 4 15 4.44772 15 5H9C9 4.44772 9.44772 4 10 4Z"
        className={`dark:fill-[#817EB5]  fill-Neutrals/neutrals-7 transition-all group-hover/native:fill-washed-blue-500`}
      />
    </svg>
  );
};
