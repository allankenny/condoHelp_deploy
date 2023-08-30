"use client"
import BarSearch from "../../../components/BarSearch"
import axios from 'axios';
import Link from 'next/link'
import { useState,useEffect } from "react";
import { ButtonAddLink } from "../../../components/Buttons"
import { PageTitleDefault } from "../../../components/PageTitle"
import { PencilSquareIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import {environment} from "../../../environment/environment";
import  TownhouseDocument  from "../../../interface/townhouse";
import { useSession } from "next-auth/react";

export default function Townhouses() {
  const { data: session, status } = useSession({
    required: true,
  })
  
  const [townhouseData, setTownhouseData] = useState<TownhouseDocument[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${environment.apiUrl}/townhouse/list`);
      setTownhouseData(response.data); 
    };
    fetchData();
  }, []);

  const handleSearch = async (query:any) => {
    try {
      let url = `${environment.apiUrl}/search/condominium`;

      const response = await axios.post(url, { query });
      setTownhouseData(response.data); 
    } catch (error) {
      console.error('Erro ao realizar a pesquisa:', error);
    }
  };

  function formatPhone(phone: string | undefined) {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  }

  async function handleStatusChange(id: any) {
    try {
      // Encontrar o item pelo ID
      const item = townhouseData.find((item) => item.id === id) as TownhouseDocument; 
  
      // Verificar o valor atual da coluna status
      const currentStatus = item.user.status;
  
      // Definir o novo valor da coluna status
      const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
  
      // Perguntar ao usuário se ele realmente deseja mudar o status do condomínio
      if (confirm('Realmente quer mudar o status do condominio?')) {
        // Enviar uma requisição PUT para a API para atualizar o registro
        await axios.put(`${environment.apiUrl}/user/updatestatus/${id}`, {
          status: newStatus,
        });
  
        // Atualizar os dados locais
        setTownhouseData((prevData) =>
          prevData.map((item) =>
            item.id === id
              ? { ...item, user: { ...item.user, status: newStatus } }
              : item
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  if(status === "loading"){
    return <></>
  }
  return (
    <>
     <div className="flex w-full justify-between items-center h-20 max-[600px]:h-auto mb-5 flex-row max-[600px]:flex-col max-[600px]:gap-2 " >
        {/* <p className="text-gray-700 text-3xl font-bold">Usuários</p> */}
        <PageTitleDefault title="Condomínio" />
        <BarSearch onSearch={handleSearch} />
        <ButtonAddLink route="townhouse/new" label="Novo Condomínio" />
      </div>
      <div className="flex justify-between items-center w-full p-2 mim-h-screen">
        <div className="w-full">
          <div className="grid gap-4">
            <div className="overflow-auto mt-4 w-full bg-white rounded-[16px] drop-shadow-md p-8">
              <table className="table-auto w-full text-left text-sm font-light">
                  <thead className="border-b border-gray-300 font-medium">
                    <tr>
                      <th scope="col" className="px-6 py-2">Nome</th>
                      <th scope="col" className="px-6 py-2 max-[600px]:hidden max-[600px]:px-1 ">Síndico</th>
                      <th scope="col" className="px-6 py-2 max-[600px]:hidden max-[600px]:px-1 ">Email</th>
                      <th scope="col" className="px-6 py-2 max-[600px]:hidden max-[600px]:px-1 ">Telefone</th>
                      <th scope="col" className="px-6 py-2 text-center">Status</th>
                      <th scope="col" className="px-6 py-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {townhouseData.map((item, index) =>(
                        <tr key={index}
                          className="border-b border-gray-100 transition duration-300 ease-in-out hover:bg-gray-100">
                          <td className="whitespace-nowrap px-6 py-2 uppercase">{item.name}</td>
                          <td className="whitespace-nowrap px-6 py-2 uppercase max-[600px]:hidden max-[600px]:px-1 ">{item.admin_name}</td>
                          <td className="whitespace-nowrap px-6 py-2 max-[600px]:hidden max-[600px]:px-1 ">{item.email}</td>
                          <td className="whitespace-nowrap px-6 py-2 max-[600px]:hidden max-[600px]:px-1">{formatPhone(item.phone)}</td>
                          <td className="whitespace-nowrap px-6 py-2">
                            <div className={` rounded whitespace-nowrap px-6 py-2 uppercase text-center ${item.user.status === 'ativo' ? 'bg-blue-300 text-white' : 'bg-red-300 text-white'}`}>{item.user.status}
                            </div>
                          </td>

                          <td className="flex justify-center py-2 gap-4">
                          <Link href={`/townhouse/${item.id}`}>
                              <PencilSquareIcon className="h-4 w-4 hover:text-blue-500" />
                          </Link>
                          <ExclamationTriangleIcon className=" cursor-pointer h-4 w-4 hover:text-red-500"
                              onClick={() => handleStatusChange(item.id)}
                            />

                          </td>
                        </tr>
                      )
                    )}
                    
                  </tbody>
                </table>
             
            </div>
          </div>
        </div>
      </div>

    </>
  )
}