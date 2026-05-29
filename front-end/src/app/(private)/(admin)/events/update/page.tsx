"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardClock, ImageDown, Info, MapPin } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { getCategories, getEventById, uploadImageToPublicAssets, resolvePublicAssetUrl, Category } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { TICKET_LOCATIONS, TOTAL_CAPACITY } from "@/app/(private)/(admin)/components/TicketLocations";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type SectorPrice = {
  location: string;
  price: string;
  capacity: string;
};

interface FieldErrors {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  categoryId?: string;
  imageUrl?: string;
  sectors?: string;
}

export default function UpdateEventForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  const [isMounted, setIsMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<SectorPrice[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    categoryId: "",
    imageUrl: "",
  });

  useEffect(() => {
    setIsMounted(true);

    async function loadData() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token não encontrado. Faça login novamente.");

        const [cats, event] = await Promise.all([
          getCategories(token),
          eventId ? getEventById(eventId) : Promise.reject(new Error("ID do evento não encontrado")),
        ]);

        setCategories(cats);

        const dateObj = new Date(event.eventDate);
        const date = dateObj.toISOString().split("T")[0];
        const startTime = dateObj.toTimeString().slice(0, 5);

        setFormData({
          title: event.title,
          description: event.description,
          date,
          startTime,
          endTime: "",
          categoryId: String(event.category?.id ?? ""),
          imageUrl: event.imageUrl ?? "",
        });

        const resolvedUrl = resolvePublicAssetUrl(event.imageUrl);
        if (resolvedUrl) setImagePreview(resolvedUrl);

        if (event.tickets && event.tickets.length > 0) {
          setSelectedSectors(
            event.tickets.map((t) => ({
              location: t.location,
              price: String(t.price),
              capacity: String(t.ticketsAvailable),
            }))
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar evento");
      } finally {
        setIsLoadingCategories(false);
        setIsLoadingEvent(false);
      }
    }

    loadData();
  }, [eventId]);

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    clearFieldError(id as keyof FieldErrors);
  };

  const toggleSector = (location: string, maxCapacity: number) => {
    setSelectedSectors((prev) => {
      const exists = prev.find((s) => s.location === location);
      if (exists) return prev.filter((s) => s.location !== location);
      return [...prev, { location, price: "", capacity: String(maxCapacity) }];
    });
    clearFieldError("sectors");
  };

  const updateSector = (location: string, field: "price" | "capacity", value: string) => {
    setSelectedSectors((prev) =>
      prev.map((s) => (s.location === location ? { ...s, [field]: value } : s))
    );
  };

  const isSectorSelected = (location: string) =>
    selectedSectors.some((s) => s.location === location);

  const totalSelectedCapacity = selectedSectors.reduce(
    (acc, s) => acc + (parseInt(s.capacity) || 0),
    0
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setFieldErrors((prev) => ({ ...prev, imageUrl: "Apenas PNG e JPG são permitidos" }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, imageUrl: "Arquivo não pode exceder 10MB" }));
      return;
    }

    setUploadingImage(true);
    clearFieldError("imageUrl");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token não encontrado");
      const imageUrl = await uploadImageToPublicAssets(file, token);
      setFormData((prev) => ({ ...prev, imageUrl }));
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } catch (err) {
      setFieldErrors((prev) => ({
        ...prev,
        imageUrl: err instanceof Error ? err.message : "Erro ao fazer upload da imagem",
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!formData.title.trim()) errors.title = "Nome do evento é obrigatório";
    if (!formData.description.trim()) errors.description = "Descrição é obrigatória";
    if (!formData.date) errors.date = "Data é obrigatória";
    if (!formData.startTime) errors.startTime = "Hora de início é obrigatória";
    if (!formData.categoryId) errors.categoryId = "Categoria é obrigatória";
    if (!formData.imageUrl) errors.imageUrl = "Imagem é obrigatória";
    if (selectedSectors.length === 0) {
      errors.sectors = "Selecione pelo menos um setor";
    } else {
      for (const s of selectedSectors) {
        if (!s.price || parseFloat(s.price) <= 0) {
          errors.sectors = `Defina o preço do setor ${s.location}`;
          break;
        }
        const sectorInfo = TICKET_LOCATIONS.find((l) => l.value === s.location);
        const cap = parseInt(s.capacity);
        if (!cap || cap <= 0) { errors.sectors = `Defina a capacidade do setor ${s.location}`; break; }
        if (sectorInfo && cap > sectorInfo.capacity) {
          errors.sectors = `Capacidade do setor ${sectorInfo.label} não pode exceder ${sectorInfo.capacity.toLocaleString("pt-BR")} lugares`;
          break;
        }
      }
      if (!errors.sectors && totalSelectedCapacity > TOTAL_CAPACITY) {
        errors.sectors = `Capacidade total (${totalSelectedCapacity.toLocaleString("pt-BR")}) excede o limite da arena (${TOTAL_CAPACITY.toLocaleString("pt-BR")})`;
      }
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!eventId) throw new Error("ID do evento não encontrado");

      const eventDateTime = `${formData.date}T${formData.startTime}:00`;
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token não encontrado. Faça login novamente.");

      await axios.put(
        `${BACKEND_URL}/events/${eventId}`,
        {
          title: formData.title,
          description: formData.description,
          eventDate: eventDateTime,
          imageUrl: formData.imageUrl,
          categoryId: parseInt(formData.categoryId),
          tickets: selectedSectors.map((s) => ({
            location: s.location,
            price: parseFloat(s.price),
            ticketsAvailable: parseInt(s.capacity),
          })),
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setSuccessMessage("Evento atualizado com sucesso!");
      setFieldErrors({});
      setTimeout(() => router.push("/dashboard-admin"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputErr = (field: keyof FieldErrors) =>
    fieldErrors[field] ? "border-red-400 focus-visible:ring-red-400" : "";

  const Err = ({ field }: { field: keyof FieldErrors }) =>
    fieldErrors[field] ? <p className="text-sm text-red-500 mt-1">{fieldErrors[field]}</p> : null;

  return (
    <main className="p-8 min-h-screen">
      {!isMounted || isLoadingEvent ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : (
        <form className="space-y-8" onSubmit={handleSubmit}>

          <header className="space-y-1">
            <h1 className="title-h1">Editar Evento</h1>
            <p className="subtitle">Edite os detalhes do evento, a programação e os preços dos ingressos.</p>
          </header>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{successMessage}</div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          )}

          {/* Basic Info */}
          <section className="bg-white p-6 rounded-xl border space-y-6">
            <h3 className="flex items-center gap-2 body-lg">
              <Info className="w-5 h-5 text-blue-600" />
              Informações Básicas
            </h3>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col space-y-1 flex-1">
                <Label htmlFor="title">Nome do evento</Label>
                <Input id="title" placeholder="Ex: Campeonato de Verão 2026" value={formData.title} onChange={handleChange} disabled={isSubmitting} className={inputErr("title")} />
                <Err field="title" />
              </div>
              <div className="flex flex-col space-y-1 flex-1">
                <Label htmlFor="categoryId">Categoria</Label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={isLoadingCategories || isSubmitting}
                  className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.categoryId ? "border-red-400" : "border-gray-300"}`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
                <Err field="categoryId" />
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descreva o evento..." className={`min-h-30 resize-none ${inputErr("description")}`} value={formData.description} onChange={handleChange} disabled={isSubmitting} />
              <Err field="description" />
            </div>
          </section>

          {/* Schedule */}
          <section className="bg-white p-6 rounded-xl border space-y-6">
            <h3 className="flex items-center gap-2 text-gray-800 font-medium">
              <ClipboardClock className="w-5 h-5 text-blue-600" />
              Agendamento
            </h3>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col space-y-1 flex-1">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" value={formData.date} onChange={handleChange} disabled={isSubmitting} className={inputErr("date")} />
                <Err field="date" />
              </div>
              <div className="flex flex-col space-y-1 flex-1">
                <Label htmlFor="startTime">Hora de início</Label>
                <Input id="startTime" type="time" value={formData.startTime} onChange={handleChange} disabled={isSubmitting} className={inputErr("startTime")} />
                <Err field="startTime" />
              </div>
              <div className="flex flex-col space-y-1 flex-1">
                <Label htmlFor="endTime">Hora de término</Label>
                <Input id="endTime" type="time" value={formData.endTime} onChange={handleChange} disabled={isSubmitting} className={inputErr("endTime")} />
                <Err field="endTime" />
              </div>
            </div>
          </section>

          {/* Setores e Preços */}
          <section className="bg-white p-6 rounded-xl border space-y-6">
            <div className="flex items-start justify-between">
              <h3 className="flex items-center gap-2 text-gray-800 font-medium">
                <MapPin className="w-5 h-5 text-blue-600" />
                Setores e Preços
              </h3>
              <div className="text-right">
                <p className="text-xs text-gray-500">Capacidade selecionada</p>
                <p className={`text-sm font-bold ${totalSelectedCapacity > TOTAL_CAPACITY ? "text-red-600" : "text-gray-700"}`}>
                  {totalSelectedCapacity.toLocaleString("pt-BR")} / {TOTAL_CAPACITY.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Selecione os setores disponíveis e defina o preço e a capacidade de cada um. Capacidade máxima da arena: <strong>45.500</strong> pessoas.
            </p>

            {fieldErrors.sectors && (
              <p className="text-sm text-red-500">{fieldErrors.sectors}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              {TICKET_LOCATIONS.map(({ value, label, capacity }) => {
                const selected = isSectorSelected(value);
                const sector = selectedSectors.find((s) => s.location === value);
                const capValue = parseInt(sector?.capacity ?? "0") || 0;
                const capExceeded = capValue > capacity;

                return (
                  <div
                    key={value}
                    className={`border rounded-xl p-4 transition-all ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                  >
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSector(value, capacity)}
                          disabled={isSubmitting}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                        <span className={`text-sm font-medium ${selected ? "text-blue-700" : "text-gray-700"}`}>
                          {label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        máx. {capacity.toLocaleString("pt-BR")}
                      </span>
                    </label>

                    {selected && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-16">Preço (R$)</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0,00"
                            value={sector?.price ?? ""}
                            onChange={(e) => updateSector(value, "price", e.target.value)}
                            disabled={isSubmitting}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-16">Lugares</span>
                          <Input
                            type="number"
                            min="1"
                            max={capacity}
                            placeholder={String(capacity)}
                            value={sector?.capacity ?? ""}
                            onChange={(e) => updateSector(value, "capacity", e.target.value)}
                            disabled={isSubmitting}
                            className={`h-8 text-sm ${capExceeded ? "border-red-400" : ""}`}
                          />
                        </div>
                        {capExceeded && (
                          <p className="text-xs text-red-500">
                            Máximo: {capacity.toLocaleString("pt-BR")} lugares
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedSectors.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-bold text-gray-700 mb-3">Resumo dos setores:</p>
                {selectedSectors.map((s) => {
                  const info = TICKET_LOCATIONS.find((l) => l.value === s.location);
                  return (
                    <div key={s.location} className="flex justify-between text-sm text-gray-600">
                      <span>{info?.label}</span>
                      <div className="flex gap-6">
                        <span>{s.capacity ? `${parseInt(s.capacity).toLocaleString("pt-BR")} lugares` : "—"}</span>
                        <span className="font-medium w-24 text-right">
                          {s.price ? `R$ ${parseFloat(s.price).toFixed(2).replace(".", ",")}` : "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t pt-2 flex justify-between text-sm font-bold text-gray-700">
                  <span>Total</span>
                  <span>{totalSelectedCapacity.toLocaleString("pt-BR")} lugares</span>
                </div>
              </div>
            )}
          </section>

          {/* Mídia */}
          <section className="bg-white p-6 rounded-xl border space-y-4">
            <h3 className="flex items-center gap-2 text-gray-800 font-medium">
              <ImageDown className="w-5 h-5 text-blue-600" />
              Mídia
            </h3>
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-300">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setFormData((prev) => ({ ...prev, imageUrl: "" })); }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remover
                </button>
              </div>
            ) : (
              <label
                htmlFor="fileUpload"
                className={`border-2 border-dashed rounded-lg p-6 text-sm text-gray-500 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition ${fieldErrors.imageUrl ? "border-red-400" : "border-gray-300"}`}
              >
                <p className="text-blue-600 font-medium">Clique para enviar</p>
                <p>ou arraste e solte</p>
                <p className="text-xs mt-1">PNG, JPG até 10MB</p>
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || isSubmitting}
                  accept="image/png,image/jpeg,image/jpg"
                />
              </label>
            )}
            {fieldErrors.imageUrl && (
              <p className="text-sm text-red-500">{fieldErrors.imageUrl}</p>
            )}
            {uploadingImage && <p className="text-sm text-blue-600">Enviando imagem...</p>}
          </section>

          {/* Actions */}
          <footer className="flex justify-end gap-3">
            <Link href="/dashboard-admin">
              <Button variant="secondary" className="px-8 py-4 cursor-pointer" type="button" disabled={isSubmitting}>
                Cancelar
              </Button>
            </Link>
            <Button
              className="bg-(--blue) px-10 py-5 cursor-pointer"
              type="submit"
              disabled={isSubmitting || isLoadingCategories}
            >
              {isSubmitting ? "Salvando..." : "Atualizar Evento"}
            </Button>
          </footer>

        </form>
      )}
    </main>
  );
}