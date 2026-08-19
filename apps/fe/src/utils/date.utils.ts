import { DateUtils as PovioDateUtils } from "@povio/ui";

export namespace DateUtils {
  export const parseDate = (date: string | Date): Date => (typeof date === "string" ? new Date(date) : date);

  export const formatDate = (date: string | Date, format = "dd/MM/yyyy") => {
    const parsedDate = parseDate(date);

    return PovioDateUtils.formatDate(parsedDate, format);
  };

  export const formatDateTime = (date: string | Date, format = "dd/MM/yyyy HH:mm") => {
    const parsedDate = parseDate(date);

    return PovioDateUtils.formatDate(parsedDate, format);
  };
}
