import { useState } from "react";

const EditPostModal = ({ post, onClose, onSave }) => {
  const [caption, setCaption] = useState(post.caption);
  const [image, setImage] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1d] p-6 rounded-lg max-w-md w-full border border-pink-500">
        <h2 className="text-xl font-bold text-white mb-4">Edit Post</h2>

        <textarea
          className="w-full p-2 rounded bg-[#111] text-white mb-2"
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="mb-3 text-white"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-700 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ caption, image })}
            className="px-3 py-1 bg-pink-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;