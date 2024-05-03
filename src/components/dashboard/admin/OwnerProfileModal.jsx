import React from "react";

function OwnerProfileModal({ isOpen, onClose, owner }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Owner Profile</h2>
        <p>
          <strong>Full Name:</strong> {owner.owner_fullName}
        </p>
        <p>
          <strong>Email:</strong> {owner.owner_email}
        </p>
        <p>
          <strong>Contact No:</strong> {owner.owner_contactNo}
        </p>
        {/* Add more owner details here if needed */}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default OwnerProfileModal;
