interface PageSubtitleProps {
    subtitle: string;
  }
  
  export function PageSubTitle(props: PageSubtitleProps) {
    return <p className=" text-gray-600 text-lg">{props.subtitle}</p>;
  }