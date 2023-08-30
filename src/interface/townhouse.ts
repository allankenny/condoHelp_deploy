import UserDocument from './user';

interface TownhouseDocument{
    id:string;
    name: string;
    cnpj: string;
    email: string;
    phone?: string;
    cellphone?: string;
    admin_name?: string;
    responsible_name?: string;
    zip?: string;
    address?: string;
    address_number?: string;
    address_complement?: string;
    address_neighborhood?: string;
    address_state?: string;
    address_city?: string;
    valid_at?: string;
    user_id?: string;
    logo?: File;
    user: UserDocument
}
export default TownhouseDocument;