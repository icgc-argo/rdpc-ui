import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const useUrlQueryState = (
  key: string,
): [x: string, y: (x: string) => string] => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const param = searchParams.get(key) || "";

  const createURL = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);

      return pathname + "?" + params.toString();
    },
    [searchParams, pathname],
  );

  return [param, createURL];
};

export default useUrlQueryState;
