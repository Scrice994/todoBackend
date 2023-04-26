export interface Request{
    method: string
    headers?: any
    body?: any
}

export interface IHttpClient {
    sendRequest(url: string, request: Request): Promise<any>
}