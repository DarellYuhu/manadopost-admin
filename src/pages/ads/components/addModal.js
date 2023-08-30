import CustomCalendar from "@/components/customCalendar";
import { database, storage } from "@/config/firebase";
import { Modal } from "@mui/material";
import { get, off, onValue, ref, set, update } from "firebase/database";
import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

export default function AddModal({ open, onClose = () => {} }) {
  const inputRef = useRef(null);
  const [configuration, setConfiguration] = useState(null);
  const [calendarModal, setCalendarModal] = useState(false);
  const [data, setData] = useState({
    adsConfig: null,
    duration: "",
    startDate: "",
    imageUri: "",
    isAllowed: Boolean(false),
    link: "",
    price: Number(0),
    type: "",
  });

  const handleType = (event) => {
    setData((prev) => ({ ...prev, type: event.target.value }));
  };

  const handleLink = (event) => {
    setData((prev) => ({ ...prev, link: event.target.value }));
  };

  const handleStartDate = (value) => {
    setData((prev) => ({
      ...prev,
      startDate: moment(value).format("DD MMMM YYYY"),
    }));
  };

  const handleDuration = (event) => {
    setData((prev) => ({
      ...prev,
      duration: event.target.value,
    }));
  };

  const handleImageUpload = async (file) => {
    const randomNum = Math.floor(Math.random() * 901) + 100;
    const parts = file.name.split(".");
    const fileName = parts[0] + randomNum + "." + parts[1];
    const imageRef = storageRef(storage, `/images/ads/${fileName}`);
    try {
      await uploadBytes(imageRef, file);
      const uri = await getDownloadURL(imageRef);
      return uri;
    } catch (error) {
      console.log(error);
    }
  };

  const checkRequired = (data) =>
    new Promise((resolve, reject) => {
      if (
        data.adsConfig !== null &&
        data.imageUri !== "" &&
        data.link !== "" &&
        data.startDate !== "" &&
        data.duration !== ""
      )
        resolve(data);
      else reject("Please fill all the field");
    });

  const handlePayload = (payload) => {
    const orderRef = ref(database, "ads/data/admin");
    try {
      get(orderRef).then((snapshot) => {
        const data = snapshot.val();
        const thisRef = snapshot.ref;
        if (!data?.profile) {
          const payload = {
            email: "",
            fullName: "Manadopost Admin",
          };
          set(thisRef, { profile: payload });
        }
        const list = data?.list ? data.list : [];
        list.push(payload);
        update(thisRef, { list });
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setData({
      adsConfig: null,
      duration: "",
      startDate: "",
      imageUri: "",
      isAllowed: Boolean(false),
      link: "",
      price: Number(0),
      type: "",
    });
    onClose();
  };

  const handleOrder = async () => {
    try {
      const passed = await checkRequired(data);
      const withDate = {
        ...passed,
        endDate: moment(passed.startDate)
          .add(passed.duration, "days")
          .format("DD MMMM YYYY"),
      };
      const iamgeUri = await handleImageUpload(withDate.imageUri);
      const payload = { ...withDate, imageUri: iamgeUri };
      handlePayload(payload);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const optionRef = ref(database, "ads/options");
    onValue(optionRef, (snapshot) => {
      const data = snapshot.val();
      setConfiguration([{ tipe: "" }, ...data]);
    });
  }, []);

  useEffect(() => {
    if (data.type) {
      const conf = configuration?.find((item) => item.tipe === data.type);
      setData((prev) => ({ ...prev, adsConfig: conf }));
    } else {
      setData((prev) => ({ ...prev, adsConfig: null }));
    }
  }, [data.type]);

  useEffect(() => {
    if (data.duration) {
      setData((prev) => ({
        ...prev,
        price: Number(data.duration) * data.adsConfig?.pricePerDay,
      }));
    }
  }, [data.duration, data.adsConfig]);

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute left-1/2 top-1/2 flex flex-col gap-3 p-4 h-screen w-[45%] overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-lg">
        <label className="flex flex-col gap-2">
          Select Banner Type:
          {configuration && (
            <select
              className="bg-transparent p-2 border border-white rounded-md"
              onChange={handleType}
              placeholder="Select Banner Type"
            >
              {configuration?.map((item) => (
                <option
                  key={item.tipe}
                  value={item.tipe}
                  className="bg-gray-800"
                >
                  {item.tipe}
                </option>
              ))}
            </select>
          )}
        </label>

        <div className="flex items-center flex-row justify-center">
          <div
            className="relative rounded-md w-[300px] border overflow-hidden justify-center flex items-center"
            style={{
              height: data.adsConfig?.height ? data.adsConfig.height : 100,
            }}
          >
            {data.imageUri ? (
              <>
                <img
                  src={URL.createObjectURL(data.imageUri)}
                  className="object-cover"
                />
                <button
                  className="flex absolute right-2 top-2 border border-red-500 p-0.5 rounded-full transition ease-in-out duration-300 hover:bg-red-500"
                  onClick={() => setData((prev) => ({ ...prev, imageUri: "" }))}
                >
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </>
            ) : (
              <>
                <button
                  className="absolute flex items-center bg-gray-700 py-1 px-2 rounded-md shadow-md transition ease-in-out duration-300 hover:bg-gray-800"
                  onClick={() => inputRef.current.click()}
                >
                  <ion-icon name="folder-outline"></ion-icon>
                  <p className="ml-1">Browse</p>
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    if (event.target.files[0])
                      setData((prev) => ({
                        ...prev,
                        imageUri: event.target.files[0],
                      }));
                  }}
                  hidden={true}
                />
              </>
            )}
          </div>
        </div>

        <label className="flex flex-col gap-2">
          Direct Link:
          <input
            value={data.link}
            onChange={handleLink}
            className="bg-transparent border border-white p-2 rounded-md"
            placeholder="www.example.com"
          />
        </label>

        <div className="flex flex-row justify-between">
          <label className="flex flex-col">
            Start Date:
            <div className="flex items-center p-2 rounded-md bg-slate-400">
              <input
                className="bg-transparent"
                disabled={true}
                value={data.startDate}
              />
              <button
                className="flex p-1 rounded-md shadow-md transition ease-in-out duration-300 hover:bg-white hover:text-black"
                onClick={() => setCalendarModal(!calendarModal)}
              >
                <ion-icon name="calendar-outline"></ion-icon>
              </button>
            </div>
          </label>
          <label className="flex flex-col">
            Duration:
            <input
              value={data.duration}
              onChange={handleDuration}
              className="bg-transparent p-2 border border-white rounded-md"
              type="number"
              placeholder="number"
            />
          </label>
        </div>

        <div className="self-end">
          <h2 className="text-xl font-medium">
            {data.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </h2>
          <div className="flex justify-end gap-2">
            <button
              className="p-2 rounded-md border border-red-500 transition ease-in-out duration-300 hover:bg-red-600"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="p-2 rounded-md border border-green-500 transition ease-in-out duration-300 hover:bg-green-600"
              onClick={handleOrder}
            >
              Order
            </button>
          </div>
        </div>

        <CustomCalendar
          open={calendarModal}
          onChange={handleStartDate}
          handleClose={() => {
            setCalendarModal(!calendarModal);
          }}
        />
      </div>
    </Modal>
  );
}
