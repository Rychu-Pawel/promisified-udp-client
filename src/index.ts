import dgram from 'dgram';

export default class UdpClient {
    #socket: dgram.Socket;

    constructor(abortSignal?: AbortSignal) {
        this.#socket = dgram.createSocket({
            type: `udp4`,
            signal: abortSignal,
        });
    }

    public get socket(): dgram.Socket {
        return this.#socket;
    }

    addMessageListener(listener: (msg: Buffer, rinfo: dgram.RemoteInfo) => void) {
        this.#socket.addListener(`message`, listener);
    }

    removeMessageListener(listener: (msg: Buffer, rinfo: dgram.RemoteInfo) => void) {
        this.#socket.removeListener(`message`, listener);
    }

    addErrorListener(listener: (msg: Buffer, rinfo: dgram.RemoteInfo) => void) {
        this.#socket.addListener(`error`, listener);
    }

    removeErrorListener(listener: (msg: Buffer, rinfo: dgram.RemoteInfo) => void) {
        this.#socket.removeListener(`error`, listener);
    }

    connect(port: number, address: string): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                const connectListener = () => resolve();

                const errorListener = (error: Error) => {
                    this.#socket.close();
                    reject(error);
                };

                const unsubscribeListener = () => {
                    this.#socket.removeListener(`error`, errorListener);
                    this.#socket.removeListener(`connect`, connectListener);

                    this.#socket.removeListener(`error`, unsubscribeListener);
                    this.#socket.removeListener(`connect`, unsubscribeListener);
                };

                this.#socket.on(`connect`, connectListener);
                this.#socket.on(`error`, errorListener);

                this.#socket.on(`connect`, unsubscribeListener);
                this.#socket.on(`error`, unsubscribeListener);

                this.#socket.connect(port, address);
            });
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    send(msg: string | readonly any[] | Uint8Array): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                this.#socket.send(msg, error => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            });
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    close(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.#socket.close(() => resolve());
            }
            catch (error) {
                reject(error);
            }
        });
    }
}