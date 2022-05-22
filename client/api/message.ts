import { MessageFormValues } from "../components/dashboard/Content"
import { RegisterFormValues } from "../components/forms/Register"
import { http } from "../lib"

export const CREATE_MESSAGE = (values: MessageFormValues) => {
  return http({
    url: "/messages",
    data: values,
    method: "POST"
  })
}

export const GET_MESSAGES = ({ queryKey }: any) => {
  const [_, args] = queryKey;
  return http({
    url: `/messages`,
    params: args,
    method: "GET"
  })
}