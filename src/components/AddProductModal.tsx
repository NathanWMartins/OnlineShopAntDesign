import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, App, theme } from "antd";
import type { Product } from "../services/fakestore"; 

const LS_KEY = "productsExtra";

type Props = {
  open: boolean;
  onCancel: () => void;
  onSaved: (p: Product) => void;
};

export default function AddProductModal({ open, onCancel, onSaved }: Props) {
  const [form] = Form.useForm<Product>();
  const { message } = App.useApp();
  const { token } = theme.useToken();

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  function nextId(): number {
    const raw = localStorage.getItem(LS_KEY);
    const arr: Product[] = raw ? JSON.parse(raw) : [];
    const max = arr.reduce((m, p) => (p.id > m ? p.id : m), 10_000);
    return max + 1;
  }

  async function handleOk() {
    const values = await form.validateFields();
    const newProduct: Product = {
      id: nextId(),
      title: values.title,
      price: Number(values.price),
      category: values.category || "new",
      image: values.image,
      description: values.description || "",
    };

    const raw = localStorage.getItem(LS_KEY);
    const arr: Product[] = raw ? JSON.parse(raw) : [];
    arr.unshift(newProduct);
    localStorage.setItem(LS_KEY, JSON.stringify(arr));

    message.success("Produto cadastrado com sucesso!");
    onSaved(newProduct);
  }

  return (
    <Modal
      title="Cadastrar produto"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Salvar"
      cancelText="Cancelar"
      maskClosable={false}
      keyboard={false}
      styles={{
        header: { borderBottom: `1px solid ${token.colorSplit}` },
        footer: { borderTop: `1px solid ${token.colorSplit}` },
      }}
    >
      <Form<Product> form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label="Nome"
          name="title"
          rules={[{ required: true, message: "Informe o nome do produto" }]}
        >
          <Input placeholder="Ex.: Awesome Headphones" />
        </Form.Item>

        <Form.Item
          label="Preço"
          name="price"
          rules={[{ required: true, message: "Informe o preço" }]}
        >
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Categoria"
          name="category"
          rules={[{ required: true, message: "Informe a categoria" }]}
        >
          <Input placeholder="Categoria" />
        </Form.Item>

        <Form.Item
          label="Imagem (URL)"
          name="image"
          rules={[{ required: true, message: "Informe a URL da imagem" }]}
        >
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item label="Descrição" name="description">
          <Input.TextArea rows={3} placeholder="Descrição (opcional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
