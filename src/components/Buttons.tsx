"use client"
import Link from "next/link";
import { useState } from 'react';


interface ButtonAddProps{
  route: string,
  label: string,
  action?: any,
  onClick?: (event: any) => Promise<void>,
}


export function ButtonAddLink(props:ButtonAddProps){
  return (
    <div className="flex w-auto max-[600px]:w-full">
      <Link href={`/${props.route}`} className="w-full">
        <button className="rounded-full w-full bg-blue-500 px-10 py-3 text-white hover:bg-blue-600" onClick={props.onClick}>{props.label}</button>
      </Link>
    </div>
  );
}

interface ButtonConfirmProps{
  route: string,
  label: string,
  action?: any,
}

export function ButtonConfirm(props:ButtonConfirmProps){
  return (
    <div className="flex w-auto max-[600px]:w-full">
      <Link href={`/${props.route}`} className="w-full">
        <button className="rounded-full bg-blue-500 px-10 py-3 text-white hover:bg-blue-600">{props.label}</button>
      </Link>
    </div>
  );
}

interface ButtonCancelProps{
  route: string,
  label: string,
  action?: any,
}

export function ButtonCancel(props:ButtonCancelProps){
  return (
    <div className="flex w-auto max-[600px]:w-full">
      <Link href={`/${props.route}`} className="w-full">
        <button className="rounded-full max-[600px]:w-full bg-white px-10 py-3 text-gray-400 border border-gray-300 hover:bg-gray-300 hover:text-white">{props.label}</button>
      </Link>
    </div>
  );
}








