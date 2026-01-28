import axios from "axios";
import { useEffect, useState } from "react";
 
/* ---------- TYPES ---------- */
 
export interface CountryCodeOption {
  label: string; // e.g. "India (+91)"
  value: string; // e.g. "+91"
}
 
interface RestCountry {
  name: {
    common: string;
  };
  idd?: {
    root?: string;
    suffixes?: string[];
  };
}
 
/* ---------- HOOK ---------- */
 
export function useCountryCodes(): CountryCodeOption[] {
  const [codes, setCodes] = useState<CountryCodeOption[]>([]);
 
  useEffect(() => {
    axios
      .get<RestCountry[]>(
        "https://restcountries.com/v3.1/all?fields=name,idd"
      )
      .then((res) => {
        const list: CountryCodeOption[] = res.data
          .flatMap((c): CountryCodeOption[] => {
            const root = c.idd?.root;
            const suffix = c.idd?.suffixes?.[0] ?? "";
 
            if (!root) return [];
 
            const code = `${root}${suffix}`;
 
            return [
              {
                label: `${c.name.common} (${code})`,
                value: code,
              },
            ];
          })
          .sort((a, b) => a.label.localeCompare(b.label));
 
        setCodes(list);
      })
      .catch(() => {
        setCodes([]);
      });
  }, []);
 
  return codes;
}
 
 