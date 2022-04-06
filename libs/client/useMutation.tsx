import { useState } from "react";

type useMutaionState<T> = {
  loading: boolean;
  datas?: T;
  error?: object;
};
type useMutaionResult<T> = [(data: any) => void, useMutaionState<T>];
export default function useMutation<T = any>(url: string): useMutaionResult<T> {
  const [state, setState] = useState<useMutaionState<T>>({
    loading: false,
    datas: undefined,
    error: undefined,
  });
  const { loading, datas, error } = state;
  // const [loading, setLoading] = useState(false);
  // const [datas, setData] = useState<undefined | any>(undefined);
  // const [error, setError] = useState<undefined | any>(undefined);
  function mutaion(data: any) {
    setState((prev) => ({ ...prev, loading: true }));
    // setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json().catch(() => {}))
      .then((data) => setState((prev) => ({ ...prev, datas: data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  }
  return [mutaion, { ...state }];
}
