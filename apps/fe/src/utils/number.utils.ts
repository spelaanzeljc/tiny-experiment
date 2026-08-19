export namespace NumberUtils {
  export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(undefined, options).format(value);
  }

  export function formatInteger(value: number, options?: Intl.NumberFormatOptions): string {
    return formatNumber(value, {
      maximumFractionDigits: 0,
      ...options,
    });
  }
}
