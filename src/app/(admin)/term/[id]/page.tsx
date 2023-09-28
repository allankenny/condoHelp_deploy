"use client"
import axios from 'axios';
import { useState,useEffect } from "react";
import { PageTitleDefault } from "../../../../components/PageTitle";
import { ButtonAddLink, ButtonCancel } from "../../../../components/Buttons";
import {environment} from "../../../../environment/environment";
import  AreaDocument  from "../../../../interface/area";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../utils/authOptions";
import { redirect } from "next/navigation";
import { useSession } from 'next-auth/react';
interface ParamsProps {
  params: {
    id: string;
  }
}

export default function Area({params}:ParamsProps) {
  const { data: session, status } = useSession({
    required: true,
  })
 
    const [formData, setFormData] = useState({
    term_description: "",
    type: ""
  });

  

  const handleChange = (event:any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  

  const resetForm = () => {
    setFormData({
      term_description: "",
      type:""
    });
  };

  
  const handleSubmit = async (event:any) => {
    event.preventDefault();
    if (
      formData.term_description === "" ||
      formData.type === "" 
     
    ) {
      alert("Por favor, preencha todos os dados !");
      return;
    }
    console.log('dados para o back',formData);
    try {
        const response = await axios.post(`${environment.apiUrl}/term/save`, formData);
      resetForm();
      alert('Dados salvos com sucesso!');
      window.history.back();
    } catch (error) {
      console.log(error);
      alert('Ocorreu um erro ao enviar os dados.');
    }
  }

  const [areaData, setAreaData] = useState<AreaDocument>();
  
  useEffect(() => {
    if(params.id !== 'new'){
      const fetchData = async () => {
        try {
          
          const response = await axios.get(`${environment.apiUrl}/term/${params.id}`); 
          setAreaData(response.data);
          
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  },[])

   
  useEffect(() => {
    if (areaData) {
      setFormData({
        ...formData,
        ...areaData
      });
    }
  }, [areaData]);
  
  if(status === "loading"){
    return <></>
  }

  return (
    <>
      <div className="flex justify-between items-center h-20 mb-5" >
        <PageTitleDefault title={params.id === 'new' ? 'Adicionar novo termo' : 'Visualisar termo'}/>
      </div>
      <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10">
        <div className="lg:col-span-2">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-4">
              <label htmlFor="name">Termo</label>
              <textarea
                name="term_description"
                id="term_description"
                className="h-80 border mt-1 rounded p-3 w-full bg-gray-50 uppercase"
                value={formData.term_description}
                onChange={handleChange}
                disabled={params.id !== 'new'}
              />   
            </div>
            <div className="md:col-span-1">
            <div className="flex items-center mt-5">
                <input type="radio" name="type" id="partner" value="partner" className="form-radio h-5 w-5 text-blue-500" onChange={handleChange} checked={formData.type === 'partner'} disabled={params.id !== 'new'}/>
                <label htmlFor="partner" className="ml-2">Parceiro</label>
              </div>
              <div className="flex items-center mt-2">
                <input type="radio" name="type" id="condominium" value="condominium" className="form-radio h-5 w-5 text-blue-500" onChange={handleChange} checked={formData.type === 'condominium'} disabled={params.id !== 'new'} />
                <label htmlFor="condominium" className="ml-2">Condomínio</label>
              </div>
              </div>
            <div className="md:col-span-5 text-right">
              <div className="inline-flex items-end gap-3 mt-5">
               <ButtonCancel route="term" label="Cancelar" />
               {params.id === 'new' && (
                  <ButtonAddLink route="term" label="cadastrar" onClick={handleSubmit} />
                )}
              </div>
            </div>
        </div>
    </div>
    </div>

    </>
  );
}