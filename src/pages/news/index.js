import { database } from "@/config/firebase";
import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import CustomTable from "./components/customTable";
import ListModal from "./components/listModal";
import Layout from "@/components/layout";

export default function News() {
  const [data, setData] = useState(null);
  const [listData, setListData] = useState(null);
  const newsRef = ref(database, "news/data");

  useEffect(() => {
    onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      const normalized = Object.keys(data).map((key) => {
        return { ...data[key] };
      });

      setData(normalized);
    });

    return () => {
      off(newsRef);
    };
  }, []);
  return (
    <Layout>
      <div className="flex flex-col flex-1">
        <div className="flex flex-row w-full justify-between items-center border-slate-700 border border-solid p-2 rounded-md">
          <h1 className="text-2xl font-medium">News</h1>
        </div>

        <CustomTable data={data} handleList={setListData} />
        <ListModal
          open={listData}
          data={listData}
          handleClose={() => setListData(null)}
        />
      </div>
    </Layout>
  );
}
