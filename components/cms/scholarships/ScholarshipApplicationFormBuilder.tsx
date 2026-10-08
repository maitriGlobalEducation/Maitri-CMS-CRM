"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import type {
  ScholarshipFieldType,
  ScholarshipFormField,
} from "@/types/scholarship";

interface ScholarshipApplicationFormBuilderProps {
  fields: ScholarshipFormField[];
  onChange: (fields: ScholarshipFormField[]) => void;
}

const fieldTypeLabels: Record<ScholarshipFieldType, string> = {
  text: "Text",
  email: "Email",
  phone: "Phone",
  select: "Select",
  date: "Date",
  checkbox: "Checkbox",
};

const createFieldKey = (label: string) => {
  const key = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");

  return key || `field${Date.now()}`;
};

export default function ScholarshipApplicationFormBuilder({
  fields,
  onChange,
}: ScholarshipApplicationFormBuilderProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addField = () => {
    const newField: ScholarshipFormField = {
      key: `field${Date.now()}`,
      label: "New Field",
      type: "text",
      required: false,
    };

    onChange([...fields, newField]);
    setExpandedIndex(fields.length);
  };

  const updateField = (
    index: number,
    updates: Partial<ScholarshipFormField>,
  ) => {
    const nextFields = fields.map((field, fieldIndex) =>
      fieldIndex === index ? { ...field, ...updates } : field,
    );

    onChange(nextFields);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, fieldIndex) => fieldIndex !== index));

    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

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
    setExpandedIndex(targetIndex);
  };

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-zinc-700">
            No application fields added yet
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            Add the fields students should complete when applying.
          </p>
        </div>
      )}

      {fields.map((field, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="flex min-w-0 cursor-pointer flex-1 items-center gap-3 text-left"
              >
                <div className="min-w-0 cursor-pointer">
                  <p className="truncate text-sm font-medium text-zinc-800">
                    {field.label || "Untitled field"}
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-400">
                    {fieldTypeLabels[field.type]}
                    {field.required ? " · Required" : " · Optional"}
                  </p>
                </div>

                {isExpanded ? (
                  <ChevronUp
                    size={18}
                    className="ml-auto shrink-0 text-zinc-400"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="ml-auto shrink-0 text-zinc-400"
                  />
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveField(index, "up")}
                  disabled={index === 0}
                  className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => moveField(index, "down")}
                  disabled={index === fields.length - 1}
                  className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="rounded-md p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                  title="Remove field"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="space-y-4 border-t border-zinc-100 bg-zinc-50/50 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Field Label
                    </label>

                    <input
                      type="text"
                      value={field.label}
                      onChange={(event) => {
                        const label = event.target.value;

                        updateField(index, {
                          label,
                          key:
                            field.key.startsWith("field") ||
                            field.key === createFieldKey(field.label)
                              ? createFieldKey(label)
                              : field.key,
                        });
                      }}
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
                      onChange={(event) => {
                        const type = event.target.value as ScholarshipFieldType;

                        updateField(index, { type });
                      }}
                      className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-400"
                    >
                      {Object.entries(fieldTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
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
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addField}
        className="cursor-pointer flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 text-sm font-medium text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-800"
      >
        <Plus size={17} />
        Add Application Field
      </button>
    </div>
  );
}
