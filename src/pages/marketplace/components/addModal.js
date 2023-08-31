import CustomCalendar from "@/components/customCalendar";
import { database, storage } from "@/config/firebase";
import { Modal, Switch } from "@mui/material";
import { get, off, onValue, ref, set, update } from "firebase/database";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

const labelList = ["", "Otomotif", "Properti", "Lowongan", "Ragam"];
const statusList = [
  "",
  "Dikontrakkan",
  "Dijual Cepat",
  "Dijual",
  "Disewakan",
  "Dicari / Hilang",
  "Menerima",
  "Ditemukan",
];

export default function AddModal({ open = Boolean, handleClose = Function }) {
  const imageInputRef = useRef(null);
  const [startDateCalendar, setStartDateCalendar] = useState(false);
  const [endDateCalendar, setEndDateCalendar] = useState(false);
  const [priceConfiguration, setPriceConfiguration] = useState({
    highlightPricePerDay: Number(0),
    pricePerDay: Number(0),
  });
  const [data, setData] = useState({
    isAllowed: Boolean(false),
    adsImage: "",
    adsName: "",
    address: "",
    brand: "",
    description: "",
    whatsappContact: "",
    price: "",
    label: "",
    status: "",
    startDate: "",
    endDate: "",
    totalPrice: Number(0),
    highlight: {
      isHighlight: Boolean(false),
      duration: "",
      endDate: "",
      highlightPrice: Number(0),
    },
    profile: {
      email: "",
      name: "Manadopost Admin",
      photos: "",
      uid: "admin",
    },
  });

  const onClose = () => {
    setData({
      isAllowed: Boolean(false),
      adsImage: "",
      adsName: "",
      address: "",
      brand: "",
      description: "",
      whatsappContact: "",
      price: "",
      label: "",
      status: "",
      startDate: "",
      endDate: "",
      totalPrice: Number(0),
      highlight: {
        isHighlight: Boolean(false),
        duration: "",
        endDate: "",
        highlightPrice: Number(0),
      },
    });
    handleClose();
  };

  const handleRequired = (data) =>
    new Promise((resolve, reject) => {
      const requiredFields = [
        "adsImage",
        "adsName",
        "address",
        "brand",
        "description",
        "whatsappContact",
        "price",
        "label",
        "status",
        "startDate",
        "endDate",
      ];

      for (const field of requiredFields) {
        if (!data[field]) {
          return reject(new Error(`${field} is required`));
        }
      }

      resolve(data);
    });

  const handleImageUpload = async (file) => {
    const randomNum = Math.floor(Math.random() * 901) + 100;
    const parts = file.name.split(".");
    const fileName = parts[0] + randomNum + "." + parts[1];
    const imageRef = storageRef(storage, `/images/marketplace/${fileName}`);
    try {
      await uploadBytes(imageRef, file);
      const uri = await getDownloadURL(imageRef);
      return uri;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handlePayload = (payload) => {
    const orderRef = ref(database, "marketplace/data/admin");
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
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const required = await handleRequired(data);
      const imageUri = await handleImageUpload(required.adsImage);
      const payload = {
        ...required,
        adsImage: imageUri,
      };
      handlePayload(payload);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const referance = ref(database, "/marketplace/options");
    onValue(referance, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setPriceConfiguration({
        highlightPricePerDay: data.highlightPricePerDay,
        pricePerDay: data.pricePerDay,
      });
    });

    return () => {
      off(referance);
    };
  }, []);

  useEffect(() => {
    if (data.highlight.duration && data.startDate) {
      setData((prev) => ({
        ...prev,
        highlight: {
          ...prev.highlight,
          endDate: moment(data.startDate)
            .add(data.highlight.duration, "days")
            .format("YYYY-MM-DD"),
          highlightPrice:
            parseInt(data.highlight.duration, 10) *
            priceConfiguration.highlightPricePerDay,
        },
      }));
    }
  }, [data.highlight.duration, data.startDate]);

  useEffect(() => {
    if (data.endDate && data.startDate) {
      setData((prev) => ({
        ...prev,
        totalPrice:
          moment(data.endDate).diff(moment(data.startDate), "days") *
            priceConfiguration.pricePerDay +
          data.highlight.highlightPrice,
      }));
    }
  }, [data.endDate, data.startDate, data.highlight.highlightPrice]);

  useEffect(() => {
    if (!data.highlight.isHighlight) {
      setData((prev) => ({
        ...prev,
        highlight: {
          ...prev.highlight,
          duration: "",
          endDate: "",
          highlightPrice: Number(0),
        },
      }));
    }
  }, [data.highlight.isHighlight]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute left-1/2 top-1/2 flex flex-col gap-3 p-4 h-screen w-[45%] overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-lg">
        <div className="relative min-h-[300px] min-w-[300px] max-h-[300px] max-w-[300px] items-center justify-center border border-white flex self-center rounded-xl overflow-hidden">
          {data.adsImage ? (
            <>
              <img
                src={URL.createObjectURL(data.adsImage)}
                className="object-cover w-full h-full"
              />
              <button
                className="absolute right-3 top-3 bg-red-500 flex p-0.5 rounded-sm transition ease-in-out duration-300 hover:bg-red-600"
                onClick={() => setData((prev) => ({ ...prev, adsImage: "" }))}
              >
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </>
          ) : (
            <button
              className="absolute bg-slate-500 p-2 rounded-md transition ease-in-out duration-300 hover:bg-slate-700 "
              onClick={() => imageInputRef.current.click()}
            >
              <p>Browse Image</p>
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={(event) => {
              const file = event.target.files[0];
              if (file) {
                setData((prev) => ({ ...prev, adsImage: file }));
              }
            }}
          />
        </div>

        <label className="flex flex-col">
          Name:
          <input
            className="bg-transparent px-2 border border-slate-400 rounded-md py-0.5"
            type="text"
            onChange={(event) =>
              setData((prev) => ({ ...prev, adsName: event.target.value }))
            }
            value={data.adsName}
            placeholder="Enter Ads Name (ex: Yamaha Mio)"
          />
        </label>

        <label className="flex flex-col">
          WhatsApp Number:
          <input
            className="bg-transparent px-2 border border-slate-400 rounded-md py-0.5"
            type="number"
            onChange={(event) =>
              setData((prev) => ({
                ...prev,
                whatsappContact: event.target.value,
              }))
            }
            value={data.whatsappContact}
            placeholder="Your WhatsApp number (ex: 081234567890)"
          />
        </label>

        <label className="flex flex-col">
          Address:
          <textarea
            className="bg-transparent px-2 border border-slate-400 rounded-md py-0.5 h-20"
            type="text"
            onChange={(event) =>
              setData((prev) => ({ ...prev, address: event.target.value }))
            }
            value={data.address}
            placeholder="Enter your address (ex: Jl. Raya Kuta)"
          />
        </label>

        <label className="flex flex-col">
          Brand Name:
          <input
            className="bg-transparent px-2 border border-slate-400 rounded-md py-0.5"
            type="text"
            onChange={(event) =>
              setData((prev) => ({ ...prev, brand: event.target.value }))
            }
            value={data.brand}
            placeholder="Enter your item's brand (ex: Yamaha)"
          />
        </label>

        <label className="flex flex-col">
          Description:
          <textarea
            className="bg-transparent px-2 border border-slate-400 rounded-md py-0.5 h-20"
            type="text"
            onChange={(event) =>
              setData((prev) => ({ ...prev, description: event.target.value }))
            }
            value={data.description}
            placeholder="Describe your product (ex: Yamaha Mio 2019, 125cc, 5 speed, 4 stroke, 1 cylinder, 4 valve, SOHC, etc.)"
          />
        </label>

        <label className="flex flex-col">
          Price:{" "}
          {parseInt(data.price, 10).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          })}
          <input
            className="bg-transparent px-2 border border-slate-400 rounded-md py-0.5"
            type="number"
            onChange={(event) =>
              setData((prev) => ({ ...prev, price: event.target.value }))
            }
            value={data.price}
            placeholder="Your product price (ex: 10000000) *Without (.) dot"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col">
            Select label:
            <select
              className="bg-transparent px-2 border border-slate-400 rounded-md py-0.5"
              onChange={(event) =>
                setData((prev) => ({ ...prev, label: event.target.value }))
              }
              value={data.label}
            >
              {labelList.map((item) => (
                <option value={item} key={item} className="bg-slate-800">
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            Select status:
            <select
              className="bg-transparent px-2 border border-slate-400 rounded-md py-0.5"
              onChange={(event) =>
                setData((prev) => ({ ...prev, status: event.target.value }))
              }
              value={data.status}
            >
              {statusList.map((item) => (
                <option value={item} key={item} className="bg-slate-800">
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col">
            Start Date:
            <div className="flex justify-between border border-slate-400 rounded-md px-2 py-0.5 overflow-hidden">
              <input
                value={data.startDate}
                disabled
                className="bg-transparent"
              />
              <div className="flex items-center">
                <button
                  className="border border-violet-500 text-violet-500 flex p-1 rounded-md transition ease-in-out duration-300 hover:bg-violet-500 hover:text-white"
                  onClick={() => setStartDateCalendar(!startDateCalendar)}
                >
                  <ion-icon name="calendar-clear-outline"></ion-icon>
                </button>
              </div>
            </div>
          </label>
          <label className="flex flex-col">
            End Date:
            <div className="flex justify-between border border-slate-400 rounded-md px-2 py-0.5 overflow-hidden">
              <input value={data.endDate} disabled className="bg-transparent" />
              <div className="flex items-center">
                <button
                  className="border border-violet-500 text-violet-500 flex p-1 rounded-md transition ease-in-out duration-300 hover:bg-violet-500 hover:text-white"
                  onClick={() => setEndDateCalendar(!endDateCalendar)}
                >
                  <ion-icon name="calendar-clear-outline"></ion-icon>
                </button>
              </div>
            </div>
          </label>
          {/* <label className="flex flex-col">
            End Date:
            <div className="flex justify-between border border-slate-400 rounded-md px-2 py-0.5 overflow-hidden">
              <input value={data.endDate} disabled className="bg-transparent" />
              <button
                className="bg-red-500"
                onClick={() => setEndDateCalendar(!endDateCalendar)}
              >
                <ion-icon name="calendar-clear-outline"></ion-icon>
                yuhu
              </button>
            </div>
          </label> */}
        </div>

        <div className="flex flex-row justify-between">
          <label className=" flex flex-col justify-between">
            Set highlight?
            <Switch
              checked={data.highlight.isHighlight}
              onChange={(event) =>
                setData((prev) => ({
                  ...prev,
                  highlight: {
                    ...prev.highlight,
                    isHighlight: event.target.checked,
                  },
                }))
              }
            />
          </label>
          <label className="flex flex-col gap-1">
            Set highlight duration:
            <input
              className="flex-none bg-transparent border border-slate-400 rounded-md px-2"
              type="number"
              disabled={!data.highlight.isHighlight}
              value={data.highlight.duration}
              onChange={(event) =>
                setData((prev) => ({
                  ...prev,
                  highlight: {
                    ...prev.highlight,
                    duration: event.target.value,
                  },
                }))
              }
            />
          </label>
          <label className="flex flex-col gap-1">
            Highlight end:
            <input
              className="flex-none bg-transparent border border-slate-400 rounded-md px-2"
              disabled
              value={data.highlight.endDate}
            />
          </label>
        </div>

        <div className="flex self-end flex-col">
          Total Price:{" "}
          {data.totalPrice.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          })}
          <div className="flex self-end gap-2">
            <button
              className="p-1 border border-red-500 rounded-md transition ease-in-out duration-300 hover:bg-red-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="p-1 border border-green-500 rounded-md transition ease-in-out duration-300 hover:bg-green-500"
              onClick={handleSubmit}
            >
              Order
            </button>
          </div>
        </div>

        <CustomCalendar
          open={startDateCalendar}
          handleClose={() => setStartDateCalendar(!startDateCalendar)}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              startDate: moment(value).format("YYYY-MM-DD"),
            }))
          }
        />
        <CustomCalendar
          open={endDateCalendar}
          handleClose={() => setEndDateCalendar(!endDateCalendar)}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              endDate: moment(value).format("YYYY-MM-DD"),
            }))
          }
        />
      </div>
    </Modal>
  );
}
