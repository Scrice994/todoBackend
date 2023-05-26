interface sendEventBaseResponse{
    statusCode: number
    data: {[key: string]: unknown}
}

interface SendEventSuccessResponse<T> extends sendEventBaseResponse {
    statusCode: number,
    data: {
        eventType: string,
        content: T
    }
}

interface SendEventErrorResponse extends sendEventBaseResponse {
    statusCode: number,
    data: {
        message: string
    }
}

export type ISendEventResponse = SendEventSuccessResponse<any> | SendEventErrorResponse

export interface IEventEmitter{
    sendEvent(eventType: string, content: any): Promise<ISendEventResponse>
}