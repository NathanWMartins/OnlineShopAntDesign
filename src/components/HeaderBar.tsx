import React, { useEffect, useState } from "react";
import {
  Layout,
  Image,
  Input,
  Space,
  Typography,
  Button,
  Badge,
  Grid,
  Tooltip,
} from "antd";
import {
  BulbOutlined,
  LoginOutlined,
  LogoutOutlined,
  MoonOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "../store";
import {
  loadCartForCurrentUser,
  replaceAll,
  selectCartCount,
} from "../store/cart/cartSlice";
import CartDrawer from "./CartDrawer";
import { useThemeContext } from "../contexts/ThemeContext";

const { Header } = Layout;
const { Text } = Typography;

export default function HeaderBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, login, loginAsAdmin, logout, isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const { mode, toggleTheme } = useThemeContext();
  const cartCount = useAppSelector(selectCartCount);

  const screens = Grid.useBreakpoint();
  const isDesktop = screens.lg; // 👈 breakpoint: se não for lg, usamos ícones

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("q") || "");
  }, [location]);

  const TOKENS = {
    height: 64,
    containerMax: 1200,
    gap: 16,
    searchWidth: 520,
    logoSize: 70,
    bg: "#eaf6ff",
    border: "#b7d7ef",
    text: "#6b7280",
  } as const;

  const clickableStyle: React.CSSProperties = {
    cursor: "pointer",
    fontSize: 16,
    color: "#111827",
    transition: "color 0.2s",
    whiteSpace: "nowrap",
  };

  const searchWidth = isDesktop ? TOKENS.searchWidth : 260;

  return (
    <>
      <Header
        style={{
          backgroundColor: TOKENS.bg,
          height: TOKENS.height,
          lineHeight: `${TOKENS.height}px`,
          padding: 0,
          margin: 0,
          borderBottom: `1px solid ${TOKENS.border}`,
        }}
      >
        <div
          style={{
            maxWidth: TOKENS.containerMax,
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: TOKENS.gap,
            height: "100%",
          }}
        >
          {/* ESQUERDA: logo + navegação */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: TOKENS.gap,
              height: "100%",
            }}
          >
            <Image
              src="/logo.png"
              alt="Online Shop"
              preview={false}
              width={TOKENS.logoSize}
              height={TOKENS.logoSize}
              style={{ objectFit: "contain", cursor: "pointer" }}
              onClick={() => navigate("/")}
            />

            {isDesktop ? (
              <>
                <Text
                  style={clickableStyle}
                  onClick={() => navigate("/")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#111827")
                  }
                >
                  Home
                </Text>
                <Text
                  style={clickableStyle}
                  onClick={() => navigate("/products")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#111827")
                  }
                >
                  Products
                </Text>
                {user && (
                  <Text
                    style={clickableStyle}
                    onClick={() => navigate("/clients")}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#2563eb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#111827")
                    }
                  >
                    Clients
                  </Text>
                )}
              </>
            ) : (
              <>
                <Tooltip title="Home">
                  <Button
                    type="text"
                    icon={<HomeOutlined />}
                    style={{color: '#2e2e2eff'}}
                    onClick={() => navigate("/")}
                  />
                </Tooltip>
                <Tooltip title="Products">
                  <Button
                    type="text"
                    icon={<AppstoreOutlined />}
                    style={{color: '#2e2e2eff'}}
                    onClick={() => navigate("/products")}
                  />
                </Tooltip>
                {user && (
                  <Tooltip title="Clients">
                    <Button
                      type="text"
                      icon={<TeamOutlined />}
                      style={{color: '#2e2e2eff'}}
                      onClick={() => navigate("/clients")}
                    />
                  </Tooltip>
                )}
              </>
            )}
          </div>

          {/* CENTRO: busca */}
          <div
            style={{
              flex: "0 1 auto",
              display: "flex",
              alignItems: "center",
              width: searchWidth,
            }}
          >
            <Input.Search
              placeholder="Search"
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={(value) => {
                const q = value.trim();
                navigate(
                  `/products${q ? `?q=${encodeURIComponent(q)}` : ""}`
                );
              }}
              style={{ width: "100%", background: "white" }}
            />
          </div>

          {/* DIREITA: login/logout, cart, tema */}
          <Space size={TOKENS.gap} align="center">
            {user ? (
              <>
                {isDesktop && (
                  <Text style={{ color: TOKENS.text }}>
                    {user.firstName} {user.lastName}
                    {isAdmin ? " (Admin)" : ""}
                  </Text>
                )}

                <Tooltip title="Logout">
                  <Space
                    size={6}
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      await logout();
                      dispatch(replaceAll([]));
                      localStorage.setItem("cartItems:guest", "[]");
                    }}
                  >
                    <LogoutOutlined style={{ color: TOKENS.text }} />
                    {isDesktop && (
                      <Text style={{ color: TOKENS.text }}>Logout</Text>
                    )}
                  </Space>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Login aleatório">
                  <Space
                    size={6}
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      await login();
                      dispatch(replaceAll(loadCartForCurrentUser()));
                    }}
                  >
                    <LoginOutlined style={{ color: TOKENS.text }} />
                    {isDesktop && (
                      <Text style={{ color: TOKENS.text }}>Login</Text>
                    )}
                  </Space>
                </Tooltip>

                <Tooltip title="Login Admin">
                  <Button
                    size={isDesktop ? "middle" : "small"}
                    onClick={async () => {
                      await loginAsAdmin();
                      dispatch(replaceAll(loadCartForCurrentUser()));
                    }}
                  >
                    {isDesktop ? "Login Admin" : "Admin"}
                  </Button>
                </Tooltip>
              </>
            )}

            <Tooltip title="Carrinho">
              <Space
                size={6}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCartOpen(true);
                }}
              >
                <Badge count={cartCount} size="small" offset={[0, 4]}>
                  <ShoppingCartOutlined
                    style={{ color: TOKENS.text, fontSize: 18 }}
                  />
                </Badge>
                {isDesktop && (
                  <Text style={{ color: TOKENS.text }}>Cart</Text>
                )}
              </Space>
            </Tooltip>

            <Tooltip
              title={
                mode === "light" ? "Ativar modo escuro" : "Ativar modo claro"
              }
            >
              <Button
                type="text"
                icon={mode === "light" ? <MoonOutlined /> : <BulbOutlined />}
                onClick={toggleTheme}
                style={{
                  fontSize: 18,
                  color: TOKENS.text,
                }}
              />
            </Tooltip>
          </Space>
        </div>
      </Header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
