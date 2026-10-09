"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  // Plus,
  // Trash2,
} from "lucide-react";

import type { EventFieldType, EventRegistrationField } from "@/types/event";

interface EventRegistrationFormBuilderProps {
  fields: EventRegistrationField[];
  onChange: (fields: EventRegistrationField[]) => void;
}

const fieldTypeLabels: Record<EventFieldType, string> = {
  text: "Text",
  email: "Email",
  phone: "Phone",
  select: "Select",
  date: "Date",
  checkbox: "Checkbox",
};

// const createField = (): EventRegistrationField => ({
//   key: `field-${Date.now()}`,
//   label: "New Field",
//   type: "text",
//   required: false,
// });

const defaultFields: EventRegistrationField[] = [
  {
    key: "firstName",
    label: "First Name",
    type: "text",
    required: true,
  },
  {
    key: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    key: "phone",
    label: "Phone Number",
    type: "phone",
    required: true,
  },
];

export { defaultFields };

export default function EventRegistrationFormBuilder({
  fields,
  onChange,
}: EventRegistrationFormBuilderProps) {
  const updateField = (
    index: number,
    updates: Partial<EventRegistrationField>,
  ) => {
    const nextFields = [...fields];

    nextFields[index] = {
      ...nextFields[index],
      ...updates,
    };

    onChange(nextFields);
  };

  // const addField = () => {
  //   onChange([...fields, createField()]);
  // };

  // const removeField = (index: number) => {
  //   onChange(fields.filter((_, fieldIndex) => fieldIndex !== index));
  // };

  const moveField = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= fields.length) {
      return;
    }

    const nextFields = [...fields];

    [nextFields[index], nextFields[targetIndex]] = [
      nextFields[targetIndex],
      nextFields[index],
    ];

    onChange(nextFields);
  };

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div
          key={index}
          className="rounded-xl border border-zinc-200 bg-zinc-50"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <GripVertical className="h-4 w-4 text-zinc-400" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">
                {field.label || "Untitled Field"}
              </p>

              <p className="text-xs text-zinc-400">
                {fieldTypeLabels[field.type]}
                {field.required && " · Required"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => moveField(index, "up")}
              disabled={index === 0}
              className="cursor-pointer rounded-md p-1.5 text-zinc-500 transition hover:bg-white hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronUp className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => moveField(index, "down")}
              disabled={index === fields.length - 1}
              className="cursor-pointer rounded-md p-1.5 text-zinc-500 transition hover:bg-white hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* <button
              type="button"
              onClick={() => removeField(index)}
              className="cursor-pointer rounded-md p-1.5 text-zinc-500 transition hover:bg-white hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button> */}
          </div>

          <div className="grid gap-4 border-t border-zinc-200 p-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Field Label
              </label>

              <input
                type="text"
                value={field.label}
                onChange={(event) =>
                  updateField(index, {
                    label: event.target.value,
                  })
                }
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-400"
                placeholder="e.g. First Name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Field Type
              </label>

              <select
                value={field.type}
                onChange={(event) =>
                  updateField(index, {
                    type: event.target.value as EventFieldType,
                  })
                }
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-400"
              >
                {Object.entries(fieldTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(event) =>
                  updateField(index, {
                    required: event.target.checked,
                  })
                }
              />
              Required field
            </label>
          </div>
        </div>
      ))}

      {/* <button
        type="button"
        onClick={addField}
        className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        <Plus className="h-4 w-4" />
        Add Field
      </button> */}
    </div>
  );
}
