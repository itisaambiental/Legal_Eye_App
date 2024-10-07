import { useMemo } from "react";

const TopContent = ({ onRowsPerPageChange, users }) => {
  const Content = useMemo(() => {
    return (
      <section className="bg-white mt-12 text-center justify-center  flex flex-col items-center -ml-64">

        
        <div className="bg-white dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
      </section>
    );
  }, [onRowsPerPageChange, users]);

  return Content;
};

export default TopContent;
