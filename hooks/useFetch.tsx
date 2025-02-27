"use client";
import { useState } from "react";

interface FetchState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

type FetchFunction<T, A extends any[]> = (...args: A) => Promise<void>;

export function useFetch<T, A extends any[]>(
  fetchFunction: (...args: A) => Promise<T>
) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const fetchData: FetchFunction<T, A> = async (...args) => {
    setState({ data: null, error: null, loading: true });
    try {
      const result = await fetchFunction(...args);
      console.log("Fetched Result in usefetch", result);
      setState({ data: result, error: null, loading: false });
    } catch (error) {
      setState({ data: null, error: (error as Error).message, loading: false });
    }
  };

  return { ...state, fetchData };
}
