import { database } from "@/config/firebase";
import { Modal } from "@mui/material";
import { ref, update } from "firebase/database";

export default function DetailModal({ open, handleClose = () => {}, data }) {
  const handleReviewed = async () => {
    const articleRef = ref(
      database,
      `news/data/${data.uid}/list/${data.index}`
    );
    try {
      await update(articleRef, {
        reviewed: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="bg-slate-800 p-3 h-screen overflow-y-auto rounded-xl w-[40%] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button
          className="absolute right-5 top-5 text-2xl"
          onClick={handleClose}
        >
          <ion-icon name="close-circle-outline"></ion-icon>
        </button>
        {data.reviewed && (
          <label className="absolute left-5 top-5 p-2 border border-green-500 rounded-md">
            Reviewed
          </label>
        )}
        <img
          src={data.image}
          className="object-cover w-full h-56 overflow-hidden rounded-lg"
        />
        <div className="flex flex-row justify-between">
          <div className="mt-6 flex flex-col w-[48%]">
            <label>Title</label>
            <textarea
              className="bg-transparent p-2 h-16 mt-2 border border-neutral-300 rounded-md"
              value={data.title}
            />
          </div>
          <div className="mt-6 flex flex-col w-[48%]">
            <label>Tag</label>
            <textarea
              className="bg-transparent p-2 h-16 mt-2 border border-neutral-300 rounded-md"
              value={data.section}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col">
          <label>Content</label>
          <textarea
            className="bg-transparent p-2 h-60 mt-2 border border-neutral-300 rounded-md"
            value={data.content}
          />
        </div>
        <button
          className="mt-6 flex border border-green-600 py-3 w-full items-center flex-col rounded-md transition ease-in-out duration-300 hover:bg-green-600"
          onClick={handleReviewed}
        >
          <p>Set as Reviewed</p>
        </button>
      </div>
    </Modal>
  );
}
