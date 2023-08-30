"use client"
import { useState } from 'react';

export default function BarSearch({ onSearch }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };
  const handleKeyDown = (event : any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="flex flex-1 max-[600px]:w-full">
      <input
        type="search"
        className="relative ml-20 mr-0 max-[600px]:ml-0 block w-[1px] min-w-0 h-12 flex-auto rounded-[16px] border border-gray-300 bg-white bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-gray-300 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none "
        placeholder="Procurar"
        aria-label="Procurar"
        aria-describedby="button-addon2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <span
        className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700"
        id="basic-addon2"
        onClick={handleSearch} // Adicione o evento de clique para a pesquisa
        style={{ cursor: 'pointer' }} // Adicione um cursor de ponteiro para indicar interatividade
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#A4A4A4"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}
