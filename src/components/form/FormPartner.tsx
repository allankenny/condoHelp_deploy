"use client"
import axios from 'axios';
import InputMask from 'react-input-mask';
import { useState, useEffect } from "react";
import { ButtonAddLink, ButtonCancel, ButtonConfirm, ButtonTerm } from "../../components/Buttons";
import { environment } from "../../environment/environment";
import TownhouseDocument from "../../interface/townhouse";
import { EyeIcon } from "@heroicons/react/24/solid";
import AreaDocument from '../../interface/area';

interface FormPartnerProps {
  backLogin: () => void; // Define o tipo da função backLogin
}

export default function FormPartner({ backLogin }: FormPartnerProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showTerm, setShowTerm] = useState(false);
  const [areasData, setAreas] = useState<AreaDocument[]>([]);
  const [termData, setTermData] = useState({ term_description: '' });
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


  const handleSubmitPartner = async (event: any) => {
    event.preventDefault();
    setShowSubmitButton(false);

    const checkbox = document.getElementById("flexSwitchCheckDefault") as HTMLInputElement;
    if (checkbox && !checkbox.checked) {
      alert("Você deve aceitar os termos antes de continuar.");
      return;
    }
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
      resetFormPartner();
      alert('Dados salvos com sucesso!');
      backLogin();
    } catch (error) {
      console.log(error);
      setShowSubmitButton(true);
      alert('Ocorreu um erro ao enviar os dados.');
    }
  }

  const resetFormPartner = () => {
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





  const fetchTermData = async () => {
    try {

      const response = await axios.get(`${environment.apiUrl}/term/list/partnerTerm`);
      setTermData(response.data);
      console.log('retorno termo', response.data);
    } catch (error) {
      console.log(error);
      alert('Ocorreu um erro.');
    }
  };



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
    fetchTermData();
  }, []);

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

  useEffect(() => {
    const fetchCepData = async (cep: any) => {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        setFormDataPartner((prevState) => ({
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
    if (formDataPartner.zip.length === 9) {
      fetchCepData(formDataPartner.zip);
    }
  }, [formDataPartner.zip]);

  function handleFileChange(event: any) {
    const file = event.target.files[0];
    // Faça algo com o arquivo selecionado pelo usuário
  }

  const acceptTerm = () => {
    setTimeout(() => {
      setShowTerm(false);
      setShowForm(true);
      setShowSubmitButton(true);
    }, 500);
  };

  const backForm = () => {
    setShowTerm(false);
    setShowForm(true);
  };

  const handleShowTermPartner = async (event: any) => {
    setShowForm(false);
    setShowTerm(true);

  }


  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const checkPassword = (pass: string) => {
    if (pass.length < 8) {
      alert('A senha deve ter no mínimo 8 dígitos!')
    }
  }


  return (
    <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md pb-10 pr-10 pl-10">
      <div className={`md:col-span-2 ${showTerm ? 'block' : 'hidden'}`}>
        <div className="md:col-span-5">
          <label htmlFor="name" className='text-center'>Termos e condições de uso.</label>
          <textarea
            name="term_description"
            id="term_description"
            className="h-80 border mt-1 rounded p-3 w-full bg-gray-50 uppercase text-[11px]"
            value={termData.term_description}
            disabled
          />
        </div>
        <div className="flex items-center">
          <input
            className="mr-2 mt-[1.1rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue-500 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-500 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-blue-500 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-blue-500 dark:checked:after:bg-blue-500 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
            onChange={(e) => {
              if (e.target.checked) {
                acceptTerm();
              }
            }}
          />
          <label
            className="inline-block pl-[0.15rem] hover:cursor-pointer mt-[1.1rem]"
            htmlFor="flexSwitchCheckDefault"
          >
            Li e aceito os termos e condições.
          </label>
        </div>
        <div className='md:col-span-5 mt-[1.1rem] flex justify-end'>
          <ButtonTerm route="" label="Voltar para tela de cadastro" onClick={backForm} />
        </div>

      </div>

      <div className={`md:col-span-2 ${showForm ? 'block' : 'hidden'}`}>
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
          <div style={{display: 'none'}}>
              <input type="password" id="hiddenPassword" autoComplete="new-password" />
            </div>
          <div className="md:col-span-5">
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" autoComplete="nope" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 lowercase" placeholder="email@email.com" value={formDataPartner.email} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="password">Senha <span className="text-[10px] italic text-zinc-500"> mínimo de 8 digitos</span></label>
            <input type={showPassword ? "text" : "password"} maxLength={10} minLength={8} name="password" id="password" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" autoComplete="off" onBlur={() => checkPassword(formDataPartner.password)} value={formDataPartner.password} onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2 relative">
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
          <div className="md:col-span-4">
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
          <div className="md:col-span-5">
            <label htmlFor="address_city">Cidade</label>
            <input type="text" name="address_city" id="address_city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formDataPartner.address_city} onChange={handleChange} />
          </div>
          
          <div className="md:col-span-5">
            <label htmlFor="service_area_id">Área de Serviço</label>
            <div className="flex flex-wrap">
              {areasData.filter(area => area.status === 'ativo').map((area) => (
                <div key={area.id} className="flex items-center mr-4 mb-2">
                  <input
                    type="checkbox"
                    id="service_area_id"
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



          <div className="md:col-span-5 mt-5 flex flex-col items-center justify-center">
            <ButtonTerm route="" label='Termos e condições de uso' onClick={handleShowTermPartner} />
            <span className="text-[11px] text-gray-400">*Faça o aceite dos termos e condições para liberação do cadastro.</span>
          </div>


          <div className={`md:col-span-5 text-right  ${showSubmitButton ? 'block' : 'hidden'}`}>
            <div className="inline-flex items-end gap-3 mt-5">
              <ButtonCancel route="" label="Cancelar" />
              <ButtonAddLink route="partner" label='Cadastrar' onClick={handleSubmitPartner} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}