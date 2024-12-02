import React from 'react';

type SearchIconProps = {
  size?: number;
  stroke?: string;
};

const SearchIcon = ({ size, stroke }: SearchIconProps) => {
  return (
    <svg
      width={size || 23}
      height={size || 23}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.125 20.125L15.8259 15.8183L20.125 20.125ZM18.2084 10.0625C18.2084 12.2229 17.3501 14.2948 15.8225 15.8225C14.2949 17.3501 12.2229 18.2083 10.0625 18.2083C7.90211 18.2083 5.83019 17.3501 4.30255 15.8225C2.77491 14.2948 1.91669 12.2229 1.91669 10.0625C1.91669 7.9021 2.77491 5.83017 4.30255 4.30253C5.83019 2.77489 7.90211 1.91667 10.0625 1.91667C12.2229 1.91667 14.2949 2.77489 15.8225 4.30253C17.3501 5.83017 18.2084 7.9021 18.2084 10.0625V10.0625Z"
        stroke={stroke || '#B3B3B3'}
        stroke-width="1.91667"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default SearchIcon;
