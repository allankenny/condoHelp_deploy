"use client"
import axios from 'axios';
import { useState, useEffect } from "react";
import InputMask from 'react-input-mask';
import { PageTitleDefault } from "../../../../components/PageTitle";
import { ButtonAddLink, ButtonCancel } from "../../../../components/Buttons";
import { environment } from "../../../../environment/environment";
import PartnerDocument from "../../../../interface/partner";
import AreaDocument from "../../../../interface/area";
import { EyeIcon } from "@heroicons/react/24/solid";
import { useSession } from 'next-auth/react';
interface ParamsProps {
  params: {
    id: string;
  }
}

export default function Partner({ params }: ParamsProps) {
  const { data: session, status } = useSession({
    required: true,
  })

  const [formData, setFormData] = useState({
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

  const [showPassword, setShowPassword] = useState(false);
  const [partnerData, setPartnerData] = useState<PartnerDocument>();
  const [areasData, setAreas] = useState<AreaDocument[]>([]);
  const [showServiceArea, setServiceArea] = useState(false);


  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${environment.apiUrl}/area/list`);
      setAreas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);


  const handleChange = (event: any) => {
    const { name, value, type } = event.target;
    if (type === 'checkbox') {
      setFormData((prevFormData: any) => {
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
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    // Faça algo com o arquivo selecionado pelo usuário
  }

  const resetForm = () => {
    setFormData({
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

  useEffect(() => {
    const fetchCepData = async (cep: any) => {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        setFormData((prevState) => ({
          ...prevState,
          address: response.data.logradouro,
          address_neighborhood: response.data.bairro,
          address_city: response.data.localidade,
          address_state: response.data.uf
        }));
      } catch (error) {
        console.log(error);
      }
    };
    if (formData.zip.length === 9) {
      fetchCepData(formData.zip);
    }
  }, [formData.zip]);


  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (
      formData.legal_name === "" ||
      formData.name === "" ||
      formData.cnpj === "" ||
      formData.email === "" 
    ) {
      alert("Por favor, preencha todos os campos !");
      return;
    }
    if (formData.password !== formData.password2) {
      alert("As senhas não coincidem.");
      return;
    }
    try {
      // Remover caracteres não numéricos do CNPJ, phone, cellphone e zip
      const cnpj = formData.cnpj.replace(/\D/g, '');
      const phone = formData.phone.replace(/\D/g, '');
      const cellphone = formData.cellphone.replace(/\D/g, '');
      const zip = formData.zip.replace(/\D/g, '');

      // Criar um novo objeto com os dados do formulário e os valores sem formatação
      const { password2, ...data } = {
        ...formData,
        cnpj,
        phone,
        cellphone,
        zip
      };
      console.log('dados enviados', data);
      if (params.id === 'new') {
        if (
          formData.password === "" ||
          (formData.service_area_id || []).length === 0
        ) {
          alert("Por favor, preencha todos os campos !");
          return;
        }
        await axios.post(`${environment.apiUrl}/partner/save`, data);
      } else {
        await axios.put(`${environment.apiUrl}/partner/update/${params.id}`, data);

      }
      resetForm();
      alert('Dados salvos com sucesso!');
      window.history.back();
    } catch (error) {
      console.log(error);
      alert('Ocorreu um erro ao enviar os dados.');
    }
  }

  const [serviceAreasData, setServiceAreasData] = useState<AreaDocument>();
  useEffect(() => {
    if(params.id !== 'new'){
      setServiceArea(true)
      const fetchData = async () => {
        try {
          
          const response = await axios.get(`${environment.apiUrl}/partner/${params.id}`); 
          const { service_areas, ...restData } = response.data;
          setPartnerData(restData);
          setServiceAreasData(service_areas);
          console.log('retornooooo',service_areas);  
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  },[])


  useEffect(() => {
    if (partnerData) {
      setFormData({
        ...formData,
        ...partnerData
      });
    }
  }, [partnerData]);

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };


  if (status === "loading") {
    return <></>
  }

  return (
    <>
      <div className="flex justify-between items-center h-20 mb-5" >
        <PageTitleDefault title={params.id === 'new' ? 'Adicionar novo parceiro' : 'Atualizar parceiro'} />
      </div>
      <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10">
        <div className="lg:col-span-2">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-3">
              <label htmlFor="legal_name">Razão Social</label>
              <input type="text" name="legal_name" id="legal_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.legal_name} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="name">Nome Fantasia</label>
              <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.name} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="cnpj">CNPJ</label>
              <InputMask mask="99.999.999/9999-99" type="text" name="cnpj" id="cnpj" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={formData.cnpj} onChange={handleChange} />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="phone">Telefone</label>
              <InputMask mask="(99) 9999-9999" type="text" name="phone" id="phone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="cellphone">Celular</label>
              <InputMask mask="(99) 99999-9999" type="text" name="cellphone" id="cellphone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.cellphone} onChange={handleChange} />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="contact_name">Nome Contato</label>
              <input type="text" name="contact_name" id="contact_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.contact_name} onChange={handleChange} />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 lowercase" placeholder="email@email.com" value={formData.email} onChange={handleChange} />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="password">Senha</label>
              <input type={showPassword ? "text" : "password"}  name="password" id="password" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" autoComplete="off" value={formData.password} onChange={handleChange}
              />
            </div>
            <div className="md:col-span-1 relative">
              <label htmlFor="password2">Confirmação da Senha</label>
              <input type={showPassword ? "text" : "password"} name="password2" id="password2" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 pr-10" autoComplete="off" value={formData.password2}
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
              <InputMask mask="99999-999" type="text" name="zip" id="zip" className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.zip} onChange={handleChange} />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="address">Endereço</label>
              <input type="text" name="address" id="address" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.address} onChange={handleChange} />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="address_number">Número</label>
              <input type="text" name="address_number" id="address_number" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.address_number} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address_complement">Complemento</label>
              <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                <input name="address_complement" id="address_complement" placeholder="" className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent uppercase" value={formData.address_complement} onChange={handleChange} />


              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address_neighborhood">Bairro</label>
              <input type="text" name="address_neighborhood" id="address_neighborhood" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.address_neighborhood} onChange={handleChange} />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="address_state">UF</label>
              <input type="text" name="address_state" id="address_state" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.address_state} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address_city">Cidade</label>
              <input type="text" name="address_city" id="address_city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.address_city} onChange={handleChange} />
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
            <div className={`mt-5 md:col-span-5 ${showServiceArea ? 'block' : 'hidden'}`}>
              <label  className=" text-gray-400" >Seus Serviços Cadastrados</label>
              <div className="flex flex-wrap items-center">
                {serviceAreasData?.map((area) => (
                  <div key={area.id} className="flex items-center mb-2 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 mr-2 text-gray-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <label htmlFor={`area_${area.id}`} className="text-gray-400 uppercase">
                      {area.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-5 text-right">
              <div className="inline-flex items-end gap-3 mt-5">
                <ButtonCancel route="dashboard" label="Cancelar" />
                <ButtonAddLink route="partner" label={params.id === 'new' ? 'Cadastrar' : 'Salvar'} onClick={handleSubmit} />
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}