"use client"
import { useState, useEffect } from "react";
import axios from 'axios';
import InputMask from 'react-input-mask';
import { PageSubTitle } from "../../../../components/PageSubTitle";
import { PageTitleDefault } from "../../../../components/PageTitle";
import { ButtonAddLink, ButtonCancel } from "../../../../components/Buttons";
import AreaDocument from "../../../../interface/area";
import OrderDocument from "../../../../interface/order";
import { environment } from "../../../../environment/environment";
import { ArrowPathIcon, ArrowUpTrayIcon, CameraIcon, PlusIcon, StarIcon } from "@heroicons/react/24/solid";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../utils/authOptions";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserData from "@/interface/userData";
import PartnerDocument from "@/interface/partner";
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
		service_area_id: "",
		description: "",
		obs: "",
		value: "",
		comment: "",
		score: 0,
		partner_id: "",
		evaluation: {
			comment: "",
			score: 0, // Aqui você define a propriedade 'score'
		},
	});

	const [orderData, setOrderData] = useState<OrderDocument>();
	const [areasData, setAreas] = useState<AreaDocument[]>([]);
	const [partnersData, setPartners] = useState<PartnerDocument[]>([]);
	const [selectPartner, setSelectPartner] = useState('');
	// const [dataUser, setDataUser] = useState<any>();
	// if(session){
	//    setDataUser(session?.user);
	// }
	// const dataUser = session?.user?.user;
	// const dataUserProfile = session?.user?.profile;
	const dataUser = session?.user as UserData;


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
			service_area_id: "",
			description: "",
			obs: "",
			value: "",
			comment: "",
			score: 0,
			partner_id: "",
			evaluation: {
				comment: "",
				score: 0, // Aqui você define a propriedade 'score'
			},
		});
	};


	const handleSubmit = async (event: any, orderStatusId: Number) => {
		event.preventDefault();
		if (
			formData.service_area_id === "" ||
			formData.description === ""
		) {
			alert("Por favor, selecione um serviço!");
			return;
		}
		try {
			if (params.id === 'new') {
				const { comment, score, evaluation, ...formDataWithoutCommentAndScore } = formData;

				const data = {
					...formDataWithoutCommentAndScore,
					condominium_id: dataUser.profile.id,
				};
				const response = await axios.post(`${environment.apiUrl}/order/save`, data);
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
					data = { ...data, partner_id: selectPartner };

				}
				console.log('dados do backend', data);
				await axios.put(`${environment.apiUrl}/order/update/${params.id}`, data);
				console.log(data);
				window.history.back();
			}
			resetForm();
		} catch (error) {
			alert('Ocorreu um erro!');
			console.error(error);
		}

	}


	const handleSubmitImage = async (event: any, orderStatusId: Number) => {
		console.log('chegouuuuuu', orderStatusId);
		event.preventDefault();

		try {

			let data = {
				...formData,
				order_status_id: orderStatusId,
			};



			console.log('dados do backend', data);
			await axios.put(`${environment.apiUrl}/order/update/${params.id}`, data);
			console.log(data);
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
					setPictureInput(true);
					setValueButton(true);
					setShowDescription(true);
					setPartnerInput(true);
					const response = await axios.get(`${environment.apiUrl}/order/${params.id}`);
					setOrderData(response.data);
					console.log('retornoooo', response.data)
				} catch (error) {
					console.log(error);
				}
			};
			fetchData();
		}
	}, [])


	useEffect(() => {
		if (dataUser?.user?.type === 'partner') {
			setPictureInput(false);
			setValueButton(false);
			setPartnerInput(false);
			setShowUpBudget(true);
		}
	}, [])

	useEffect(() => {
		if (orderData) {
			setFormData({
				...formData,
				...orderData
			});
		}
	}, [orderData]);


	const [showUpBudget, setShowUpBudget] = useState(false);
	const [showDescription, setShowDescription] = useState(true);
	const [showSubmitButton, setShowSubmitButton] = useState(false);
	const [showMsgButton, setShowMsgButton] = useState(false);
	const [showPartnerInput, setPartnerInput] = useState(false);
	const [showValueButton, setValueButton] = useState(false);
	const [showPictureInput, setPictureInput] = useState(false);
	const [images, setImages] = useState<File[]>([]);
	const [rating, setRating] = useState(0);


	function handleImageChange(event: any) {
		if (event.target.files) {
			const files = Array.from(event.target.files) as File[];
			setImages([...images, ...files]);
		}
	}


	const clearImages = () => {
		setImages([]);
	};

	const handleServiceChange = (event: any) => {
		handleChange(event);
		setShowDescription(true);
	};


	const handlePartnersChange = (event: any) => {
		handleChange(event);
	};



	const handleDescriptionChange = (event: any) => {
		handleChange(event);
		setShowSubmitButton(event.target.value.length >= 5);
	};


	if (status === "loading") {
		return <></>
	}

	return (
		<>
			<div className="flex justify-between items-center h-10 mb-5">
				<PageTitleDefault title="Chamados" />
			</div>

			<div className="grid col-1 rounded-[16px] bg-white drop-shadow-md p-10">
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



							<div className="md:col-span-5 text-center mt-10">

								<label
									htmlFor="docInput"
									className="btn btn-primary  bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white  p-3 border-2 border-blue-400 hover:border-transparent rounded cursor-pointer"
								>
									Carregar Orçamento  <ArrowUpTrayIcon className="h-8 w-8 inline-block" />

								</label>
								<input
									type="file"
									id="docInput"
									className="hidden"
									onChange={handleImageChange}
									multiple
								/>
							</div>
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

					</div>
				</div>
			</div>

			<div className={`grid col-1 rounded-[16px] bg-white drop-shadow-md p-5 mt-5 mb-5 transition-all duration-700 ${showMsgButton ? 'block' : 'hidden'}`}>
				<div className="flex justify-center items-center m-2 text-center font-bold">
					<PageSubTitle subtitle="Aguarde, estamos te conectando a um de nossos parceiros." />
				</div>
			</div>

			<div className={`grid col-1 mt-10 rounded-[16px] bg-white drop-shadow-md mb-10 p-10 ${showPartnerInput ? 'block' : 'hidden'}`}>
				<div className="md:col-span-5 text-center mb-3">
					<label htmlFor="selectPartner" className="font-bold text-lg text-gray-400">
						Selecione o parceiro
					</label>
					<select
						name="selectPartner"
						id="selectPartner"
						className="h-10 border mt-3 rounded px-4 w-full bg-gray-50"
						onChange={(e) => setSelectPartner(e.target.value)}
						value={formData.partner_id} // Define o valor selecionado no <select>
					>
						<option value="">Selecione...</option>
						{partnersData.filter((partner) =>
							partner.service_areas.some((area: any) => area.id === formData.service_area_id)
						)
							.map((partner) => (
								<option key={partner.id} value={partner.id}>
									{partner.name}
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
				<div className="md:col-span-5 text-center mt-5">
					<label htmlFor="value" className="font-bold text-lg text-gray-400">
						Valor
					</label>
					<input type="number" name="value" id="value" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={formData.value} onChange={handleChange} />
				</div>
				<div className={`md:col-span-5 text-right  ${showValueButton ? 'block' : 'hidden'}`} >
					<div className="inline-flex items-end gap-3 mt-5">
						<ButtonCancel route="order" label="Cancelar" />
						<ButtonAddLink route="" label='Confirmar Valores' onClick={(event) => handleSubmit(event, 2)} />
					</div>
				</div>
			</div>

			<div className={`grid col-1 mt-10 rounded-[16px] bg-white drop-shadow-md mb-10 p-10 ${showPictureInput ? 'block' : 'hidden'}`}>
				<div className="md:col-span-5 text-center mt-3">
					<label htmlFor="obs" className="font-bold text-lg text-gray-400">
						Adicione fotos do serviço prestado
					</label>
					<div className="md:col-span-5 text-center mt-10">
						<label
							htmlFor="imageInput"
							className="btn btn-primary bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-3 p-3 border-2 border-blue-400 hover:border-transparent rounded cursor-pointer"
						>
							Imagens <CameraIcon className="h-8 w-8 inline-block" />

						</label>
						<label
							htmlFor=""
							className="btn btn-primary ml-5 bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-3 p-3 border-2 border-blue-400 hover:border-transparent rounded cursor-pointer" onClick={clearImages}
						>
							Limpar  <ArrowPathIcon className="h-8 w-8 inline-block" />

						</label>
						<input
							type="file"
							id="imageInput"
							className="hidden"
							onChange={handleImageChange}
							multiple
						/>
					</div>
					<div className="flex flex-wrap justify-center">
						{[...Array(10)].map((_, index) => (
							<div
								key={index}
								className="w-48 h-48 m-4 mt-10 border-2 rounded-lg border-dotted border-blue-400 flex items-center justify-center"
							>
								{images[index] ? (
									<img
										src={URL.createObjectURL(images[index])}
										alt={`Preview ${index + 1}`}
										className="max-w-full max-h-full"
									/>
								) : (
									<PlusIcon className="h-8 w-8 inline-block text-blue-400" />
								)}
							</div>
						))}
					</div>


				</div>
				<div className={`md:col-span-5 text-right mt-5  ${showValueButton ? 'block' : 'hidden'}`} >
					<div className="inline-flex items-end gap-3 ">
						<ButtonCancel route="order" label="Cancelar" />
						<ButtonAddLink route="" label='Enviar Imagens' onClick={(event) => handleSubmitImage(event, 3)} />

					</div>
				</div>
			</div>

			<div className={`grid col-1 mt-10 rounded-[16px] bg-white drop-shadow-md mb-10 p-10 ${showPartnerInput ? 'block' : 'hidden'}`}>
				<div className="md:col-span-5 text-center mt-3">
					<label htmlFor="comment" className="font-bold text-lg text-gray-400">
						Avalie o prestador
					</label>
					<div className="md:col-span-5 text-center mt-3 mb-5 text-gray-300  ">
						{[1, 2, 3, 4, 5].map((value) => (
							<StarIcon
								key={value}
								className={`h-8 w-8 inline-block cursor-pointer ${value <= rating ? 'text-yellow-400' : ''
									}`}
								onClick={() => setRating(value)}
							/>
						))}
					</div>

					<label htmlFor="comment" className=" text-lg text-gray-400">
						Deixe aqui um comentário
					</label>
					<textarea
						name="comment"
						id="comment"
						className="h-24 border mt-3 rounded p-2 px-4 w-full bg-gray-50 uppercase"
						value={formData.evaluation?.comment}
						onChange={handleChange}
					/>
				</div>

				<div className={`md:col-span-5 text-right  ${showValueButton ? 'block' : 'hidden'}`} >
					<div className="inline-flex items-end gap-3 mt-5">
						<ButtonCancel route="order" label="Cancelar" />
						<ButtonAddLink route="" label='Finalizar Chamado' onClick={(event) => handleSubmit(event, 4)} />
					</div>
				</div>
			</div>


		</>
	);
}