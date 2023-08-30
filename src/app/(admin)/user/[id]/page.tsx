"use client"
import axios from 'axios';
import { useState,useEffect } from "react";
import { PageTitleDefault } from "../../../../components/PageTitle";
import { ButtonAddLink, ButtonCancel } from "../../../../components/Buttons";
import { EyeIcon } from "@heroicons/react/24/solid";
import {environment} from "../../../../environment/environment";
import  UserDocument  from "../../../../interface/user";
import { useSession } from 'next-auth/react';

interface ParamsProps {
  params: {
    id: string;
  }
}

export default function User({params}:ParamsProps) {
  const { data: session, status } = useSession({
    required: true,
  })
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<UserDocument>();

  const handleChange = (event:any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password2: ""
    });
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    if (
      formData.name === "" ||
      formData.email === ""||
      formData.password === ""
    ) {
      alert("Por favor, preencha todos os campos !");
      return;
    }
    if (formData.password !== formData.password2) {
      alert("As senhas não coincidem.");
      return;
    }
    try {
      const { password2, ...data } = {
        ...formData,
      };
     
      if ( params.id === 'new'){
       await axios.post(`${environment.apiUrl}/user/save`, data);
      } else {
       await axios.put(`${environment.apiUrl}/user/update/${params.id}`, data);
  
      }
      resetForm();
      alert('Dados salvos com sucesso!');
      window.history.back();
    } catch (error) {
      console.log(error);
      alert('Ocorreu um erro ao enviar os dados.');
    }
  }

  useEffect(() => {
    if(params.id !== 'new'){
      const fetchData = async () => {
        try {
          console.log('cima');
          const response = await axios.get(`${environment.apiUrl}/user/${params.id}`); 
          console.log('baixo');
          setUserData(response.data);
          
        } catch (error) {
          console.log('Erro ao buscar dados do usuário:', error);;
        }
      };
      fetchData();
    }
  },[])

   
  useEffect(() => {
    if (userData) {
      setFormData({
        ...formData,
        ...userData
      });
    }
  }, [userData]);

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  if(status === "loading"){
    return <></>
  }

  return (
    <>
      <div className="flex justify-between items-center h-20 mb-5" >
      <PageTitleDefault title={params.id === 'new' ? 'Adicionar novo usuário' : 'Atualizar usuário'}/>
      </div>
      <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10">
        <div className="lg:col-span-2">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-5">
              <label htmlFor="name">Nome Completo</label>
              <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.name} onChange={handleChange}/>
            </div>

            <div className="md:col-span-3">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="email@email.com" value={formData.email} onChange={handleChange} />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="password">Senha</label>
              <input type={showPassword ? "text" : "password"} maxLength={10} minLength={8} name="password" id="password" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" autoComplete="off" value={formData.password} onChange={handleChange}
              />
            </div>
            <div className="md:col-span-1 relative">
              <label htmlFor="password2">Confirmação da Senha</label>
              <input type={showPassword ? "text" : "password"} name="password2" id="password2" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 pr-10" maxLength={10} minLength={8} autoComplete="off" value={formData.password2}
                onChange={handleChange}
              />
              <div
                className="absolute right-4 top-9 cursor-pointer"
                style={{ color: "lightgray" }}
                title="Ver senha"
                onClick={handleToggleShowPassword}
              >
                <EyeIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="md:col-span-5 text-right mt-5">
              <div className="inline-flex items-end gap-3">
                <ButtonCancel  route="user" label="Cancelar"/>
                <ButtonAddLink route="user" label={params.id === 'new' ? 'Cadastrar' : 'Salvar'} onClick={handleSubmit} />
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}