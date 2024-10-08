import { Button, Pagination } from "@nextui-org/react";
import { useMemo } from "react";


function BottomContent({ page, totalPages, onPageChange, onPreviousPage, onNextPage, selectedKeys, filteredItems }) {
  const paginationContent = useMemo(() => {
    const allSelected = selectedKeys === "all" || selectedKeys.size === filteredItems.length;

    return (
      <div className="py-2 px-2 flex justify-between gap-24 items-center">
         <span className="w-[30%] text-small text-default-400">
          {allSelected
            ? `${filteredItems.length} de ${filteredItems.length} seleccionados`
            : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </span>

  <div className="ml-4">
        <Pagination
          isCompact
          showControls
          showShadow
          color="danger"
          page={page}
          total={totalPages}
          onChange={onPageChange}
        />
        </div>

        <div className="hidden sm:flex w-[30%] justify-start gap-2 ">
          <Button isDisabled={page <= 1} size="sm" color="danger" variant="solid" onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={page >= totalPages} size="sm" color="danger" variant="solid" onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, totalPages, onPageChange, onPreviousPage, onNextPage]);

  return paginationContent;
}

export default BottomContent;
