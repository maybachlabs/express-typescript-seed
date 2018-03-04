import {Client} from "../models/entities/Client";
import {NotFoundError} from "../errors/NotFoundError";

export class ClientManager {

    constructor() {
    }

    public async createClient(clientId, clientSecret) {
        let newClient = new Client({clientId, clientSecret});
        return newClient.save();
    }

    public async updateClient(clientId, clientSecret) {
        let client = await Client.find<Client>({where: {clientId: clientId}});
        if(client) {
            client.clientId = clientId;
            client.clientSecret = clientSecret;
            return client.save();
        } else {
            throw new NotFoundError("No client found with that id");
        }
    }

    public async deleteClient(clientId) {
        let client = await Client.find<Client>({where: {clientId: clientId}});
        if(client) {
            return client.destroy();
        } else {
            throw new NotFoundError("No client found with that id");
        }
    }
}