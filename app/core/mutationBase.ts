import { useMutation } from "@tanstack/react-query";
import { post, put, remove } from "../core/api";
import { AxiosResponse } from "axios";

// POST mutation base
export const usePostMutationBase = <T>(options: {
  url: string;
  config?: object;
  onSuccess?: (data: AxiosResponse<T>, variables: T) => unknown;
}) => {
  const { url, config, onSuccess } = options;
  return useMutation<AxiosResponse<T>, unknown, T>({
    mutationFn: (data: T) => post<T>(url, data, config),
    onSuccess,
  });
};

// PUT mutation base
export const usePutMutationBase = <T>(options: {
  url: string | ((id: string) => string);
  config?: object;
  onSuccess?: (
    data: AxiosResponse<T>,
    variables: { data: T; id?: string }
  ) => unknown;
}) => {
  const { url, config, onSuccess } = options;
  return useMutation<AxiosResponse<T>, unknown, { data: T; id?: string }>({
    mutationFn: async ({ data, id }) =>
      put<T>(typeof url === "string" ? url : url(id || ""), data, config),
    onSuccess,
  });
};

// DELETE mutation base
export const useDeleteMutationBase = <T = unknown>(options: {
  url: string | ((id: string) => string);
  config?: object;
  onSuccess?: (
    data: AxiosResponse<T>,
    variables: string | undefined
  ) => unknown;
}) => {
  const { url, config, onSuccess } = options;
  return useMutation<AxiosResponse<T>, unknown, string | undefined>({
    mutationFn: async (id?: string) =>
      remove<T>(typeof url === "string" ? url : url(id || ""), config),
    onSuccess,
  });
};
