import {useEffect, useState} from "react";
import Pagination from "react-bootstrap/Pagination";

export default function MyPagination(props) {
  const step = 20;
  const limit = 10;
  const maxPageCount = Math.ceil(props.count / step);
  const centerIndex = Math.ceil(limit / 2);
  const [ currentPage, setCurrentPage ] = useState(validatePageRange(props.page));
  const pages = generatePageList(currentPage, limit);
  const navigateToPage = props.navigate;

  function validatePageRange(page: number): number {
    if (page < 1) {
      return 1;
    } else if (page < maxPageCount) {
      return page;
    } else {
      return maxPageCount;
    }
  }

  function generatePageList(aroundIndex: number, limit: number): number[] {
    let startIndex = 0;
    const result = [];

    if (aroundIndex + centerIndex > maxPageCount) {
      startIndex = maxPageCount - limit;
    } else if (aroundIndex - centerIndex > 0) {
      startIndex = aroundIndex - centerIndex;
    }

    for (let i = 1; i <= limit; i++) {
      result.push(startIndex + i);
    }
    return result;
  }

  function isFirstScreen(): boolean {
    return currentPage - centerIndex <= 0;
  }

  function isFirstActive(): boolean {
    return currentPage === 1;
  }

  function isLastActive(): boolean {
    return currentPage === maxPageCount;
  }

  function isLastScreen(): boolean {
    return currentPage + centerIndex >= maxPageCount;
  }

  function isActiveItem(item: number): boolean {
    return currentPage === item;
  }

  function selectItem(page: number) {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }

  function firstPage() {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage + 1 <= maxPageCount) {
      setCurrentPage(currentPage + 1);
    }
  }

  function lastPage() {
    if (currentPage < maxPageCount) {
      setCurrentPage(maxPageCount);
    }
  }

  useEffect(() => {
    navigateToPage(currentPage);
  }, [currentPage]);

  return (
    <Pagination>
      <Pagination.First disabled={isFirstScreen()} onClick={firstPage} />
      <Pagination.Prev disabled={isFirstActive()} onClick={prevPage} />
      {pages.map((page, idx) => (
        <Pagination.Item
          key={idx}
          active={isActiveItem(page)}
          onClick={() => selectItem(page)}
        >
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next disabled={isLastActive()} onClick={nextPage} />
      <Pagination.Last disabled={isLastScreen()} onClick={lastPage} />
    </Pagination>
  )
}
