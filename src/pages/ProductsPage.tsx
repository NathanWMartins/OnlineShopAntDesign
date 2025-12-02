import { useEffect, useMemo, useState } from "react";
import {
  App as AntApp,
  Button,
  Divider,
  Flex,
  Grid,
  Image,
  Input,
  List,
  Popconfirm,
  Typography,
  theme,
  Rate,
  Form,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import HeaderBar from "../components/HeaderBar";
import AddProductModal from "../components/AddProductModal";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { useAppDispatch, useAppSelector } from "../store";
import {
  initProducts,
  addLocalProduct,
  updateLocalProduct,
  deleteLocalProduct,
  type ProductItem,
} from "../store/productsSlice";
import type { Product } from "../services/fakestore";
import { addItem } from "../store/cart/cartSlice";
import EditProductDrawer from "../components/EditProductDrawer";

const { Title, Text, Paragraph } = Typography;

export default function ProductsPage() {
  const { message } = AntApp.useApp();
  const { token } = theme.useToken();
  const { user, isAdmin } = useAuth();
  const screens = Grid.useBreakpoint();
  const [searchParams] = useSearchParams();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>();
  const [previewTitle, setPreviewTitle] = useState<string>();

  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.products.loading);
  const items = useAppSelector((s) => s.products.items);

  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [form] = Form.useForm<Product>();

  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    dispatch(initProducts())
      .unwrap()
      .catch(() => message.error("Falha ao carregar produtos"));
  }, [dispatch, message]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) => p.title.toLowerCase().includes(s));
  }, [items, q]);

  function handleSaved(p: Product) {
    dispatch(addLocalProduct(p));
    setAddOpen(false);
    message.success("Produto cadastrado com sucesso!");
  }

  function openEdit(item: ProductItem) {
    setEditing(item);
    form.setFieldsValue({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category,
      image: item.image,
      description: item.description,
    } as any);
    setDrawerOpen(true);
  }

  async function handleSaveEdit() {
    const values = await form.validateFields();
    if (!editing) return;
    if (!isAdmin || editing.source !== "local") {
      message.warning("Somente o admin pode editar produtos locais.");
      setDrawerOpen(false);
      return;
    }
    dispatch(updateLocalProduct({ ...values, id: editing.id } as Product));
    setDrawerOpen(false);
    message.success("Produto atualizado!");
  }

  function handleDelete(item: ProductItem) {
    if (!isAdmin || item.source !== "local") return;
    dispatch(deleteLocalProduct(item.id));
    message.success("Produto excluído.");
  }

  const placeholderBase64 =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
        <rect width='100%' height='100%' fill='#f5f5f5'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-family='Arial' font-size='16'>Imagem indisponível</text>
      </svg>`
    );

  return (
    <div
      style={{
        background: token.colorBgBase,
        color: token.colorText,
        minHeight: "100vh",
      }}
    >
      <HeaderBar />

      <Flex
        align="center"
        justify="space-between"
        wrap
        gap={12}
        style={{
          margin: "16px 0 8px",
          paddingInline: 16,
          maxWidth: 1200,
          marginInline: "auto",
        }}
      >
        <Title level={3} style={{ margin: 0, color: token.colorText }}>
          List of Products
        </Title>

        {user && (
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setAddOpen(true)}
          >
            Add Product
          </Button>
        )}
      </Flex>

      <Flex
        style={{ paddingInline: 16, maxWidth: 1200, marginInline: "auto" }}
      >
        <Input.Search
          placeholder="Search products"
          allowClear
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            maxWidth: 420,
            marginBottom: 12,
            background: token.colorBgContainer,
            borderColor: token.colorBorder,
          }}
        />
      </Flex>

      <Divider style={{ margin: "12px 0", borderColor: token.colorSplit }} />

      <div style={{ paddingInline: 16, maxWidth: 1200, marginInline: "auto" }}>
        <List
          loading={loading}
          dataSource={filtered}
          grid={{ gutter: 28, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
          renderItem={(item) => {
            const isWide = screens.md;
            const canManageLocal = isAdmin && item.source === "local";

            return (
              <List.Item style={{ padding: 8 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    background: token.colorBgContainer,
                    border: `1px solid ${token.colorSplit}`,
                    borderRadius: token.borderRadiusLG,
                    padding: 12,
                    minWidth: 360,
                    maxWidth: 440,
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isWide ? "row" : "column",
                      alignItems: isWide ? "flex-start" : "stretch",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        flex: "0 0 auto",
                        width: isWide ? 160 : "100%",
                        height: 160,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: token.colorFillTertiary,
                        borderRadius: token.borderRadius,
                        overflow: "hidden",
                        cursor: "zoom-in",
                      }}
                      onClick={() => {
                        setPreviewSrc(item.image);
                        setPreviewTitle(item.title);
                        setPreviewOpen(true);
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fallback={placeholderBase64}
                        preview={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        strong
                        ellipsis={{ tooltip: item.title }}
                        style={{ display: "block" }}
                      >
                        {item.title}
                      </Text>

                      <Flex
                        align="center"
                        gap={8}
                        style={{ margin: "6px 0" }}
                      >
                        <Rate
                          disabled
                          defaultValue={5}
                          allowHalf
                          style={{ fontSize: 16 }}
                        />
                      </Flex>

                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 3, tooltip: item.description }}
                        style={{ marginBottom: 0 }}
                      >
                        {item.description}
                      </Paragraph>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        borderRadius: token.borderRadius,
                        padding: "8px 12px",
                        fontWeight: 600,
                        textAlign: "center",
                        background: token.colorPrimaryBg,
                      }}
                    >
                      Price:{" "}
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.price)}
                    </div>

                    <Flex gap={8}>
                      <Button
                        icon={<ShoppingCartOutlined />}
                        type="primary"
                        style={{ flex: 1 }}
                        onClick={() => {
                          if (!user) {
                            message.warning("Você precisa estar logado para adicionar itens ao carrinho.");
                            return;
                          }
                          dispatch(
                            addItem({
                              id: item.id,
                              title: item.title,
                              price: item.price,
                              image: item.image,
                            })
                          );
                          message.success(
                            `"${item.title}" adicionado ao carrinho`
                          );
                        }}
                      >
                        Buy
                      </Button>

                      <Tooltip
                        title={
                          item.source === "api"
                            ? "Itens da API são somente leitura"
                            : "Editar produto"
                        }
                      >
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => openEdit(item)}
                          disabled={!canManageLocal}
                        />
                      </Tooltip>

                      <Tooltip
                        title={
                          item.source === "api"
                            ? "Itens da API são somente leitura"
                            : "Excluir produto"
                        }
                      >
                        <Popconfirm
                          title="Confirmar exclusão?"
                          okText="Excluir"
                          cancelText="Cancelar"
                          placement="topRight"
                          onConfirm={() => handleDelete(item)}
                          disabled={!canManageLocal}
                        >
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={!canManageLocal}
                          />
                        </Popconfirm>
                      </Tooltip>
                    </Flex>

                    {isAdmin && item.source === "api" && (
                      <Flex
                        align="center"
                        gap={6}
                        style={{
                          color: token.colorTextTertiary,
                          fontSize: 12,
                        }}
                      >
                        <InfoCircleOutlined />
                        <span>
                          Produtos da API não podem ser editados/excluídos.
                        </span>
                      </Flex>
                    )}
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>

      <Image
        style={{ display: "none" }}
        src={previewSrc}
        alt={previewTitle}
        preview={{
          visible: previewOpen,
          onVisibleChange: (v) => setPreviewOpen(v),
        }}
      />

      <AddProductModal
        open={!!user && addOpen}
        onCancel={() => setAddOpen(false)}
        onSaved={handleSaved}
      />

      <EditProductDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveEdit}
        form={form}
      />
    </div>
  );
}