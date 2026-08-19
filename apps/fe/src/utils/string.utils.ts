export namespace StringUtils {
  export function emptyToUndefined(value: string | null | undefined): string | undefined {
    return value || undefined;
  }
}
