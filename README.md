# promisified-udp-client

The `promisified-udp-client` is an NPM package that provides a simple way to create UDP clients with a promise-based interface. This allows for easy interaction using await, streamlining the process of sending and receiving UDP messages.

## Installation

To install the package, use the following command in your project:

```bash
npm install promisified-udp-client
```

## Example

```typescript
const client = new UdpClient();

await client.connect(8080, `127.0.0.1`);

await client.send(`Test message`);

client.close();
```

## Methods

```typescript
client.addErrorListener((msg: Buffer, rinfo: dgram.RemoteInfo) => console.log(msg, rinfo));
client.removeErrorListener(errorListenerMethod);

client.addMessageListener((msg: Buffer, rinfo: dgram.RemoteInfo) => console.log(msg, rinfo));
client.removeMessageListener(messageListenerMethod);

await client.connect(port, address);
await client.send(msg: string | readonly any[] | Uint8Array);
await client.close();
```

## Properties

```typescript
client.socket
```