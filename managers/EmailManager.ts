import {MessageManager} from "./MessageManager";
import {MessageQueueEnum} from "../models/enums/MessageQueueEnum";
import AWS = require('aws-sdk');
import {logger} from "../lib/logger";

export class EmailManager extends MessageManager {

    private ses: AWS.SES;

    constructor() {
        super(MessageQueueEnum.EMAIL);
        this.ses = new AWS.SES();
    }

    public sendMail(destinations: Array<string>, returnAddress: string, source: string, messageSubject: string, messageBody: string): void {
        const email = {
            Destination: {
                ToAddresses: destinations
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: messageBody
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: messageSubject
                }
            },
            ReturnPath: returnAddress,
            Source: source
        };

        this.publish(email).then(() => {
            logger.debug('Email published to queue');
        }, ()=> {
            logger.error('Failed to publish email to queue');
        });
    }

    public async handleMessage(message) {
        this.ses.sendEmail(message, (err, data) => {
            if (err) {
                throw err;
            }
            else {
                return data;
            }
        });
    }
}