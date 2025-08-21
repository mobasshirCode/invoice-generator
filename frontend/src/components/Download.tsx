import axios from "axios";
import { Button } from "@/components/ui/button"; // shadcn button
import { Loader2, FileDown } from "lucide-react"; // nice icons
import { useState } from "react";

const Download = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // JWT from login

      const response = await axios.get(
        "http://localhost:5000/api/invoice/download",
        {
          responseType: "blob", // important for file download
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading invoice", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          Download Invoice
        </>
      )}
    </Button>
  );
};

export default Download;
