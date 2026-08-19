import Svg, { Path, type SvgProps } from "react-native-svg";

const SendIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M5.105 7.59c-1.092-1.712.764-3.774 2.58-2.866l10.973 5.487c1.474.737 1.474 2.84 0 3.578L7.685 19.275c-1.816.908-3.672-1.154-2.58-2.865L7.92 12 5.105 7.59ZM17.764 12 6.79 6.513l2.815 4.41a2 2 0 0 1 0 2.153l-2.815 4.41L17.764 12Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default SendIcon;
