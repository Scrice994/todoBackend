import { IHttpClient } from '../../../src/utils/HttpClient/IHttpClient'

export class HttpClientMock implements IHttpClient{
    sendRequest = jest.fn()
}