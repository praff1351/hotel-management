import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

const ImagesSection = () => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<HotelFormData>();

  const existingImageUrls = watch("imageUrls");
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string,
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl),
    );
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { ref, onChange, ...rest } = register("imageFiles", {
    validate: () => {
      const totalLength = selectedFiles.length + (existingImageUrls?.length || 0) ;

      if (totalLength === 0) {
        return "At least one image should be added.";
      }
      if (totalLength > 6) {
        return "Total number of images cannot be more than 6";
      }

      return true;
    },
  });

  const toFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? []);

    if (incomingFiles.length === 0) {
      return;
    }

    const nextFiles = [...selectedFiles];

    incomingFiles.forEach((incomingFile) => {
      const alreadySelected = nextFiles.some(
        (file) =>
          file.name === incomingFile.name &&
          file.size === incomingFile.size &&
          file.lastModified === incomingFile.lastModified,
      );

      if (!alreadySelected && nextFiles.length < 6) {
        nextFiles.push(incomingFile);
      }
    });

    setSelectedFiles(nextFiles);

    const mergedFileList = toFileList(nextFiles);
    onChange({
      target: { files: mergedFileList, name: "imageFiles" },
      type: "change",
    } as ChangeEvent<HTMLInputElement>);
    setValue("imageFiles", mergedFileList, { shouldValidate: true });

    // Allow re-selecting the same file again if user removes it later.
    event.target.value = "";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>

      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
              <div className="relative group">
                <img src={url} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hidden input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={(e) => {
            ref(e);
            fileInputRef.current = e;
          }}
          onChange={handleFileChange}
          {...rest}
          multiple
        />

        {/* Button + Count */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Upload Images
          </button>

          <span className="text-gray-600 text-sm">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} photo${selectedFiles.length > 1 ? "s" : ""} selected`
              : "No photos selected"}
          </span>
        </div>
      </div>

      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;
