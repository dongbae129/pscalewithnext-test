import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
interface ProfileResponse {
  ok: boolean;
  profile: User;
}
const useUser = () => {
  const router = useRouter();

  // const handle = async () => {
  //   const { data } = await axios.get("/api/users/me");
  //   return data;
  // };
  // const { data, error } = useSWR("/api/users/me", fetcher);
  const { data, isLoading, error } = useQuery<ProfileResponse>(
    "userData",
    () => fetch("/api/users/me").then((res) => res.json())
    // fetch("/api/users/me").then((res) => res.json())
  );

  // console.log(data, "00");
  useEffect(() => {
    if (data && !data.ok && router.pathname !== "/enter") {
      router.replace("/enter");
    }
  }, [data, router]);

  // useEffect(() => {
  //   console.log(isLoading, data);
  //   // if ((isLoading && !data) || (!isLoading && !data?.ok))
  //   // console.log(isLoading, data);
  //   // router.push("/enter");
  // }, [router, data, isLoading]);

  return { user: data?.profile, isLoading };
};
export default useUser;
