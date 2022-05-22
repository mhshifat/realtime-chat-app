import { AxiosResponse } from "axios";
import toast from "react-hot-toast"

export const sendPromiseToastMessage = async (fn: Promise<unknown>, loading: string, successMsg: string) => {
  const { data } = await toast.promise(
    fn,
     {
       loading: `${loading || 'Processing'}...`,
       success: <b>{successMsg}!</b>,
       error: (err) => <b>{err?.response?.data?.msg}!</b>,
     }
   ) as AxiosResponse;
   return data?.result || data;
};