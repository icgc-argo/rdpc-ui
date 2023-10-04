import { useSearchParams } from "next/navigation";

const useUrlQueryState = (key: string): [x: string] => {
  const searchParams = useSearchParams();

  const param = searchParams.get(key) || "";

  return [param];
};

export default useUrlQueryState;
