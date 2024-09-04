import PartnerDocument from './partner';
import StatusDocument from './statusOrder';
import TownhouseDocument from './townhouse';

interface OrderDocument{
	map(arg0: (image: string | undefined, index: import("react").Key | null | undefined) => import("react").JSX.Element): import("react").ReactNode;
	length: number;
    images: any | undefined;
    evaluation: any;
    id: string;
    name:string;
    description: string;
    obs: string;
    value: string;
    condominium?:any;
    partner:PartnerDocument;
    order_status:StatusDocument;
    partner_id?: string;
    service_area_id?: string;
    condominium_id?:string;
    opened_at?: string;
    admin_name?: string;
}

export default OrderDocument;