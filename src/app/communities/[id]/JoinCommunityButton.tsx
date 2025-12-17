"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinCommunityButton({
  communityId,
  isMemberInitial,
}: {
  communityId: string;
  isMemberInitial: boolean;
}) {
  const [isMember, setIsMember] = useState(isMemberInitial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleMembership() {
  setLoading(true);

  const res = await fetch(`/api/communities/${communityId}/join`, {
    method: isMember ? "DELETE" : "POST",
  });

  if (res.ok) {
    setIsMember(!isMember);
    try { router.refresh(); } catch (_) {}
  }

  setLoading(false);
}

  return (
    <button
      onClick={toggleMembership}
      disabled={loading}
      className={`px-6 py-2 rounded-lg font-semibold transition
        ${isMember
          ? "bg-neutral-800 hover:bg-red-600"
          : "bg-red-600 hover:bg-red-700"}
      `}
    >
      {isMember ? "Salir de la comunidad" : "Unirse a la comunidad"}
    </button>
  );
}
