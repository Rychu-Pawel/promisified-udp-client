import dgram from 'dgram';

export default function bindServer(server: dgram.Socket): Promise<void> {
    try {
        return new Promise((resolve, reject) => {
            const connectListener = () => resolve();

            const errorListener = (error: Error) => {
                server.close();
                reject(error);
            };

            const unsubscribeListener = () => {
                server.removeListener(`error`, errorListener);
                server.removeListener(`listening`, connectListener);

                server.removeListener(`error`, unsubscribeListener);
                server.removeListener(`listening`, unsubscribeListener);
            };

            server.on(`listening`, connectListener);
            server.on(`error`, errorListener);

            server.on(`listening`, unsubscribeListener);
            server.on(`error`, unsubscribeListener);

            server.bind(0, `127.0.0.1`);
        });
    }
    catch (error) {
        return Promise.reject(error);
    }
}
