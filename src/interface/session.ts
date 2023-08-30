import UserDocument from './user';

interface SessionDocument {
    access_token:string;
    token_type: string;
    user: UserDocument
}

export default SessionDocument;