/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minWidth:{
        'app':'510px'
      },
      colors: {
        transparent: 'tranparent',
        // Gray
        'gray-100': '#F7F7FA',
        'gray-200': '#F0F0F5',
        'gray-300': '#E1E1E8',
        'gray-400': '#CDCED6',
        'gray-500': '#A9ABB8',
        'gray-600': '#858899',
        'gray-700': '#3E404C',
        'gray-800': '#2B2D36',

        // Blue
        'blue-100': '#F5FBFF',
        'blue-200': '#DCEAFE',
        'blue-300': '#CAE0FF',
        'blue-400': '#97BFFC',
        'blue-500': '#7DABF8',
        'blue-600': '#3D4EAC',

        // Alert
        'red-100': '#FFF2F2',
        'red-200': '#F5535E',
        'red-300': '#D91C29',
        'green-100': '#EBF8F5',
        'green-200': '#00A881',
        'green-300': '#08785E',

        // Calender
        'spring-100': '#FFEFEF',
        'spring-200': '#FFBFCD',
        'spring-300': '#FF83AF',
        'summer-100': '#DBF0F7',
        'summer-200': '#76C1DE',
        'summer-300': '#507EC3',
        'autumn-100': '#FFF3DC',
        'autumn-200': '#F8C37F',
        'autumn-300': '#F2914A',
        'winter-100': '#EAE8F5',
        'winter-200': '#96A0D1',
        'winter-300': '#50659C',

        //Album
        'album-100': '#F4E2DC',
        'album-200': '#F3D1B2',
        'album-300': '#F7F0D5',
        'album-400': '#BFDAAB',
        'album-500': '#C5DFE6',
        'album-600': '#B3C6E3',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem", // 16px
          sm: "2rem", // 32px
          md: "3rem", // 48px
          lg: "6rem",
          xl: "150px",
          // "2xl": "150px", // 이것도 할 건가요?
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          // "2xl": "1536px", // 이것도 할 건가요?
        },
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        stunning: ["STUNNING", "sans-serif"],
      },
      fontSize: {
        // Desktop (lg)
        "h1-lg": [ // 추억보관함, 나의 폰트, 편지쓰기 등 페이지 이름
          "38px",
          {
            lineHeight: "57px",
            letterSpacing: "-0.4px",
            // fontWeight: "700",
          },
        ],
        "h2-lg": [ // 추억방울 만들기, 나의 폰트 만들기 등 컨텐츠 안에 제목
          "32px",
          {
            lineHeight: "48px",
            letterSpacing: "-0.3px",
            // fontWeight: "700",
          },
        ],
        "h3-lg": [ // 메인-앨범 작은 제목, 모달 제목, 막내아들 글씨체 (컨텐츠 강조), 달력 년월, 편지 to/from
          "24px",
          {
            lineHeight: "36px",
            letterSpacing: "-0.3px",
            // fontWeight: "700",
          },
        ],
        "h4-lg": [ // 사진 엽서 보낸이, 카센트 보낸이
          "20px",
          {
            lineHeight: "30px",
            letterSpacing: "-0.2px",
            // fontWeight: "700",
          },
        ],
        "h5-lg": [ // 달력 요일
          "18px",
          {
            lineHeight: "27px",
            letterSpacing: "-0.1px",
            // fontWeight: "700",
          },
        ],
        "subtitle-1-lg": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.1px",
            // fontWeight: "500",
          },
        ],
        "subtitle-2-lg": [
          "14px",
          {
            lineHeight: "22px",
            letterSpacing: "-0.1px",
            // fontWeight: "500",
          },
        ],
        "subtitle-3-lg": [
          "12px",
          {
            lineHeight: "18px",
            letterSpacing: "-0.1px",
            // fontWeight: "500",
          },
        ],
        "lg-lg": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.1px",
            // fontWeight: "400",
          },
        ],
        "p-lg": [
          "14px",
          {
            lineHeight: "22px",
            letterSpacing: "-0.1px",
            // fontWeight: "400",
          },
        ],
        "sm-lg": [
          "12px",
          {
            lineHeight: "18px",
            letterSpacing: "-0.1px",
            // fontWeight: "400",
          },
        ],
        "h-logo-lg": [ // 헤더에 로고
          "20px",
          {
            lineHeight: "30px",
            letterSpacing: "-0.4px",
            // fontWeight: "800",
          },
        ],
        "album-1-lg": [
          "180px",
          {
            lineHeight: "238px",
            letterSpacing: "-2px",
            // fontWeight: "400",
          },
        ],
        "album-2-lg": [
          "160px",
          {
            lineHeight: "249px",
            letterSpacing: "-0.4px",
            // fontWeight: "400",
          },
        ],
        "album-3-lg": [
          "140px",
          {
            lineHeight: "264px",
            letterSpacing: "-0.4px",
            // fontWeight: "400",
          },
        ],

        // Tablet (md)
        "h1-md": [
          "32px",
          {
            lineHeight: "48px",
            letterSpacing: "-0.4px",
          },
        ],
        "h2-md": [
          "28px",
          {
            lineHeight: "42px",
            letterSpacing: "-0.3px",
          },
        ],
        "h3-md": [
          "22px",
          {
            lineHeight: "33px",
            letterSpacing: "-0.3px",
          },
        ],
        "h4-md": [
          "18px",
          {
            lineHeight: "27px",
            letterSpacing: "-0.2px",
          },
        ],
        "h5-md": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.1px",
          },
        ],
        "subtitle-1-md": [
          "15px",
          {
            lineHeight: "23px",
            letterSpacing: "-0.1px",
          },
        ],
        "subtitle-2-md": [
          "14px",
          {
            lineHeight: "21px",
            letterSpacing: "-0.1px",
          },
        ],
        "subtitle-3-md": [
          "12px",
          {
            lineHeight: "18px",
            letterSpacing: "-0.1px",
          },
        ],
        "lg-md": [
          "15px",
          {
            lineHeight: "23px",
            letterSpacing: "-0.1px",
          },
        ],
        "p-md": [
          "14px",
          {
            lineHeight: "21px",
            letterSpacing: "-0.1px",
          },
        ],
        "sm-md": [
          "12px",
          {
            lineHeight: "18px",
            letterSpacing: "-0.1px",
          },
        ],
        "h-logo-md": [
          "18px",
          {
            lineHeight: "27px",
            letterSpacing: "-0.4px",
          },
        ],
        "album-1-md": [
          "150px",
          {
            lineHeight: "160px",
            letterSpacing: "-0.4px",
          },
        ],
        "album-2-md": [
          "130px",
          {
            lineHeight: "150px",
            letterSpacing: "-0.4px",
          },
        ],
        "album-3-md": [
          "110px",
          {
            lineHeight: "140px",
            letterSpacing: "-0.4px",
          },
        ],

        // Mobile (sm)
        "h1-sm": [
          "28px",
          {
            lineHeight: "42px",
            letterSpacing: "-0.4px",
          },
        ],
        "h2-sm": [
          "24px",
          {
            lineHeight: "36px",
            letterSpacing: "-0.3px",
          },
        ],
        "h3-sm": [
          "20px",
          {
            lineHeight: "30px",
            letterSpacing: "-0.3px",
          },
        ],
        "h4-sm": [
          "18px",
          {
            lineHeight: "27px",
            letterSpacing: "-0.2px",
          },
        ],
        "h5-sm": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.1px",
          },
        ],
        "subtitle-1-sm": [
          "15px",
          {
            lineHeight: "23px",
            letterSpacing: "-0.1px",
          },
        ],
        "subtitle-2-sm": [
          "13px",
          {
            lineHeight: "20px",
            letterSpacing: "-0.1px",
          },
        ],
        "subtitle-3-sm": [
          "11px",
          {
            lineHeight: "17px",
            letterSpacing: "-0.1px",
          },
        ],
        "lg-sm": [
          "14px",
          {
            lineHeight: "21px",
            letterSpacing: "-0.1px",
          },
        ],
        "p-sm": [
          "13px",
          {
            lineHeight: "20px",
            letterSpacing: "-0.1px",
          },
        ],
        "sm-sm": [
          "11px",
          {
            lineHeight: "17px",
            letterSpacing: "-0.1px",
          },
        ],
        "h-logo-sm": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.4px",
          },
        ],
        // 모바일 버전에서 album font 사용 x
      },
      fontWeight: {
        "p-700": "700", // h1~h5였음
        'p-500': "500", // medium, subtitle
        'p-400': "400", // regular, preg
        'p-800': "800", // 로고, 메인 페이지 큰 글자
      },
      boxShadow: {
        'sm': '0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.2)',
        'md': '0 0.125rem 0.625rem rgba(0, 0, 0, 0.2)',
        'lg': '0 0.25rem 1rem rgba(0, 0, 0, 0.2)',
        'xl': '0 1rem 2rem rgba(0, 0, 0, 0.2)',
      },

      animation: {
        'drift': 'drift 7000ms infinite linear',
        'drift-fast': 'drift 3000ms infinite linear',
        'drift-slow': 'drift 7500ms infinite linear',
      },
      keyframes: {
        drift: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};