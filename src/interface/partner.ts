import UserDocument from './user';

interface PartnerDocument{
	service_areas: any;
    id:string;
    legal_name: string;
    name: string;
    cnpj: string;
    email: string;
    phone?: string;
    cellphone?: string;
    contact_name?: string;
    admin_name?: string;
    zip?: string;
    address?: string;
    address_number?: string;
    address_complement?: string;
    address_neighborhood?: string;
    address_state?: string;
    address_city?: string;
    service_area_id?: string;
    user_id?: string;
    user: UserDocument,
    average_score: any
}

export default PartnerDocument;