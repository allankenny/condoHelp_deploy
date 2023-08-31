"use client"
import axios from 'axios';
import Link from 'next/link'
import { useState, useEffect } from "react";
import BarSearch from "../../../components/BarSearch"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
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


export default function Orders() {
  const { data: session, status } = useSession({
    required: true,
  })

  const [orderData, setOrderData] = useState<OrderDocument[]>([]);

  //  if(session){
  //     setDataUser(session?.user);
  //  }

  // const dataUser = session?.user?.user;
  // const dataUserProfile = session?.user?.profile;
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
      setOrderData(response.data);
    } catch (error) {
      console.error('Erro ao realizar a pesquisa:', error);
    }
  };



  useEffect(() => {
    async function fetchData() {
      try {
        let url = `${environment.apiUrl}/order/list/${dataUser.user.id}`;

        if (dataUser.profile?.id) {
          url += `/${dataUser.profile.id}`;
        }

        const response = await axios.get(url);
        setOrderData(response.data);
      } catch (error) {
        console.error('Error fetching order data:', error);
        // Handle the error as needed, such as displaying a message to the user.
      }
    }

    fetchData();
  }, [dataUser]);




  function getWidth(status: any) {
    if (status === 5) return 0;
    if (status.id === 1) return 25;
    if (status.id === 2) return 50;
    if (status.id === 3) return 75;
    if (status.id === 4) return 100;
  }



  // let filteredData = orderData;
  // if (dataUser.type === 'parceiro') {
  //   filteredData = orderData.filter(item => (item.partner_id === dataUserProfile.id || item.partner_id === null) && item.service_area_id === dataUserProfile.service_area_id);
  // } else if  (dataUser.type === 'condominio') {
  //   filteredData = orderData.filter(item => item.condominium_id === dataUserProfile.id);
  // }

  if (status === "loading") {
    return <></>
  }

  return (
    <>
      <div className="flex w-full justify-between items-center h-20 max-[600px]:h-auto mb-5 flex-row max-[600px]:flex-col max-[600px]:gap-2 " >
        <PageTitleDefault title="Chamados" />
        <BarSearch onSearch={handleSearch} />
        {dataUser?.user.type === 'condominium' && (
          <ButtonAddLink route="order/new" label="Novo Chamado" />
        )}
      </div>
      <div className="flex justify-between items-center w-full p-2 mim-h-screen">
        <div className="w-full">
          <div className="grid gap-4">
            <div className="overflow-auto mt-4 w-full bg-white rounded-[16px] drop-shadow-md p-8">
              <table className="table-auto w-full text-left text-sm font-light">
                <thead className="border-b border-gray-300 font-medium">
                  <tr>
                    <th scope="col" className="px-3 py-2">Nº</th>
                    <th scope="col" className="px-8 py-2  max-[600px]:hidden max-[600px]:px-1">Condomínio</th>
                    <th scope="col" className="px-6 py-2  max-[600px]:hidden max-[600px]:px-1">Prestador</th>
                    <th scope="col" className="px-6 py-2 text-center  max-[600px]:hidden max-[600px]:px-1">Progresso</th>
                    <th scope="col" className="px-6 py-2 text-center">Status</th>
                    <th scope="col" className="px-6 py-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData && orderData.map((item, index) => {
                    return (
                      <tr key={index}
                        className="border-b border-gray-100 transition duration-300 ease-in-out hover:bg-gray-100">
                        <td className="whitespace-nowrap px-3 py-2">{item.id}</td>
                        <td className="whitespace-nowrap px-8 py-2  max-[600px]:hidden max-[600px]:px-1">
                          <div className="flex justify-start items-center ">
                            {item.condominium!.logo && (
                              <img src={item.condominium!.logo}
                                alt="Logo 1"
                                className=" rounded h-10 w-10 drop-shadow-lg mr-2"
                              />
                            )}
                            <span className=" uppercase">{item.condominium!.name}</span>
                          </div>
                        </td>


                        <td className="whitespace-nowrap px-6 py-2  max-[600px]:hidden max-[600px]:px-1 uppercase ">{item.partner === null ? 'Conectando a um parceiro' : item.partner.name}</td>
                        <td className="whitespace-nowrap py-2 max-[600px]:hidden max-[600px]:px-1" >
                          <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-200 ">
                            <div className="h-4 rounded-full flex justify-center items-center align-middle bg-blue-500"
                              style={{ width: `${getWidth(item.order_status)}%` }}
                            >
                              <span className="text-white text-xs ml-1">{getWidth(item.order_status)}%</span>
                            </div>
                          </div>

                        </td>
                        <td className="whitespace-nowrap w-32 p-12 max-[600px]:px-1  py-2  ">
                          <div
                            className={`whitespace-nowrap px-5 py-1 rounded  uppercase text-center text-white font-bold ${item.order_status.id == '1'
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
                        <td className="py-3 text-right gap-4 pr-6">
                          <div className="flex justify-end items-center align-middle gap-3">
                            <Link href={`/order/${item.id}`}>
                              <PencilSquareIcon className="h-5 w-5 hover:text-blue-500" />
                            </Link>

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
    </>
  )
}