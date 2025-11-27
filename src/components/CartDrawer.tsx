import {
    Button,
    Drawer,
    Empty,
    Flex,
    Image,
    InputNumber,
    List,
    Popconfirm,
    Space,
    Typography,
    theme,
} from "antd";
import {
    DeleteOutlined,
    MinusOutlined,
    PlusOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store";
import {
    selectCartItems,
    selectCartTotal,
    addItem,
    decrementItem,
    removeItem,
    clearCart,
    setQty,
} from "../store/cart/cartSlice";
import { useState } from "react";
import PurchaseAnimation from "./PurchaseAnimation";

const { Text, Title } = Typography;

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {
    const { token } = theme.useToken();
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectCartItems);
    const total = useAppSelector(selectCartTotal);
    const [showAnim, setShowAnim] = useState(false);

    const isEmpty = items.length === 0;

    return (
        <>
            <Drawer
                title={
                    <Flex align="center" gap={10}>
                        <ShoppingCartOutlined />
                        <span>Meu Carrinho</span>
                    </Flex>
                }
                placement="right"
                open={open}
                onClose={onClose}
                width={420}
                bodyStyle={{ padding: 16 }}
                styles={{ header: { borderBottom: `1px solid ${token.colorSplit}` } }}
                extra={
                    !isEmpty && (
                        <Popconfirm
                            title="Limpar carrinho?"
                            okText="Limpar"
                            cancelText="Cancelar"
                            placement="bottomRight"
                            onConfirm={() => dispatch(clearCart())}
                        >
                            <Button danger>Limpar</Button>
                        </Popconfirm>
                    )
                }
            >
                {isEmpty ? (
                    <Empty
                        description="Seu carrinho está vazio"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <>
                        <List
                            itemLayout="horizontal"
                            dataSource={items}
                            style={{ marginBottom: 12 }}
                            renderItem={(it) => (
                                <List.Item
                                    actions={[
                                        <Popconfirm
                                            key="rem"
                                            title="Remover este item?"
                                            okText="Remover"
                                            cancelText="Cancelar"
                                            placement="left"
                                            onConfirm={() => dispatch(removeItem({ id: it.id }))}
                                        >
                                            <Button type="text" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>,
                                    ]}
                                    style={{
                                        border: `1px solid ${token.colorSplit}`,
                                        borderRadius: token.borderRadiusLG,
                                        padding: 8,
                                        marginBottom: 8,
                                        background: token.colorBgContainer,
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: token.colorFillTertiary,
                                                    borderRadius: token.borderRadius,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <Image
                                                    src={it.image}
                                                    alt={it.title}
                                                    preview={false}
                                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                                />
                                            </div>
                                        }
                                        title={
                                            <Text strong ellipsis={{ tooltip: it.title }}>
                                                {it.title}
                                            </Text>
                                        }
                                        description={
                                            <Flex vertical gap={6}>
                                                <Text type="secondary">
                                                    {Intl.NumberFormat("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    }).format(it.price)}{" "}
                                                    <Text type="secondary">/ un.</Text>
                                                </Text>

                                                <Flex align="center" gap={8} wrap>
                                                    <Button
                                                        icon={<MinusOutlined />}
                                                        size="small"
                                                        onClick={() => dispatch(decrementItem({ id: it.id }))}
                                                    />
                                                    <InputNumber
                                                        min={1}
                                                        value={it.qty}
                                                        onChange={(v) =>
                                                            dispatch(setQty({ id: it.id, qty: Number(v) || 1 }))
                                                        }
                                                        size="small"
                                                        style={{ width: 64 }}
                                                    />
                                                    <Button
                                                        icon={<PlusOutlined />}
                                                        size="small"
                                                        onClick={() =>
                                                            dispatch(
                                                                addItem({
                                                                    id: it.id,
                                                                    title: it.title,
                                                                    price: it.price,
                                                                    image: it.image,
                                                                })
                                                            )
                                                        }
                                                    />

                                                    <Text style={{ marginLeft: "auto" }}>
                                                        Subtotal:{" "}
                                                        <Text strong>
                                                            {Intl.NumberFormat("pt-BR", {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }).format(it.price * it.qty)}
                                                        </Text>
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        }
                                    />
                                </List.Item>
                            )}
                        />

                        <Flex
                            vertical
                            gap={10}
                            style={{
                                borderTop: `1px solid ${token.colorSplit}`,
                                paddingTop: 12,
                            }}
                        >
                            <Flex align="center" justify="space-between">
                                <Text type="secondary">Total</Text>
                                <Title level={4} style={{ margin: 0 }}>
                                    {Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(total)}
                                </Title>
                            </Flex>

                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        if (items.length === 0) return;
                                        dispatch(clearCart());
                                        onClose();
                                        setShowAnim(true);
                                    }}                                
                                >
                                    Finalizar compra
                                </Button>
                            </Space>
                        </Flex>
                    </>
                )}
            </Drawer>
            <PurchaseAnimation
                open={showAnim}
                onClose={() => setShowAnim(false)}
                truckSrc="/truck.png"
                text="Produto(s) a caminho"
                duration={3}
            />
        </>
    );
}
