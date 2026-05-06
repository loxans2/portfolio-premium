"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SingleProps {
  multi?: false;
  value: string;
  onChange: (url: string) => void;
}

interface MultiProps {
  multi: true;
  values: string[];
  onChangeMulti: (urls: string[]) => void;
}

type Props = SingleProps | MultiProps;

export function ImageUpload(props: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      toast.error("Échec de l'upload");
      return null;
    }
    const data = await res.json();
    return data.url as string;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      if (props.multi) {
        const urls: string[] = [];
        for (const f of Array.from(files)) {
          const u = await uploadFile(f);
          if (u) urls.push(u);
        }
        props.onChangeMulti([...props.values, ...urls]);
      } else {
        const u = await uploadFile(files[0]);
        if (u) props.onChange(u);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addByUrl() {
    if (!urlInput.trim()) return;
    if (props.multi) {
      props.onChangeMulti([...props.values, urlInput.trim()]);
    } else {
      props.onChange(urlInput.trim());
    }
    setUrlInput("");
  }

  function removeAt(i: number) {
    if (!props.multi) {
      props.onChange("");
      return;
    }
    const next = [...props.values];
    next.splice(i, 1);
    props.onChangeMulti(next);
  }

  const items = props.multi ? props.values : props.value ? [props.value] : [];

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div
          className={cn(
            "grid gap-3",
            props.multi ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
          )}
        >
          {items.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group"
            >
              {src ? (
                <Image
                  src={src}
                  alt={`upload-${i}`}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              ) : null}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Supprimer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={props.multi}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          <Upload size={14} /> {uploading ? "Upload..." : "Choisir un fichier"}
        </Button>
        <div className="flex gap-2 flex-1">
          <Input
            type="url"
            placeholder="ou collez une URL d'image"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={addByUrl}>
            <Link2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
