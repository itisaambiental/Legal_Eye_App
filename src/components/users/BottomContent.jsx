import { Button, Pagination } from "@nextui-org/react";
import { useMemo } from "react";

/**
 * BottomContent component
 * 
 * This component renders pagination controls along with a selection summary
 * for a paginated list. It displays the current page number, total pages, 
 * and allows navigation between pages with "Previous" and "Next" buttons.
 * It also shows the count of selected items relative to the total items 
 * in the filtered list.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {number} props.page - Current page number.
 * @param {number} props.totalPages - Total number of pages.
 * @param {function} props.onPageChange - Function to call when page changes.
 * @param {function} props.onPreviousPage - Function to call when navigating to the previous page.
 * @param {function} props.onNextPage - Function to call when navigating to the next page.
 * @param {Set|string} props.selectedKeys - Selected items, either as a Set of selected IDs or the string "all" if all are selected.
 * @param {Array} props.filteredItems - List of filtered items.
 * 
 * @returns {JSX.Element} - Rendered BottomContent component with pagination controls.
 */
function BottomContent({ page, totalPages, onPageChange, onPreviousPage, onNextPage, selectedKeys, filteredItems }) {
  const paginationContent = useMemo(() => {
    const allSelected = selectedKeys === "all" || selectedKeys.size === filteredItems.length;

    return (
      <div className="py-2 px-2 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-24">
        <div className="w-full sm:w-[30%] text-small text-default-400 text-center sm:text-left">
          {allSelected
            ? `${filteredItems.length} de ${filteredItems.length} seleccionados`
            : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </div>
        <div className="w-full sm:w-auto flex justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
        <div className="hidden sm:flex w-[30%] justify-start gap-2 ">
          <Button isDisabled={page <= 1} size="sm" color="primary" variant="solid" onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={page >= totalPages} size="sm" color="primary" variant="solid" onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, totalPages, onPageChange, onPreviousPage, onNextPage]);

  return paginationContent;
}

export default BottomContent;
  