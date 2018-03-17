import {MessageError} from "../errors/MessageError";
import {logger} from "../lib/logger";

export abstract class MessageManager {

    private queue: string;

    // This must be instantiated when the server starts
    static connection;

    constructor(queue: string) {
        this.queue = queue;
        this.subscribe().then(() => {
            logger.debug('Message queue subscribed');
        }, () => {
            logger.error('Message queue subscription failed');
        });
    }

    public abstract async handleMessage(message): Promise<any>;

    public async publish(content) {
        try {

            const channel = await MessageManager.connection.createChannel();

            channel.assertQueue(this.queue, {
                // Ensure that the queue is not deleted when server restarts
                durable: true
            }).then(() => {
                channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(content)), {
                    // Store queued elements on disk
                    persistent: true,
                    contentType: 'application/json'
                });
                return true;
            }, (error) => {
                throw error;
            });

        } catch (error) {
            throw new MessageError(error.message);
        }
    }

    public async subscribe() {
        try {

            const channel = await MessageManager.connection.createChannel();

            channel.assertQueue(this.queue, {
                // Ensure that the queue is not deleted when server restarts
                durable: true
            }).then(() => {

                // Only request 1 unacked message from queue
                // This value indicates how many messages we want to process in parallel
                channel.prefetch(1);

                channel.consume(this.queue, messageData => {

                    if (messageData === null) {
                        return;
                    }

                    // Decode message contents
                    const message = JSON.parse(messageData.content.toString());

                    this.handleMessage(message).then(() => {
                        return channel.ack(messageData);
                    }, () => {
                        return channel.nack(messageData);
                    });
                });
            }, (error) => {
                throw error;
            });

        } catch (error) {
            throw new MessageError(error.message);
        }
    }
}