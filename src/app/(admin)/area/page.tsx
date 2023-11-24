"use client"
import Link from "next/link"
import BarSearch from "../../../components/BarSearch"
import axios from 'axios';
import { useState,useEffect } from "react";
import { ButtonAddLink } from "../../../components/Buttons"
import { PageTitleDefault } from "../../../components/PageTitle"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import  AreaDocument  from "../../../interface/area";
import {environment} from "../../../environment/environment";
import { useSession } from "next-auth/react";

export default  function Areas() {
  const { data: session, status } = useSession({
    required: true,
  })
  
  
  const [areaData, setAreaData] = useState<AreaDocument[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${environment.apiUrl}/area/list`);
      setAreaData(response.data);
    };
    fetchData();
  }, []);

  const handleSearch = async (query:any) => {
    try {
      let url = `${environment.apiUrl}/search/area`;

      const response = await axios.post(url, { query });
      setAreaData(response.data);
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
        <PageTitleDefault title="Área de Serviço" />
        <BarSearch onSearch={handleSearch} />
        <ButtonAddLink route="area/new" label="Nova Área de serviço" />
      </div>
      <div className="flex justify-between items-center w-full p-2 mim-h-screen">
        <div className="w-full">
          <div className="grid gap-4">
            <div className="overflow-auto mt-4 w-full bg-white rounded-[16px] drop-shadow-md p-8">
              <table className="table-auto w-full text-left text-sm font-light">
                  <thead className="border-b border-gray-300 font-medium">
                    <tr>
                      <th scope="col" className="px-6 py-2">Área de Serviço</th>
                      <th scope="col" className="px-6 py-2 text-center">Status</th>
                      <th scope="col" className="px-6 py-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {areaData.map((item, index) =>{
                      return (
                        <tr key={index}
                          className="border-b border-gray-100 transition duration-300 ease-in-out hover:bg-gray-100">
                          <td className="whitespace-nowrap px-6 py-2 uppercase">{item.name}</td>
                          <td className="whitespace-nowrap px-6 py-2 text-center uppercase">
                            <span className={`rounded px-2 py-1 text-white ${item.status === 'ativo' ? 'bg-blue-300 px-4' : 'bg-red-300'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="flex justify-center py-2 text-right gap-4 ">
                          <Link href={`/area/${item.id}`}>
                            <PencilSquareIcon className="h-4 w-4 hover:text-blue-500" />
                          </Link>
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