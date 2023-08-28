import { database } from "@/config/firebase";
import { Switch } from "@mui/material";
import { ref, set, update } from "firebase/database";
import { useState } from "react";

export default function Action({ user, lotteryList }) {
  const [visible, setVisible] = useState(false);
  const winnerRef = ref(database, "lottery/winner");
  const winner = lotteryList?.find((list) => list.email === user.email);

  const handleWinner = async () => {
    try {
      const winner = [
        ...lotteryList,
        {
          email: user?.email,
          claimed: false,
          name: user?.fullName,
        },
      ];
      await set(winnerRef, winner);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClaimed = async (event) => {
    try {
      const index = lotteryList?.findIndex((list) => list.email === user.email);
      const referance = ref(database, `lottery/winner/${index}`);
      await update(referance, { claimed: event.target.checked });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="relative flex items-center justify-center flex-col">
      <button
        className=" text-2xl flex items-center justify-center"
        onClick={() => setVisible(!visible)}
      >
        <ion-icon name="ellipsis-vertical-circle-outline"></ion-icon>
      </button>
      {visible && (
        <div className="absolute top-8 -left-16 bg-slate-400 shadow-md z-10 rounded-md p-3 w-32 transition-all">
          <div>
            <button
              className="flex flex-row bg-blue-500 text-2xl items-center rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-blue-700 duration-300"
              onClick={handleWinner}
              disabled={winner ? true : false}
            >
              <ion-icon name="add-outline"></ion-icon>
              <p className="text-xs">Add to winner list</p>
            </button>
          </div>
          <div>
            <label>Set Claimed</label>
            <Switch
              checked={winner?.claimed}
              disabled={winner ? false : true}
              onChange={handleClaimed}
            />
          </div>
        </div>
      )}
    </div>
  );
}
