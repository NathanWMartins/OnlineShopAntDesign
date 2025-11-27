import { Card, Image, Typography } from "antd";
import type { Product } from "../services/fakestore";


const { Text, Paragraph } = Typography;

type Props = { product: Product };

export default function ProductCard({ product }: Props) {

  return (
    <Card
      hoverable
      style={{ width: 210, borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <Image
        src={product.image}
        alt={product.title}
        preview={{ mask: null }}
        width="100%"
        height={200}
        style={{
          objectFit: "contain",
          background: "#fff",
          borderRadius: 4,
        }}
      />

      <div style={{ textAlign: "left", marginTop: 12 }}>
        <Text
          strong
          style={{
            display: "block",
            fontSize: 14,
            marginBottom: 4,
          }}
          ellipsis={{ tooltip: product.title }}
        >
          {product.title}
        </Text>

        <Paragraph
          style={{
            margin: 0,
            color: "#666",
            fontSize: 13,
          }}
          ellipsis={{ rows: 2, tooltip: product.description }}
        >
          {product.description}
        </Paragraph>
      </div>
    </Card>
  );
}
