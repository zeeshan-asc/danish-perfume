"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  perfumeCreateSchema,
  PerfumeCreateInput,
} from "@/schemas/perfumeSchemas";
import { usePerfumes } from "@/hooks/usePerfumes";
import { useToast } from "@/hooks/useToast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { IPerfume } from "@/types";
import BrandSelect from "@/components/form/BrandSelect";
import SearchableSelect from "@/components/form/SearchableSelect";
import {
  SCENT_TYPES,
  OCCASIONS,
  LONGEVITY,
  TOP_NOTES,
  HEART_NOTES,
  BASE_NOTES,
} from "@/data/fragranceData";
import { X } from "lucide-react";

const seasons = ["Spring", "Summer", "Fall", "Winter"];

interface PerfumeFormProps {
  perfume?: IPerfume | null;
  onClose: () => void;
  onSaved: () => void;
}

const is = (s: string | number | undefined | null): string =>
  s ? String(s) : "";

export default function PerfumeForm({
  perfume,
  onClose,
  onSaved,
}: PerfumeFormProps) {
  const isEditing = !!perfume;
  const { createPerfume, updatePerfume } = usePerfumes();
  const { addToast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PerfumeCreateInput>({
    resolver: zodResolver(
      isEditing ? perfumeCreateSchema.partial() : perfumeCreateSchema
    ) as any,
    defaultValues: {
      name: is(perfume?.name),
      brand: is(perfume?.brand),
      notes: {
        top: is(perfume?.notes?.top),
        heart: is(perfume?.notes?.heart),
        base: is(perfume?.notes?.base),
      },
      scent_type: is(perfume?.scent_type),
      seasons: perfume?.seasons || [],
      occasion: is(perfume?.occasion),
      longevity: is(perfume?.longevity),
      analysis: is(perfume?.analysis),
      status: perfume?.status || "Owned",
      rating: perfume?.rating || null,
    },
  });

  const statusValue = watch("status");

  useEffect(() => {
    if (perfume?.tags) setTags(perfume.tags);
  }, [perfume]);
  useEffect(() => {
    if (perfume?.imageId && !removeImage)
      setImagePreview(`/api/images/${perfume.imageId}`);
  }, [perfume, removeImage]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      addToast("Only JPEG, PNG, WebP allowed", "error");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      addToast("Image must be under 4MB", "error");
      return;
    }
    setImageFile(file);
    setRemoveImage(false);
    const r = new FileReader();
    r.onload = () => setImagePreview(r.result as string);
    r.readAsDataURL(file);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (tags.length >= 10) return;
      if (tags.includes(tagInput.trim())) return;
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const onSubmit = async (data: PerfumeCreateInput) => {
    const payload = { ...data, tags };
    const result =
      isEditing && perfume
        ? await updatePerfume(
            perfume.id || perfume._id,
            payload,
            imageFile || undefined,
            removeImage
          )
        : await createPerfume(payload, imageFile || undefined);
    if (result.error) {
      addToast(result.error, "error");
      return;
    }
    addToast(isEditing ? "Updated!" : "Added!", "success");
    onSaved();
  };

  const inp: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-default)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-md)",
    padding: "9px 14px",
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color var(--duration-fast) var(--ease-out)",
  };
  const lbl: React.CSSProperties = {
    fontSize: 12,
    color: "var(--text-secondary)",
    marginBottom: 5,
    fontWeight: 500,
    fontFamily: "var(--font-body)",
  };
  const sec: React.CSSProperties = {
    fontSize: 10,
    color: "var(--accent-primary)",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 12,
    fontFamily: "var(--font-body)",
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? "Edit Perfume" : "Add Perfume"}
      size="lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit as any)}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        {/* Basic Info */}
        <div>
          <p style={sec}>Basic Information</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <p style={lbl}>Name *</p>
              <input
                style={inp}
                placeholder="e.g. Khamrah Qahwa"
                {...register("name")}
              />
            </div>
            <div>
              <p style={lbl}>Brand *</p>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <BrandSelect value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div>
              <p style={lbl}>Scent Type</p>
              <Controller
                name="scent_type"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={SCENT_TYPES}
                    placeholder="e.g. Gourmand Oriental"
                  />
                )}
              />
            </div>
            <div>
              <p style={lbl}>Status</p>
              <div style={{ display: "flex", gap: 4 }}>
                {["Owned", "Wishlist", "Sold"].map((s) => (
                  <label key={s} style={{
                    flex: 1, textAlign: "center", cursor: "pointer", padding: "8px 4px", borderRadius: 6, fontSize: 12,
                    fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
                    background: statusValue === s ? "rgba(20,184,166,0.15)" : "rgba(255,255,255,0.04)",
                    border: statusValue === s ? "1px solid rgba(20,184,166,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    color: statusValue === s ? "#2dd4bf" : "#a0a0b4", fontWeight: statusValue === s ? 600 : 400,
                    transition: "all 0.15s ease",
                  }}>
                    <input type="radio" value={s} checked={statusValue === s} onChange={() => setValue("status", s as "Owned" | "Sold" | "Wishlist")} style={{ display: "none" }} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <p style={sec}>Fragrance Notes</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <p style={lbl}>Top</p>
              <Controller
                name="notes.top"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={TOP_NOTES}
                    placeholder="e.g. Bergamot"
                  />
                )}
              />
            </div>
            <div>
              <p style={lbl}>Heart</p>
              <Controller
                name="notes.heart"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={HEART_NOTES}
                    placeholder="e.g. Rose"
                  />
                )}
              />
            </div>
            <div>
              <p style={lbl}>Base</p>
              <Controller
                name="notes.base"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={BASE_NOTES}
                    placeholder="e.g. Musk"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          <p style={sec}>Details</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <p style={lbl}>Occasion</p>
              <Controller
                name="occasion"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={OCCASIONS}
                    placeholder="e.g. Evening"
                  />
                )}
              />
            </div>
            <div>
              <p style={lbl}>Longevity</p>
              <Controller
                name="longevity"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={LONGEVITY}
                    placeholder="e.g. 8-10 hrs"
                  />
                )}
              />
            </div>
            <div>
              <p style={lbl}>Rating (1-10)</p>
              <input
                style={inp}
                type="number"
                min={1}
                max={10}
                placeholder="8"
                {...register("rating", { valueAsNumber: true })}
              />
            </div>
            <div>
              <p style={lbl}>Seasons</p>
              <div style={{ display: "flex", gap: 14, paddingTop: 10 }}>
                {seasons.map((s) => (
                  <label
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <input type="checkbox" value={s} {...register("seasons")} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review + Tags */}
        <div>
          <p style={sec}>Review</p>
          <textarea
            maxLength={2000}
            rows={3}
            style={{
              ...inp,
              minHeight: 80,
              resize: "vertical",
              lineHeight: 1.6,
            }}
            placeholder="Your personal thoughts on this fragrance..."
            {...register("analysis")}
          />
          <div style={{ marginTop: 12 }}>
            <p style={lbl}>Tags</p>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type a tag and press Enter"
              style={inp}
            />
            {tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 10px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--accent-subtle)",
                      border: "1px solid var(--accent-border)",
                      color: "var(--accent-primary)",
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--accent-primary)",
                        padding: 0,
                        lineHeight: 1,
                        opacity: 0.5,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <p style={{ ...sec, marginBottom: 0 }}>Image</p>
          {imagePreview ? (
            <div style={{ position: "relative" }}>
              <img
                src={imagePreview}
                style={{
                  width: 72,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                  setRemoveImage(true);
                }}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "var(--danger)",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  fontSize: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => document.getElementById("pfImg")?.click()}
              style={{
                width: 72,
                height: 72,
                borderRadius: "var(--radius-md)",
                border: "1px dashed var(--border-default)",
                background: "rgba(255,255,255,0.02)",
                color: "var(--text-muted)",
                fontSize: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                transition: "all var(--duration-fast) var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-border)";
                e.currentTarget.style.color = "var(--accent-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              Upload
            </button>
          )}
          <input
            id="pfImg"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImage}
            style={{ display: "none" }}
          />
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            Optional · JPEG, PNG, WebP · Max 4MB
          </span>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            paddingTop: 14,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" type="submit" loading={isSubmitting}>
            {isEditing ? "Save Changes" : "Add Perfume"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
