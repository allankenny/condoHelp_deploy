"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { BsFillClipboard2CheckFill } from "react-icons/bs"
import { FiCheckSquare, FiFileText } from "react-icons/fi"
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import UserData from "../../interface/userData";
import {
  BuildingOfficeIcon,
  MegaphoneIcon,
  UserIcon,
  UserGroupIcon,
  ChartPieIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { data: session, status } = useSession({
    required: true,
  })


  

  const dataUser = session?.user as UserData;
  

  if (status === "loading") {
    return <></>
  }

  return (
    <>
      {/* menu large screen */}
      <div
        className={`hidden md:block bg-blue-700 shadow-sm min-h-screen z-50 ${open ? "w-64" : "w-16"
          } duration-200 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-between">
          {open && (
            <picture>
              <img
                className="w-28 h-auto"
                src="/logo.png"
                alt="condo help"
              />
            </picture>
          )}
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          <Link
            href="/dashboard"
            className={'group flex items-center text-sm  gap-3.5 font-medium p-2 text-white hover:bg-blue-100 hover:text-blue-500 rounded-md'}
          >
            <div><ChartPieIcon className="h-5 w-5" /></div>
            <h2
              style={{
                transitionDelay: `300ms`,
              }}
              className={`whitespace-pre duration-200 text-sm ${!open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
            >
              Home
            </h2>
            <h2
              className={`${open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
            >
              Home
            </h2>
          </Link>

          {dataUser.user.status !== 'pendente' && (
            <>
          <Link
            href="/order"
            className={'group flex items-center text-sm  gap-3.5 font-medium p-2 text-white hover:bg-blue-100 hover:text-blue-500 rounded-md'}
          >
            <div><MegaphoneIcon className="h-5 w-5" /></div>
            <h2
              style={{
                transitionDelay: `300ms`,
              }}
              className={`whitespace-pre duration-200 text-sm ${!open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
            >
              Chamados
            </h2>
            <h2
              className={`${open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
            >
              Chamados
            </h2>
          </Link>
          </>
          )}

          {dataUser.user.type === 'admin' && (
            <>
              <Link
                href="/partner"
                className={'group flex items-center text-sm  gap-3.5 font-medium p-2 text-white hover:bg-blue-100 hover:text-blue-500 rounded-md'}
              >
                <div><UserIcon className="h-5 w-5" /></div>
                <h2
                  style={{
                    transitionDelay: `300ms`,
                  }}
                  className={`whitespace-pre duration-200 text-sm ${!open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                >
                  Parceiros
                </h2>
                <h2
                  className={`${open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  Parceiros
                </h2>
              </Link>

              <Link
                href="/townhouse"
                className={'group flex items-center text-sm  gap-3.5 font-medium p-2 text-white hover:bg-blue-100 hover:text-blue-500 rounded-md'}
              >
                <div><BuildingOfficeIcon className="h-5 w-5" /></div>
                <h2
                  style={{
                    transitionDelay: `300ms`,
                  }}
                  className={`whitespace-pre duration-200 text-sm ${!open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                >
                  Condomínios
                </h2>
                <h2
                  className={`${open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  Condomínios
                </h2>
              </Link>



              <div className={'group flex items-center text-sm  gap-3.5 font-medium p-2 text-white hover:bg-blue-100 hover:text-blue-500 rounded-md'}>
                <div className="group inline-block ">
                  <button className="rounded-lg text-center cursor-pointer flex items-center transition-colors text-blue hover:bg-blue-100 hover:text-blue-500">
                    <div>
                      <Cog6ToothIcon className="h-5 w-5" />
                    </div>

                    <h2
                      style={{
                        transitionDelay: `300ms`,
                      }}
                      className={`whitespace-pre duration-200 text-sm ml-4 ${!open && "opacity-0 translate-x-28 overflow-hidden"
                        }`}
                    >
                      Configurações
                    </h2>
                    <span
                      style={{
                        transitionDelay: `300ms`,
                      }}
                      className={`whitespace-pre duration-200 text-sm ${!open && "opacity-0 translate-x-28 overflow-hidden"
                        }`}
                    >
                      <svg className="fill-current h-4 w-4 transform group-hover:-rotate-180
                            transition duration-150 ease-in-out"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20" >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </span>
                    <h2
                      className={`${open && "hidden"
                        } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                    >
                      Configurações
                    </h2>

                  </button>
                  <ul className="w-52 min-w-full rounded-lg transform scale-0 group-hover:scale-100 absolute
                  transition duration-150 ease-in-out origin-top bg-custom-blue p-2 mt-2">
                    <li className="rounded-md px-2 py-1 mx-0 text-white hover:bg-blue-100 hover:text-blue-500 ">
                      <Link href="/user">
                        <div
                          className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors  "
                        >
                          <div className="mr-2">
                            <UserGroupIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p>Usuários</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="rounded-md px-2  py-1  text-white hover:bg-blue-100 hover:text-blue-500 ">
                      <Link href="/area">
                        <div
                          className=" py-1 mx-1 pr-4 pl-1  text-center cursor-pointer flex items-center transition-colors  "
                        >
                          <div className="mr-2">
                            <WrenchScrewdriverIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p>Áreas de Serviço</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="rounded-md px-2 py-1 mx-0 text-white hover:bg-blue-100 hover:text-blue-500 ">
                      <Link href="/statusorder">
                        <div
                          className=" py-1 mx-1 pr-4 pl-1 text-center cursor-pointer flex items-center transition-colors  "
                        >
                          <div className="mr-2">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p>Status Chamado</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="rounded-md px-2 py-1 mx-0 text-white hover:bg-blue-100 hover:text-blue-500 ">
                      <Link href="/term">
                        <div
                          className=" py-1 mx-1 pr-4 pl-1 text-center cursor-pointer flex items-center transition-colors  "
                        >
                          <div className="mr-2">
                            <DocumentTextIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p>Termos</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>

  );
}