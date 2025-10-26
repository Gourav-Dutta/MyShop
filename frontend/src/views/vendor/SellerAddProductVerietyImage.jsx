import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ProductPageLoader } from "../ProductPageLoader";
import { useInsertImageMutation } from "../../context/slice/productSlice";

export const SellerAddProductVerietyImage = () => {
  const { productVerietyId } = useParams();
  const navigate = useNavigate();
  const [insertImage, { isLoading }] = useInsertImageMutation();

  const [files, setFiles] = useState([]);

  // Handle file input change
  const handleFileChange = (e) => {
  const newFiles = Array.from(e.target.files); // convert FileList to array
  setFiles((prevFiles) => [...prevFiles, ...newFiles]); // merge with existing files
};

  // Remove selected file
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file); // must match multer field name
    });

    try {
      await insertImage({ varietyId: productVerietyId, formData }).unwrap();
      toast.success("Images uploaded successfully!");
      setFiles([]);
      navigate("/seller/layout/sellerDashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Add Product Variety Images
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <label className="block text-sm font-medium mb-2">
            Select Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />

          {/* Preview Selected Images */}
          {files.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index + 1}`}
                    className="w-40 h-40 object-cover rounded-lg border shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Uploading..." : "Submit Images"}
        </button>
      </form>
    </div>
  );
};
