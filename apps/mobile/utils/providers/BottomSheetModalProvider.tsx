import { BottomSheetModalProvider as BaseBottomSheetModalProvider } from "@gorhom/bottom-sheet";
import type { PropsWithChildren } from "react";

export default function BottomSheetModalProvider(props: PropsWithChildren) {
  return <BaseBottomSheetModalProvider>{props.children}</BaseBottomSheetModalProvider>;
}
