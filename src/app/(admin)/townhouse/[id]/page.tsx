"use client"
import axios from 'axios';
import InputMask from 'react-input-mask';
import { useState, useEffect } from "react";
import { PageTitleDefault } from "../../../../components/PageTitle";
import { ButtonAddLink, ButtonCancel } from "../../../../components/Buttons";
import { environment } from "../../../../environment/environment";
import TownhouseDocument from "../../../../interface/townhouse";
import { EyeIcon } from "@heroicons/react/24/solid";
import { useSession } from 'next-auth/react';
import { storage } from '../../../../libs/firebase';
import { v4 as createId} from 'uuid';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface ParamsProps {
  params: {
    id: string;
  }
}

export default function Townhouse({ params }: ParamsProps) {
  const { data: session, status } = useSession({
    required: true,
  })

  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    cellphone: "",
    admin_name: "",
    responsible_name: "",
    zip: "",
    address: "",
    address_number: "",
    address_complement: "",
    address_neighborhood: "",
    address_state: "",
    address_city: "",
    valid_at: "",
    user_id: "",
    password: "",
    password2: "",
    logo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [townhouseData, setTownhouseData] = useState<TownhouseDocument>();

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cnpj: "",
      email: "",
      phone: "",
      cellphone: "",
      admin_name: "",
      responsible_name: "",
      zip: "",
      address: "",
      address_number: "",
      address_complement: "",
      address_neighborhood: "",
      address_state: "",
      address_city: "",
      valid_at: "",
      user_id: "",
      password: "",
      password2: "",
      logo: "",
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
      formData.name === "" ||
      formData.cnpj === "" ||
      formData.email === "" ||
      formData.phone === "" ||
      formData.cellphone === "" ||
      formData.admin_name === "" ||
      formData.responsible_name === "" ||
      formData.zip === "" ||
      formData.address === "" ||
      formData.address_number === "" ||
      formData.address_neighborhood === "" ||
      formData.address_state === "" ||
      formData.address_city === "" ||
      formData.address_number === ""
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

      if (params.id === 'new') {
        if (formData.password === "") {
          alert("Por favor, preencha todos os campos !");
          return;
        }
        await axios.post(`${environment.apiUrl}/townhouse/save`, data);
      } else {
        await axios.put(`${environment.apiUrl}/townhouse/update/${params.id}`, data);

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
    if (params.id !== 'new') {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${environment.apiUrl}/townhouse/${params.id}`);
          setTownhouseData(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, []);

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)){
      if(formData.logo?.length > 0){
        removeImage(formData.logo); 
      }
      setFile(file);
      insertImage(file);
    }else{
      alert("Formato inválido");
    }
  }

  const insertImage = async (file:File) => {
    let randomName = createId()
    let newFile = ref(storage, randomName)
    let upload = await uploadBytes(newFile, file);
    let imageUrl = await getDownloadURL(upload.ref);
    setFormData((prevFormData) => ({ ...prevFormData, ['logo']: imageUrl }));
  }

  const removeImage = async (file:string) => {
    let imageRef = ref(storage, file);
    setFormData((prevFormData) => ({ ...prevFormData, ['logo']: '' }));
    await deleteObject(imageRef).then(() => {
      setFile(null);
      console.log('Imagem deletada com sucesso!');
    }).catch((error) => {
      console.log(error)
      alert('Erro ao deletar imagem');
    });
  }

  useEffect(() => {
    if (townhouseData) {
      setFormData({
        ...formData,
        ...townhouseData
      });
    }
  }, [townhouseData]);

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  if (status === "loading") {
    return <></>
  }


  return (
    <>
      <div className="flex justify-between items-center h-20 mb-5" >
        <PageTitleDefault title={params.id === 'new' ? 'Adicionar novo condomínio' : 'Atualizar condomínio'} />
      </div>
      <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10">
        <div className="lg:col-span-2">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-3">
              <label htmlFor="name">Nome</label>
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
              <label htmlFor="admin_name">Síndico</label>
              <input type="text" name="admin_name" id="admin_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.admin_name} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="responsible_name">Encarregado</label>
              <input type="text" name="responsible_name" id="responsible_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.responsible_name} placeholder="" onChange={handleChange} />
            </div>
            <div style={{display: 'none'}}>
              <input type="password" id="hiddenPassword" autoComplete="new-password" />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 lowercase" placeholder="email@email.com" value={formData.email} autoComplete="off" onChange={handleChange} />
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

            <div className="md:col-span-1">
              <label htmlFor="zip">CEP</label>
              <InputMask mask="99999-999" type="text" name="zip" id="zip"
                className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                value={formData.zip} onChange={handleChange}
              />
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
              <input type="text" name="address_neighborhood" id="address_neighborhood" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.address_neighborhood} placeholder="" onChange={handleChange} />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="address_state">UF</label>
              <input type="text" name="address_state" id="address_state" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.address_state} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address_city">Cidade</label>
              <input type="text" name="address_city" id="address_city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.address_city} onChange={handleChange} />
            </div>

            <input type="hidden" name="valid_at" id="valid_at" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.valid_at} onChange={handleChange} />


            <input type="hidden" name="user_id" id="user_id" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.user_id} onChange={handleChange} />

            <div className="md:col-span-3">
              <label htmlFor="logo">Logo</label>
              <div className="flex">
                <input type="text" name="logo" id="logo" className="h-10 border mt-1 rounded-tl-md rounded-bl-md px-4 w-full bg-gray-50" placeholder="Carregar Arquivo" value={file?.name}/>
                <button className="h-10 border mt-1 rounded-tr-md rounded-br-md px-4 bg-gray-50" onClick={() => {
                  const fileInput = document.getElementById('fileInput');
                  if (fileInput) {
                    fileInput.click();
                  }
                }}>Procurar</button>
              </div>
              <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
            </div>
            <div className="flex items-center justify-center w-full">
              {formData.logo && formData.logo.length > 0 && (
                <div className='flex mt-4 gap-2'>
                  <div
                    className='flex flex-col items-center'
                  >
                    <picture >
                      <img
                        className="object-cover h-48 w-96 rounded-lg"
                        src={formData.logo}
                        alt=""
                      />
                    </picture>
                    <button className='mt-2 bg-rose-500 p-2 text-white hover:bg-rose-600 rounded-lg' onClick={()=>removeImage(formData.logo)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-trash" viewBox="0 0 16 16"> 
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="white">
                        </path> 
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="white">
                        </path> 
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-5 text-right">
              <div className="inline-flex items-end gap-3 mt-5">
                <ButtonCancel route="dashboard" label="Cancelar" />
                <ButtonAddLink route="townhouse" label={params.id === 'new' ? 'Cadastrar' : 'Salvar'} onClick={handleSubmit} />
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}