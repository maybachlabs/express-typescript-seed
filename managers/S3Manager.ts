import {MessageManager} from "./MessageManager";
import {MessageQueueEnum} from "../models/enums/MessageQueueEnum";
import AWS = require('aws-sdk');
import {logger} from "../lib/logger";

export class S3Manager extends MessageManager {

    private s3: AWS.S3;

    constructor() {
        super(MessageQueueEnum.IMAGE_UPLOAD);
        this.s3 = new AWS.S3({params: {Bucket: 'your bucket name'}});
    }

    public uploadImage(image, destination, fileName): void {

        const imageParams = {
            Key: destination + '/' +fileName,
            Body: image.buffer.toString('base64'),
            ACL: 'public-read'
        };

        this.publish(imageParams).then(() => {
            logger.debug('Image published to queue');
        }, ()=> {
            logger.error('Failed to publish image to queue');
        });
    }

    public async handleMessage(message) {

        message.Body = new Buffer(message.Body, 'base64');

        this.s3.upload(message, function(err, data) {
            if (err) {
                throw err;
            } else {
                return data;
            }
        });
    }
}