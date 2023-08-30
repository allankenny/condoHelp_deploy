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
    name: "",
    status: "ativo"
   
  });

  

  const handleChange = (event:any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  

  const resetForm = () => {
    setFormData({
      name: "",
     status:""
    });
  };

  
  const handleSubmit = async (event:any) => {
    event.preventDefault();
    if (
      formData.name === "" ||
      formData.status === "" 
     
    ) {
      alert("Por favor, preencha todos os dados !");
      return;
    }
    console.log(formData.status);
    try {
      if ( params.id === 'new'){
        const response = await axios.post(`${environment.apiUrl}/area/save`, formData);
      } else {
       await axios.put(`${environment.apiUrl}/area/update/${params.id}`, formData);

      }
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
          
          const response = await axios.get(`${environment.apiUrl}/area/${params.id}`); 
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
        <PageTitleDefault title={params.id === 'new' ? 'Adicionar nova área' : 'Atualizar área'}/>
      </div>
      <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10">
        <div className="lg:col-span-2">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-3">
              <label htmlFor="name">Área de serviço</label>
              <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase"  value={formData.name} onChange={handleChange}/>
              
            </div>
            <div className="md:col-span-2">
            <div className="flex items-center mt-5">
                <input type="radio" name="status" id="ativo" value="ativo" className="form-radio h-5 w-5 text-blue-500" onChange={handleChange} checked={formData.status === 'ativo'} />
                <label htmlFor="ativo" className="ml-2">Ativo</label>
              </div>
              <div className="flex items-center mt-2">
                <input type="radio" name="status" id="inativo" value="inativo" className="form-radio h-5 w-5 text-blue-500" onChange={handleChange} checked={formData.status === 'inativo'} />
                <label htmlFor="inativo" className="ml-2">Inativo</label>
              </div>
              </div>
            <div className="md:col-span-5 text-right">
              <div className="inline-flex items-end gap-3 mt-5">
               <ButtonCancel route="area" label="Cancelar" />
                <ButtonAddLink route="area" label={params.id === 'new' ? 'cadastrar' : 'salvar'} onClick={handleSubmit} />
              </div>
            </div>
        </div>
    </div>
    </div>

    </>
  );
}