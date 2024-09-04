"use client"
import axios from 'axios';
import Link from 'next/link'
import { useState, useEffect } from "react";
import BarSearch from "../../../components/BarSearch"
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PencilSquareIcon, StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { PageTitleDefault } from "../../../components/PageTitle";
import { ButtonAddLink } from "../../../components/Buttons";
import { environment } from "../../../environment/environment";
import OrderDocument from "../../../interface/order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../utils/authOptions";
import { redirect } from "next/navigation";
import { useSession } from 'next-auth/react';
import Pagination from '@/components/Paginate';
import UserData from '@/interface/userData';
import ModalCond from '@/components/ModalCond';
import ModalPart from '@/components/ModalPart';


export default function Orders() {
   const { data: session, status } = useSession({
      required: true,
   })


   // const [orderData, setOrderData] = useState<OrderDocument[]>([]);
   const [orderData, setOrderData] = useState({
      data: [],
      current_page: 1,
      last_page: 1,
   });

   const [searchData, setSearchData] = useState(null);
   const [isCondModalOpen, setIsCondModalOpen] = useState(false);
   const [isPartModalOpen, setIsPartModalOpen] = useState(false);
   const [statusData, setStatus] = useState<OrderDocument[]>([]);
   const [selectedCondominium, setSelectedCondominium] = useState<any>(null); 
   const [selectedPartner, setSelectedPartner] = useState<any>(null);



   function openCondModal(condominiumData: any) {
      setSelectedCondominium(condominiumData); // Armazena o condomínio selecionado
      setIsCondModalOpen(true); // Abre o modal
    }
    
  
    function closeCondModal() {
      setIsCondModalOpen(false);
    }

    function openPartModal(partnerData: any) {
      setSelectedPartner(partnerData); // Armazena o condomínio selecionado
      setIsPartModalOpen(true); // Abre o modal
    }
    
  
    function closePartModal() {
      setIsPartModalOpen(false);
    }




   const dataUser = session?.user as UserData;

   const handleSearch = async (query: any) => {
      try {
          let url;
  
          if (dataUser.user.type === 'condominium') {
              url = `${environment.apiUrl}/search/condominium/order/${dataUser.profile.id}`;
          } else if (dataUser.user.type === 'partner') {
              url = `${environment.apiUrl}/search/partner/order/${dataUser.profile.id}`;
          } else {
              url = `${environment.apiUrl}/search/admin/order`;
          }
  
          const response = await axios.post(url, { query });
          setSearchData(response.data);  // Atualize searchData em vez de orderData
      } catch (error) {
          console.error('Erro ao realizar a pesquisa:', error);
      }
  };
 
   async function fetchData(page: number) {
      try {
         let url = `${environment.apiUrl}/order/list/${dataUser.user.id}`;

         if (dataUser.profile?.id) {
            url += `/${dataUser.profile.id}`;
         }
         url += `?page=${page}`;  // Adicione o número da página à URL

         const response = await axios.get(url);
         setOrderData(response.data);   

      } catch (error) {
         console.error('Error fetching order data:', error);
         
      }
   }

   useEffect(() => {
      fetchData(orderData.current_page);  // Passe o número da página atual para fetchData
    }, [dataUser, orderData.current_page]);  // Atualize sempre que a página atual ou dataUser mudar


   async function handleCancelOrder(id: any) {
      try {
      
        // Perguntar ao usuário se ele realmente deseja mudar o status do parceiro
        if (confirm(`Realmente quer cancelar o chamado ${id} ?`)) {
          // Enviar uma requisição PUT para a API para atualizar o registro
            await axios.put(`${environment.apiUrl}/order/updateStatusOrder/${id}`);
            fetchData(orderData.current_page);
        } 
      } catch (error) {
        console.log(error);
      }
    }
   

   const handlePageChange = (newPage: number) => {
      setOrderData(prevData => ({ ...prevData, current_page: newPage }));
   }





   const fetchStatus = async () => {
      try {
         const response = await axios.get(`${environment.apiUrl}/statusOrder/list`);
         setStatus(response.data);
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      fetchStatus();
   }, []);

   function getWidth(status: any) {
      if (status.id === 5) return 100;
      if (status.id === 1) return 25;
      if (status.id === 2) return 50;
      if (status.id === 3) return 75;
      if (status.id === 4) return 100;
   }


   const [selectedStatus, setSelectedStatus] = useState(''); // Estado para armazenar a opção selecionada

   // Função para lidar com a mudança no select
   const handleSelectChange = (event: any) => {
      const selectedValue = event.target.value;
      setSelectedStatus(selectedValue); // Atualize o estado com a opção selecionada
      handleSearch(selectedValue); // Chame a função handleSearch com o valor selecionado
   };

   

   if (status === "loading") {
      return <></>
   }

   return (
      <>
         <div className="flex w-full justify-between items-center h-20 max-[600px]:h-auto flex-row max-[600px]:flex-col max-[600px]:gap-2 " >
            <PageTitleDefault title="Chamados" />
            <BarSearch onSearch={handleSearch} />

            <div className="flex flex-1 max-[600px]:w-full relative">
               <select
                  id="status"
                  className="relative ml-20 mr-12 max-[600px]:ml-0 block w-[1px] min-w-0 h-12 flex-auto rounded-[16px] border border-gray-300 bg-white bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-gray-400 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none "
                  onChange={handleSelectChange}
                  value={selectedStatus} // Defina o valor do select com base no estado
               >
                  <option selected value="">Status/todos</option>

                  {statusData.map((status) => (
                     <option key={status.id} value={status.name}>
                        {status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                     </option>
                  ))}
               </select>
            </div>
            {dataUser?.user?.type === 'condominium' && (
               <ButtonAddLink route="order/new" label="Novo Chamado" />
            )}
         </div>
         <div className="flex justify-between items-center w-full p-0 mim-h-screen">
            <div className="w-full">
               <div className="grid gap-4">
                  <div className="overflow-auto mt-4 w-full bg-white rounded-[16px] drop-shadow-md p-4">
                     <table className="table-auto w-full text-left text-sm font-light">
                        <thead className="border-b border-gray-300 font-medium">
                           <tr>
                              <th scope="col" className="px-1 py-2">Nº</th>
                              <th scope="col" className="px-2 py-2">Data</th>
                              <th scope="col" className="px-8 py-2  max-[600px]:hidden max-[600px]:px-1">Condomínio</th>
                              <th scope="col" className="px-6 py-2  max-[600px]:hidden max-[600px]:px-1">Prestador</th>
                              <th scope="col" className="px-1 py-2 text-center  max-[600px]:hidden max-[600px]:px-1">Serviço/Área</th>
                              <th scope="col" className="px-6 py-2 text-center  max-[600px]:hidden max-[600px]:px-1">Progresso</th>
                              <th scope="col" className="px-6 py-2 text-center">Status</th>
                              <th scope="col" className="px-1 py-2 text-center">Av. Chamado</th>
                              <th scope="col" className="px-6 py-2 text-center">Ações</th>
                           </tr>
                        </thead>
                        <tbody>
                           {(searchData ? searchData : orderData.data).map((item: any, index: any) => {
                              return (
                                 <tr key={index}
                                    className="border-b border-gray-100 transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="whitespace-nowrap text-xs px-1 py-1">{item.id}</td>
                                    <td className="whitespace-nowrap text-xs px-1 py-2">{item.opened_at}</td>
                                    <td className=" whitespace-nowrap text-xs px-3 py-2  max-[600px]:hidden max-[600px]:px-1" onClick={() => openCondModal(item.condominium)}>
                                       <div className="flex justify-start items-center hover:font-bold cursor-pointer">
                                          {item.condominium!.logo && (
                                             <img src={item.condominium!.logo}
                                                alt="Logo 1"
                                                className=" rounded h-8 w-8 drop-shadow-lg mr-2 object-contain"
                                             />
                                          )}
                                          <span title={item.condominium!.name} className=" uppercase max-w-[170px] truncate overflow-hidden text-ellipsis "  >{item.condominium!.name}</span>
                                       </div>
                                    </td>
                                    <td className="  whitespace-nowrap px-3 py-2 text-xs max-[600px]:hidden max-[600px]:px-1 uppercase " >{item.partner === null ? 'Conectando a um parceiro' :
                                       <div className="flex justify-start items-center hover:font-bold cursor-pointer " onClick={() => openPartModal(item.partner)}>
                                          {item.partner!.logo && (
                                             <img src={item.partner!.logo}
                                                alt="Logo 1"
                                                className=" rounded h-8 w-8 drop-shadow-lg mr-2 object-contain"
                                             />
                                          )}
                                          <span title={item.partner!.name} className=" uppercase max-w-[150px] truncate overflow-hidden text-ellipsis"  >{item.partner!.name}</span>
                                       </div>}
                                    </td>
                                    <td className="whitespace-nowrap px-1  py-2 max-[600px]:hidden max-[600px]:px-1" >
                                       <div className='text-xs uppercase max-w-[120px] truncate overflow-hidden text-ellipsis'>
                                          <span title={item.service_area.name}>{item.service_area.name}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="whitespace-nowrap  py-2 max-[600px]:hidden max-[600px]:px-1" >
                                       <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-200 ">
                                          <div className="h-4 rounded-full flex justify-center items-center align-middle bg-blue-500"
                                             style={{ width: `${getWidth(item.order_status)}%` }}
                                          >
                                             <span className="text-white text-xs ml-1">{getWidth(item.order_status)}%</span>
                                          </div>
                                       </div>

                                    </td>
                                    <td className="whitespace-nowrap w-32 p-6 max-[600px]:px-1  py-2  ">
                                       <div
                                          className={`whitespace-nowrap px-3 py-2 rounded text-xs uppercase text-center text-white font-bold ${item.order_status.id == '1'
                                             ? "bg-orange-300"
                                             : item.order_status.id == '2'
                                                ? "bg-blue-300"
                                                : item.order_status.id == '3'
                                                   ? "bg-green-300"
                                                   : item.order_status.id == '4'
                                                      ? "bg-gray-300"
                                                      : item.order_status.id == '5'
                                                         ? "bg-red-300"
                                                         : ""
                                             }`}
                                       >
                                          {item.order_status.name}
                                       </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2 text-xs  max-[600px]:px-1">
                                       <div className="text-center text-gray-300">
                                          {item.evaluation ? (
                                             [1, 2, 3, 4, 5].map((value) => (
                                                <StarIcon
                                                   key={value}
                                                   className={`h-5 w-5 inline-block ${value <= parseFloat(item.evaluation?.score || 0)
                                                      ? 'text-yellow-400'
                                                      : 'text-gray-300'
                                                      }`}
                                                />
                                             ))
                                          ) : (
                                             <span className='text-gray-400'>Não Avaliado</span>
                                          )}
                                       </div>
                                    </td>

                                    <td className=" ">
                                       <div className="flex justify-center items-center  gap-3">
                                          <Link href={`/order/${item.id}`}>
                                             <PencilSquareIcon className="h-5 w-5 hover:text-blue-500 " title="Acompanhar Chamado"/>
                                          </Link>

                                          {dataUser?.user?.type !== 'partner' && (
                                             <XMarkIcon className="h-5 w-5 hover:text-blue-500 cursor-pointer " title="Cancelar" onClick={() => handleCancelOrder(item.id)} />
                                          )}
                                          
                                       </div>
                                    </td>
                                 </tr>
                              )
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
                           
         </div>
         
         {/* pagination                */}
         <div className="mt-4">
         {orderData.last_page > 1 && <Pagination orderData={orderData} handlePageChange={handlePageChange} />}
         </div>
         <ModalCond isOpen={isCondModalOpen} closeModal={closeCondModal} condominiumData={selectedCondominium}/>
         <ModalPart isOpen={isPartModalOpen} closeModal={closePartModal} partnerData={selectedPartner}/>
      </>
   )
}