import { useTheme } from "@shopify/restyle";

import type { Theme } from "@povio/rn-ui";

const useAppTheme = () => {
  return useTheme<Theme>();
};

export default useAppTheme;
