"use client"
import Link from 'next/link';

const Pagination = ({ data }: any) => {
    console.log(data);
  const { current_page, last_page } = data;
  return (
    <div>
      {current_page > 1 && (
        <Link href={`?page=${current_page - 1}`}>
          <a>Anterior</a>
        </Link>
      )}
      {current_page < last_page && (
        <Link href={`?page=${current_page + 1}`}>
          <a>Próximo</a>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
