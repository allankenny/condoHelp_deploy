"use client"
import { useSession } from "next-auth/react";
import { PageTitleDefault } from "../../../components/PageTitle";
import { Line } from 'react-chartjs-2';
import { ArrowPathIcon, CameraIcon, PlusIcon, StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "@/environment/environment";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [totalChamados, setTotalChamados] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalEvaluation, setTotalEvaluation] = useState(0);
  const { data: session, status } = useSession({
    required: true,
  })
  
  const data:any = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Resultados',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 66, 65, 90]
      }
    ]
  };  

  // const [dataUser, setDataUser] = useState<any>();
  // if(session){
  //    setDataUser(session?.user);
  // }

  const dataUser = session?.user?.user;
  // const dataUserProfile = session?.user?.profile;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
  
        if (dataUser.user.type === 'condominium') {
          response = await axios(`${environment.apiUrl}/dashboard/condominium/${dataUser.profile.id}`);
        } else if (dataUser.user.type === 'partner') {
          response = await axios(`${environment.apiUrl}/dashboard/partner/${dataUser.profile.id}`);
        } else {
          response = await axios(`${environment.apiUrl}/dashboard/data`)
        }
  
    
        setTotalChamados(response.data.totalChamados);
        setTotalValue(response.data.totalValue);
        setTotalEvaluation(response.data.totalEvaluation);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Handle the error as needed, such as displaying a message to the user.
      }
    };
  

    fetchData();
  }, [dataUser]);
  

  


  function formatCurrency(value: number, currency: string = 'BRL'): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency });
  }

  if( status === "loading"){
    return <></>
  }
  
  return (
    <>
      <div className="flex w-full justify-between items-center h-20 mb-5" >
        <PageTitleDefault title="Dashboard" />
      </div>
      <div className="grid w-full lg:grid-cols-3 gap-5 mb-16">
        <div className="rounded-[16px] bg-blue-500 h-40 drop-shadow-lg text-white font-bold flex flex-col justify-center text-xl items-center">
          <span className="block  mt-3">Chamados</span>
          <div className="flex items-center mt-3">
            <PlusIcon className="h-16 w-16 inline-block text-white mr-2" />
            <span className="  text-7xl mr-2">{totalChamados}</span>
          </div>
        </div>
        <div className="rounded-[16px] bg-blue-500 h-40 drop-shadow-lg text-white font-bold flex flex-col justify-center text-xl items-center">
          <span className="block mt-3">Satisfação</span>
          <div className="flex items-center mt-3">
          <span className="text-7xl mr-2">
            {totalEvaluation === 0 ? "100%" : `% ${totalEvaluation.toFixed(1)}`}
          </span>



          </div>
        </div>
        <div className="rounded-[16px] bg-blue-500 h-40 drop-shadow-lg text-white font-bold flex flex-col justify-center text-xl items-center">
          <span className="block">Valores Transacionados</span>
          <span className="text-5xl mr-2">
            {totalValue !== undefined ? formatCurrency(totalValue) : formatCurrency(0)}
          </span>

        </div>

      </div>
      <div className="grid col-1 rounded-[16px] bg-white h-100 drop-shadow-md p-10">
        <Line
          data={data}
          height={60}
        />
      </div>


    </>

  );
}
