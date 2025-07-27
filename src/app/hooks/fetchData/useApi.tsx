"use client";

import { useState } from "react";
import axios, { Method, AxiosRequestConfig } from "axios";

type ApiCallOptions = {
    method: Method;
    endpoint: string;
    data?: any;
    params?: Record<string, any>;
};

const useApi = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(null);

    const apiCall = async <T = any>({
        method,
        endpoint,
        data,
        params,
    }: ApiCallOptions): Promise<T> => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("auth-token");

            const config: AxiosRequestConfig = {
                method,
                url: endpoint,
                data,
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await axios<T>(config);
            setLoading(false);
            return response.data;
        } catch (err: any) {
            setLoading(false);
            const message =
                err?.response?.data?.message || "Error desconocido";
            setError(message);
            throw err;
        }
    };

    return { apiCall, loading, error };
};

export default useApi;