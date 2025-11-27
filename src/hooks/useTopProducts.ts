import { useEffect, useMemo, useState } from "react";
import { fetchTopProducts, type Product } from "../services/fakestore";
import { notification } from "antd";

export function useTopProducts(limit = 5) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetchTopProducts(limit);
        if (alive) setData(res);
      } catch {
        notification.error({
          message: "Erro ao carregar produtos",
          description: "Não foi possível buscar os produtos da Fake Store API.",
        });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [limit]);

  const top = useMemo(() => data.slice(0, limit), [data, limit]);
  return { top, loading };
}
