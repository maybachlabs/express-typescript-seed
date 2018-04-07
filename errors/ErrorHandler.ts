import {RegistrationError} from "./RegistrationError";
import {AuthError} from "./AuthError";
import {DatabaseError} from "./DatabaseError";
import {NotFoundError} from "./NotFoundError";
import {DatabaseError as SequelizeError, ValidationError as SequelizeValidationError} from "sequelize";
import {InternalServerError} from "./InternalServerError";
import {ValidationError} from "./ValidationError";
import {logger} from "../lib/logger";

export function errorHandler(error, req, res, next) {

    if (error instanceof RegistrationError) {
        logger.error(error);
        return res.status(400).json(error);
    }
    if (error instanceof AuthError) {
        logger.error(error);
        return res.status(401).json(error);
    }
    if (error.name === 'AuthenticationError') {
        logger.error(error.message);
        return res.status(403).json(error);
    }
    if (error instanceof DatabaseError) {
        logger.error(error);
        return res.status(500).json(error);
    }
    if (error instanceof SequelizeError) {
        logger.error(error.message);
        return res.status(500).json(new DatabaseError(error.message));
    }
    if (error instanceof NotFoundError) {
        logger.error(error);
        return res.status(404).json(error);
    }
    if (error instanceof SequelizeValidationError) {
        logger.error(error.message);
        return res.status(400).json(new ValidationError(error.message));
    }
    logger.error(error.message);
    return res.status(500).json(new InternalServerError(error.message));

}
