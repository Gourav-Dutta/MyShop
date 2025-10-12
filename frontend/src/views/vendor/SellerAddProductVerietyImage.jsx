import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useInsertImageMutation } from "../../context/slice/productSlice";
import { useNavigate } from "react-router-dom";
import { ProductPageLoader } from "../ProductPageLoader";

export const SellerAddProductVerietyImage = () => {
  const { productVerietyId } = useParams();
  const [insertImage] = useInsertImageMutation();
  const navigate = useNavigate();



  const [images, setImages] = useState([
    { url: "", alt_text: "", is_primary: "false" },
  ]);

  // Handle onChange
  const handleChange = (index, e) => {
    const updatedImages = [...images];
    updatedImages[index][e.target.name] = e.target.value;
    setImages(updatedImages);
  };
  console.log(images);

  // To add new Image field
  const addImageField = () => {
    setImages([...images, { url: "", alt_text: "", is_primary: "false" }]);
  };

  // Remove image
  const removeImageField = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // Submit  image
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await insertImage({ varietyId: productVerietyId, images }).unwrap();
      toast.success("All images added successfully!");
      setImages([{ url: "", alt_text: "", is_primary: "false" }]);
      navigate("/seller/layout/sellerDashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add images");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Add Product Variety Images
      </h1>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-sm relative bg-gray-50"
          >
            {/* Remove button - only if the length of image is > 1 */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="absolute top-2 right-2 flex items-center justify-center w-20 h-5 bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg transition rounded-2xl"
              >
                Remove
              </button>
            )}

            {/* URL */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="url"
                value={img.url}
                onChange={(e) => handleChange(index, e)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Alt Text */}
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Alt Text</label>
              <input
                type="text"
                name="alt_text"
                value={img.alt_text}
                onChange={(e) => handleChange(index, e)}
                placeholder="E.g. Red Shirt front view"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Is Primary */}
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">
                Primary Image
              </label>
              <select
                name="is_primary"
                value={img.is_primary}
                onChange={(e) => handleChange(index, e)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            {/* Preview */}
            {img.url && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={img.url}
                  alt={img.alt_text || "preview"}
                  className="w-40 h-40 object-cover rounded-lg border shadow"
                />
              </div>
            )}
          </div>
        ))}

        {/* Add more button */}
        <button
          type="button"
          onClick={addImageField}
          className="px-4 py-2 mr-126 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          + Add Another Image
        </button>

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          Submit Images
        </button>
      </form>
    </div>
  );
};
