import { Client, Databases, Account } from 'appwrite';

export const PROJECT_ID = '6635785e001cb3bc810c'
export const DATABASE_ID = '66357a33002202fe9e4d'
export const COLLECTION_ID_MESSAGES = '66357a48003cd7e5b40f'

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6635785e001cb3bc810c');

    export const databases = new Databases(client);
    export const account = new Account(client)

export default client