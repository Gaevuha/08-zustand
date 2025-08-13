import css from './Pagination.module.css';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (nextPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      containerClassName={css.pagination}
      activeClassName={css.active}
      onPageChange={({ selected }) => onChange(selected + 1)}
      forcePage={page - 1}
      renderOnZeroPageCount={null}
    />
  );
}
