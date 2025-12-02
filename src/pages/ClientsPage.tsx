import { useEffect, useMemo, useState } from "react";
import {
  App as AntApp,
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  Space,
  Table,
  Typography,
  Form,
  theme,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import HeaderBar from "../components/HeaderBar";
import { listUsers, type FakeStoreUser } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";

const { Title, Text } = Typography;

type Client = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  source: "api" | "local";
};

const LS_CLIENTS = "clientsExtra";

export default function ClientsPage() {
  const { message } = AntApp.useApp();
  const { user, isAdmin } = useAuth();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form] = Form.useForm<Client>();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const apiUsers: FakeStoreUser[] = await listUsers();
        const apiClients: Client[] = apiUsers.map((u) => ({
          id: u.id,
          firstName: u.name?.firstname ?? "",
          lastName: u.name?.lastname ?? "",
          email: u.email,
          username: u.username,
          phone: u.phone,
          source: "api",
        }));

        const raw = localStorage.getItem(LS_CLIENTS);
        const extras: Client[] = raw ? JSON.parse(raw) : [];

        setClients([...apiClients, ...extras]);
      } catch {
        message.error("Falha ao carregar clientes");
      } finally {
        setLoading(false);
      }
    })();
  }, [message]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter((c) =>
      [c.firstName, c.lastName, c.email, c.username]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [clients, q]);

  function persistExtras(next: Client[]) {
    const onlyLocal = next.filter((c) => c.source === "local");
    localStorage.setItem(LS_CLIENTS, JSON.stringify(onlyLocal));
  }

  const isCurrentUser = (rec: Client) =>
    user && rec.username === user.username;

  const canEdit = (rec: Client) =>
    isAdmin || rec.source === "local" || isCurrentUser(rec);

  const canDelete = (rec: Client) =>
    isAdmin || rec.source === "local";


  function openEdit(rec: Client) {
    setEditing(rec);
    form.setFieldsValue(rec);
    setOpen(true);
  }

  function handleDelete(rec: Client) {
    if (!canDelete(rec)) {
      message.warning("Você não tem permissão para excluir este cliente.");
      return;
    }
    const next = clients.filter((c) => c.id !== rec.id);
    setClients(next);
    persistExtras(next);
    message.success("Cliente removido.");
  }

  async function handleOk() {
    const values = await form.validateFields();

    if (editing) {
      const editingIsCurrent = isCurrentUser(editing);

      if (!isAdmin && !editingIsCurrent && editing.source !== "local") {
        message.warning(
          "Somente admin, o próprio usuário ou clientes locais podem ser editados."
        );
        setOpen(false);
        return;
      }

      const next = clients.map((c) =>
        c.id === editing.id ? { ...editing, ...values } : c
      );
      setClients(next);

      if (editingIsCurrent) {
        const updatedUser = { ...user, ...values };
        localStorage.setItem("authUser", JSON.stringify(updatedUser));
      }

      persistExtras(next);
      message.success("Cliente atualizado!");
    } else {
      const newClient: Client = {
        ...values,
        id: genLocalId(clients),
        source: "local",
      };
      const next = [newClient, ...clients];
      setClients(next);
      persistExtras(next);
      message.success("Cliente cadastrado com sucesso!");
    }

    setOpen(false);
  }

  return (
    <div style={{
      background: token.colorBgBase,
      color: token.colorText,
    }}>
      <HeaderBar />

      <Flex
        align="center"
        justify="space-between"
        wrap
        gap={12}
        style={{ margin: "16px 0 8px" }}
      >
        <Title level={3} style={{ margin: 0, color: token.colorText }}>
          Clients
        </Title>
      </Flex>

      <Input.Search
        placeholder="Search client (name, email, username)"
        allowClear
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          maxWidth: 480, margin: "8px 0 12px", 
          background: token.colorBgContainer,
          borderColor: token.colorBorder,
        }}
      />

      <Divider style={{ margin: "12px 0" }} />

      <Table<Client>
        loading={loading}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        columns={[
          {
            title: "Name",
            dataIndex: "firstName",
            render: (_, r) => `${r.firstName} ${r.lastName}`.trim(),
          },
          { title: "Username", dataIndex: "username" },
          { title: "Email", dataIndex: "email" },
          { title: "Phone", dataIndex: "phone" },
          {
            title: "Source",
            dataIndex: "source",
            width: 90,
            render: (v) => <Text type="secondary">{v}</Text>,
          },
          {
            title: "Actions",
            width: 160,
            render: (_, rec) => (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openEdit(rec)}
                  disabled={!canEdit(rec)}
                >
                  Edit
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(rec)}
                  disabled={!canDelete(rec)}
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={"Edit Client"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleOk}
        okText={editing ? "Save" : "Create"}
        maskClosable={false}
        keyboard={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="First name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

function genLocalId(items: Client[]) {
  const base = 1000;
  const max = items.reduce((acc, it) => (it.id > acc ? it.id : acc), base);
  return Math.max(base, max) + 1;
}
