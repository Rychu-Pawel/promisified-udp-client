import dgram from 'dgram';

import test from "ava";

import bindServer from './utils/bindServer.js';
import UdpClient from '../src/index.js';

export const port = 41234;
export const address = `127.0.0.1`;

test.serial(`Sends correct data`, async t => {
    // Arrange
    const message = `Test value`;

    const sut = new UdpClient();

    const server = dgram.createSocket(`udp4`);

    // Act
    let serverReceivedData: string | undefined;

    let messageReceivedPromiseResolve: () => void | undefined;

    const messageReceivedPromise = new Promise<void>(resolve => {
        messageReceivedPromiseResolve = resolve;
    });

    await bindServer(server);

    server.on(`message`, msg => {
        serverReceivedData = msg.toString();
        messageReceivedPromiseResolve();
    });

    const serverAddress = server.address();

    await sut.connect(serverAddress.port, serverAddress.address);

    await sut.send(message);

    await messageReceivedPromise;

    sut.close();
    server.close();

    // Assert
    t.is(serverReceivedData, message);
});