"use client"
import { useState, useEffect, useCallback, Key } from "react";
import axios from 'axios';
import InputMask from 'react-input-mask';
import { PageSubTitle } from "../../../../components/PageSubTitle";
import { PageTitleDefault } from "../../../../components/PageTitle";
import { ButtonAddLink, ButtonCancel, Spinner } from "../../../../components/Buttons";
import AreaDocument from "../../../../interface/area";
import OrderDocument from "../../../../interface/order";
import { environment } from "../../../../environment/environment";
import { ArrowPathIcon, ArrowUpTrayIcon, CameraIcon, DocumentTextIcon, PrinterIcon, StarIcon } from "@heroicons/react/24/solid";
import 'public/styles/print.css'; 
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserData from "@/interface/userData";
import PartnerDocument from "@/interface/partner";
import { useDropzone } from 'react-dropzone';
import { ref, getDownloadURL, listAll, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '../../../../libs/firebase';
import { v4 as createId } from 'uuid';
import { AiOutlineLoading } from "react-icons/ai";
import { AxiosError } from 'axios';
import { string } from "yup";
interface ParamsProps {
   params: {
      id: string;
   }
}

export default function Order({ params }: ParamsProps) {
   const { data: session, status } = useSession({
      required: true,
   })

   const [formData, setFormData] = useState({
      id: "",
      service_area_id: "",
      description: "",
      budget: "",
      obs: "",
      value: "0,00",
      comment: "",
      order_status_id: "",
      score: 0,
      partner_id: "",
      images: [],
      evaluation: {
         comment: "",
         score: 0, // Aqui você define a propriedade 'score'
      },
   });

   const [orderData, setOrderData] = useState<OrderDocument>();
   const [areasData, setAreas] = useState<AreaDocument[]>([]);
   const [partnersData, setPartners] = useState<PartnerDocument[]>([]);
   const [selectPartner, setSelectPartner] = useState('');
   const [images, setImages] = useState<File[]>([]);
   const [rating, setRating] = useState(0);
   const dataUser = session?.user as UserData;
   const [uploading, setUploading] = useState(false)
   const [file, setFile] = useState<File[] | null>(null);
   const [fileDoc, setFileDoc] = useState<File | null>(null);
   const [imagesUrl, setImagesUrl] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoading2, setIsLoading2] = useState(false);
   const [orderImagePartner, setOrderImagePartner] = useState<OrderDocument>();
   const [orderImageComdominium, setOrderImageComdominium] = useState<OrderDocument[]>([]);
   const [showUpBudget, setShowUpBudget] = useState(false);
   const [showDescription, setShowDescription] = useState(true);
   const [showPictureInputDesc, setShowPictureInputDesc] = useState(true);
   const [showPictureInputDescImg, setShowPictureInputDescImg] = useState(true);
   const [showSubmitButton, setShowSubmitButton] = useState(false);
   const [showBtnDoc, setShowBtnDoc] = useState(false);
   const [showMsgButton, setShowMsgButton] = useState(false);
   const [showPartnerInput, setPartnerInput] = useState(false);
   const [showValueButton, setValueButton] = useState(false);
   const [showPictureInput, setPictureInput] = useState(false);
   const [showValueInit, setShowValueInit] = useState(true);
   const [showValueFinal, setShowValueFinal] = useState(false);
   const [showDivAvaluation, setDivAvaluation] = useState(false);
   const [showPictureButton, setShowPictureButton] = useState(false);
   const [showBtnFinal, setShowBtnFinal] = useState(false);
   const [showDivBtnFinal, setShowDivBtnFinal] = useState(true);
   const [showImageComdomimiun, setShowImageComdomimiun] = useState(false);
   const [ showRemoveButton, setShowRemoveButton] = useState(true);

   const onDrop = useCallback((files: File[]) => {
      setFile(files);
   }, []);

   const dropzone = useDropzone({
      onDrop,
      accept: {
         'image/jpeg': [],
         'image/jpg': [],
         'image/png': [],
         'application/pdf': [],
         'application/msword': [],         // Para arquivos .doc
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document': []  // Para arquivos .docx
      }
   });

   const insertImage = async (file: File) => {
      setUploading(true);
      console.log(file);
      let randomName = createId();
      let newFile = ref(storage, randomName);
      let upload = await uploadBytes(newFile, file);
      let imageUrl = await getDownloadURL(upload.ref);
      let arrayImages = imagesUrl;
      arrayImages?.push(imageUrl);
      setImagesUrl(arrayImages);
      setTimeout(() => {
         setUploading(false);
      }, 4000)
   }

   const removeImage = async (file: string) => {
      setUploading(true);
      let imageRef = ref(storage, file);
      await deleteObject(imageRef).then(() => {
         let actualArray = imagesUrl;
         let arrayImage = actualArray.filter(photo => photo != file);
         setImagesUrl(arrayImage);
         console.log('Imagem deletada com sucesso!');
         setUploading(false);
      }).catch((error) => {
         console.log(error);
         alert('Erro ao deletar imagem');
         setUploading(false);
      });
   }

   useEffect(() => {
      const handleImages = async () => {
        console.log('uploading images');
        file?.map((image: any) => {
          if ([
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/pdf',
            'application/msword',  // Para arquivos .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  // Para arquivos .docx
          ].includes(image.type)) {
            insertImage(image);
          } else {
            alert('Tipo de arquivo não permitido');
          }
        });
      };
      handleImages();
    }, [file]);
    

  const handleChange = (event: any) => {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
   };

   const fetchAreas = async () => {
      try {
         const response = await axios.get(`${environment.apiUrl}/area/list`);
         setAreas(response.data);
      } catch (error) {
         console.error(error);
      }
   };

   const fetchPartners = async () => {
      try {
         const response = await axios.get(`${environment.apiUrl}/order/show/showPartnerOrder`);
         setPartners(response.data);
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      fetchAreas();
      fetchPartners();
   }, []);

   const resetForm = () => {
      setFormData({
         id: "",
         service_area_id: "",
         description: "",
         budget: "",
         obs: "",
         value: "",
         order_status_id: "",
         comment: "",
         score: 0,
         partner_id: "",
         images: [],
         evaluation: {
            comment: "",
            score: 0, // Aqui você define a propriedade 'score'
         },
      });
   };

   const handleSubmit = async (event: any, orderStatusId: Number) => {
      event.preventDefault();
      if (formData.service_area_id === "" || formData.description === "") {
         alert("Por favor, selecione um serviço!");
         return;
      }
      setShowSubmitButton(false);
      setIsLoading2(true);
      try {
         if (params.id === 'new') {
            const { comment, score, evaluation, value, budget, ...formDataWithoutColuns } = formData;

            const data = {
               ...formDataWithoutColuns,
               condominium_id: dataUser.profile.id,
               images: imagesUrl
            };
            await axios.post(`${environment.apiUrl}/order/save`, data);
            setIsLoading2(false);
            setShowMsgButton(true);
            
         } else {
            let data = {
               ...formData,
               order_status_id: orderStatusId,
            };

            // Adiciona a propriedade score somente se o order_status_id for igual a 4
            if (orderStatusId === 4) {
               data = { ...data, score: rating };
            } else {
               const formattedValue = formData.value.replace('.', '').replace(',', '.'); // Remove a vírgula
               const numericValue = parseFloat(formattedValue);
               data.value = numericValue.toString();
               data = { ...data, partner_id: selectPartner.toString() };
            }
            await axios.put(`${environment.apiUrl}/order/update/${params.id}`, data);
            window.history.back();
         }
         resetForm();
      } catch (error) {
         const axiosError = error as AxiosError;
         if (axiosError.response && axiosError.response.status === 403) {
             // Trate o erro CORS aqui
             console.error('Erro CORS: ' + axiosError.message);
         } else {
             // Trate outros erros aqui
             alert('Ocorreu um erro!');
             console.error(axiosError);
         }
      }

   }

   const handleSubmitImage = async (event: any, orderStatusId: Number) => {
      event.preventDefault();
      try {
         let data = {
            ...formData,
            order_status_id: orderStatusId,
            images: imagesUrl
         };
         await axios.put(`${environment.apiUrl}/order/update/${params.id}`, data);
         window.history.back();
         resetForm();
      } catch (error) {
         alert('Ocorreu um erro!');
         console.error(error);
      }

   }



   const handleSubmitDoc = async (event: any) => {
      event.preventDefault();
      try {
         const dataDoc = {
            ...formData,
            budget: formData.budget,
            id: formData.id,
            partner_id: dataUser.profile.id
         };
         
         await axios.post(`${environment.apiUrl}/budget/save`, dataDoc);
         window.history.back();
         resetForm();
      } catch (error) {
         alert('Ocorreu um erro!');
         console.error(error);
      }

   }

   useEffect(() => {
      if (params.id !== 'new') {
         const fetchData = async () => {
            try {

               setValueButton(true);
               setShowDescription(true);

               const response = await axios.get(`${environment.apiUrl}/order/${params.id}`);
               setOrderData(response.data);
               if (response.data.images) {
                  setImagesUrl(response.data.images);
               }
            } catch (error) {
               console.log(error);
            }
         };
         fetchData();
      }
   }, [])

   useEffect(() => {
      if (params.id !== 'new' && dataUser && dataUser.user && dataUser.user.type == 'partner') {
         const fetchImagesPartner = async () => {
            try {
               setValueButton(true);
               setShowDescription(true);
               let url = `${environment.apiUrl}/budget/images/${params.id}`;
               if (dataUser.profile?.id) {
                  url += `/${dataUser.profile.id}`;
               }
               const response = await axios.get(url);
               setOrderImagePartner(response.data);
               // if (response.data.images) {
               //    setImagesUrl(response.data.images);
               // }
            } catch (error) {
               console.log(error);
            }
         };
         fetchImagesPartner();
      } else {
         const fetchImagesCondominium = async () => {
            try {
               setValueButton(true);
               setShowDescription(true);
               let url = `${environment.apiUrl}/budget/imagesCondominium/${params.id}`;
               if (dataUser.profile?.id) {
                  url += `/${dataUser.profile.id}`;
               }
               const response = await axios.get(url);
               setOrderImageComdominium(response.data);
               if (response.data.images) {
                  setImagesUrl(response.data.images);
               }
            } catch (error) {
               console.log(error);
            }
         };
         fetchImagesCondominium();
      }
   }, [])





   useEffect(() => {
      if (orderData) {
         setFormData({
            ...formData,
            ...orderData,
         });
      }
   }, [orderData]);




   useEffect(() => {
      const orderStatusId = parseInt(formData.order_status_id);

      if (!isNaN(orderStatusId) && orderStatusId >= 1 && dataUser?.user?.type == 'admin') {
         setShowMsgButton(false);
         setPartnerInput(true);
         setShowPictureButton(true);
         setShowImageComdomimiun(false);
         setShowValueInit(false);
         setShowValueFinal(true);
         setPictureInput(true);
         setDivAvaluation(true);
         setValueButton(false);
         setShowDivBtnFinal(false);
         setShowRemoveButton(false);
         setShowPictureInputDesc(false);
         setShowPictureButton(false);
         
      } else if (!isNaN(orderStatusId) && orderStatusId == 1 && dataUser?.user?.type == 'condominium') {
         setShowMsgButton(true);


      } else if (!isNaN(orderStatusId) && orderStatusId == 2 && dataUser?.user?.type == 'condominium') {
         setPartnerInput(true);
        
      } else if (!isNaN(orderStatusId) && orderStatusId == 3 && dataUser?.user?.type == 'condominium') {
        
         setPartnerInput(true);
         setShowValueInit(false);
         setShowValueFinal(true);
         setPictureInput(true);
         setShowPictureButton(true);
         setValueButton(false);
         setShowBtnFinal(false);
         setShowImageComdomimiun(true);
         setShowPictureInputDesc(false);
         if (formData.images && formData.images.length !== 0){
            setDivAvaluation(true);
         } else {
            setDivAvaluation(false);
         }
          
      } else if (!isNaN(orderStatusId) && orderStatusId == 4 && dataUser?.user?.type == 'condominium') {
         setShowImageComdomimiun(false);
         setPartnerInput(true);
         setShowValueInit(false);
         setShowValueFinal(true);
         setPictureInput(true);
         setDivAvaluation(true);
         setValueButton(false);
         setShowBtnFinal(false);
         setShowRemoveButton(false);
         setShowPictureInputDesc(false);
         setShowDivBtnFinal(false);
      } else if (dataUser?.user?.type == 'partner' && !isNaN(orderStatusId)) {
         if (orderStatusId == 1) {
            setValueButton(false);
            setPartnerInput(false);
            setShowUpBudget(true);
            setShowRemoveButton(false);
            setShowPictureInputDescImg(false);
         } else if ( orderStatusId == 2){
            // setPictureInput(true);
            // setShowPictureButton(true);
            setValueButton(false);
            setPartnerInput(false);
            setShowUpBudget(true);
            setShowRemoveButton(false);
            setShowPictureInputDescImg(false);
         } else if ( orderStatusId == 3){
            setPictureInput(true);
            setValueButton(false);
            setPartnerInput(false);
            setShowUpBudget(true);
            setShowPictureButton(true);
            setShowRemoveButton(false);
            setShowPictureInputDesc(false);
            setShowPictureInputDescImg(false);
         } else if (orderStatusId == 4) {
            setPartnerInput(true);
            setShowValueInit(false);
            setShowValueFinal(true);
            setPictureInput(true);
            setDivAvaluation(true);
            setShowPictureButton(false);
            setValueButton(false);
            setShowBtnFinal(false);
            setShowRemoveButton(false);
            setShowPictureInputDesc(false);
            setShowPictureInputDescImg(false);
         }
      }

   }, [formData.order_status_id]);

   function handleFileChange(event: any) {
      const file = event.target.files[0];
      if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type)) {
         if (formData.budget?.length > 0) {
            removeImageDoc(formData.budget);
         }
         
         setFileDoc(file);
         insertImageDoc(file);
      } else {
         alert("Formato inválido");
      }
   }

   
   const insertImageDoc = async (file: File) => {
      setIsLoading(true); // Inicia o carregamento
      let randomName = createId();
      let newFile = ref(storage, randomName);
      let upload = await uploadBytes(newFile, file);
      let imageUrl = await getDownloadURL(upload.ref);
      setFormData((prevFormData) => ({ ...prevFormData, ['budget']: imageUrl }));
      setShowBtnDoc(true); 
      setIsLoading(false); // Termina o carregamento
   }

   const removeImageDoc = async (file: string) => {
      setShowBtnDoc(false);
      let imageRef = ref(storage, file);
      setFormData((prevFormData) => ({ ...prevFormData, ['budget']: '' }));
      await deleteObject(imageRef).then(() => {
         setFile(null);
         console.log('Imagem deletada com sucesso!');
      }).catch((error) => {
         console.log(error)
         alert('Erro ao deletar imagem');
      });
   }




   const handleChangeValue = (event: any) => {
      const { name, value } = event.target;

      // Remove todos os caracteres não numéricos
      const numericValue = value.replace(/[^0-9]/g, '');

      // Formata o valor como um valor monetário
      const formattedValue = formatCurrency(numericValue);

      setFormData({
         ...formData,
         [name]: formattedValue,
      });
   };


   const handleServiceChange = (event: any) => {
      handleChange(event);
      setShowDescription(true);
   };

   const formatCurrency = (value: any) => {
      // Converte o valor numérico para uma string formatada em moeda
      const numericValue = parseFloat(value) / 100; // Assume que o valor está em centavos
      return numericValue.toLocaleString('pt-BR', {
         style: 'currency',
         currency: 'BRL',
      }).replace('R$', ''); // Remove o "R$" da string formatada
   };

   const formattedValue = parseFloat(formData.value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
   }).replace('R$', '');


   const handleDescriptionChange = (event: any) => {
      handleChange(event);
      setShowSubmitButton(event.target.value.length >= 5);
   };

   const handleStarClick = (value: any) => {
      setRating(value);
      if (value > 0) {
        setShowBtnFinal(true);
      } else {
        setShowBtnFinal(false);
      }
    };


   if (status === "loading") {
      return <></>
   }

   return (
      <>
         <div className="flex justify-between items-center h-10 mb-5 no-print">
            <PageTitleDefault title="Chamados" />
         </div>
         
         <div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10 no-print">
            <div className="lg:col-span-2">
               <div className=" mb-3 text-center font-bold">
                  {dataUser.user.type === 'condominium' ? (
                     <PageSubTitle subtitle={`Olá, ${dataUser.profile.name.toUpperCase()} selecione a área de interesse para receber um orçamento!`} />
                  ) : dataUser.user.type === 'partner' ? (
                     <PageSubTitle subtitle={`Olá, ${orderData && orderData.condominium ? orderData.condominium.name.toUpperCase() : ''} solicitou serviços na área abaixo!`} />
                  ) : null}
               </div>

               <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-5 text-center">
                     <label htmlFor="service_area_id" className="font-bold text-lg text-gray-400">Área de Serviço</label>
                     <select
                        name="service_area_id"
                        id="service_area_id"
                        className="h-10 border mt-3 rounded px-4 w-full bg-gray-50 uppercase"
                        value={formData.service_area_id}
                        onChange={handleServiceChange}
                        disabled={params.id !== 'new'}
                     >
                        <option value="">Selecione um serviço</option>
                        {areasData.filter(area => area.status === 'ativo').map((area) => (
                           <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                     </select>
                  </div>
                  <div className={`md:col-span-5 text-center mt-4  ${showDescription ? 'block' : 'hidden'}`}>
                     <label htmlFor="description" className="font-bold text-lg text-gray-400">
                        {dataUser.user.type === 'partner' ? 'Serviço a ser executado' : 'Fale um pouco sobre sua necessidade'}
                     </label>

                     <textarea
                        name="description"
                        id="description"
                        className="h-24 border mt-3 rounded p-2 px-4 w-full bg-gray-50 uppercase"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        disabled={params.id !== 'new'}
                     />
                  </div>

                  <div className={`md:col-span-5 mt-0 rounded-[16px] bg-white  ${showPictureInputDesc ? 'block' : 'hidden'}`}>
                     <div className="md:col-span-5 text-center mt-3">
                        <label htmlFor="obs" className="font-bold text-lg text-gray-400">
                        {dataUser.user.type === 'partner' ? 'Imagens do serviço a ser executado' : 'Adicionar imagens referente ao chamado'}
                           
                        </label>

                        <div className={`flex items-center justify-center w-full mt-3  ${showPictureInputDescImg ? 'block' : 'hidden'}` }>
                           <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                 <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                 </svg>
                                 <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Clique para procurar</span> ou arraste e solte os aquivos aqui.</p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF (Imagens Max. 800x400px)</p>
                              </div>
                              <input {...dropzone.getInputProps()} id="dropzone-file" type="file" className="hidden" />
                           </label>
                        </div>

                        {uploading && (
                           <div className="flex items-center justify-center w-full h-16 mt-3">
                              <AiOutlineLoading className="animate-spin text-cyan-700" size={20} />
                              <span className="text-cyan-700">Carregando aguarde...</span>
                           </div>
                        )}

                        <div className="flex items-center justify-center w-full">
                           {imagesUrl && imagesUrl.length > 0 && (
                              <div className='flex mt-4 flex-wrap w-full'>
                                 {imagesUrl.map((item: any) => (
                                    <div key={Math.random()}
                                       className='flex flex-col w-1/5 items-center p-1'
                                    >
                                       <picture className="w-full">
                                          <a href={item} target="_blank" rel="noopener noreferrer">
                                             <img
                                                className="object-cover h-48 w-full rounded-lg"
                                                src={item}
                                                alt=""
                                             />
                                          </a>
                                       </picture>
                                       <button className={`mt-2 bg-rose-500 p-2 text-white hover:bg-rose-600 rounded-lg ${showRemoveButton ? 'block' : 'hidden'} `} onClick={() => removeImage(item)} >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-trash" viewBox="0 0 16 16">
                                             <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="white">
                                             </path>
                                             <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="white">
                                             </path>
                                          </svg>
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                    
                  </div>

                  <div className="md:col-span-5 text-center">
                     {orderImageComdominium && orderImageComdominium.length > 0 && (
                        <>
                           
                           <div className="flex justify-between items-center w-full p-2 mim-h-screen">
                              <div className="w-full">
                                 <div className="grid gap-4">
                                    <div className="overflow-auto mt-4 w-full bg-white rounded-[8px] drop-shadow-md p-8">
                                    <h2 className="font-bold text-lg text-gray-400 ">Orçamentos</h2>
                                       <table className="table-auto w-full text-left text-sm font-light">
                                          <thead className="border-b border-gray-300 font-medium">
                                             <tr>
                                                <th scope="col" className="px-6 py-2  text-center">Parceiro</th>
                                                <th scope="col" className="px-6 py-2  text-center">Orçamento</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {orderImageComdominium && orderImageComdominium.map((item, index) => (
                                                <tr key={index}
                                                className="border-b border-gray-100 transition duration-300 ease-in-out hover:bg-gray-100">
                                                   <td className="whitespace-nowrap px-3 text-center py-2 uppercase">{item?.partner.name}</td>
                                                   <td className="whitespace-nowrap px-3 py-2">
                                                      <div key={index} className='flex flex-col items-center'>
                                                         <picture>
                                                            <a href={item.images} download target="_blank" rel="noopener noreferrer">
                                                               {/* <img
                                                                  className=" rounded h-10 w-10 drop-shadow-lg mr-2 object-contain"
                                                                  src={item.images}
                                                                  alt="Orçamento"
                                                               /> */}
                                                               <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                                                            </a>
                                                         </picture>
                                                      </div>
                                                   </td>
                                                </tr>
                                             ))}
                                          </tbody>
                                       </table>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </>
                     )}
                  </div>

                  <div className={`md:col-span-5 text-center mt-4  ${showUpBudget ? 'block' : 'hidden'}`}>
                     <label htmlFor="description" className="font-bold text-lg text-gray-400">
                        Entre em contato com o condominio
                     </label>
                     <ul className="mt-3 text-gray-400 " >
                        <li ><strong>Nome:</strong> {orderData && orderData.condominium ? orderData.condominium.name.toUpperCase() : 'condomínio'}</li>
                        <li><strong>Endereço:</strong> {orderData && orderData.condominium ? orderData.condominium.address.toUpperCase() : 'condomínio'}</li>
                        <li><strong>Telefone:</strong> {orderData && orderData.condominium ? orderData.condominium.phone.toUpperCase() : 'condomínio'}</li>
                        <li><strong>Email:</strong> {orderData && orderData.condominium ? orderData.condominium.email.toUpperCase() : 'condomínio'}</li>
                        <li><strong>Síndico:</strong> {orderData && orderData.condominium ? orderData.condominium.admin_name.toUpperCase() : 'condomínio'}</li>
                        <li><strong>Contato:</strong> {orderData && orderData.condominium ? orderData.condominium.responsible_name.toUpperCase() : 'condomínio'}</li>
                     </ul>
                     <div className={`md:col-span-5 mb-[-25px]  ${isLoading ? 'block' : 'hidden'}`} >
                        <Spinner />
                     </div>
                     <div className="md:col-span-5 text-center mt-10">
                        <label
                           htmlFor="docInput"
                           className="btn btn-primary  bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white  p-3 border-2 border-blue-400 hover:border-transparent rounded cursor-pointer"

                        >
                           Carregar Orçamento <ArrowUpTrayIcon className="h-8 w-8 inline-block" />
                        </label>

                        

                        <input type="file" id="docInput" className="hidden" onChange={handleFileChange} />
                        
                     </div>
                     

                     <div className="flex items-center justify-center w-full">
                        {formData.budget && formData.budget.length > 0 && (
                           <div className='flex mt-4 gap-2'>
                              <div
                                 className='flex flex-col items-center'
                              >
                                 <div >
                                    {/* <img
                                       className="object-cover h-48 w-96 rounded-lg text-gray-400 text-center text-[20px]"
                                       src={formData.budget}
                                       alt="Orçamento PDF"
                                    /> */}
                                    <a href={formData.budget} download target="_blank" rel="noopener noreferrer">
                                       <DocumentTextIcon className="h-[100px] w-[100px] text-gray-400" />
                                    </a>
                                    
                                 </div>
                                 <button className='mt-2 bg-rose-500 p-2 text-white hover:bg-rose-600 rounded-lg hidden' onClick={() => removeImageDoc(formData.budget)}>
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


                     <div className="flex items-center justify-center w-full">
                     {orderImagePartner && Array.isArray(orderImagePartner.images) && orderImagePartner.images.length > 0 && (
                           <div className='flex mt-4 gap-2'>
                              {orderImagePartner.images.map((image: string | undefined, index: Key | null | undefined) => (
                                 <div key={index} className='flex flex-col items-center'>
                                    <picture>
                                       <a href={image} download target="_blank" rel="noopener noreferrer">
                                       <DocumentTextIcon className="h-[100px] w-[100px] text-gray-400" />
                                       </a>
                                    </picture>
                                 </div>
                              ))}
                           </div>
                        )}

                     </div>

                     <div  className=" md:col-span-5 mt-6 text-gray-400"><span className="mt-5 text-gray-400">*Se for preciso atualizar orçamento, carregue o arquivo novamente e clique em Enviar Imagem/PDF.</span></div>
                     <div className={`md:col-span-5 text-right mt-5  ${showBtnDoc ? 'block' : 'hidden'}`} >
                        <div className="inline-flex items-end gap-3 ">
                           <ButtonCancel route="order" label="Cancelar" />
                           <ButtonAddLink route="" label='Enviar Imagem/PDF' onClick={(event) => handleSubmitDoc(event)} />
                        </div>
                     </div>
                  </div>

                  <div className={`md:col-span-5 mb-[-25px]  ${isLoading2 ? 'block' : 'hidden'}`} >
                        <Spinner />
                  </div>

                  <div className={`md:col-span-5 text-right  ${showSubmitButton ? 'block' : 'hidden'}`} >
                     <div className="flex w-full flex-row max-[600px]:flex-col items-end max-[600px]:items-center gap-3 mt-5">
                        <div className="flex w-auto max-[600px]:w-full">
                           
                           {/* <Link href={''} className="w-full"> */}
                           <button className="rounded-full w-full bg-blue-500 px-10 py-3 text-white hover:bg-blue-600" onClick={(event) => handleSubmit(event, 1)}>Solicitar Orçamento</button>
                           {/* </Link> */}

                        </div>
                        {/* <ButtonAddLink route="" label='Solicitar Orçamento' onClick={()=>handleSubmit} /> */}
                        <ButtonCancel route="order" label="Cancelar" />
                     </div>
                  </div>
                  <div className={` md:col-span-5 text-right rounded-[16px] bg-blue-500  drop-shadow-md p-2 mt-2 mb-0 transition-all duration-900 ${showMsgButton ? 'block' : 'hidden'} text-white text-lg`}>
                     <div className="flex justify-center items-center m-2 text-center font-bold ">
                        <span>Aguarde, estamos te conectando a um de nossos parceiros.</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className={`grid col-1 mt-10 rounded-[16px] no-print bg-white drop-shadow-md mb-10 p-10 ${showPartnerInput ? 'block' : 'hidden'}`}>
            <div className="md:col-span-5 text-center mb-3">
               <label htmlFor="selectPartner" className="font-bold text-lg text-gray-400">
                  Selecione o parceiro 
               </label>
               <select
                  name="selectPartner"
                  id="selectPartner"
                  className="h-10 border mt-3 rounded px-4 w-full bg-gray-50 lowercase capitalize "
                  onChange={(e) => setSelectPartner(e.target.value)}
                  value={formData.partner_id} // Define o valor selecionado no <select>
               >
                  <option value="" >selecione... </option>

               {orderImageComdominium &&
                  orderImageComdominium.map((item, index) => (
                     <option key={index} value={item.partner_id}>
                        {item.partner.name}
                     </option>
                  ))}

               </select>

            </div>
            <div className="md:col-span-5 text-center mt-3">
               <label htmlFor="obs" className="font-bold text-lg text-gray-400">
                  Detalhe os serviços prestados.
               </label>
               <textarea
                  name="obs"
                  id="obs"
                  className="h-24 border mt-3 rounded p-2 px-4 w-full bg-gray-50 uppercase"
                  value={formData.obs}
                  onChange={handleChange}
               />
            </div>
            <div className={`md:col-span-5 text-center  ${showValueInit ? 'block' : 'hidden'}`} >
               <label htmlFor="value" className="font-bold text-lg text-gray-400">
                  Valor (R$)
               </label>
               <input type="text" name="value" id="value" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50  " value={formData.value} onChange={handleChangeValue} />
            </div>
            <div className={`md:col-span-5 text-center  ${showValueFinal ? 'block' : 'hidden'}`} >
               <label htmlFor="value" className="font-bold text-lg text-gray-400">
                  Valor (R$)
               </label>
               <input type="text" name="value" id="value" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50  " value={formattedValue} onChange={handleChangeValue} disabled />
            </div>
            <div className={`md:col-span-5 text-right  ${showValueButton ? 'block' : 'hidden'}`} >
               <div className="inline-flex items-end gap-3 mt-5">
                  <ButtonCancel route="order" label="Cancelar" />
                  <ButtonAddLink route="" label='Confirmar Valores' onClick={(event) => handleSubmit(event, 3)} />
               </div>
            </div>
         </div>

         <div className={`grid col-1 mt-10 rounded-[16px] no-print bg-white drop-shadow-md mb-10 p-10 ${showPictureInput ? 'block' : 'hidden'}`}>
            <div className="md:col-span-5 text-center mt-3">
               <label htmlFor="obs" className="font-bold text-lg text-gray-400">
                  Adicione fotos do serviço prestado
               </label>

               <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Clique para procurar</span> ou arraste e solte os aquivos aqui.</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF, DOC (Imagens Max. 800x400px)</p>
                     </div>
                     <input {...dropzone.getInputProps()} id="dropzone-file" type="file" className="hidden" />
                  </label>
               </div>

               {uploading && (
                  <div className="flex items-center justify-center w-full h-16 mt-3">
                     <AiOutlineLoading className="animate-spin text-cyan-700" size={20} />
                     <span className="text-cyan-700">Carregando aguarde...</span>
                  </div>
               )}

               <div className="flex items-center justify-center w-full">
                  {imagesUrl && imagesUrl.length > 0 && (
                     <div className='flex mt-4 flex-wrap w-full'>
                        {imagesUrl.map((item: any) => (
                           <div key={Math.random()}
                              className='flex flex-col w-1/5 items-center p-1'
                           >
                              <picture className="w-full">
                                 <a href={item} target="_blank" rel="noopener noreferrer">
                                    <img
                                       className="object-cover h-48 w-full rounded-lg"
                                       src={item}
                                       alt="PDF"
                                    />
                                 </a>
                              </picture>
                              <button className={`mt-2 bg-rose-500 p-2 text-white hover:bg-rose-600 rounded-lg ${showRemoveButton ? 'block' : 'hidden'} `} onClick={() => removeImage(item)} >
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="white">
                                    </path>
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="white">
                                    </path>
                                 </svg>
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
            <div className={`md:col-span-5 text-right mt-5  ${showPictureButton && (imagesUrl && imagesUrl.length > 0) ? 'block' : 'hidden'}`}>
               <div className="inline-flex items-end gap-3 ">
                  <ButtonAddLink route="" label='Enviar Imagens' onClick={(event) => handleSubmitImage(event, 3)} />
               </div>
            </div>
         </div>

         <div className={`grid col-1 mt-10 rounded-[16px] no-print bg-white drop-shadow-md mb-10 p-10 ${showDivAvaluation ? 'block' : 'hidden'}`}>

            <div className="md:col-span-5 flex justify-end max-[650px]:mb-[0px] mb-[-50px] no-print">
               <button className="z-10 rounded-full max-[600px]:w-full max-[600px]:text-xs  max-[600px]:py-1 max-[600px]:mb-2 bg-white px-5 py-3 text-gray-400 border border-gray-300 hover:bg-gray-300 hover:text-white " onClick={() => window.print()}>
               Imprimir/PDF <PrinterIcon className="h-6 w-6 inline-block" />
               </button>
            </div>

            <div className="md:col-span-5 text-center">
               <label htmlFor="comment" className="font-bold text-lg text-gray-400 no-print">
                  Avalie o prestador
               </label>
               <div className="md:col-span-5 text-center mt-3 mb-5 text-gray-300  ">
                  {[1, 2, 3, 4, 5].map((value) => (
                     <StarIcon
                        key={value}
                        className={`h-8 w-8 inline-block cursor-pointer ${value <= rating ? 'text-yellow-400' : ''
                           }`}
                           onClick={() => handleStarClick(value)}
                     />
                  ))}
               </div>
               
               <label htmlFor="comment" className=" text-lg text-gray-400">
                  Deixe aqui um comentário
               </label>
               <textarea
                  name="comment"
                  id="comment"
                  className="h-24 border mt-3 rounded p-2 px-4 w-full bg-gray-50"
                  value={formData.evaluation?.comment}
                  onChange={handleChange}
               />
            </div>

            <div className="md:col-span-5 flex items-center justify-between mt-5 no-print">
               
               <ButtonCancel route="order" label="Voltar" />
               
               {/* <PrinterIcon className="h-8 w-8 inline-block cursor-pointer text-gray-500 border-gray-300 "/> */}
               <div className={` ${showDivBtnFinal ? 'block' : 'hidden'} mx-auto `}>
                  <div className={` ${showBtnFinal ? 'block' : 'hidden'} ml-[-130px] max-[600px]:ml-0`}>
                     <ButtonAddLink route="" label='Finalizar Chamado' onClick={(event) => handleSubmit(event, 4)} />
                  </div>
               </div>
            </div>
         </div>

         {/* IMPRESSÃO */}
         <div className="hidden z-10 max-w-3xl mx-auto rounded-[16px] bg-white shadow-lg p-8 border border-gray-300 border-[2px] print-only">
            {/* Cabeçalho do Chamado */}
            <div className=" pb-4 mb-1 flex items-center justify-between">
               <h2 className="text-2xl font-bold text-gray-700">Chamado Nº {formData.id}</h2>
               {/* <p className="text-sm text-gray-500">Data abertura: <InputMask mask="9999/99/99" className="border-none bg-transparent text-black-600"  value={orderData?.opened_at} disabled /></p> */} 
            </div>
            
            <div className="mb-[20px] flex items-center justify-between">
               <div >
                  <p className="capitalize">
                     <span className="font-medium">Condo Help Servicos LTDA</span>
                  </p>
                  <p className="capitalize text-xs">
                     <span className="font-medium">52.233.453/0001-61</span>
                  </p>
                  <p className="capitalize text-xs">
                     <span className="font-medium">70714-020 <br /> Setor Comercial Norte Q 4 Bl B, S/N Brasília-DF </span>
                  </p>
               </div>
               <picture className="mt-[-20px]">
                  <img
                     className="w-[300px] h-auto"
                     src="/logo_login_full.png"
                     alt="condo help"
                  />
               </picture>
            </div>
               
            {/* Informações do Solicitante */}
            <div className="mb-6 border-t">
               <h3 className="text-lg font-semibold text-gray-600 mb-2 mt-2">Solicitante</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p className="capitalize mb-0 ">
                     <span className="font-medium capitalize">Nome: </span> 
                     {orderData?.condominium?.name || ""}
                  </p>
                  <p className="capitalize">
                     Cnpj: <InputMask mask="99.999.999/9999-99" className="border-none bg-transparent text-black-600"  value={orderData?.condominium?.cnpj} disabled />
                  </p>
                  <p className="capitalize"><span className="font-medium">Endereço:</span> {orderData?.condominium?.address}, Nº {orderData?.condominium?.address_number} {orderData?.condominium?.address_city}-{orderData?.condominium?.address_state} 
                  </p>
                  <p className="capitalize"><span className="font-medium">Contato: {orderData?.condominium?.admin_name}</span> </p>
                  <p><span className="font-medium">Telefone:</span> {orderData?.condominium?.phone}</p>
                  <p><span className="font-medium">E-mail:</span> {orderData?.condominium?.email}</p>
               </div>
            </div>

            {/* Informações do Prestador de Serviços */}
            <div className="mb-6 border-t ">
               <h3 className="text-lg font-semibold text-gray-600 mb-2 mt-2">Prestador de Serviços</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p className="capitalize"><span className="font-medium capitalize">Nome: {orderImageComdominium[0]?.partner?.name}</span> </p>
                  <p className="capitalize">
                     Cnpj: <InputMask mask="99.999.999/9999-99" className="border-none bg-transparent text-black-600"  value={orderImageComdominium[0]?.partner?.cnpj} disabled />
                  </p>
                  <p className="capitalize"><span className="font-medium">Endereço:</span> {orderImageComdominium[0]?.partner?.address}, Nº {orderImageComdominium[0]?.partner?.address_number} {orderImageComdominium[0]?.partner?.address_city}-{orderImageComdominium[0]?.partner?.address_state} 
                  </p>
                  <p className="capitalize"><span className="font-medium">Contato: {orderImageComdominium[0]?.partner?.contact_name
                  }</span> </p>
                  <p><span className="font-medium">Telefone:</span> {orderImageComdominium[0]?.partner?.phone}</p>
                  <p><span className="font-medium">E-mail:</span> {orderImageComdominium[0]?.partner?.email}</p>
               </div>
            </div>

            {/* Detalhes do Chamado */}
            <div className="mb-6 border-t">
               <h3 className="text-lg font-semibold text-gray-600 mb-2 mt-2">Detalhes do Chamado</h3>
               <div className="space-y-2">
                  <p className="font-medium capitalize" >
                     <span className="font-medium capitalize">Área de Serviço: </span>
                     {areasData.find((area) => area.id === formData.service_area_id)?.name || ''}
                  </p>
                  <p className="text-center"><span className="font-medium">Descrição do serviço:</span> </p>
                  <textarea className="capitalize h-24 border mt-3 rounded p-2 px-4 w-full bg-gray-50 "
                        value={formData.description}
                     />
                  <p>
                     <span className="font-medium">Status: {formData.order_status_id == '1' 
                        ? 'Aguardando Orçamento' 
                        : formData.order_status_id == '2' 
                        ? 'Orçamento Enviado' 
                        : formData.order_status_id == '3'
                        ? 'Serviço em Andamento'
                        : formData.order_status_id == '4' 
                        ? 'Serviço Finalizado'
                        : formData.order_status_id == '5'
                        ? 'Chamado Cancelado': ''} 
                     </span>
                  </p>
                  <p className=" text-right p-2 rounded" ><span className="p-2 rounded border-[1px] border-gray-500 font-medium">Valor: R${formattedValue}</span> </p>
               </div>
            </div>

            {/* Rodapé do Chamado */}
            <div className="border-t pt-0 mt-0 flex justify-between items-center">
               <p className="text-sm text-gray-500">Gerado automaticamente por CondoHelp</p>
            </div>
         </div>

      </>
   );
}