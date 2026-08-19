import { clsx } from "clsx";

export const uiOutlineClass = clsx(
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2",
  "has-focus-visible:outline has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-offset-2",
);

export const uiGroupOutlineClass = clsx(
  "group-focus:outline-none group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-solid group-focus-visible:outline-offset-2",
);
