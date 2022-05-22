import { RegisterFormValues } from "../components/forms/Register"
import { http } from "../lib"

export const CREATE_USER = (values: Omit<RegisterFormValues, "confPassword">) => {
  return http({
    url: "/users",
    data: {
      ...values,
      type: "EMAIL"
    },
    method: "POST"
  })
}

export const GET_FRIENDS = ({ queryKey }: any) => {
  const [_, { id, ...args }] = queryKey;
  return http({
    url: `/users/${id}/friends`,
    params: args,
    method: "GET"
  })
}