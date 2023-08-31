interface AreaDocument{
    map(arg0: (area: any) => import("react").JSX.Element): import("react").ReactNode;
    id: string;
    name: string;
    status: string
    
}

export default AreaDocument;