"use client";

import { deleteBusinessProductAction } from "@/lib/business-actions";

export default function DeleteProductButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteBusinessProductAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This also removes its photos.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="font-semibold text-red-600 hover:underline">Delete</button>
    </form>
  );
}
