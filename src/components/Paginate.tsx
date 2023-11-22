import React from 'react';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";

type PaginationButtonProps = {
  page: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
};

const PaginationButton = ({ page, currentPage, handlePageChange }: PaginationButtonProps) => (
  <button
    key={page}
    onClick={() => handlePageChange(page)}
    disabled={currentPage === page}
    className={`mx-1 px-3 py-1 text-white rounded-[12px] ${currentPage === page ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {page}
  </button>
);

type OrderData = {
  current_page: number;
  last_page: number;
};

type PaginationProps = {
  orderData: OrderData;
  handlePageChange: (page: number) => void;
};

const Pagination = ({ orderData, handlePageChange }: PaginationProps) => {
  const pages = Array.from({ length: Math.min(4, orderData.last_page) }, (_, i) => orderData.current_page - 2 + i)
    .filter(page => page >= 1 && page <= orderData.last_page);

  return (
    <div className="flex pl-2">
      <button
        onClick={() => handlePageChange(orderData.current_page - 1)}
        disabled={orderData.current_page === 1}
        className="px-2 py-1 mr-2 text-white bg-blue-500 rounded-[12px] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronDoubleLeftIcon className="h-5 w-5 hover:text-blue-500" />
      </button>

      {pages.map(page => (
        <PaginationButton
          key={page}
          page={page}
          currentPage={orderData.current_page}
          handlePageChange={handlePageChange}
        />
      ))}

      <button
        onClick={() => handlePageChange(orderData.current_page + 1)}
        disabled={orderData.current_page === orderData.last_page}
        className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-[12px] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronDoubleRightIcon className="h-5 w-5 hover:text-blue-500" />
      </button>
    </div>
  );
};

export default Pagination;
