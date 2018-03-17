import {User} from "../models/entities/User";
import {NotFoundError} from "../errors/NotFoundError";
import {RoleEnum} from "../models/enums/RoleEnum";
import {Auth} from "../auth/auth";
import {AuthError} from "../errors/AuthError";
import {S3Manager} from "./S3Manager";
import {logger} from "../lib/logger";

export class UserManager {

    constructor() {

    }

    public async createUser(email: string, password: string, firstName: string, lastName: string, role: RoleEnum, profilePicUrl?: string) {

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            profilePicUrl,
            role
        });
        return newUser.save();
    }

    public async updateUser(userId: string, email: string, firstName: string, lastName: string, role: RoleEnum, profilePicUrl?: string): Promise<User> {

        const user = await User.find<User>({where: {id: userId}});
        if (user) {
            user.email = email || user.email;
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.profilePicUrl = profilePicUrl || user.profilePicUrl;
            user.role = role;
            return user.save();
        } else {
            logger.error("No user found");
            throw new NotFoundError("No user found");
        }
    }

    public async updateProfileImage(userId: string, image: Express.Multer.File): Promise<User> {

        const s3Manager = new S3Manager();
        const user = await User.find<User>({where: {id: userId}});
        if (user) {
            s3Manager.uploadImage(image, 'profileImages', userId);
            user.profilePicUrl = `${process.env.S3_PROFILE_PIC_URL}/${userId}`;
            return user.save();
        } else {
            logger.error("No user found");
            throw new NotFoundError("No user found");
        }
    }

    public async findByEmail(email: string) {
        const user = await User.findOne<User>({where: {email: email}});
        if (user) {
            return user;
        } else {
            logger.error("No user found with the provided email");
            throw new NotFoundError("No user found with the provided email");
        }
    }

    public async deleteUser(userId: string): Promise<User | null> {
        const user = await User.find<User>({where: {id: userId}});
        if (user) {
            await user.destroy();
            return user;
        } else {
            logger.error("No user found");
            throw new NotFoundError("No user found");
        }
    }

    public async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
        const user = await User.find<User>({where: {id: userId}});
        if (user) {
            const authorized = await Auth.comparePasswords(currentPassword, user.password);
            if (authorized) {
                user.password = newPassword;
                return user.save();
            } else {
                logger.error("Current password incorrect");
                throw new AuthError("Current password incorrect");
            }
        } else {
            logger.error("No user found");
            throw new NotFoundError("No user found");
        }
    }
}
