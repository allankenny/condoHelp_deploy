"use client";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { PiBuildingsDuotone } from "react-icons/pi";
import InputMask from 'react-input-mask';


// Define a interface para as props do modal
interface ModalCondProps {
  isOpen: boolean;
  closeModal: () => void;
  condominiumData: any;
}

// Componente funcional do modal
export default function ModalCond({ isOpen, closeModal, condominiumData }: ModalCondProps) {
  

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        {/* Sobreposição escura */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-900"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Conteúdo do modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <PiBuildingsDuotone className="mr-2 text-2xl" />
                Condomínio
              </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 capitalize">
                    Nome: {condominiumData?.name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    Cnpj: <InputMask mask="99.999.999/9999-99"   value={condominiumData?.cnpj} className="border-none bg-transparent text-gray-500" disabled />
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    Endereço: {condominiumData?.address}, Nº {condominiumData?.address_number}, {condominiumData?.address_state} {condominiumData?.address_city} 
                  </p>
                  <p className="text-sm text-gray-500 ">
                    E-mail: {condominiumData?.email}
                  </p>
                  <p className="text-sm text-gray-500 ">
                    Telefone: <InputMask mask=" (99) 9999-9999" className="border-none bg-transparent text-gray-500 w-[105px]"  value={condominiumData?.phone} disabled /> / <InputMask mask=" (99) 99999-9999" className="border-none bg-transparent text-gray-500 "  value={condominiumData?.cellphone} disabled />
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    Síndico: {condominiumData?.admin_name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    Encarregado: {condominiumData?.responsible_name}
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <button
                    type="button"
                    className="rounded-full bg-white px-10 py-2 text-gray-400 border border-gray-300 hover:bg-gray-300 hover:text-white text-sm"
                    onClick={closeModal}
                  >
                    Fechar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
