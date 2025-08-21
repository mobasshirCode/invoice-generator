"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import API from "@/api";
import logo from "../assets/wlogo.svg";
import add from "../assets/add.png";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function AddProducts() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>();
  const [quantity, setQuantity] = useState<number>();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Logoutt
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // login pe lejao
  };

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await API.get("/products");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Add product
  const addMutation = useMutation({
    mutationFn: async () => {
      await API.post("/products", { name, price, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setName("");
      setPrice(0);
      setQuantity(1);
    },
  });

  // Delete product
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await API.delete(`/products/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const subtotal = Array.isArray(products)
    ? products.reduce((acc, p) => acc + p.price * p.quantity, 0)
    : 0;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex justify-between items-center bg-[#1F1F1F] h-[64px] py-[8px] px-[80px]">
        <img className="w-[141px] h-[48px]" src={logo} alt="" />
        <button
          onClick={handleLogout}
          className="bg-[#CCF575] text-black px-4 py-2 rounded-[6px] font-medium"
        >
          Logout
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="max-w-5xl w-full">
          <h1 className="text-[40px] font-bold mb-2">Add Products</h1>
          <p className="text-[20px] text-gray-400 mb-8">
            This is basic login page which is used for levitation assignment purpose.
          </p>

          <div className="mb-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="text-[16px] text-white mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="Enter the product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-3 rounded-[4px] bg-neutral-800 border border-[#424647]"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[16px] text-white mb-1">Price</label>
                <input
                  type="number"
                  placeholder="Enter the price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="px-4 py-3 rounded-[4px] bg-neutral-800 border border-[#424647]"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[16px] text-white mb-1">Quantity</label>
                <input
                  type="number"
                  placeholder="Enter the Qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="px-4 py-3 rounded-[4px] bg-neutral-800 border border-[#424647]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => addMutation.mutate()}
                className="text-[16px] text-[#CCF575] bg-[#303030] px-6 py-3 rounded-[7.47px] hover:text-[#CCF575] hover:bg-[#252525] flex"
              >
                Add Product <img className="w-cover h-cover pl-[20px]" src={add} alt="" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-t-[8px] border border-[#3F3F3F]">
            <table className="w-full text-left ">
              <thead className="bg-white text-black">
                <tr>
                  <th className="p-3">Product name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Total Price</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p._id}
                    className="bg-black border-b border-[#3F3F3F]"
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3">{p.quantity}</td>
                    <td className="p-3">₹{p.price * p.quantity}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteMutation.mutate(p._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}

                <tr className="bg-black font-semibold border-b border-[#3F3F3F]">
                  <td colSpan={3} className="p-3 text-right">
                    Subtotal
                  </td>
                  <td className="p-3">₹{subtotal.toFixed(2)}</td>
                  <td></td>
                </tr>

                <tr className="bg-black font-semibold">
                  <td colSpan={3} className="p-3 text-right">
                    Incl. GST (18%)
                  </td>
                  <td className="p-3">₹{total.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={async () => {
                const res = await API.get("/products/invoice", {
                  responseType: "blob",
                });
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "invoice.pdf");
                document.body.appendChild(link);
                link.click();
              }}
              className=" text-[#CCF575] bg-[#303030] px-[16px]  rounded-[7.47px] text-[16px] w-[435px] h-[43px]  hover:bg-[#CCF575] hover:text-[#303030]"
            >
              Generate PDF Invoice
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
