import type { PropsWithChildren } from "react";

import { BrandLogo } from "@/components/shared/branding/BrandLogo";

import { AuthBrandPanel } from "./AuthBrandPanel";

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh w-full overflow-hidden bg-elevation-fill-default-2">
      <AuthBrandPanel />

      <section className="m-4 flex w-full flex-1 flex-col rounded-sm bg-elevation-fill-default-1 lg:m-0 lg:rounded-none">
        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>

        <div className="flex justify-center pb-6 lg:hidden">
          <BrandLogo className="text-interactive-contained-primary-idle" />
        </div>
      </section>
    </div>
  );
}
