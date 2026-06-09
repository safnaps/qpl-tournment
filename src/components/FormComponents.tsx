"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Check, FileText } from "lucide-react";

// Types
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixText?: string;
  description?: string;
  error?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  description?: string;
  error?: string;
}

interface SelectOption {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SelectCardsProps {
  label: string;
  options: SelectOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  error?: string;
  description?: string;
}

interface MultiSelectCardsProps {
  label: string;
  options: SelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
  description?: string;
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  error?: string;
}

interface CheckboxGridProps {
  label: string;
  options: { id: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
  description?: string;
}

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
  accept?: string;
  description?: string;
}

// 1. Text Input Component (Compact mockup size: py-2.5, text-sm. Label size: text-sm)
export const TextInput: React.FC<TextInputProps> = ({
  label,
  prefixText,
  description,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && <label className="text-sm font-semibold text-zinc-350 tracking-wide">{label}</label>}
      
      <div className="flex w-full rounded-lg overflow-hidden border border-pink-500/10 bg-neutral-900/40 focus-within:bg-pink-950/5 focus-within:border-pink-500/30 focus-within:ring-2 focus-within:ring-pink-500/5 transition-all">
        {prefixText && (
          <div className="bg-neutral-850 text-neutral-400 border-r border-pink-500/10 py-2.5 px-3.5 shrink-0 select-none text-xs font-semibold flex items-center min-w-[80px]">
            {prefixText}
          </div>
        )}
        <input
          type="text"
          className={`w-full px-3.5 py-2.5 bg-transparent text-white text-sm placeholder-neutral-600 focus:outline-none ${className}`}
          {...props}
        />
      </div>
      
      {description && <span className="text-[11px] text-neutral-500 leading-normal mt-0.5">{description}</span>}
      {error && <span className="text-xs text-red-400 font-medium animate-fade-in mt-0.5">{error}</span>}
    </div>
  );
};

// 2. Text Area Component (Compact mockup size: py-2.5, text-sm. Label size: text-sm)
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  description,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label className="text-sm font-semibold text-zinc-350 tracking-wide">{label}</label>
      <textarea
        rows={3}
        className={`w-full px-3.5 py-2.5 rounded-lg text-white bg-neutral-900/40 border border-pink-500/10 focus:bg-pink-950/5 focus:border-pink-500/30 focus:outline-none text-sm resize-none focus:ring-2 focus:ring-pink-500/5 transition-all ${
          error ? "border-red-500/50" : ""
        } ${className}`}
        {...props}
      />
      {description && <span className="text-[11px] text-neutral-500 leading-normal mt-0.5">{description}</span>}
      {error && <span className="text-xs text-red-400 font-medium animate-fade-in mt-0.5">{error}</span>}
    </div>
  );
};

// 3. Selection Cards Component (Compact mockup size: p-3.5, text-sm. Label size: text-sm)
export const SelectCards: React.FC<SelectCardsProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  error,
  description,
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label className="text-sm font-semibold text-zinc-355 tracking-wide mb-0.5">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? "bg-pink-950/10 border-pink-500/30 shadow-[0_4px_12px_rgba(226,30,122,0.02)]"
                  : "bg-neutral-900/30 border-pink-500/10 hover:border-pink-500/30 hover:bg-pink-950/5"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-white text-black p-0.5 rounded-bl-lg">
                  <Check className="w-3.5 h-3.5 stroke-[2.5px]" />
                </div>
              )}
              <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-zinc-300"}`}>
                {option.title}
              </span>
              {option.description && (
                <span className="text-[11px] text-neutral-500 mt-1 leading-normal">
                  {option.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {description && <span className="text-[11px] text-neutral-500 mt-0.5 leading-normal">{description}</span>}
      {error && <span className="text-xs text-red-400 font-medium mt-0.5 animate-fade-in">{error}</span>}
    </div>
  );
};

// 4. Multi-Select Tags Component (Label size: text-sm)
export const MultiSelectCards: React.FC<MultiSelectCardsProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  error,
  description,
}) => {
  const handleToggle = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((val) => val !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label className="text-sm font-semibold text-zinc-350 tracking-wide">{label}</label>
      
      {/* Selected tags block container */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 min-h-[42px] rounded-lg border border-pink-500/10 bg-neutral-900/40 focus-within:bg-pink-950/5 focus-within:border-pink-500/30 transition-all">
        {selectedValues.length === 0 ? (
          <span className="text-xs text-neutral-600 select-none">No positions selected. Click pills below to add.</span>
        ) : (
          selectedValues.map((valId) => {
            const opt = options.find((o) => o.id === valId);
            return (
              <div
                key={valId}
                className="flex items-center gap-1.5 py-0.5 px-2 rounded bg-neutral-800 border border-neutral-700 text-xs text-white font-medium animate-fade-in"
              >
                <span>{opt?.title || valId}</span>
                <button
                  type="button"
                  onClick={() => handleToggle(valId)}
                  className="hover:text-red-400 transition-colors p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Available selection choices as small pills */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleToggle(opt.id)}
              className={`py-1 px-3 rounded-full border text-[11px] font-semibold transition-all ${
                isSelected
                  ? "bg-white text-black border-white"
                  : "bg-neutral-900/40 border-pink-500/10 text-neutral-400 hover:border-pink-500/30 hover:text-white"
              }`}
            >
              {opt.title}
            </button>
          );
        })}
      </div>

      {description && <span className="text-[11px] text-neutral-500 mt-1 leading-normal">{description}</span>}
      {error && <span className="text-xs text-red-400 font-medium animate-fade-in mt-0.5">{error}</span>}
    </div>
  );
};

// 5. Custom Checkbox Component
export const Checkbox: React.FC<CheckboxProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1 text-left">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div className={`w-4.5 h-4.5 rounded border bg-neutral-900/40 flex items-center justify-center shrink-0 text-transparent peer-checked:text-black peer-checked:bg-white peer-checked:border-white transition-all duration-150 group-hover:border-pink-500/30 ${error ? "border-red-500/50" : "border-pink-500/10"}`}>
          <Check className="w-3 h-3 stroke-[3.5px]" />
        </div>
        <span className="text-xs font-semibold text-neutral-400 group-hover:text-zinc-200 transition-colors select-none leading-relaxed">
          {label}
        </span>
      </label>
      {error && <span className="text-xs text-red-400 font-medium mt-1 pl-8 animate-fade-in">{error}</span>}
    </div>
  );
};

// 6. Checkbox Grid Component (Representative Experience. Label size: text-sm)
export const CheckboxGrid: React.FC<CheckboxGridProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  error,
  description,
}) => {
  const handleToggle = (id: string) => {
    if (id === "none") {
      if (selectedValues.includes("none")) {
        onChange([]);
      } else {
        onChange(["none"]);
      }
    } else {
      const filtered = selectedValues.filter((v) => v !== "none");
      if (filtered.includes(id)) {
        onChange(filtered.filter((v) => v !== id));
      } else {
        onChange([...filtered, id]);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label className="text-sm font-semibold text-zinc-350 tracking-wide mb-0.5">{label}</label>
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-neutral-900/30 border p-3.5 rounded-xl ${error ? "border-red-500/50" : "border-pink-500/10"}`}>
        {options.map((option) => {
          const isChecked = selectedValues.includes(option.id);
          return (
            <label
              key={option.id}
              className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer hover:bg-neutral-800/40 transition-all select-none ${
                isChecked ? "text-white font-medium" : "text-neutral-400"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(option.id)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${
                  isChecked
                    ? "bg-white border-white text-black"
                    : "border-pink-500/10 bg-neutral-900/40 text-transparent"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3px]" />
              </div>
              <span className="text-xs">{option.label}</span>
            </label>
          );
        })}
      </div>
      {description && <span className="text-[11px] text-neutral-500 leading-normal mt-0.5">{description}</span>}
      {error && <span className="text-xs text-red-400 font-medium animate-fade-in mt-0.5">{error}</span>}
    </div>
  );
};

// 7. Custom Drag-and-Drop File Upload Component (Label size: text-sm)
export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFileSelect,
  selectedFile,
  error,
  accept = ".pdf,.png,.jpg,.jpeg,.doc,.docx",
  description,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      <label className="text-sm font-semibold text-zinc-350 tracking-wide">{label}</label>
      
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`flex flex-col items-center justify-center border border-dashed rounded-xl p-5 cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-pink-500/30 bg-pink-950/5"
              : error
              ? "border-red-500/30 bg-red-950/5 hover:bg-red-950/10"
              : "border-pink-500/10 bg-neutral-900/20 hover:border-pink-500/30 hover:bg-pink-950/5"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
          <Upload className={`w-6 h-6 mb-1.5 ${isDragActive ? "text-white" : "text-neutral-500"}`} />
          <p className="text-xs text-neutral-300 font-medium">
            Drag & drop here, or <span className="text-white underline underline-offset-2 hover:text-neutral-200">browse</span>
          </p>
          <p className="text-[10px] text-neutral-550 mt-0.5">
            Format: PNG, JPG, JPEG, PDF (Max 5MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/40 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-neutral-800 rounded text-neutral-400">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white truncate max-w-[200px] md:max-w-[320px]">
                {selectedFile.name}
              </span>
              <span className="text-[10px] text-neutral-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      
      {description && <span className="text-[11px] text-neutral-500 leading-normal mt-0.5">{description}</span>}
      {error && <span className="text-xs text-red-400 font-medium animate-fade-in mt-0.5">{error}</span>}
    </div>
  );
};

// 8. ProgressBar Component (Clean Minimalist White/Grey style)
export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full text-left">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Registration Steps
        </span>
        <span className="text-[10px] font-semibold text-neutral-500">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>
    </div>
  );
};
