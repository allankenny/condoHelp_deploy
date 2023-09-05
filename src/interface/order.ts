import PartnerDocument from './partner';
import StatusDocument from './statusOrder';
import TownhouseDocument from './townhouse';

interface OrderDocument{
    evaluation: any;
    id: string;
    description: string;
    obs: string;
    value: string;
    condominium?:any;
    partner:PartnerDocument;
    order_status:StatusDocument;
    partner_id?: string;
    service_area_id?: string;
    condominium_id?:string
}

export default OrderDocument;