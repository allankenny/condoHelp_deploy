"use client"
import { Fragment, useEffect, useState, use } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  Bars3CenterLeftIcon,
  PencilIcon,
  ChevronDownIcon,
  CreditCardIcon,
  Cog8ToothIcon,
  Bars3Icon,
  Cog6ToothIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  ChartPieIcon,
  UserIcon,
  BuildingOfficeIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/solid";
import { BellIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Menu, Transition, Popover } from "@headlessui/react";
import SessionDocument from "../../interface/session";
import UserData from "@/interface/userData";

export default function TopBar() {

  const { data: session, status } = useSession({
    required: true,
  })
  if (status === "loading") {
    return <></>
  }
  // if(session){
  //    setDataUser(session?.user);
  // }

  // const dataUserProfile = session.user.profile;
  // const dataUser = session.user?.user;

  const dataUser = session?.user as UserData;

  return (
    <div className="bg-gray-100 w-full h-16 flex justify-between items-center transition-all z-10">
      <div className="">
        <Menu as="div" className="relative flex text-right sm:hidden bg-blue-500 p-1 w-10 h-10 rounded-full justify-center items-center">
          <div>
            <Menu.Button className="flex w-full justify-center items-center">
              <Bars3Icon className="h-5 w-5 text-white" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration=75"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <Menu.Items className="absolute left-0 top-1 w-60 z-50 mt-10 origin-top-right bg-blue-500 rounded-[16px] drop-shadow-xl">
              <div className="p-2" >
                <Menu.Item>
                  <Link
                    href="/dashboard"
                    className="flex w-full text-white rounded-[12px] p-1 text-sx group transition-colors items-center"
                  >
                    <div className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors ">
                      <div className="mr-2">
                        <ChartPieIcon className="h-5 w-5" />
                      </div>
                      <h1>Home</h1>
                    </div>
                  </Link>
                </Menu.Item>
              </div>


              {dataUser?.user.status !== 'pendente' && (
                <> 
                <div className="p-1" >
                  <Menu.Item>
                    <Link
                      href="/order"
                      className="flex w-full text-white rounded-[12px] p-1 text-sx group transition-colors items-center"
                    >
                      <div className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors ">
                        <div className="mr-2">
                          <MegaphoneIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h1>Chamados</h1>
                        </div>
                      </div>
                    </Link>
                  </Menu.Item>
                </div>
              </>
              )}



              {dataUser?.user.type === 'admin' && (
                <>
                  <div className="p-1" >
                    <Menu.Item>
                      <Link
                        href="/partner"
                        className="flex w-full text-white rounded-[12px] p-1 text-sx group transition-colors items-center"
                      >
                        <div className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors ">
                          <div className="mr-2">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <h1>Parceiros</h1>
                        </div>
                      </Link>
                    </Menu.Item>
                  </div>
                  <div className="p-1" >
                    <Menu.Item>
                      <Link
                        href="/townhouse"
                        className="flex w-full text-white rounded-[12px] p-1 text-sx group transition-colors items-center"
                      >
                        <div className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors ">
                          <div className="mr-2">
                            <BuildingOfficeIcon className="h-5 w-5" />
                          </div>
                          <h1>Condomínios</h1>
                        </div>
                      </Link>
                    </Menu.Item>
                  </div>


                  <button className="rounded-lg text-center cursor-pointer flex items-center transition-colors text-blue-400">
                    <div className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors ">
                      <div className="mr-2 flex justify-center items-center">
                        <div>
                          <Cog6ToothIcon className="h-5 w-5" />
                        </div>
                        <h6 className="text-xs">
                          Configurações
                        </h6>
                      </div>
                    </div>
                  </button>

                  <div className="p-1" >
                    <Link
                      href="/user"
                      className="flex w-full text-white rounded-[12px] p-1 text-sx group transition-colors items-center"
                    >
                      <div className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors ">
                        <div className="mr-2">
                          <UserGroupIcon className="h-5 w-5" />
                        </div>
                        <h1>Usuários</h1>
                      </div>
                    </Link>
                  </div>
                  <div className="p-1" >
                    <Link
                      href="/area"
                      className="flex w-full text-white rounded-[12px] p-1 text-sx group transition-colors items-center"
                    >
                      <div className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors ">
                        <div className="mr-2">
                          <WrenchScrewdriverIcon className="h-5 w-5" />
                        </div>
                        <h1>Áreas de Serviço</h1>
                      </div>
                    </Link>
                  </div>
                  <div className="p-1" >
                    <Link
                      href="/statusorder"
                      className="flex w-full text-white rounded-[12px] p-1 text-sx group transition-colors items-center"
                    >
                      <div className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors ">
                        <div className="mr-2">
                          <ExclamationTriangleIcon className="h-5 w-5" />
                        </div>
                        <h1>Status Chamado</h1>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>



      <div className="flex items-center">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center items-center">
              <picture>
                <img
                  src="/man-smiling.jpg"
                  className="rounded-full h-8 md:mr-4 border-2 border-white shadow-sm"
                  alt="profile picture"
                />
              </picture>

              <span className=" md:block font-medium text-gray-700 ml-2 uppercase">
                {dataUser?.user.name}
              </span>

              <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-700" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration=75"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <Menu.Items className="absolute right-0 w-56 z-50 mt-2 origin-top-right bg-white rounded-[16px] drop-shadow-md">
              <div className="p-1">
                <Menu.Item>
                  <Link
                    href={
                      dataUser?.user.type === 'partner'
                        ? `/partner/${dataUser.profile.id}`
                        : dataUser?.user.type === 'admin'
                          ? `/user/${dataUser?.user.id}`
                          : dataUser?.user.type === 'condominium'
                            ? `/townhouse/${dataUser.profile.id}`
                            : '#'
                    }
                    className="flex hover:bg-blue-700 hover:text-white text-gray-700 rounded-[12px] p-2 text-sm group transition-colors items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className="flex w-full hover:bg-blue-700 hover:text-white text-gray-700 rounded-[12px] p-2 text-sm group transition-colors items-center"
                    onClick={() => signOut()}
                  >
                    <Cog8ToothIcon className="h-4 w-4 mr-2" />
                    Sair
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}