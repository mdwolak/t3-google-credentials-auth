import { useState } from "react";

import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";

import UpdateExemplarModal from "~/components/exemplars/update.exemplar.modal";
import Modal from "~/components/modals/modal";
import { type RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

type ExemplarItemProps = {
  exemplar: RouterOutputs["exemplar"]["getExemplars"]["exemplars"][number];
};

const ExemplarItem = ({ exemplar }: ExemplarItemProps) => {
  const apiContext = api.useContext();

  const [openMenu, setOpenMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { mutate: deleteExemplar } = api.exemplar.deleteExemplar.useMutation({
    onSuccess() {
      apiContext.exemplar.invalidate();
      toast.success("Exemplar deleted successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const onDeleteHandler = (id: number) => {
    toggleMenu();
    if (window.confirm("Are you sure")) {
      deleteExemplar(id);
    }
  };
  return (
    <>
      <div className="rounded-md bg-white shadow-md">
        <div className="p-4">
          <h5 className="mb-4 text-xl font-semibold text-[#4d4d4d]">
            {exemplar.title.length > 25 ? exemplar.title.substring(0, 25) + "..." : exemplar.title}
          </h5>
          <div className="mt-4 flex items-center">
            <p className="mr-4 rounded-sm bg-[#dad8d8] p-1">{exemplar.category}</p>
            <p className="text-[#ffa238]">
              {format(parseISO(exemplar.createdAt.toISOString()), "PPP")}
            </p>
          </div>
          <div className="mt-4">{exemplar.content}</div>
        </div>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="relative">
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => {
                setOpenModal(true);
                toggleMenu();
              }}>
              <i className="bx bx-edit-alt"></i> <span>Edit</span>
            </a>
            <a
              className="flex h-7 w-24 cursor-pointer items-center gap-2 px-2 py-3 transition duration-300 ease-in hover:bg-[#f5f5f5]"
              onClick={() => onDeleteHandler(exemplar.id)}>
              <i className="bx bx-trash"></i> <span>Delete</span>
            </a>
          </div>
        </div>
      </div>
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <UpdateExemplarModal exemplar={exemplar} setOpenModal={setOpenModal} />
      </Modal>
    </>
  );
};

export default ExemplarItem;