"use client"
import axios from 'axios';
import InputMask from 'react-input-mask';
import { useState, useEffect } from "react";
import { ButtonAddLink, ButtonCancel } from "../../components/Buttons";
import { environment } from "../../environment/environment";
import TownhouseDocument from "../../interface/townhouse";
import { EyeIcon } from "@heroicons/react/24/solid";

export default function FormTownhouse() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
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
  });

  const handleChangeTownhouse = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  function handleFileChangeTownhouse(event: any) {
    const file = event.target.files[0];
    // Faça algo com o arquivo selecionado pelo usuário
  }

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

  const handleSubmitTownhouse = async (event: any) => {
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
    if (formData.password.length < 8) {
      alert("A senha deve ter mais que 8 dígitos.");
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

      console.log(data);

      if (formData.password === "") {
        alert("Por favor, preencha todos os campos !");
        return;
      }
      await axios.post(`${environment.apiUrl}/townhouse/save`, data);
      resetForm();
      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.log(error);
      alert('Ocorreu um erro ao enviar os dados.');
    }
    
  }

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const checkPassword = (pass: string) => {
    console.log(pass.length);
    alert('A senha deve ter no mínimo 8 dígitos!')
  }

  return (
    <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10">
      <div className="lg:col-span-2">
        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-3">
            <label htmlFor="name">Nome</label>
            <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.name} onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="cnpj">CNPJ</label>
            <InputMask mask="99.999.999/9999-99" type="text" name="cnpj" id="cnpj" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={formData.cnpj} onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="phone">Telefone</label>
            <InputMask mask="(99) 9999-9999" type="text" name="phone" id="phone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.phone} onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="cellphone">Celular</label>
            <InputMask mask="(99) 99999-9999" type="text" name="cellphone" id="cellphone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.cellphone} onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="admin_name">Síndico</label>
            <input type="text" name="admin_name" id="admin_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.admin_name} onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="responsible_name">Encarregado</label>
            <input type="text" name="responsible_name" id="responsible_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.responsible_name} placeholder="" onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-5">
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 lowercase" placeholder="email@email.com" value={formData.email} autoComplete="off" onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="password">Senha <span className="text-[10px] italic text-zinc-500"> mínimo de 8 digitos</span></label>
            <input type={showPassword ? "text" : "password"} maxLength={10} minLength={8} name="password" id="password" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" autoComplete="off" onBlur={() => checkPassword(formData.password)} value={formData.password} onChange={handleChangeTownhouse}
            />
          </div>
          <div className="md:col-span-2 relative">
            <label htmlFor="password2">Confirmação da Senha</label>
            <input type={showPassword ? "text" : "password"} name="password2" id="password2" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 pr-10" maxLength={10} minLength={8} autoComplete="off" value={formData.password2}
              onChange={handleChangeTownhouse}
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
              value={formData.zip} onChange={handleChangeTownhouse}
            />
          </div>
          <div className="md:col-span-4">
            <label htmlFor="address">Endereço</label>
            <input type="text" name="address" id="address" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.address} onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="address_number">Número</label>
            <input type="text" name="address_number" id="address_number" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.address_number} onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address_complement">Complemento</label>
            <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
              <input name="address_complement" id="address_complement" placeholder="" className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent uppercase" value={formData.address_complement} onChange={handleChangeTownhouse} />
            </div>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address_neighborhood">Bairro</label>
            <input type="text" name="address_neighborhood" id="address_neighborhood" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" value={formData.address_neighborhood} placeholder="" onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="address_state">UF</label>
            <input type="text" name="address_state" id="address_state" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.address_state} onChange={handleChangeTownhouse} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address_city">Cidade</label>
            <input type="text" name="address_city" id="address_city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 uppercase" placeholder="" value={formData.address_city} onChange={handleChangeTownhouse} />
          </div>

          <input type="hidden" name="valid_at" id="valid_at" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.valid_at} onChange={handleChangeTownhouse} />


          <input type="hidden" name="user_id" id="user_id" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" value={formData.user_id} onChange={handleChangeTownhouse} />

          <div className="md:col-span-3">
            <label htmlFor="logo">Logo</label>
            <div className="flex">
              <input type="text" name="logo" id="logo" className="h-10 border mt-1 rounded-tl-md rounded-bl-md px-4 w-full bg-gray-50" placeholder="Carregar Arquivo" onChange={handleChangeTownhouse} />
              <button className="h-10 border mt-1 rounded-tr-md rounded-br-md px-4 bg-gray-50" onClick={() => {
                const fileInput = document.getElementById('fileInput');
                if (fileInput) {
                  fileInput.click();
                }
              }}>Procurar</button>
            </div>
            <input type="file" id="fileInput" className="hidden" onChange={handleFileChangeTownhouse} />
          </div>
          <div className="md:col-span-5 text-right">
            <div className="inline-flex items-end gap-3 mt-5">
              <ButtonCancel route="dashboard" label="Cancelar" />
              <ButtonAddLink route="townhouse" label="Cadastrar" onClick={handleSubmitTownhouse} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}