"use client"
import { useSession } from "next-auth/react";
import { PageTitleDefault } from "../../../components/PageTitle";
import { Line } from 'react-chartjs-2';
import { ArrowPathIcon, CameraIcon, PlusIcon, StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "@/environment/environment";
import UserData from "@/interface/userData";
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
import { PageSubTitle } from "@/components/PageSubTitle";
import { ButtonAddLink } from "@/components/Buttons";

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
  const [valueChart, setValueChart] = useState([]);
  const [dateChart, setDateChart] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalEvaluation, setTotalEvaluation] = useState(0);
  const [showMsgButton, setShowMsgButton] = useState(false);
  const [showDashboard, setDashboard] = useState(true);
  const [showTerm, setShowTerm ] = useState(false);
  const [termData, setTermData] = useState({ term_description: '' });
  const { data: session, status } = useSession({
    required: true,
  })
  
  const data: any = {
    labels: dateChart,
    datasets: [
      {
        label: 'Resultados',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: valueChart
      }
    ]
  };

  const dataUser = session?.user as UserData;
  


  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const checkbox = document.getElementById("flexSwitchCheckDefault") as HTMLInputElement;
    if (checkbox && !checkbox.checked) {
      alert("Você deve aceitar os termos antes de continuar.");
      return;
    }
    try {
      const data = {
        term_id : dataUser?.term,
        id : dataUser?.profile?.id
      }; 

      if (dataUser?.user.type === 'partner') {
        await axios.put(`${environment.apiUrl}/term/refresh/partner`, data);
        window.location.reload();
      } else if (dataUser?.user.type === 'condominium') {
        await axios.put(`${environment.apiUrl}/term/refresh/condominium`, data);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert('Ocorreu um erro ao enviar os dados.');
    }
  }


  
  
  useEffect(() => {
    const fetchTermData = async () => {
      try {
        if (dataUser?.user.type === 'partner') {
          const response = await axios.get(`${environment.apiUrl}/term/list/partnerTerm`);
          setTermData(response.data);
        } else if (dataUser?.user.type === 'condominium') {
          const response = await axios.get(`${environment.apiUrl}/term/list/townhouseTerm`);
          setTermData(response.data);
        }    
        
      } catch (error) {
        console.log(error);
        alert('Ocorreu um erro.');
      }
    };
    fetchTermData();
  }, [dataUser]);
  
  
  
  
  
  
  
  useEffect(() => {
    const fetchDataUsers = async () => {
      try {
        
          if ( dataUser?.user.type === 'partner' ){
            const response = await axios.get(`${environment.apiUrl}/partner/${dataUser?.profile?.id}`);
            if (response.data.term_id !== dataUser?.term) {
              setShowTerm(true);
              setDashboard(false);
            }
          } else if ( dataUser?.user.type === 'condominium' ){
            const response = await axios.get(`${environment.apiUrl}/townhouse/${dataUser?.profile?.id}`);
            if (response.data.term_id !== dataUser?.term) {
              setShowTerm(true);
              setDashboard(false);
            }
          }
        
      } catch (error) {
        console.log(error);
        alert('Ocorreu um erro ao atualizar as views do dashboard.');
      }
    };
    fetchDataUsers();
  }, [dataUser]);
  
  
  
  
  useEffect(() => {    
    if (dataUser?.user.status === 'pendente') {
      setShowMsgButton(true);
      setDashboard(false);
    } 
    
  }, [dataUser]);
  
  
  
  useEffect(() => {
    const fetchData = async () => {
      console.log(session);
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
        setValueChart(response.data.valueArray);
        setDateChart(response.data.dateValueArray);
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

  if (status === "loading") {
    return <></>
  }

  

  return (
    <>
    <div className={`mx-auto max-w-screen-md rounded-[16px] bg-white drop-shadow-md p-5 mt-5 mb-5 transition-all duration-700 ${showTerm ? 'block' : 'hidden'}`}>
        <div className="md:col-span-5">
          <label htmlFor="name" className='text-center'>Termos e condições de uso.</label>
          <textarea
            name="term_description"
            id="term_description"
            className="h-80 border mt-1 rounded p-3 w-full bg-gray-50 uppercase text-[11px]"
            value={termData.term_description}
            disabled
          />
        </div>
        <div className="flex items-center">
          <input
            className="mr-2 mt-[1.1rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue-500 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-500 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-blue-500 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-blue-500 dark:checked:after:bg-blue-500 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
            // onChange={(e) => {
            //   if (e.target.checked) {
            //     acceptTerm();
            //   }
            // }}
          />
          <label
            className="inline-block pl-[0.15rem] hover:cursor-pointer mt-[1.1rem]"
            htmlFor="flexSwitchCheckDefault"
          >
            Li e aceito os termos e condições.
          </label>
        </div>
        <div className="md:col-span-5 text-right ">
          <div className="inline-flex items-end gap-3 mt-5">
            <ButtonAddLink route="partner" label='Aceitar' onClick={handleSubmit}  />
          </div>
        </div>
      </div>

     <div className={`grid col-1 rounded-[16px] bg-white drop-shadow-md p-5 mt-5 mb-5 transition-all duration-700 ${showMsgButton ? 'block' : 'hidden'}`}>
        <div className="flex justify-center items-center m-2 text-center font-bold">
          <PageSubTitle subtitle="Aguarde, seu cadastro está aguardando aprovação." />
        </div>
      </div>

      <div className={`grid col-1 rounded-[16px] bg-white drop-shadow-md p-5 mt-5 mb-5 transition-all duration-700 ${showDashboard ? 'block' : 'hidden'}`}>
        <div className="flex w-full justify-between items-center h-20 mb-5" >
          <PageTitleDefault title="Dashboard" />
        </div>
        <div className="grid w-full lg:grid-cols-3 gap-5 mb-16">
          <div className="rounded-[16px] bg-blue-500 h-40 drop-shadow-lg text-white max-[600px]:h-[100px] max-[600px]:text-sm font-bold flex flex-col justify-center text-xl items-center max-sm:max-w-full">
            <span className="block  mt-3">Chamados</span>
            <div className="flex items-center mt-3 ">
              
              <span className="  text-7xl mr-2 max-[600px]:text-[40px]">+ {totalChamados}</span>
            </div>
          </div>
          <div className="rounded-[16px] bg-blue-500 h-40 drop-shadow-lg text-white font-bold flex flex-col justify-center text-xl items-center max-[600px]:h-[100px] max-sm:max-w-full">
            <span className="block mt-3 max-[600px]:text-sm">Satisfação</span>
            <div className="flex items-center mt-3">
              <span className="text-7xl mr-2 max-[600px]:text-[40px]">
                {totalEvaluation === 0 ? "100%" : `% ${totalEvaluation.toFixed(1)}`}
              </span>
            </div>
          </div>
          <div className="rounded-[16px] bg-blue-500 h-40 drop-shadow-lg text-white font-bold flex flex-col justify-center text-xl items-center max-[600px]:text-sm max-[600px]:h-[100px] max-sm:max-w-full">
            <span className="block">Valores Transacionados</span>
            <span className="text-5xl mr-2 max-[600px]:text-[40px]">
              {totalValue !== undefined ? formatCurrency(totalValue) : formatCurrency(0)}
            </span>
          </div>
        </div>
        <div className="max-[600px]:w-[0px] ">
          <div className="grid col-1 rounded-[10px] bg-white h-100  p-2 ">
            <Line
              data={data}
              height={60}
            />
          </div>
        </div>
      </div>


    </>

  );
}