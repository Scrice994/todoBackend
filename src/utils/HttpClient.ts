import axios, { AxiosRequestConfig } from "axios";
import { IHttpClient } from "src/entities/IHttpClient";
import { Request } from "src/entities/IHttpClient";

export class HttpClient implements IHttpClient {
    async sendRequest(url: string, request: Request): Promise<any> {
        return (await axios(url, this._requestToAxios(request)));
    }

    private _requestToAxios(request: Request): AxiosRequestConfig {
        return {
            method: request.method,
            headers: request.headers,
            data: request.body     
        }
    }
}