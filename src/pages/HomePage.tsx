import { Spin, Layout } from "antd";
import HeaderBar from "../components/HeaderBar";
import { useTopProducts } from "../hooks/useTopProducts";
import ProductCard from "../components/ProductCard";

const { Content } = Layout;

export default function HomePage() {
  const { top, loading } = useTopProducts(5);

  const TOKENS = {
    containerMax: 1200,
    pagePadding: 32,
    gridGap: 16,
    h2Size: 28,
    h3Size: 22,
  } as const;

  return (
    <Layout style={{
      minHeight: "100vh", margin: 0, padding: 0,      
      width: "100vw", overflowX: "hidden"
    }}>
      <HeaderBar />

      <Content
        style={{
          maxWidth: TOKENS.containerMax,
          margin: "0 auto",
          padding: TOKENS.pagePadding,
          textAlign: "center",
        }}
      >
        {loading ? (
          <div
            style={{
              minHeight: 220,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Spin tip="Carregando produtos..." />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: TOKENS.gridGap,
              justifyContent: "center",
            }}
          >
            {top.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Content>
    </Layout>
  );
}
