import { database } from "@/config/firebase";
import {
  onValue,
  ref,
  query,
  orderByChild,
  child,
  orderByKey,
  equalTo,
  orderByValue,
} from "firebase/database";
import { useEffect, useState } from "react";
import CustomTable from "./components/customTable";

export default function Lottery() {
  const [subscriber, setSubscriber] = useState(null);
  const usersRef = ref(database, "users");

  useEffect(() => {
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const cleaned = Object.keys(data).map((key) => {
        return { id: key, ...data[key] };
      });
      const filtered = cleaned.filter((user) => {
        return user?.subscription?.isExpired === false;
      });
      setSubscriber(filtered);
    });
  }, []);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-row w-full justify-between items-center border-slate-700 border border-solid p-2 rounded-md">
        <h1 className="text-2xl font-medium">Lottery</h1>
        <button
          className="flex flex-row bg-cyan-400 hover:bg-cyan-600 items-center py-2 px-4 rounded-md "
          onClick={() => setModal(true)}
        >
          <ion-icon name="settings"></ion-icon>
          <p className="ml-2">Settings</p>
        </button>
      </div>

      <CustomTable data={subscriber} />
    </div>
  );
}
