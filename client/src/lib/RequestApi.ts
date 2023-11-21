import axios, { AxiosInstance, AxiosResponse, isAxiosError } from 'axios';
import store from '../store/store';

export interface RequestApiInstanceType {
  endpoint: string;
  token?: string;
}

export interface RequestApiGetReqType {
  query: Record<string, string>;
}

export interface RequestApiPostReqType extends Partial<RequestApiGetReqType> {
  data: object;
}

export interface RequestApiDeleteReqType {
  data: object;
}


class RequestApi {
  private static readonly apiUrl: string = process.env.REACT_APP_API_URL ?? 'http://localhost:8000/api';
  public endpoint: string;
  private token: string | null;
  private axiosInstance: AxiosInstance;

  constructor (props: RequestApiInstanceType) {
    this.endpoint = props.endpoint;
    this.token = store.getState().auth.token;

    this.axiosInstance = axios.create({
      baseURL: RequestApi.apiUrl,
    });

    if (this.token) {
      this.axiosInstance.interceptors.request.use((config) => {
        config.headers.Authorization = `Token ${this.token}`;
        return config;
      });
    }
  }

  async get ({ query }: RequestApiGetReqType): Promise<Record<string, string> | null> {
    const url: string = this.endpoint;
    const params: Record<string, string> = query;
    let response: AxiosResponse;

    try {
      response= await this.axiosInstance.get(url, params);
      return response.data;
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        return error.response?.data ?? null;
      } else {
        return null;
      }
    }
  }

  async post ({ query, data }: RequestApiPostReqType): Promise<Record<string, string> | null> {
    const url: string = this.endpoint;
    const params: Record<string, string> | undefined = query;
    let response: AxiosResponse;

    try {
      response= await this.axiosInstance.post(url, data, params);
      return response.data;
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        return error.response?.data ?? null;
      } else {
        return null;
      }
    }
  }

  async delete ({ data }: RequestApiDeleteReqType): Promise<Record<string, string> | null> {
    const url: string = this.endpoint;
    let response: AxiosResponse;

    try {
      response= await this.axiosInstance.delete(url, { data });
      return response.data;
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        return error.response?.data ?? null;
      } else {
        return null;
      }
    }
  }
};

export default RequestApi;