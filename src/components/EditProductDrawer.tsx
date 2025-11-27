import { Drawer, Form, Input, Button, Space } from "antd";

interface EditProductDrawerProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    form: any;
}

export default function EditProductDrawer({
    open,
    onClose,
    onSave,
    form,
}: EditProductDrawerProps) {
    return (
        <Drawer
            title="Edit Product"
            open={open}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={onSave}>
                        Save
                    </Button>
                </Space>
            }
            width={480}
            maskClosable={false}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>

                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                        { required: true, type: "number", transform: (v) => toNumber(v) },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Drawer>
    );
}

function toNumber(v: any) {
    if (typeof v === "number") return v;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
}
