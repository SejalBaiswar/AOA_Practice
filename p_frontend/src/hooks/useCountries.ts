import axios from "axios";
import { useEffect, useState } from "react";
 
 
interface RestCountry {
  name: {
    common: string;
  };
}
 
export function useCountries(): string[] {
  const [countries, setCountries] = useState<string[]>([]);
 
  useEffect(() => {
    axios
      .get<RestCountry[]>(
        "https://restcountries.com/v3.1/all?fields=name"
      )
      .then((res) => {
        const list = res.data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
 
        setCountries(list);
      })
      .catch(() => setCountries([]));
  }, []);
 
  return countries;
}