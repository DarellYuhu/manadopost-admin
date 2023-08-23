import { useEffect, useState } from "react";
import SettingsModal from "./components/settingsModal";
import { onValue, ref } from "firebase/database";
import { database } from "@/config/firebase";

export default function Ads() {
  const [adsSettings, setAdsSettings] = useState(null);
  const [modal, setModal] = useState(false);
  const adsRef = ref(database, "/ads");

  useEffect(() => {
    onValue(adsRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setAdsSettings(data.options);
    });
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-row w-full justify-between items-center border-slate-700 border border-solid p-2 rounded-md">
        <h1 className="text-2xl font-medium">Ads</h1>
        <button
          className="flex flex-row bg-cyan-400 hover:bg-cyan-600 items-center py-2 px-4 rounded-md "
          onClick={() => setModal(true)}
        >
          <ion-icon name="settings"></ion-icon>
          <p className="ml-2">Settings</p>
        </button>
      </div>
      <div>
        <p>yuhu</p>
      </div>

      {modal && (
        <SettingsModal
          data={adsSettings}
          open={modal}
          handleClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
