import {
  ProductCreate,
  ProductEdit,
} from "@/components/buttoncontrol/button-component";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import ApiErrorPage from "@/components/api-error/api-error";
import { Textarea } from "@/components/ui/textarea";

const INITIAL_STATE = {
  product_name: "",
  product_rodtep_per: "",
  product_drawback_per: "",
  product_default_statement: "",
  product_status: "Active",
};

const ProductForm = React.memo(function ProductForm({ editId, onSuccess }) {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { pathname } = useLocation();

  const {
    trigger: fetchProduct,
    loading: loadingData,
    error,
  } = useApiMutation();
  const { trigger, loading } = useApiMutation();

  const fetchProductData = async () => {
    try {
      const res = await fetchProduct({
        url: PRODUCT_API.getById(editId),
      });

      setFormData({
        product_name: res?.data?.product_name || "",
        product_rodtep_per: res?.data?.product_rodtep_per || "",
        product_drawback_per: res?.data?.product_drawback_per || "",
        product_default_statement: res?.data?.product_default_statement || "",
        product_status: res?.data?.product_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load Product");
    }
  };

  useEffect(() => {
    if (open && isEdit) fetchProductData();
  }, [open, editId, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    if (value === "") {
      setFormData({ ...formData, [name]: "" });
      return;
    }

    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async () => {
    if (!formData.product_name) {
      toast.error("Product name is required");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? PRODUCT_API.updateById(editId) : PRODUCT_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 201 || res.code === 200) {
        toast.success(
          isEdit
            ? "Product updated successfully"
            : "Product created successfully"
        );
        setOpen(false);
        onSuccess?.();
        setFormData(INITIAL_STATE);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (error) return <ApiErrorPage onRetry={fetchProductData} />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loadingData && <LoadingBar />}

      <DialogTrigger asChild>
        {isEdit ? (
          <ProductEdit onClick={() => setOpen(true)} />
        ) : pathname === "/master/product" ? (
          <ProductCreate onClick={() => setOpen(true)} className="ml-2" />
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div>
            <Label>Product Name *</Label>
            <Input
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>RODTEP %</Label>
            <Input
              name="product_rodtep_per"
              value={formData.product_rodtep_per}
              onChange={handleNumberChange}
            />
          </div>

          <div>
            <Label>Drawback %</Label>
            <Input
              name="product_drawback_per"
              value={formData.product_drawback_per}
              onChange={handleNumberChange}
            />
          </div>

          <div>
            <Label>Default Statement</Label>
            <Textarea
              name="product_default_statement"
              value={formData.product_default_statement}
              onChange={handleChange}
            />
          </div>

          {isEdit && (
            <div>
              <Label>Default Statement</Label>
              <Select
                value={formData.product_status}
                onValueChange={(value) =>
                  setFormData((p) => ({ ...p, product_status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="Inactive">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default ProductForm;
