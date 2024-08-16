"use client"
import Link from "next/link"
import BarSearch from "../../../components/BarSearch"
import axios from 'axios';
import { useState, useEffect } from "react";
import { ButtonAddLink } from "../../../components/Buttons"
import { PageTitleDefault } from "../../../components/PageTitle"
import {  StarIcon } from "@heroicons/react/24/solid"
import { PencilSquareIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { environment } from "../../../environment/environment";
import PartnerDocument from "../../../interface/partner";
import { useSession } from "next-auth/react";

export default function Partners() {
  const { data: session, status } = useSession({
    required: true,
  })

  const [partnerData, setPartnerData] = useState<PartnerDocument[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(`${environment.apiUrl}/partner/list`);
      setPartnerData(response.data);

    };
    fetchData();
  }, []);

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
      const item = partnerData.find((item) => item.id === id) as PartnerDocument;

      // Verificar o valor atual da coluna status
      const currentStatus = item.user.status;

      // Definir o novo valor da coluna status
      const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';

      // Perguntar ao usuário se ele realmente deseja mudar o status do parceiro
      if (confirm('Realmente quer mudar o status do parceiro?')) {
        // Enviar uma requisição PUT para a API para atualizar o registro
        await axios.put(`${environment.apiUrl}/user/updateStatusPartner/${id}`, {
          status: newStatus,
        });

        // Atualizar os dados locais
        setPartnerData((prevData) =>
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

  const handleSearch = async (query: any) => {
    try {
      let url = `${environment.apiUrl}/search/partner`;

      const response = await axios.post(url, { query });
      setPartnerData(response.data);
    } catch (error) {
      console.error('Erro ao realizar a pesquisa:', error);
    }
  };

  function renderStarRating(score: any) {
    const starCount = score !== null
      ? Math.round(typeof score === 'number' ? score : parseFloat(score))
      : 5; // Mostrar 5 estrelas se parceiro não tiver avaliação(novo parceiro)

    const stars = Array.from({ length: starCount }, (_, index) => (
      <StarIcon key={index} className="h-5 w-5 inline-block cursor-pointer text-yellow-300" />
    ));

    return stars;
  }


  

  const [selectedStatus, setSelectedStatus] = useState('');
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
        <PageTitleDefault title="Parceiros" />
        <BarSearch onSearch={handleSearch} />

        <div className="flex flex-1 max-[600px]:w-full relative">
            <select
              id="status"
              className="relative ml-20 mr-12 max-[600px]:ml-0 block w-[1px] min-w-0 h-12 flex-auto rounded-[16px] border border-gray-300 bg-white bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-gray-400 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none "
              onChange={handleSelectChange}
              value={selectedStatus} // Defina o valor do select com base no estado
            >
              <option selected value="">Status/todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="pendente">Pendente</option>
            </select>
        </div>

        <ButtonAddLink route="partner/new" label="Novo Parceiro" />
      </div>

      <div className="flex justify-between items-center w-full p-0 mim-h-screen">
        <div className="w-full">
          <div className="grid gap-4">
            <div className="overflow-auto mt-4 w-full bg-white rounded-[16px] drop-shadow-md p-4">
              <table className="table-auto w-full text-left text-sm font-light">
                <thead className="border-b border-gray-300 font-medium">
                  <tr>
                    <th scope="col" className="px-6 py-2">Parceiro</th>
                    <th scope="col" className="px-6 py-2">Nome contato</th>
                    <th scope="col" className="px-6 py-2 max-[600px]:hidden max-[600px]:px-1">Email</th>
                    <th scope="col" className="px-6 py-2 max-[600px]:hidden max-[600px]:px-1">Telefone</th>
                    <th scope="col" className="px-6 py-2 text-center max-[600px]:hidden max-[600px]:px-1">Avaliação</th>
                    <th scope="col" className="px-6 py-2 text-center">Status</th>
                    <th scope="col" className="px-6 py-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerData.map((item, index) => (
                    <tr key={index}
                      className="border-b border-gray-100 transition duration-300 ease-in-out hover:bg-gray-100">
                      <td className="whitespace-nowrap px-6 py-2 text-xs uppercase max-w-[250px] truncate overflow-hidden text-ellipsis">{item.name}</td>
                      <td className="whitespace-nowrap px-6 py-2 uppercase text-xs max-[600px]:hidden max-[600px]:px-1">{item.contact_name}</td>
                      <td className="whitespace-nowrap px-6 text-xs py-2 max-[600px]:hidden max-[600px]:px-1 lowercase">{item.email}</td>
                      <td className="whitespace-nowrap px-6 text-xs py-2 max-[600px]:hidden max-[600px]:px-1">{formatPhone(item.phone)}</td>
                      <td className="whitespace-nowrap px-6 text-xs py-2 max-[600px]:hidden max-[600px]:px-1">
                        {renderStarRating(item.average_score)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2">
                        <div className={`rounded whitespace-nowrap text-xs px-6 py-2 uppercase text-center text-white ${item.user.status === 'ativo' ? 'bg-blue-300 ' :
                            item.user.status === 'pendente' ? 'bg-orange-300 ' :
                              item.user.status === 'inativo' ? 'bg-red-300 ' : ''
                          }`}>{item.user.status}</div>
                      </td>

                      <td className="flex justify-center py-2 gap-4">
                        <Link href={`/partner/${item.id}`}>
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