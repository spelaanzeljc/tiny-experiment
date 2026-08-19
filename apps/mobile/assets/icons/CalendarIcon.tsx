import Svg, { Path, type SvgProps } from "react-native-svg";

const CalendarIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.5 2.91a.905.905 0 0 0-.9-.91c-.497 0-.9.407-.9.91v.908H9.3V2.91A.905.905 0 0 0 8.4 2c-.497 0-.9.407-.9.91v.908H5.7C4.209 3.818 3 5.04 3 6.545v12.728C3 20.779 4.209 22 5.7 22h12.6c1.491 0 2.7-1.221 2.7-2.727V6.545c0-1.506-1.209-2.727-2.7-2.727h-1.8V2.91Zm2.7 6.363V6.545a.905.905 0 0 0-.9-.909h-1.8v.91c0 .502-.403.909-.9.909a.905.905 0 0 1-.9-.91v-.909H9.3v.91c0 .502-.403.909-.9.909a.905.905 0 0 1-.9-.91v-.909H5.7c-.497 0-.9.407-.9.91v2.727h14.4ZM4.8 11.09h14.4v8.182c0 .502-.403.909-.9.909H5.7a.905.905 0 0 1-.9-.91v-8.181Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default CalendarIcon;
