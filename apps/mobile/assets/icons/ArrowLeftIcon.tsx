import Svg, { Path, type SvgProps } from "react-native-svg";

const ArrowLeftIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="currentColor"
      d="m10 18-6-6 6-6 1.4 1.45L7.85 11H20v2H7.85l3.55 3.55L10 18Z"
    />
  </Svg>
);

export default ArrowLeftIcon;
