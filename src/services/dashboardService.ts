/* Service to fetch dashboard summary (counts, activity, xp) */
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'development') return 'http://localhost:3000/api';
    return process.env.NEXT_PUBLIC_API_URL || 'https://motoconnect.vercel.app/api';
  }
  return '/api';
};

const API_BASE = getBaseUrl();

export interface DashboardSummary {
  totals: { communities: number; routes: number; workshops: number };
  recentActivity: Array<{ type: string; title: string; description?: string; createdAt: string }>;
  xp: number;
  level: number;
  levels: number[];
  achievements: Array<{ key: string; label: string; earned: boolean }>;
}

export async function fetchDashboardSummary(): Promise<DashboardSummary | null> {
  try {
    const res = await fetch(`${API_BASE}/dashboard/summary`, { method: 'GET', credentials: 'include' });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;
    return json.data as DashboardSummary;
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    return null;
  }
}
