import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePrev: () => void;
  handleNext: () => void;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePrev,
  handleNext,
  setCurrentPage,
}) => {
  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages if <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More than 5 pages
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages.map((page, index) =>
      typeof page === "number" ? (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded border text-sm ${
            page === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ) : (
        <span key={index} className="px-2 text-gray-500">
          ...
        </span>
      )
    );
  };

  return (
    <div className="flex justify-center items-center space-x-2 p-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded border text-sm ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        Prev
      </button>

      {renderPageNumbers()}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded border text-sm ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        Next 
      </button>
    </div>
  );
};

export default Pagination;
