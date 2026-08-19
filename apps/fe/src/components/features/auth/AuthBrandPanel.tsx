import { Typography } from "@povio/ui";
import { useTranslation } from "react-i18next";

import { BrandLogo } from "@/components/shared/branding/BrandLogo";

export function AuthBrandPanel() {
  const { t } = useTranslation();

  return (
    <section className="relative hidden flex-1 overflow-hidden bg-elevation-fill-default-2 lg:flex lg:flex-col lg:justify-between">
      <div className="relative z-raised flex flex-col gap-1 px-16 pt-20 xl:px-24 xl:pt-24">
        <Typography
          as="p"
          className="text-text-default-2"
          size="title-3"
        >
          {t(($) => $.auth.wrapper.title)}
        </Typography>
        <Typography
          as="h1"
          className="text-text-default-2"
          size="title-1"
          variant="prominent-1"
        >
          {t(($) => $.auth.wrapper.description)}
        </Typography>
      </div>

      <BrandLogo className="absolute -right-12 top-10 text-[10rem] leading-none text-[#e1e9ee]" />

      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-auto w-full opacity-20"
        viewBox="0 0 760 390"
      >
        <path
          d="M0 245 80 202l62 22 98-85 92 77 68-45 76 53 84-113 74 95 126-50v234H0Z"
          fill="#006ab6"
        />
        <path
          d="m52 390 132-120 78 61 106-130 91 108 69-59 128 140Z"
          fill="#006ab6"
          opacity=".4"
        />
      </svg>

      <div className="relative z-raised flex flex-col items-center gap-3 pb-8">
        <BrandLogo className="text-interactive-contained-primary-idle" />
        <Typography
          as="span"
          className="text-text-default-2"
          size="body-4"
          variant="prominent-1"
        >
          {t(($) => $.auth.wrapper.watermark, { year: new Date().getFullYear() })}
        </Typography>
      </div>
    </section>
  );
}
