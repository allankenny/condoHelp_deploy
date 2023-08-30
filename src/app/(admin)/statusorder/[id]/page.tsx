"use client"
import axios from 'axios';
import { useState,useEffect } from "react";
import { PageTitleDefault } from "../../../../components/PageTitle";
import { ButtonAddLink, ButtonCancel } from "../../../../components/Buttons";
import {environment} from "../../../../environment/environment";
import  StatusDocument  from "../../../../interface/statusOrder";
interface ParamsProps {
  params: {
    id: string;
  }
}

export default function StatusOrder({params}:ParamsProps) {
    const [formData, setFormData] = useState({
    name: "",
  });

  

  const handleChange = (event:any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  

  const resetForm = () => {
    setFormData({
      name: "",
    });
  };

  
  const handleSubmit = async (event:any) => {
    event.preventDefault();
    if (
      formData.name === ""    
    ) {
      alert("Por favor, preencha todos os dados !");
      return;
    }
    try {
      if ( params.id === 'new'){
        const response = await axios.post(`${environment.apiUrl}/statusOrder/save`, formData);
      } else {
       await axios.put(`${environment.apiUrl}/statusOrder/update/${params.id}`, formData);

      }
      resetForm();
      alert('Dados salvos com sucesso!');
      window.history.back();
    } catch (error) {
      console.log(error);
      alert('Ocorreu um erro ao enviar os dados.');
    }
  }

  const [statusData, setStatusData] = useState<StatusDocument>();
  
  useEffect(() => {
    if(params.id !== 'new'){
      const fetchData = async () => {
        try {
          
          const response = await axios.get(`${environment.apiUrl}/statusOrder/${params.id}`); 
          setStatusData(response.data);
          
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  },[])

   
  useEffect(() => {
    if (statusData) {
      setFormData({
        ...formData,
        ...statusData
      });
    }
  }, [statusData]);
  
  

  return (
    <>
      <div className="flex justify-between items-center h-20 mb-5" >
        <PageTitleDefault title={params.id === 'new' ? 'Adicionar novo Status' : 'Atualizar Status'}/>
      </div>
      <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10">
        <div className="lg:col-span-2">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-3">
              <label htmlFor="name">Nome Status</label>
              <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase"  value={formData.name} onChange={handleChange}/>
              
            </div>
            <div className="md:col-span-5 text-right">
              <div className="inline-flex items-end gap-3 mt-5">
               <ButtonCancel route="statusorder" label="Cancelar" />
                <ButtonAddLink route="statusorder" label={params.id === 'new' ? 'Cadastrar' : 'Salvar'} onClick={handleSubmit} />
              </div>
            </div>
        </div>
    </div>
    </div>

    </>
  );
}