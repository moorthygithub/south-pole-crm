"use client";

import ApiErrorPage from "@/components/api-error/api-error";
import {
  ProductDescriptionCreate,
  ProductDescriptionEdit,
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
import { PRODUCTDESCRIPTION_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const INITIAL_STATE = {
  product_name: "",
  product_description: "",
  product_hsn: "",
  product_status: "Active",
};

const ProductDescriptionForm = React.memo(function ProductForm({ editId }) {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const {
    trigger: fetchProduct,
    loading: loadingData,
    error,
  } = useApiMutation();
  const { trigger, loading } = useApiMutation();

  useEffect(() => {
    if (!open || !isEdit) return;

    const fetchData = async () => {
      try {
        const res = await fetchProduct({
          url: PRODUCTDESCRIPTION_API.getById(editId),
        });
        setFormData({
          product_name: res?.data?.product_name || "",
          product_description: res?.data?.product_description || "",
          product_hsn: res?.data?.product_hsn || "",
          product_status: res?.data?.product_status || "Active",
        });
      } catch (err) {
        toast.error(err?.message || "Failed to load product");
      }
    };

    fetchData();
  }, [open, editId, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.product_name || !formData.product_hsn) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit
          ? PRODUCTDESCRIPTION_API.updateById(editId)
          : PRODUCTDESCRIPTION_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      if (res.code === 201) {
        toast.success(
          res.message ??
            (isEdit
              ? "Product updated successfully"
              : "Product created successfully")
        );
        setOpen(false);
        queryClient.invalidateQueries(["product-description-list"]);
        setFormData(INITIAL_STATE);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (error)
    return (
      <ApiErrorPage
        onRetry={() =>
          fetchProduct({ url: PRODUCTDESCRIPTION_API.getById(editId) })
        }
      />
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loadingData && <LoadingBar />}
      <DialogTrigger asChild>
        {isEdit ? (
          <ProductDescriptionEdit onClick={() => setOpen(true)} />
        ) : pathname === "/master/product-description" ? (
          <ProductDescriptionCreate
            onClick={() => setOpen(true)}
            className="ml-2"
          />
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="product_name">Product Name *</Label>
            <Input
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="Enter Product Name"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="product_hsn">HSN Code *</Label>
            <Input
              id="product_hsn"
              name="product_hsn"
              value={formData.product_hsn}
              onChange={handleChange}
              placeholder="Enter HSN Code"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="product_description">Description</Label>
            <Input
              id="product_description"
              name="product_description"
              value={formData.product_description}
              onChange={handleChange}
              placeholder="Enter Description"
            />
          </div>
          {isEdit && (
            <>
              <Label htmlFor="product_status">Status</Label>

              <Select
                value={formData.product_status || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, product_status: value }))
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
            </>
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

export default ProductDescriptionForm;
