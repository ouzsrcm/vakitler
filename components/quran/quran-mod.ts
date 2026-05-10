export type QuranMod = "dinle" | "oku" | "notlar";

export function parseQuranMod(value: unknown): QuranMod {
  const v = Array.isArray(value) ? value[0] : value;
  if (v === "oku" || v === "notlar" || v === "dinle") {
    return v;
  }
  return "dinle";
}
