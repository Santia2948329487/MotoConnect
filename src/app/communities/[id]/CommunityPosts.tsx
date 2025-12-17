"use client";
import { useEffect, useState, useRef } from "react";

interface Post {
  id: string;
  title?: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  author?: { name?: string };
}

export default function CommunityPosts({
  communityId,
}: {
  communityId: string;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function loadPosts() {
    if (!communityId) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/communities/${communityId}/posts`, {
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      const data = Array.isArray(json) ? json : json?.data ?? [];
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if ((err as DOMException)?.name === "AbortError") return;
      setError(err instanceof Error ? err.message : String(err));
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(f: File) {
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch(`/api/communities/${communityId}/uploads`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `Upload failed ${res.status}`);
    }
    const json = await res.json();
    // cloudinary/url or data url comes back as "url"
    return json?.url as string;
  }

  async function createPost() {
    if (!content.trim() || posting || !communityId) return;
    setPosting(true);
    setError(null);

    const temp: Post = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      title: title?.trim() || undefined,
      imageUrl: preview ?? null,
      createdAt: new Date().toISOString(),
      author: { name: "Tú" },
    };
    setPosts((p) => [temp, ...p]);

    const originalContent = content;
    const originalTitle = title;
    setContent("");
    setTitle("");
    setFile(null);
    setPreview(null);

    try {
      let imageUrl: string | undefined;
      if (file) {
        imageUrl = await uploadFile(file);
      }

      const res = await fetch(`/api/communities/${communityId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // enviar imageUrl (el server acepta image/imageUrl)
        body: JSON.stringify({
          content: originalContent,
          title: originalTitle,
          imageUrl: imageUrl ?? null,
        }),
      });

      const text = await res.text();
      console.log("POST /posts status:", res.status, "body:", text);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e) {
        console.warn("POST response is not JSON:", e);
      }

      if (!res.ok) {
        throw new Error(json?.error ?? text ?? `HTTP ${res.status}`);
      }

      const created = json?.data ?? (json?.success && json?.data) ?? null;

      if (created && created.id) {
        setPosts((p) =>
          p.map((x) =>
            x.id === temp.id
              ? {
                  // normaliza a imageUrl
                  id: created.id,
                  title: created.title ?? x.title,
                  content: created.content ?? x.content,
                  imageUrl: created.imageUrl ?? created.image ?? x.imageUrl ?? null,
                  createdAt: created.createdAt ?? x.createdAt,
                  author: created.author ?? x.author,
                }
              : x
          )
        );
      } else {
        // respuesta ok pero sin post creado: conserva optimista y no lo borres
        console.info("POST returned no created.id — manteniendo post optimista");
        // opcional: disparar loadPosts en background
        loadPosts().catch(() => {});
      }
    } catch (err: unknown) {
      console.error("createPost error:", err);
      setError(err instanceof Error ? err.message : String(err));
      // revertir optimista solo en fallo
      setPosts((p) => p.filter((x) => x.id !== temp.id));
      setContent(originalContent);
      setTitle(originalTitle);
    } finally {
      setPosting(false);
    }
  }

  useEffect(() => {
    loadPosts();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título (opcional)"
          className="w-full bg-neutral-800 text-white rounded-lg p-2 mb-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comparte algo con tu comunidad..."
          className="w-full bg-neutral-800 text-white rounded-lg p-3 resize-none focus:ring-2 focus:ring-red-600"
          rows={4}
          disabled={posting}
        />
        <div className="flex items-center gap-3 mt-3">
          <label className="cursor-pointer bg-neutral-800 px-3 py-2 rounded text-neutral-300">
            Subir imagen
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {preview && (
            <div className="w-20 h-20 rounded overflow-hidden bg-neutral-700">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {error && <span className="text-red-500 text-sm">{error}</span>}
            <button
              onClick={createPost}
              disabled={posting || !content.trim()}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold disabled:opacity-50"
            >
              {posting ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-neutral-400">Cargando publicaciones...</p>
      ) : posts.length === 0 ? (
        <p className="text-neutral-500">Aún no hay publicaciones</p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-white font-medium">{post.title ?? ""}</h3>
                <div className="text-sm text-neutral-400">
                  {post.author?.name || "Anónimo"}
                </div>
              </div>
              <div className="text-xs text-neutral-400">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>

            <p className="text-neutral-300 mb-3">{post.content}</p>

            {post.imageUrl && (
              <div className="rounded overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>
            )}
          </article>
        ))
      )}
    </div>
  );
}
