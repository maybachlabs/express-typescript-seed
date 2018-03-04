/**
 * Module dependencies.
 */
import * as oauth2orize from "oauth2orize";
import * as passport from "passport";
import {AccessToken, Client} from "../models";
import {sign, verify} from "jsonwebtoken";
import {AuthError} from "../errors/AuthError";

export class Oauth2 {

    private server;
    private jwtSecret: string | undefined;

    constructor() {
        this.server = oauth2orize.createServer();
        this.serializeClient();
        this.registerGrants();
        this.jwtSecret = process.env.JWT_SECRET;
    }

    // token endpoint
    //
    // `token` middleware handles client requests to exchange authorization grants
    // for access tokens.  Based on the grant type being exchanged, the above
    // exchange middleware will be invoked to handle the request.  Clients must
    // authenticate when making requests to this endpoint.
    public getTokenEndpoint() {
        return [
            passport.authenticate(['local'], { session: false }),
            this.server.token(),
            this.server.errorHandler()
        ];
    }

    // Register serialialization and deserialization functions.
    //
    // When a client redirects a user to user authorization endpoint, an
    // authorization transaction is initiated.  To complete the transaction, the
    // user must authenticate and approve the authorization request.  Because this
    // may involve multiple HTTP request/response exchanges, the transaction is
    // stored in the session.
    //
    // An application must supply serialization functions, which determine how the
    // client object is serialized into the session.  Typically this will be a
    // simple matter of serializing the client's ID, and deserializing by finding
    // the client by ID from the database.
    private serializeClient() {

        this.server.serializeClient(function(client, done) {
            return done(null, client.id);
        });

        this.server.deserializeClient(function(id, done) {
            Client.findById(id).then(function(client) {
                return done(null, client);
            }, function(error) {
                return done(error);
            });
        });
    }


    // Register supported grant types.
    //
    // OAuth 2.0 specifies a framework that allows users to grant client
    // applications limited access to their protected resources.  It does this
    // through a process of the user granting access, and the client exchanging
    // the grant for an access token.
    private registerGrants() {
        this.registerPasswordGrant();
        // this.registerClientCredentialGrant();
    }

    // PASSWORD GRANT TYPE
    // Exchange user id and password for access tokens.  The callback accepts the
    // `client`, which is exchanging the user's name and password from the
    // authorization request for verification. If these values are validated, the
    // application issues an access token on behalf of the user who authorized the code.
    private registerPasswordGrant() {

        this.server.exchange(oauth2orize.exchange.password((athlete, username, password, scope, done) => {

            AccessToken.findOne<AccessToken>({where: {userId: athlete.id}}).then(accessToken => {
                if(accessToken) {
                    if(this.jwtSecret) {
                        verify(accessToken.token, this.jwtSecret, (err, decodedToken: any) => {
                            if(err) {
                                accessToken.destroy().then(() => {
                                    if(this.jwtSecret) {
                                        sign(athlete.dataValues, this.jwtSecret, { expiresIn: "10h"}, (err, encodedToken) => {
                                            if(err) {
                                                return done(err);
                                            }
                                            AccessToken.create({
                                                token: encodedToken,
                                                userId: athlete.id
                                            }).then((accessToken: AccessToken) => {
                                                return done(null, accessToken.token);
                                            }).catch((error) => {
                                                return done(error);
                                            });
                                        });
                                    } else {
                                        return done(new AuthError("JWT Secret Undefined"), false);
                                    }

                                });
                            } else if (decodedToken && accessToken.userId === decodedToken.id) {
                                return done(null, accessToken.token);
                            } else {
                                return done(new AuthError("Token Validation Error"), false);
                            }
                        });
                    } else {
                        return done(new AuthError("JWT Secret Undefined"), false);
                    }

                } else {
                    if(this.jwtSecret) {
                        sign(athlete.dataValues, this.jwtSecret, { expiresIn: "10h"}, (err, encodedToken) => {
                            if(err) {
                                return done(err);
                            }
                            AccessToken.create({
                                token: encodedToken,
                                userId: athlete.id
                            }).then((accessToken: AccessToken) => {
                                return done(null, accessToken.token);
                            }).catch((error) => {
                                return done(new AuthError(error.message));
                            });
                        });
                    } else {
                        return done(new AuthError("JWT Secret Undefined"));
                    }

                }
            });

        }));
    }

    // CLIENT CREDENTIAL GRANT TYPE
    // Exchange the client id and password/secret for an access token.  The callback accepts the
    // `client`, which is exchanging the client's id and password/secret from the
    // authorization request for verification. If these values are validated, the
    // application issues an access token on behalf of the client who authorized the code.
    private registerClientCredentialGrant() {

        this.server.exchange(oauth2orize.exchange.clientCredentials(function(client, scope, done) {

            Client.findOne({
                where: {clientId: client.clientId}
            }).then(function(localClient: any) {
                if(localClient === null) return done(null, false);
                if(localClient.clientSecret !== client.clientSecret) return done(null, false);
                const token = sign(localClient,  this.jwtSecret, { expiresIn: "10h"});
                AccessToken.create({
                    token: token,
                    clientId: client.dataValues.id
                }).then(function(accessToken) {
                    return done(null, accessToken);
                }).catch(function(error) {
                    return done(error);
                });
            }).catch(function(error) {
                return done(error);
            });
        }));
    }
}