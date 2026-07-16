"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";

import {
  personalSettingsSchema,
  removeAvatar,
  updateAvatar,
  updatePersonalSettings,
  type PersonalSettingsInput,
} from "@/features/settings/client";
import { Button, Field, Input } from "@/shared/ui";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_AVATAR_EDGE = 512;

const PROFESSION_LABELS = {
  EMPLOYEE: "Salarié",
  FREELANCER: "Indépendant",
  ENTREPRENEUR: "Entrepreneur",
  STUDENT: "Étudiant",
  UNEMPLOYED: "Sans emploi",
  RETIRED: "Retraité",
} as const;

export function PersonalSettingsForm({
  initialValues,
  initialImage,
}: {
  initialValues: PersonalSettingsInput;
  initialImage: string | null;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState(initialValues);
  const [image, setImage] = useState(initialImage);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isBusy = isPending || isPreparingImage;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const parsed = personalSettingsSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Vérifiez vos informations.");
      return;
    }

    startTransition(async () => {
      const response = await updatePersonalSettings(parsed.data);
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      setError(null);
      setMessage("Profil mis à jour.");
    });
  }

  async function selectAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setMessage(null);
    setError(null);
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError("Utilisez une image JPG, PNG ou WEBP.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("L’image doit peser moins de 5 Mo.");
      return;
    }

    setIsPreparingImage(true);
    try {
      const dataUrl = await compressAvatar(file);
      startTransition(async () => {
        const response = await updateAvatar({ dataUrl });
        if (!response.success) {
          setError(response.error.message);
          return;
        }
        setImage(response.data.image);
        setMessage("Photo de profil mise à jour.");
      });
    } catch {
      setError("L’image n’a pas pu être préparée.");
    } finally {
      setIsPreparingImage(false);
    }
  }

  function deleteAvatar() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const response = await removeAvatar();
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      setImage(null);
      setMessage("Photo de profil supprimée.");
    });
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
        <h2 className="text-lg font-semibold">Photo de profil</h2>
        <p className="mt-1 text-sm text-secondary-text">JPG, PNG ou WEBP · 5 Mo maximum.</p>
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
          {image ? (
            <Image
              src={image}
              alt="Photo de profil actuelle"
              width={96}
              height={96}
              unoptimized
              className="size-24 rounded-3xl object-cover"
            />
          ) : (
            <div className="grid size-24 place-items-center rounded-3xl bg-card text-secondary-text">
              <ImagePlus aria-hidden="true" />
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={selectAvatar}
              aria-label="Choisir une photo de profil"
            />
            <Button
              type="button"
              variant="secondary"
              disabled={isBusy}
              onClick={() => fileInput.current?.click()}
            >
              <ImagePlus size={18} aria-hidden="true" />
              {isPreparingImage ? "Préparation..." : "Choisir une photo"}
            </Button>
            {image && (
              <Button type="button" variant="ghost" disabled={isBusy} onClick={deleteAvatar}>
                <Trash2 size={18} aria-hidden="true" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </section>

      <form className="rounded-3xl border border-border bg-surface p-5 sm:p-8" onSubmit={submit}>
        <h2 className="text-lg font-semibold">Informations personnelles</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Prénom" htmlFor="firstName">
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(event) => setValues({ ...values, firstName: event.target.value })}
              autoComplete="given-name"
              required
            />
          </Field>
          <Field label="Nom" htmlFor="lastName">
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(event) => setValues({ ...values, lastName: event.target.value })}
              autoComplete="family-name"
              required
            />
          </Field>
          <Field label="Date de naissance" htmlFor="birthDate">
            <Input
              id="birthDate"
              type="date"
              value={values.birthDate}
              onChange={(event) => setValues({ ...values, birthDate: event.target.value })}
              autoComplete="bday"
              required
            />
          </Field>
          <Field label="Pays de résidence" htmlFor="country">
            <Input
              id="country"
              value={values.country}
              onChange={(event) => setValues({ ...values, country: event.target.value })}
              autoComplete="country-name"
              required
            />
          </Field>
          <Field label="Situation professionnelle" htmlFor="profession">
            <select
              id="profession"
              value={values.profession}
              onChange={(event) =>
                setValues({
                  ...values,
                  profession: event.target.value as PersonalSettingsInput["profession"],
                })
              }
              className="h-12 w-full rounded-xl border border-border bg-card px-4"
            >
              {Object.entries(PROFESSION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-8">
          <Button type="submit" disabled={isBusy}>
            {isPending ? "Enregistrement..." : "Enregistrer mon profil"}
          </Button>
        </div>
      </form>

      <AnimatePresence initial={false} mode="wait">
        {(message || error) && (
          <motion.p
            key={error ? "error" : "success"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border p-3 text-sm ${
              error
                ? "border-danger/40 bg-danger/10 text-danger"
                : "border-success/40 bg-success/10 text-success"
            }`}
            role={error ? "alert" : "status"}
          >
            {error ?? message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

async function compressAvatar(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_AVATAR_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("CANVAS_UNAVAILABLE");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("IMAGE_COMPRESSION_FAILED"))),
      "image/webp",
      0.82,
    );
  });
  return readAsDataUrl(blob);
}

function readAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("READ_FAILED"));
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.readAsDataURL(blob);
  });
}
