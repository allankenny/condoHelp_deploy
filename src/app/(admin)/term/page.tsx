"use client"
import Link from "next/link"
import BarSearch from "../../../components/BarSearch"
import axios from 'axios';
import { useState,useEffect } from "react";
import { ButtonAddLink } from "../../../components/Buttons"
import { PageTitleDefault } from "../../../components/PageTitle"
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import  AreaDocument  from "../../../interface/area";
import {environment} from "../../../environment/environment";
import { useSession } from "next-auth/react";

export default  function Areas() {
  const { data: session, status } = useSession({
    required: true,
  })
  
  interface Term {
    id: number;
    term_description: string;
    type: string;
  }
  const [termData, setTermData] = useState<Term[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${environment.apiUrl}/term/list`);
      setTermData(response.data);
    };
    fetchData();
  }, []);

  const handleSearch = async (query:any) => {
    try {
      let url = `${environment.apiUrl}/search/term`;

      const response = await axios.post(url, { query });
      setTermData(response.data);
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
        <PageTitleDefault title="Termos" />
        <BarSearch onSearch={handleSearch} />
        <ButtonAddLink route="term/new" label="Novo Termo" />
      </div>
      <div className="flex justify-between items-center w-full p-2 mim-h-screen">
        <div className="w-full">
          <div className="grid gap-4">
            <div className="overflow-auto mt-4 w-full bg-white rounded-[16px] drop-shadow-md p-8">
              <table className="table-auto w-full text-left text-sm font-light">
                  <thead className="border-b border-gray-300 font-medium">
                    <tr>
                    <th scope="col" className="px-6 py-2 text-center">Cód.</th>
                      <th scope="col" className="px-6 py-2">Termo</th>
                      <th scope="col" className="px-6 py-2 text-center">Tipo</th>
                      <th scope="col" className="px-6 py-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {termData.map((item, index) =>{
                      return (
                        <tr key={index}
                          className="border-b border-gray-100 transition duration-300 ease-in-out hover:bg-gray-100">
                            <td className="whitespace-nowrap px-6 py-2 uppercase font-bold text-center ">{item.id}</td>
                            <td className="whitespace-nowrap w-10 px-6 py-2 uppercase">
                              {item.term_description.length > 80 ? item.term_description.substr(0, 80) + '...' : item.term_description}
                          </td>

                          <td className="whitespace-nowrap px-6 py-2 text-center uppercase">
                            <span className={`rounded px-2 py-1 text-white ${item.type === 'partner' ? 'bg-blue-400' : 'bg-green-400'}`}>
                              {item.type === 'partner' ? 'PARCEIRO' : 'CONDOMÍNIO'}
                            </span>
                          </td>

                          <td className="flex justify-center py-2 text-right gap-4 ">
                          <Link href={`/term/${item.id}`}>
                            <EyeIcon className="h-4 w-4 hover:text-blue-500" />
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