import { IHttpClient } from "src/entities/IHttpClient";

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

type ISendEventResponse = SendEventSuccessResponse<any> | SendEventErrorResponse

export class EventEmitter {
    constructor(private httpClient: IHttpClient){}

    async sendEvent(eventType: string, content: any): Promise<ISendEventResponse>{
        try {
            const event = await this.httpClient.sendRequest('http://localhost:4005/events', {
                method: 'POST',
                body: {
                    type: eventType,
                    data: content
                }
            }) 

            return {
                statusCode: event.status,
                data: event.data.message
            }

        } catch (error) {
            return this.errorResponse(error)
        }
    }

    private errorResponse(error: any){
        if (error instanceof Error){
            return {
                statusCode: 500,
                data: {
                    message: error.message,
                },
            };
        } else {
            return {
                statusCode: 500,
                data: {
                    message: "An unknown error occured"
                }
            }    
        }
    }
}