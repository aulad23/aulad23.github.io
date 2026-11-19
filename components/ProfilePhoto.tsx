"use client";

import { useRef, useState } from "react";
import { photo } from "@/data/site";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const build = process.env.NEXT_PUBLIC_BUILD_ID ?? "";
const API = "https://api.github.com";
const TOKEN_KEY = "portfolio-photo-token";

// SHA-256 of "name:password" for the photo editor login.
// To change the login, run:  node -e "console.log(require('crypto').createHash('sha256').update('NAME:PASSWORD').digest('hex'))"
const LOGIN_HASH = "b93ef7e0a95ef8055dc00d8462fe05fb4d26e817811a0e924305ca12e0218f12";

type Status = { kind: "idle" | "working" | "error" | "done"; message?: string };

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
};
const writeToken = (t: string) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
};

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Resize to a web-friendly JPEG so the repository stays small.
async function toJpegBase64(file: File): Promise<{ base64: string; previewUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 900 / bitmap.width, 1270 / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process image"))), "image/jpeg", 0.86),
  );
  const buffer = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < buffer.length; i += 0x8000) {
    binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000));
  }
  return { base64: btoa(binary), previewUrl: URL.createObjectURL(blob) };
}

export default function ProfilePhoto() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [src, setSrc] = useState(`${base}/images/profile.jpg${build ? `?v=${build}` : ""}`);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [hasToken, setHasToken] = useState(false);

  const open = () => {
    setStatus({ kind: "idle" });
    setHasToken(Boolean(readToken()));
    formRef.current?.reset();
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const forgetToken = () => {
    writeToken("");
    setHasToken(false);
    setStatus({ kind: "idle", message: "Saved GitHub token removed from this browser." });
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("username") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const newToken = String(data.get("token") ?? "").trim();
    const file = data.get("photo") as File | null;

    if ((await sha256(`${name}:${password}`)) !== LOGIN_HASH) {
      return setStatus({ kind: "error", message: "Name or password is not correct." });
    }
    const token = newToken || readToken();
    if (!token) return setStatus({ kind: "error", message: "First time only: paste your GitHub token." });
    if (!file || file.size === 0) return setStatus({ kind: "error", message: "Choose a photo first." });
    if (!/^image\/(jpeg|png|webp)$/.test(file.type))
      return setStatus({ kind: "error", message: "Use a JPG, PNG or WebP image." });
    if (file.size > 10 * 1024 * 1024) return setStatus({ kind: "error", message: "The image must be under 10 MB." });

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    try {
      setStatus({ kind: "working", message: "Preparing the photo…" });
      const { base64, previewUrl } = await toJpegBase64(file);

      setStatus({ kind: "working", message: "Uploading…" });
      // Save to every target: the source (so future builds keep it) and the live site branch.
      for (const target of photo.targets) {
        const fileUrl = `${API}/repos/${photo.owner}/${photo.repo}/contents/${target.path}`;
        const current = await fetch(`${fileUrl}?ref=${target.branch}`, { headers, cache: "no-store" });
        if (current.status === 401) {
          writeToken("");
          setHasToken(false);
          return setStatus({ kind: "error", message: "The GitHub token is not valid. Paste a new one." });
        }
        const sha = current.ok ? (await current.json()).sha : undefined;

        const put = await fetch(fileUrl, {
          method: "PUT",
          headers,
          body: JSON.stringify({ message: "Update profile photo", content: base64, branch: target.branch, sha }),
        });
        if (!put.ok) {
          if (put.status === 401) {
            writeToken("");
            setHasToken(false);
          }
          const reason =
            put.status === 401
              ? "The GitHub token is not valid. Paste a new one."
              : put.status === 403 || put.status === 404
                ? `The GitHub token cannot change this repository. Give it Contents: Read and write on ${photo.repo}.`
                : `Upload failed (error ${put.status}). Please try again.`;
          return setStatus({ kind: "error", message: reason });
        }
      }

      writeToken(token);
      setHasToken(true);
      setSrc(previewUrl);
      setStatus({
        kind: "done",
        message: "Photo updated. Visitors will see it after the site rebuilds, usually in 1–2 minutes.",
      });
    } catch {
      setStatus({ kind: "error", message: "Could not reach GitHub. Check your connection and try again." });
    }
  }

  const working = status.kind === "working";

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Profile photo — owner can click to change it"
        className="group relative block w-full overflow-hidden bg-surface-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={photo.alt}
          width={900}
          height={1270}
          className="aspect-[4/5] h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/80 px-3 py-1.5 text-xs text-muted opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Change photo
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="photo-dialog-title"
        className="m-auto w-[min(92vw,26rem)] rounded-xl border border-line bg-surface p-0 text-text backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="photo-dialog-title" className="text-lg font-semibold">Change profile photo</h2>
              <p className="mt-1 text-sm text-muted">Owner only.</p>
            </div>
            <button type="button" onClick={close} aria-label="Close" className="rounded-lg p-2 text-muted hover:text-text">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Name</span>
            <input name="username" required autoComplete="username" className="rounded-xl border border-line bg-bg px-4 py-3 text-base" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Password</span>
            <input name="password" type="password" required autoComplete="current-password" className="rounded-xl border border-line bg-bg px-4 py-3 text-base" />
          </label>

          {hasToken ? (
            <p className="flex items-center justify-between gap-3 rounded-xl bg-bg px-4 py-3 text-xs text-muted">
              GitHub token saved in this browser.
              <button type="button" onClick={forgetToken} className="font-semibold text-purple hover:underline">
                Remove
              </button>
            </p>
          ) : (
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted">GitHub token (first time only — saved in this browser)</span>
              <input name="token" type="password" autoComplete="off" className="rounded-xl border border-line bg-bg px-4 py-3 text-base" />
            </label>
          )}

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">New photo (JPG, PNG or WebP)</span>
            <input
              name="photo"
              type="file"
              required
              accept="image/jpeg,image/png,image/webp"
              className="rounded-xl border border-line bg-bg px-3 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-text"
            />
          </label>

          {status.message && (
            <p
              role={status.kind === "error" ? "alert" : "status"}
              className={`rounded-xl px-4 py-3 text-sm ${
                status.kind === "error"
                  ? "bg-red-600/10 text-red-800"
                  : status.kind === "done"
                    ? "bg-success/10 text-success"
                    : "bg-blue/10 text-blue"
              }`}
            >
              {status.message}
            </p>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={close} className="flex-1 rounded-lg border border-line px-4 py-3 text-sm font-semibold">
              {status.kind === "done" ? "Close" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={working}
              className="flex-1 rounded-lg bg-purple px-4 py-3 text-sm font-semibold text-bg disabled:opacity-60"
            >
              {working ? "Working…" : "Update photo"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
