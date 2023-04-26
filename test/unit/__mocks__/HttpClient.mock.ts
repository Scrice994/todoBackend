import { IHttpClient } from '../../../src/entities/IHttpClient'

export class HttpClientMock implements IHttpClient{
    sendRequest = jest.fn()
}