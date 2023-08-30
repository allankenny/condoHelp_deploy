"use client"
interface PageTitleDefaultProps{
  title: string,
}
export function PageTitleDefault(props: PageTitleDefaultProps){
  return (
    <div className="flex w-auto  max-[600px]:w-full">
      <p className="text-gray-700 text-2xl font-bold">{props.title}</p>
    </div>
  )
}