import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const handleQuery = useCallback((name: string, value: string) => {
    params.set(name, value);
    router.push(pathname + "?" + params.toString());
  }, []);
  const handleDeleteQuery = useCallback((name: string) => {
    params.delete(name);
    router.push(pathname + "?" + params.toString());
  }, []);

  return {
    params,
    handleQuery,
    handleDeleteQuery,
  };
};

export default useQueryParams;
