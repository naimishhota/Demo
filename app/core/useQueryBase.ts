import { useQuery } from "@tanstack/react-query";
import { get } from "../core/api";

export const useQueryBase = <T>({
  url,
  key,
  params,
  enabled = true,
  refetchInterval,
  refetchOnWindowFocus = true,
}: {
  url: string;
  key: string;
  params?: object;
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}) =>
  useQuery({
    queryKey: [key, url, params],
    queryFn: async () => await get<T>(url, params),
    enabled,
    refetchInterval,
    refetchOnWindowFocus,
  });
