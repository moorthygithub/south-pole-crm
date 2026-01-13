import ApiErrorPage from "@/components/api-error/api-error";
import {
  BuyerCreate,
  EditBuyer,
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
import { Textarea } from "@/components/ui/textarea";
import { BUYER_LIST } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import useMasterQueries from "@/hooks/useMasterQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const INITIAL_STATE = {
  buyer_sort: "",
  buyer_group: "",
  buyer_name: "",
  buyer_address: "",
  buyer_port: "",
  buyer_country: "",
  buyer_ecgc_ref: "",
  buyer_status: "Active",
};

const BuyerForm = ({ editId = null }) => {
  const isEdit = Boolean(editId);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { trigger: UpdateBuyer, loading: buyerloading } = useApiMutation();
  const { pathname } = useLocation();
  const { trigger: fetchBuyer, loadingbuyer, error } = useApiMutation();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const { countryPort, country } = useMasterQueries(
    ["countryPort", "country"],
    open
  );

  const {
    data: portsData,
    loading: loadingPort,
    error: errorPort,
    refetch: refetchPort,
  } = countryPort;

  const {
    data: countryData,
    loading: loadingCountry,
    error: errorCountry,
    refetch: refetchCountry,
  } = country;

  const fetchData = async () => {
    try {
      const res = await fetchBuyer({ url: BUYER_LIST.getById(editId) });
      const editData = res.data;

      setFormData({
        buyer_sort: editData.buyer_sort || "",
        buyer_group: editData.buyer_group || "",
        buyer_name: editData.buyer_name || "",
        buyer_address: editData.buyer_address || "",
        buyer_port: editData.buyer_port || "",
        buyer_country: editData.buyer_country || "",
        buyer_ecgc_ref: editData.buyer_ecgc_ref || "",
        buyer_status: editData.buyer_status || "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load data");
    }
  };
  useEffect(() => {
    if (!open || !editId) return;
    fetchData();
  }, [open, editId]);
  const handleChange = (e, key, value) => {
    if (e?.target) {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };
  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      buyer_status: value,
    }));
  };
  const handleCountryChange = (selectedCountry) => {
    setFormData((prev) => ({
      ...prev,
      buyer_country: selectedCountry,
    }));
    console.log(selectedCountry, "selectedCountry");
    const matched = portsData?.data?.find(
      (item) => item.country_port == selectedCountry.country_port
    );

    if (matched) {
      setFormData((prev) => ({
        ...prev,
        buyer_port: matched.country_port,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        buyer_port: "",
      }));
    }
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "buyer_sort",
      "buyer_name",
      "buyer_address",
      "buyer_port",
      "buyer_country",
    ];

    const hasEmpty = requiredFields.some((f) => !formData[f]);
    if (hasEmpty) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await UpdateBuyer({
        url: isEdit ? BUYER_LIST.updateById(editId) : BUYER_LIST.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });
      if (res.code == 201) {
        toast.success(
          res.message || isEdit
            ? "Buyer updated successfully"
            : "Buyer created successfully"
        );
        await queryClient.invalidateQueries(["buyer-list"]);
        setOpen(false);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };
  const hasError = error || errorPort || errorCountry;

  const isLoading = loadingbuyer || loadingPort || loadingCountry;

  if (hasError) {
    return (
      <ApiErrorPage
        onRetry={() => {
          if (error) fetchData();
          if (errorPort) refetchPort();
          if (errorCountry) refetchCountry();
        }}
      />
    );
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isLoading && <LoadingBar />}
      <DialogTrigger asChild>
        {isEdit ? (
          <EditBuyer onClick={() => setOpen(true)} />
        ) : pathname === "/master/buyer" ? (
          <BuyerCreate onClick={() => setOpen(true)} className="ml-2" />
        ) : null}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Buyer" : "Create Buyer"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label>Name *</Label>
            <Input
              name="buyer_name"
              value={formData.buyer_name}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Short Name *</Label>
              <Input
                name="buyer_sort"
                value={formData.buyer_sort}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Group</Label>
              <Input
                name="buyer_group"
                value={formData.buyer_group}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Address *</Label>
            <Textarea
              name="buyer_address"
              rows={3}
              value={formData.buyer_address}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Country *</Label>
              <Select
                value={formData.buyer_country}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countryData?.data?.map((c, i) => (
                    <SelectItem key={i} value={c.country_name}>
                      {c.country_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Port *</Label>
              <Select
                value={formData.buyer_port}
                onValueChange={(v) => handleChange(null, "buyer_port", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select port" />
                </SelectTrigger>
                <SelectContent>
                  {portsData?.data?.map((p, i) => (
                    <SelectItem key={i} value={p.country_port}>
                      {p.country_port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className={isEdit ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
            <div>
              <Label>ECGC Ref</Label>
              <Input
                name="buyer_ecgc_ref"
                value={formData.buyer_ecgc_ref}
                onChange={handleChange}
              />
            </div>
            {isEdit && (
              <div className="grid gap-2">
                <Label htmlFor="buyer_status">Status</Label>
                <Select
                  value={formData.buyer_status}
                  onValueChange={handleStatusChange}
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
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={buyerloading}>
            {buyerloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Update Buyer"
            ) : (
              "Create Buyer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyerForm;
