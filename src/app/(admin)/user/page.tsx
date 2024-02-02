"use client"
import Link from "next/link"
import axios from 'axios';
import { useState,useEffect } from "react";
import BarSearch from "../../../components/BarSearch"
import { ButtonAddLink } from "../../../components/Buttons"
import { PageTitleDefault } from "../../../components/PageTitle"
import { PencilSquareIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import {environment} from "../../../environment/environment";
import  UserDocument  from "../../../interface/user";
import { useSession } from "next-auth/react";

export default function Users() {
  const { data: session, status } = useSession({
    required: true,
  })
  
  const [userData, setUserData] = useState<UserDocument[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${environment.apiUrl}/user/list`);
      setUserData(response.data); 

    };
    fetchData();
  }, []);


  async function handleStatusChange(id: any) {
  try {
    // Encontrar o item pelo ID
    const item = userData.find((item) => item.id === id) as UserDocument;
  
    // Verificar o valor atual da coluna status
    const currentStatus = item.status;
  
    // Definir o novo valor da coluna status
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
  
    // Perguntar ao usuário se ele realmente deseja mudar o status do usuario
    if (confirm('Realmente quer mudar o status do Usuário?')) {
      // Enviar uma requisição PUT para a API para atualizar o registro
      await axios.put(`${environment.apiUrl}/user/updateStatusUser/${id}`, {
        status: newStatus,
      });
  
      // Atualizar os dados locais
      setUserData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
}

const handleSearch = async (query:any) => {
  try {
    let url = `${environment.apiUrl}/search/user`;
    const response = await axios.post(url, { query });
    setUserData(response.data); 
  } catch (error) {
    console.error('Erro ao realizar a pesquisa:', error);
  }
};

if(status === "loading"){
  return <></>
}

  return (
    <>
     <div className="flex w-full justify-between items-center h-20 max-[600px]:h-auto flex-row max-[600px]:flex-col max-[600px]:gap-2 " >
        {/* <p className="text-gray-700 text-3xl font-bold">Usuários</p> */}
        <PageTitleDefault title="Usuários" />
        <BarSearch onSearch={handleSearch} />
        <ButtonAddLink route="user/new" label="Novo Usuário" />
      </div>
      <div className="flex justify-between items-center w-full p-2 mim-h-screen">
        <div className="w-full">
          <div className="grid gap-4">
            <div className="overflow-auto mt-4 w-full bg-white rounded-[16px] drop-shadow-md p-8">
              <table className="table-auto w-full text-left text-sm font-light">
                  <thead className="border-b border-gray-300 font-medium">
                    <tr>
                      <th scope="col" className="px-6 py-2">Nome</th>
                      <th scope="col" className="px-6 py-2">Email</th>
                      <th scope="col" className="px-6 py-2 text-center">Tipo</th>
                      <th scope="col" className="px-6 py-2 text-center">Status</th>
                      <th scope="col" className="px-6 py-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((item, index) =>(
                        <tr key={index}
                          className="border-b border-gray-100 transition duration-300 ease-in-out hover:bg-gray-100">
                          <td className="whitespace-nowrap px-6 py-2 uppercase">{item.name}</td>
                          <td className="whitespace-nowrap px-6 py-2 lowercase">{item.email}</td>
                          <td className="whitespace-nowrap px-6 py-2 uppercase text-center">
                            {item.type === 'partner' ? 'PARCEIRO' : 
                            item.type === 'admin' ? 'ADMINISTRADOR' : 
                            item.type === 'condominium' ? 'CONDOMINIO' : ''}
                          </td>

                          <td className="whitespace-nowrap px-6 py-2">
                            <div className={`rounded whitespace-nowrap px-6 py-2 uppercase text-center ${
                                item.status === 'ativo' ? 'bg-blue-300 text-white' :
                                item.status === 'pendente' ? 'bg-orange-300 text-white' :
                                item.status === 'inativo' ? 'bg-red-300 text-white' : ''
                                }`}>{item.status}
                            </div>
                          </td>
                          <td className="flex justify-center py-2 gap-4">
                          <Link href={`/user/${item.id}`}>
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