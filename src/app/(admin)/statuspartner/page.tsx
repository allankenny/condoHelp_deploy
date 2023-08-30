"use client"
import BarSearch from "../../../components/BarSearch"
import { ButtonAddLink } from "../../../components/Buttons"
import { PageTitleDefault } from "../../../components/PageTitle"
import { useSession } from "next-auth/react"
export default function StatusPartner() {
  const { data: session, status } = useSession({
    required: true,
  })
  // if(status === "loading"){
  //   return <></>
  // }
  return (
    <>
      <div className="flex justify-between items-center h-20 mb-5" >
        <PageTitleDefault title="Status do Parceiro" />
        <BarSearch />
        <ButtonAddLink route="user/add" label="Novo Usuário" />
      </div>
     

    </>
  )
}