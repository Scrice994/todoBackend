import { HttpClientMock } from "../__mocks__/HttpClient.mock"
import { EventEmitter } from "../../../src/utils/EventEmitter/EventEmitter"
describe("unit", () => {
    const clientMock = new HttpClientMock()
    const EVENT = new EventEmitter(clientMock)

    describe("Event Emitter", () => {
        it("Should return emitted event with 200 statusCode when Successfull", async () => {
            clientMock.sendRequest.mockImplementationOnce(() => Promise.resolve({
                status: 200,
                data: {
                    message: {
                        text: 'testText',
                }}
            }))

            const response = await EVENT.sendEvent('newTodo', { text: 'testText' })

            expect(response).toEqual({
                statusCode: 200,
                data: { text: 'testText' }
            })
        })

        it("Should return errorMessage with 500 statusCode when it fails", async () => {
            clientMock.sendRequest.mockImplementationOnce(() => {throw new Error('testError')})

            const response = await EVENT.sendEvent('newTodo', { text: 'testText' })

            expect(response).toEqual({
                statusCode: 500,
                data: { message: 'testError' }
            })
        })
    })
})