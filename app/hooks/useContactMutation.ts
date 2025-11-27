import { usePostMutationBase } from "../core/mutationBase";
import { AxiosResponse } from "axios";
import { IContactForm } from "../type/model";

export const useContactMutation = (options?: {
  onSuccess?: (data: AxiosResponse<IContactForm>, variables: IContactForm) => unknown;
  onError?: (err: unknown) => unknown;
}) => {
  const { onSuccess, onError } = options || {};

  return usePostMutationBase<IContactForm>({
    url: "/api/contact",
    onSuccess,
    config: undefined,
  });
};

export default useContactMutation;
