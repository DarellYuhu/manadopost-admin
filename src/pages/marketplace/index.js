import { useEffect, useState } from "react";
import SettingsModal from "./components/settingsModal";
import CustomTable from "./components/customTable";
import { onValue, ref } from "firebase/database";
import { database } from "@/config/firebase";
import normalizeData from "@/utils/normalizeData";
import ListModal from "./components/listModal";
import Layout from "@/components/layout";
import AddModal from "./components/addModal";

export default function Marketplace() {
  const [settingModal, setSettingModal] = useState(false);
  const [data, setData] = useState(null);
  const [listModal, setListModal] = useState(false);
  const [listData, setListData] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const marketplaceRef = ref(database, "/marketplace");

  useEffect(() => {
    onValue(marketplaceRef, (snapshot) => {
      const data = snapshot.val();
      const normalized = normalizeData(data);
      setData(normalized);
    });
  }, []);
  return (
    <Layout>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-row w-full justify-between items-center border-slate-700 border border-solid p-2 rounded-md">
          <h1 className="text-2xl font-medium">Marketplace</h1>
          <div className="flex flex-row gap-2">
            <button
              className="flex flex-row bg-emerald-400 hover:bg-emerald-600 items-center py-2 px-4 rounded-md"
              onClick={() => setAddModal(!addModal)}
            >
              <ion-icon name="add-circle-outline"></ion-icon>
              <p className="ml-2">Add Marketplace Ads</p>
            </button>
            <button
              className="flex flex-row bg-cyan-400 hover:bg-cyan-600 items-center py-2 px-4 rounded-md "
              onClick={() => setSettingModal(true)}
            >
              <ion-icon name="settings"></ion-icon>
              <p className="ml-2">Settings</p>
            </button>
          </div>
        </div>

        <CustomTable
          data={data}
          actionPressed={(data) => {
            setListModal(true);
            setListData(data);
          }}
        />

        <SettingsModal
          open={settingModal}
          handleClose={() => setSettingModal(false)}
        />

        <ListModal
          open={listModal}
          handleClose={() => {
            setListModal(false);
            setListData(null);
          }}
          data={listData}
        />

        <AddModal handleClose={() => setAddModal(!addModal)} open={addModal} />
      </div>
    </Layout>
  );
}
