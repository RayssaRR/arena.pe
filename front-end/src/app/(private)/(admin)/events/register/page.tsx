"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardClock, Coins, ImageDown, Info } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { createEvent, getCategories, uploadImageToPublicAssets, Category } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EventForm() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
    price: "",
    categoryId: "",
    imageUrl: "",
  });

  // Marcar como montado e carregar categorias
  useEffect(() => {
    setIsMounted(true);
    
    const loadCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Token não encontrado. Faça login novamente.");
        }
        const data = await getCategories(token);
        setCategories(data);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setError("Erro ao carregar categorias");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setError("Apenas PNG e JPG são permitidos");
      return;
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Arquivo não pode exceder 10MB");
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const imageUrl = await uploadImageToPublicAssets(file, token);
      setFormData((prev) => ({
        ...prev,
        imageUrl,
      }));

      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer upload da imagem";
      setError(errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      // Validações
      if (!formData.title.trim()) throw new Error("Nome do evento é obrigatório");
      if (!formData.description.trim()) throw new Error("Descrição é obrigatória");
      if (!formData.date) throw new Error("Data é obrigatória");
      if (!formData.startTime) throw new Error("Hora de início é obrigatória");
      if (!formData.endTime) throw new Error("Hora de término é obrigatória");
      if (!formData.capacity || parseInt(formData.capacity) <= 0)
        throw new Error("Capacidade deve ser maior que 0");
      if (!formData.categoryId) throw new Error("Categoria é obrigatória");
      if (!formData.imageUrl) throw new Error("Imagem é obrigatória");

      // Combinar data e hora
      const eventDateTime = `${formData.date}T${formData.startTime}:00`;

      // Obter token
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token não encontrado. Faça login novamente.");

      // Criar evento
      await createEvent(
        {
          title: formData.title,
          description: formData.description,
          eventDate: eventDateTime,
          capacity: parseInt(formData.capacity),
          status: "UPCOMING",
          imageUrl: formData.imageUrl,
          categoryId: parseInt(formData.categoryId),
        },
        token
      );

      setSuccessMessage("Evento criado com sucesso!");
      setFormData({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        capacity: "",
        price: "",
        categoryId: "",
        imageUrl: "",
      });
      setImagePreview(null);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/dashboard-admin");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar evento";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-8 min-h-screen">
      {!isMounted ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : (
        <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Header */}
        <header className="space-y-1">
          <h1 className="title-h1">Criar novo evento</h1>
          <p className="subtitle">
            Configure os detalhes do evento, programação e preços.
          </p>
        </header>

        {/* Mensagens de Sucesso e Erro */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
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
              <Input
                id="title"
                name="title"
                placeholder="Ex: Campeonato de Verão 2026"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col space-y-1 flex-1">
              <Label htmlFor="categoryId">Categoria</Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isLoadingCategories || isSubmitting}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva o evento..."
              className="min-h-30 resize-none"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
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
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col space-y-1 flex-1">
              <Label htmlFor="startTime">Hora de início</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col space-y-1 flex-1">
              <Label htmlFor="endTime">Hora de término</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </section>

        {/* Bottom Sections */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Capacity & Pricing */}
          <section className="bg-white p-6 rounded-xl border flex-1 space-y-4">
            <h3 className="flex items-center gap-2 text-gray-800 font-medium">
              <Coins className="w-5 h-5 text-blue-600" />
              Capacidade
            </h3>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="capacity">Capacidade total</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                placeholder="500"
                value={formData.capacity}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </section>

          {/* Media */}
          <section className="bg-white p-6 rounded-xl border flex-1 space-y-4">
            <h3 className="flex items-center gap-2 text-gray-800 font-medium">
              <ImageDown className="w-5 h-5 text-blue-600" />
              Mídia
            </h3>

            {imagePreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-300">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, imageUrl: "" }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remover
                </button>
              </div>
            ) : (
              <label
                htmlFor="fileUpload"
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-sm text-gray-500 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
              >
                <p className="text-blue-600 font-medium">Clique para enviar</p>
                <p>ou arraste e solte</p>
                <p className="text-xs mt-1">PNG, JPG até 10MB</p>
                <input
                  id="fileUpload"
                  name="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || isSubmitting}
                  accept="image/png,image/jpeg,image/jpg"
                />
              </label>
            )}
            {uploadingImage && (
              <p className="text-sm text-blue-600">Enviando imagem...</p>
            )}
          </section>
        </div>

        {/* Actions */}
        <footer className="flex justify-end gap-3">
          <Link href="/dashboard-admin">
            <Button
              variant="secondary"
              className="px-8 py-4 cursor-pointer"
              type="button"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </Link>
          <Button
            className="bg-(--blue) px-10 py-5 cursor-pointer"
            type="submit"
            disabled={isSubmitting || isLoadingCategories}
          >
            {isSubmitting ? "Salvando..." : "Salvar evento"}
          </Button>
        </footer>
        </form>
      )}
    </main>
  );
}