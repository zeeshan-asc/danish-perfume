"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { perfumeCreateSchema, PerfumeCreateInput } from "@/schemas/perfumeSchemas";
import { usePerfumes } from "@/hooks/usePerfumes";
import { useToast } from "@/hooks/useToast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { IPerfume } from "@/types";
import BrandSelect from "@/components/form/BrandSelect";
import SearchableSelect from "@/components/form/SearchableSelect";
import { SCENT_TYPES, OCCASIONS, LONGEVITY, TOP_NOTES, HEART_NOTES, BASE_NOTES } from "@/data/fragranceData";
import { X } from "lucide-react";

const seasons = ["Spring", "Summer", "Fall", "Winter"];

interface PerfumeFormProps { perfume?: IPerfume | null; onClose: () => void; onSaved: () => void; }

const is = (s: string | number | undefined | null): string => s ? String(s) : "";

export default function PerfumeForm({ perfume, onClose, onSaved }: PerfumeFormProps) {
  const isEditing = !!perfume;
  const { createPerfume, updatePerfume } = usePerfumes();
  const { addToast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<PerfumeCreateInput>({
    resolver: zodResolver(isEditing ? perfumeCreateSchema.partial() : perfumeCreateSchema) as any,
    defaultValues: {
      name: is(perfume?.name), brand: is(perfume?.brand),
      notes: { top: is(perfume?.notes?.top), heart: is(perfume?.notes?.heart), base: is(perfume?.notes?.base) },
      scent_type: is(perfume?.scent_type), seasons: perfume?.seasons || [],
      occasion: is(perfume?.occasion), longevity: is(perfume?.longevity),
      analysis: is(perfume?.analysis), status: perfume?.status || "Owned",
      rating: perfume?.rating || null,
    },
  });

  useEffect(() => { if (perfume?.tags) setTags(perfume.tags); }, [perfume]);
  useEffect(() => { if (perfume?.imageId && !removeImage) setImagePreview(`/api/images/${perfume.imageId}`); }, [perfume, removeImage]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!["image/jpeg","image/png","image/webp"].includes(file.type)) { addToast("Only JPEG, PNG, WebP allowed", "error"); return; }
    if (file.size > 4*1024*1024) { addToast("Image must be under 4MB", "error"); return; }
    setImageFile(file); setRemoveImage(false);
    const r = new FileReader(); r.onload = () => setImagePreview(r.result as string); r.readAsDataURL(file);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (tags.length >= 10) return;
      if (tags.includes(tagInput.trim())) return;
      setTags([...tags, tagInput.trim()]); setTagInput("");
    }
  };

  const onSubmit = async (data: PerfumeCreateInput) => {
    const payload = { ...data, tags };
    const result = isEditing && perfume
      ? await updatePerfume(perfume.id || perfume._id, payload, imageFile || undefined, removeImage)
      : await createPerfume(payload, imageFile || undefined);
    if (result.error) { addToast(result.error, "error"); return; }
    addToast(isEditing ? "Updated!" : "Added!", "success"); onSaved();
  };

  const inp: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", color: "#f0f0f4", borderRadius: 6,
    padding: "8px 12px", fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", outline: "none",
  };
  const lbl: React.CSSProperties = { fontSize: 12, color: "#a0a0b4", marginBottom: 4, fontWeight: 500, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" };
  const sec: React.CSSProperties = { fontSize: 10, color: "#14b8a6", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" };

  return (
    <Modal isOpen onClose={onClose} title={isEditing ? "Edit Perfume" : "Add Perfume"} size="lg">
      <form onSubmit={handleSubmit(onSubmit as any)} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Basic Info */}
        <div>
          <p style={sec}>Basic Info</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><p style={lbl}>Name *</p><input style={inp} placeholder="e.g. Khamrah Qahwa" {...register("name")} /></div>
            <div><p style={lbl}>Brand *</p><Controller name="brand" control={control} render={({ field }) => <BrandSelect value={field.value} onChange={field.onChange} />} /></div>
            <div><p style={lbl}>Scent Type</p><Controller name="scent_type" control={control} render={({ field }) => <SearchableSelect value={field.value || ""} onChange={field.onChange} options={SCENT_TYPES} placeholder="e.g. Gourmand Oriental" />} /></div>
            <div>
              <p style={lbl}>Status</p>
              <select style={inp} {...register("status")}>
                <option value="Owned">Owned</option><option value="Wishlist">Wishlist</option><option value="Sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <p style={sec}>Notes</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div><p style={lbl}>Top</p><Controller name="notes.top" control={control} render={({ field }) => <SearchableSelect value={field.value || ""} onChange={field.onChange} options={TOP_NOTES} placeholder="e.g. Bergamot" />} /></div>
            <div><p style={lbl}>Heart</p><Controller name="notes.heart" control={control} render={({ field }) => <SearchableSelect value={field.value || ""} onChange={field.onChange} options={HEART_NOTES} placeholder="e.g. Rose" />} /></div>
            <div><p style={lbl}>Base</p><Controller name="notes.base" control={control} render={({ field }) => <SearchableSelect value={field.value || ""} onChange={field.onChange} options={BASE_NOTES} placeholder="e.g. Musk" />} /></div>
          </div>
        </div>

        {/* Details */}
        <div>
          <p style={sec}>Details</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><p style={lbl}>Occasion</p><Controller name="occasion" control={control} render={({ field }) => <SearchableSelect value={field.value || ""} onChange={field.onChange} options={OCCASIONS} placeholder="e.g. Evening / Special Occasion" />} /></div>
            <div><p style={lbl}>Longevity</p><Controller name="longevity" control={control} render={({ field }) => <SearchableSelect value={field.value || ""} onChange={field.onChange} options={LONGEVITY} placeholder="e.g. 8-10 hrs" />} /></div>
            <div><p style={lbl}>Rating (1-10)</p><input style={inp} type="number" min={1} max={10} placeholder="8" {...register("rating", { valueAsNumber: true })} /></div>
            <div>
              <p style={lbl}>Seasons</p>
              <div style={{ display: "flex", gap: 10 }}>
                {seasons.map(s => (
                  <label key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#a0a0b4", cursor: "pointer" }}>
                    <input type="checkbox" value={s} {...register("seasons")} /> {s}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review */}
        <div>
          <p style={sec}>Review</p>
          <textarea maxLength={2000} rows={3} style={{ ...inp, minHeight: 70, resize: "vertical" }} placeholder="Your thoughts on this fragrance..." {...register("analysis")} />
          <div style={{ marginTop: 8 }}>
            <p style={lbl}>Tags</p>
            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Type a tag and press Enter" style={inp} />
            {tags.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                {tags.map(t => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 9px", borderRadius: 6, background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.15)", color: "#2dd4bf", fontSize: 11, fontWeight: 500 }}>
                    {t} <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} style={{ background: "none", border: "none", cursor: "pointer", color: "#2dd4bf", padding: 0, lineHeight: 1, opacity: 0.6 }}><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image (optional) */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <p style={{ ...sec, marginBottom: 0 }}>Image</p>
          {imagePreview ? (
            <div style={{ position: "relative" }}>
              <img src={imagePreview} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }} />
              <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); setRemoveImage(true); }} style={{ position: "absolute", top: -5, right: -5, width: 18, height: 18, borderRadius: "50%", background: "rgba(248,113,113,0.8)", border: "none", cursor: "pointer", color: "white", fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          ) : (
            <button type="button" onClick={() => document.getElementById("pfImg")?.click()} style={{ width: 64, height: 64, borderRadius: 6, border: "1px dashed rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.02)", color: "#6b6b80", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Upload
            </button>
          )}
          <input id="pfImg" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} style={{ display: "none" }} />
          <span style={{ fontSize: 11, color: "#6b6b80" }}>Optional · JPEG, PNG, WebP · Max 4MB</span>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>{isEditing ? "Save" : "Add Perfume"}</Button>
        </div>
      </form>
    </Modal>
  );
}
