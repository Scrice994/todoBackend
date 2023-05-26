import { IHttpClient } from "src/utils/HttpClient/IHttpClient";
import { ISendEventResponse, IEventEmitter } from './IEventEmitter'

export class EventEmitter implements IEventEmitter{
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