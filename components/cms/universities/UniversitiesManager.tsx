"use client";

import { useState } from "react";
import { University } from "@/types/university";
import UniversityModal from "./UniversityModal";

interface UniversitiesManagerProps {
  universities: University[];
}

export default function UniversitiesManager({
  universities,
}: UniversitiesManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  const handleAdd = () => {
    setSelectedUniversity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (university: University) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedUniversity(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-lg cursor-pointer bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        + Add University
      </button>

      {/* Temporary — we'll put the existing table here next */}
      <div className="mt-6 space-y-2">
        {universities.map((university) => (
          <div
            key={university.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4"
          >
            <span className="text-zinc-700">{university.name}</span>

            <button
              type="button"
              onClick={() => handleEdit(university)}
              className="text-sm cursor-pointer font-medium text-zinc-600 hover:text-zinc-950"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <UniversityModal
        open={isModalOpen}
        university={selectedUniversity}
        onClose={handleClose}
      />
    </>
  );
}
