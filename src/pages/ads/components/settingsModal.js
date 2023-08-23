import { database } from "@/config/firebase";
import { Modal } from "@mui/material";
import { ref, update } from "firebase/database";
import { useEffect, useState } from "react";

export default function SettingsModal({ data, open, handleClose = () => {} }) {
  const [settingData, setSettingData] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newData = settingData.map((item) => {
      if (item.tipe === name) {
        return { ...item, pricePerDay: value };
      }
      return item;
    });
    setSettingData(newData);
  };

  useEffect(() => {
    const normalized = data?.map((item) => {
      return { ...item, pricePerDay: item.pricePerDay.toString() };
    });
    setSettingData(normalized);

    return () => {
      setSettingData(null);
    };
  }, [data]);

  const handleSave = async () => {
    try {
      const settingRef = ref(database, "/ads");
      const normalized = settingData?.map((item) => {
        return { ...item, pricePerDay: parseInt(item.pricePerDay) };
      });
      await update(settingRef, { options: normalized });
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal open={open} onClose={handleClose} className="backdrop-blur-sm">
      <div className="absolute rounded-md top-[50%] left-[50%] py-3 px-4 transform -translate-x-[50%] -translate-y-[50%] bg-slate-800 text-neutral-400">
        <div className="pb-4 border-b border-slate-500 mb-2">
          <h2 className="text-xl font-normal">Ads Banner Settings</h2>
        </div>

        <div>
          {settingData?.map((item) => (
            <div key={item.tipe}>
              <div className="flex flex-row mb-2">
                <h3 className="w-[40%]">{item.tipe}</h3>
                <p className="mx-2">:</p>
                <input
                  name={item.tipe}
                  className="bg-transparent rounded-md px-2 border-[2px] border-cyan-900 focus:border-cyan-500 border-solid"
                  type="text"
                  placeholder="IDR Price (Ex: 20000)"
                  value={item.pricePerDay}
                  onChange={handleChange}
                />
                <p className="ml-2">/day</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-row justify-end mt-2">
          <button
            className="flex flex-row border border-green-500 rounded-md hover:bg-green-500 hover:text-white items-center px-3 py-2 "
            onClick={handleSave}
          >
            <p>Save</p>
          </button>
          <button
            className="flex flex-row ml-3 border border-red-500 rounded-md hover:bg-red-500 hover:text-white items-center px-3 py-2 "
            onClick={handleClose}
          >
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </Modal>
  );
}
