"use client";
import React, { useEffect, useState } from "react"
import * as yup from "yup";
import InputMask from 'react-input-mask';
import { yupResolver } from "@hookform/resolvers/yup";
import { authOptions, ICredentials } from "../utils/authOptions";
import { redirect, useRouter } from "next/navigation";
import { getSession, signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import Link from "next/link";
import { ButtonAddLink, ButtonCancel } from "../components/Buttons";
import { EyeIcon } from "@heroicons/react/24/solid";
import AreaDocument from "../interface/area";
import axios from "axios";
import { environment } from "../environment/environment";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showFormUserPartner, setShowFormUserPartner] = useState<boolean>(false);
  const [showFormUserTownhouse, setShowFormUserTownhouse] = useState<boolean>(false);
  const [areasData, setAreas] = useState<AreaDocument[]>([]);
  const [formDataPartner, setFormDataPartner] = useState({
    legal_name: "",
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    cellphone: "",
    contact_name: "",
    zip: "",
    address: "",
    address_complement: "",
    address_number: "",
    address_neighborhood: "",
    address_state: "",
    address_city: "",
    service_area_id: "",
    user_id: "",
    password: "",
    password2: ""
  });

  const validationForm = yup.object().shape({
    email: yup.string().required("O Campo é obrigatorio!"),
    password: yup
      .string()
      .min(8, "A senha deve ter no minimo 8 digitos")
      .required("O Campo é obrigatorio!"),
  });

  const submitForm = async (data: ICredentials) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    setIsLoading(false);
    requireAuth(result);
  };

  const handleSubmitPartner = async (event: any) => {
    event.preventDefault();
    if (
      formDataPartner.contact_name === "" ||
      formDataPartner.name === "" ||
      formDataPartner.cnpj === "" ||
      formDataPartner.email === "" ||
      formDataPartner.password === "" ||
      (formDataPartner.service_area_id || []).length === 0
    ) {
      alert("Por favor, preencha todos os campos !");
      return;
    }
    if (formDataPartner.password !== formDataPartner.password2) {
      alert("As senhas não coincidem.");
      return;
    }
    try {
      // Remover caracteres não numéricos do CNPJ, phone, cellphone e zip
      const cnpj = formDataPartner.cnpj.replace(/\D/g, '');
      const phone = formDataPartner.phone.replace(/\D/g, '');
      const cellphone = formDataPartner.cellphone.replace(/\D/g, '');
      const zip = formDataPartner.zip.replace(/\D/g, '');

      // Criar um novo objeto com os dados do formulário e os valores sem formatação
      const { password2, ...data } = {
        ...formDataPartner,
        cnpj,
        phone,
        cellphone,
        zip
      };
      await axios.post(`${environment.apiUrl}/partner/save`, data);
      resetForm();
      alert('Dados salvos com sucesso! Aguarde, seu cadastro esta aguardando aprovação.');
      backLogin();
    } catch (error) {
      console.log(error);
      alert('Ocorreu um erro ao enviar os dados.');
    }
  }

  const resetForm = () => {
    setFormDataPartner({
      legal_name: "",
      name: "",
      cnpj: "",
      email: "",
      phone: "",
      cellphone: "",
      contact_name: "",
      zip: "",
      address: "",
      address_complement: "",
      address_number: "",
      address_neighborhood: "",
      address_state: "",
      address_city: "",
      service_area_id: "",
      user_id: "",
      password: "",
      password2: ""
    });
  };

  function requireAuth(result: any) {
    if (result?.url) {
      console.log('resultado do loginnn', result);
      return router.replace(`/dashboard`)
    } else {
      let message = "Erro ao solicitar a autenticação";
      if (result?.status === 401) {
        message = "Usuario ou senha invalido";
      };
    }
  }

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${environment.apiUrl}/area/list`);
      setAreas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleChange = (event: any) => {
    const { name, value, type } = event.target;
    if (type === 'checkbox') {
      setFormDataPartner((prevFormData: any) => {
        if (event.target.checked) {
          // Adiciona o valor ao array se a caixa de seleção estiver marcada e o valor ainda não estiver presente
          return { ...prevFormData, [name]: [...(prevFormData[name] || []), value].filter((v, i, a) => a.indexOf(v) === i) };
        } else {
          // Remove o valor do array se a caixa de seleção não estiver marcada
          return { ...prevFormData, [name]: (prevFormData[name] || []).filter((v: any) => v !== value) };
        }
      });
    } else {
      // Armazena um único valor para outros tipos de campos
      setFormDataPartner((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };
  
  function handleFileChange(event: any) {
    const file = event.target.files[0];
    // Faça algo com o arquivo selecionado pelo usuário
  }
  
  const backLogin = () => {
    setShowFormUserPartner(false);
    setShowFormUserTownhouse(false)
  };
  
  const { handleSubmit, register, formState } = useForm({
    resolver: yupResolver(validationForm),
  });

  useEffect(() => {
    fetchAreas();
  }, []);
  
  return (
    <div className="h-screen md:flex">
      <div
        className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-600 to-blue-950 i justify-around items-center hidden">
        <div className="flex justify-center items-center flex-col">
          <picture>
            <img
              className="w-60 h-auto"
              src="/logo.png"
              alt="condo help"
            />
          </picture>
          <p className="text-white mt-1">Conectando condomínios aos melhores prestadores de serviço!</p>
          <Link
            href={'http://condohelpdf.com.br/'}
            target={"_blank"}
          >
            <button type="submit" className="block bg-white text-blue-600 mt-4 py-2 px-4 rounded-2xl font-bold mb-2">Saiba mais...</button>
          </Link>
        </div>
        {/* <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div> */}
      </div>
      <div className="flex md:w-1/2 justify-center  items-center bg-white sm:items-center flex-col h-screen">
        
          {!showFormUserPartner && !showFormUserTownhouse && (
            <div className="w-[60%] max-[767px]:w-[80%] bg-white">
              <div className="hidden max-[767px]:flex w-full bg-white justify-center items-center mb-10">
                <picture>
                  <img
                    className="w-60 h-auto"
                    src="/logo_login_full.png"
                    alt="condo help"
                  />
                </picture>
              </div>
              <form className="bg-white"
                onSubmit={handleSubmit(submitForm)}
              >
                <h1 className="text-gray-800 font-bold text-2xl mb-1">Ola!</h1>
                <p className="text-sm font-normal text-gray-600 mb-7">Seja bem vindo.</p>

                <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    className="pl-2 outline-none border-none w-full"
                    type="text"
                    placeholder="Email"
                    {...register("email")}
                  />
                </div>
                {formState.errors.email && (
                  <p
                    style={{ color: "red" }}
                    className="text-sm text-red-500 mt-2 ml-2 hover:none"
                  >
                    {formState.errors.email.message}
                  </p>
                )}
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd" />
                  </svg>
                  <input
                    className="pl-2 outline-none border-none w-full"
                    type="password"
                    placeholder="Senha"
                    {...register("password")}
                  />
                </div>
                {formState.errors.password && (
                  <p style={{ color: "red" }} className="text-sm mt-2 ml-2">
                    {formState.errors.password.message}
                  </p>
                )}
                <button type="submit" className="flex justify-center w-full bg-blue-700 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">
                  {(isLoading && (
                    <AiOutlineLoading className="animate-spin" size={20} />
                  )) ||
                    "Entrar"
                  }
                </button>
              </form>
              <div className="flex justify-between items-center mt-4">
                <button className="text-sm hover:text-blue-500 cursor-pointer p-2 border rounded-2xl" onClick={() => setShowFormUserPartner(true)}>Cadastrar Parceiro</button>
                <button className="text-sm hover:text-blue-500 cursor-pointer p-2 border rounded-2xl" onClick={() => setShowFormUserTownhouse(true)}>Cadastrar Condomínio</button>
              </div>
            </div>
          )}

          {showFormUserPartner  && (
            <div className="w-[90%] max-[767px]:w-[90%] bg-white overflow-auto">
              <div className="hidden max-[767px]:flex w-full bg-white justify-center items-center mb-10">
                <picture>
                  <img
                    className="w-60 h-auto"
                    src="/logo_login_full.png"
                    alt="condo help"
                  />
                </picture>
              </div>

              <h1 className="text-gray-800 font-bold text-2xl mb-1">Cadastro de Condomínio</h1>
              <p className="text-sm font-normal text-gray-600 mb-7">Seja bem vindo.</p>

              <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10">
                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-3">
                      <label htmlFor="legal_name">Razão Social</label>
                      <input type="text" name="legal_name" id="legal_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formDataPartner.legal_name} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="name">Nome Fantasia</label>
                      <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formDataPartner.name} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="cnpj">CNPJ</label>
                      <InputMask mask="99.999.999/9999-99" type="text" name="cnpj" id="cnpj" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={formDataPartner.cnpj} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="phone">Telefone</label>
                      <InputMask mask="(99) 9999-9999" type="text" name="phone" id="phone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formDataPartner.phone} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="cellphone">Celular</label>
                      <InputMask mask="(99) 99999-9999" type="text" name="cellphone" id="cellphone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formDataPartner.cellphone} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="contact_name">Nome Contato</label>
                      <input type="text" name="contact_name" id="contact_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formDataPartner.contact_name} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="email">Email</label>
                      <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="email@email.com" value={formDataPartner.email} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="password">Senha</label>
                      <input type={showPassword ? "text" : "password"} maxLength={10} minLength={8} name="password" id="password" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" autoComplete="off" value={formDataPartner.password} onChange={handleChange}
                      />
                    </div>
                    <div className="md:col-span-1 relative">
                      <label htmlFor="password2">Repetir Senha</label>
                      <input type={showPassword ? "text" : "password"} name="password2" id="password2" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 pr-10" maxLength={10} minLength={8} autoComplete="off" value={formDataPartner.password2}
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
                    <div className="md:col-span-1">
                      <label htmlFor="zip">CEP</label>
                      <InputMask mask="99999-999" type="text" name="zip" id="zip" className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formDataPartner.zip} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="address">Endereço</label>
                      <input type="text" name="address" id="address" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formDataPartner.address} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="address_number">Número</label>
                      <input type="text" name="address_number" id="address_number" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formDataPartner.address_number} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address_complement">Complemento</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input name="address_complement" id="address_complement" placeholder="" className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent uppercase" value={formDataPartner.address_complement} onChange={handleChange} />


                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address_neighborhood">Bairro</label>
                      <input type="text" name="address_neighborhood" id="address_neighborhood" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formDataPartner.address_neighborhood} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="address_state">UF</label>
                      <input type="text" name="address_state" id="address_state" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formDataPartner.address_state} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address_city">Cidade</label>
                      <input type="text" name="address_city" id="address_city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formDataPartner.address_city} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="logo">Logo</label>
                      <div className="flex">
                        <input type="text" name="logo" id="logo" className="h-10 border mt-1 rounded-tl-md rounded-bl-md px-4 w-full bg-gray-50" placeholder="Carregar Arquivo" onChange={handleChange} />
                        <button className="h-10 border mt-1 rounded-tr-md rounded-br-md px-4 bg-gray-50" onClick={() => {
                          const fileInput = document.getElementById('fileInput');
                          if (fileInput) {
                            fileInput.click();
                          }
                        }}>Procurar</button>
                      </div>
                      <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="service_area_id">Área de Serviço</label>
                      <div className="flex flex-wrap">
                        {areasData.filter(area => area.status === 'ativo').map((area) => (
                          <div key={area.id} className="flex items-center mr-4 mb-2">
                            <input
                              type="checkbox"
                              name="service_area_id"
                              value={area.id}
                              onChange={handleChange}
                              className="form-checkbox mt-2 h-5 w-5 text-indigo-600 rounded"
                            />
                            <label className="ml-1 mt-2 text-gray-700 uppercase">{area.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end gap-3 mt-5">
                        <ButtonCancel route="dashboard" label="Cancelar" />
                        <ButtonAddLink route="partner" label='Cadastrar' onClick={handleSubmitPartner} />
                      </div>
                    </div>

                  </div>
                </div>
              </div>


              {/* <button type="submit" className="flex justify-center w-full bg-blue-700 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">
                {(isLoading && (
                  <AiOutlineLoading className="animate-spin" size={20} />
                )) ||
                  "Cadastrar"
                }
              </button> */}

              <div className="flex justify-between items-center mt-4">
                <button className="text-sm hover:text-blue-500 cursor-pointer" onClick={() => backLogin()}>Voltar</button>
              </div>
            </div>
          )}
          {showFormUserTownhouse && (
            <div className="w-[60%] max-[767px]:w-[80%] bg-white">
              <div className="hidden max-[767px]:flex w-full bg-white justify-center items-center mb-10">
                <picture>
                  <img
                    className="w-60 h-auto"
                    src="/logo_login_full.png"
                    alt="condo help"
                  />
                </picture>
              </div>
              {/* <form className="bg-white"
                onSubmit={handleSubmit(submitForm)}
              >
                <h1 className="text-gray-800 font-bold text-2xl mb-1">Cadastro de Parceiro</h1>
                <p className="text-sm font-normal text-gray-600 mb-7">Seja bem vindo.</p>

                <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    className="pl-2 outline-none border-none w-full"
                    type="text"
                    placeholder="Email"
                    {...register("email")}
                  />
                </div>
                {formState.errors.email && (
                  <p
                    style={{ color: "red" }}
                    className="text-sm text-red-500 mt-2 ml-2 hover:none"
                  >
                    {formState.errors.email.message}
                  </p>
                )}
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd" />
                  </svg>
                  <input
                    className="pl-2 outline-none border-none w-full"
                    type="password"
                    placeholder="Senha"
                    {...register("password")}
                  />
                </div>
                {formState.errors.password && (
                  <p style={{ color: "red" }} className="text-sm mt-2 ml-2">
                    {formState.errors.password.message}
                  </p>
                )}
                <button type="submit" className="flex justify-center w-full bg-blue-700 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">
                  {(isLoading && (
                    <AiOutlineLoading className="animate-spin" size={20} />
                  )) ||
                    "Cadastrar"
                  }
                </button>
              </form> */}
              <div className="flex justify-between items-center mt-4">
                <button className="text-sm hover:text-blue-500 cursor-pointer" onClick={() => backLogin()}>Voltar</button>
              </div>
            </div>
          )}
        
      </div>
    </div>

  )
}
