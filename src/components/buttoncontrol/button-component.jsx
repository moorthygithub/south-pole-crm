import { Button } from "@/components/ui/button";
import {
  Edit,
  Eye,
  FilePlus2,
  Printer,
  Receipt,
  SquarePlus,
} from "lucide-react";
import { forwardRef } from "react";
import { useSelector } from "react-redux";
import { checkPermission } from "./permisssion";

export const BuyerCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "BuyerCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Buyer
    </Button>
  );
});

BuyerCreate.page = "Buyer";

export const EditBuyer = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "EditBuyer", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      className={className}
      ref={ref}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});
EditBuyer.page = "Buyer";
//////// MASTER – Bag Type
export const BagTypeCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "BagTypeCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Bag Type
    </Button>
  );
});

BagTypeCreate.page = "Bag Type";
export const BagTypeEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "BagTypeEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      className={className}
      ref={ref}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

BagTypeEdit.page = "Bag Type";
/////// MASTER – Bank Create
export const BankCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "BankCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Bank
    </Button>
  );
});

BankCreate.page = "Bank";

/////// MASTER – Bank Edit
export const BankEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "BankEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

BankEdit.page = "Bank";
/////// MASTER – Container Size
export const ContainerSizeCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (
    !checkPermission(String(userId), "ContainerSizeCreate", buttonPermissions)
  ) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Container Size
    </Button>
  );
});

ContainerSizeCreate.page = "Container Size";

/////// MASTER – Container Size
export const ContainerSizeEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (
    !checkPermission(String(userId), "ContainerSizeEdit", buttonPermissions)
  ) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

ContainerSizeEdit.page = "Container Size";
/////// MASTER – Country Create
export const CountryCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "CountryCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Country
    </Button>
  );
});

CountryCreate.page = "Country";

/////// MASTER – Container Size
export const CountryEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "CountryEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

CountryEdit.page = "Country";
/////// MASTER – GR Code
export const GRCodeCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "GRCodeCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Gr Code
    </Button>
  );
});

GRCodeCreate.page = "Gr Code";

/////// MASTER – Gr Code
export const GRCodeEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "GRCodeEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

GRCodeEdit.page = "Gr Code";
/////// MASTER – Marking
export const MarkingCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "MarkingCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Marking
    </Button>
  );
});

MarkingCreate.page = "Marking";

/////// MASTER – Marking
export const MarkingEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "MarkingEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

MarkingEdit.page = "Marking";
/////// MASTER – Order Type
export const OrderTypeCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "OrderTypeCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Order Type
    </Button>
  );
});

OrderTypeCreate.page = "Order Type";

/////// MASTER – Order Type
export const OrderTypeEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "OrderTypeEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

OrderTypeEdit.page = "Order Type";
/////// MASTER – Payment Term
export const PaymentTermCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (
    !checkPermission(String(userId), "PaymentTermCreate", buttonPermissions)
  ) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Payment Term
    </Button>
  );
});

PaymentTermCreate.page = "Payment Term";

/////// MASTER – Payment Term
export const PaymentTermEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "PaymentTermEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

PaymentTermEdit.page = "Payment Term";
/////// MASTER – Port of Loading
export const PortofLoadingCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (
    !checkPermission(String(userId), "PortofLoadingCreate", buttonPermissions)
  ) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Port of Loading
    </Button>
  );
});

PortofLoadingCreate.page = "Port of Loading";

/////// MASTER – PortofLoading
export const PortofLoadingEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (
    !checkPermission(String(userId), "PortofLoadingEdit", buttonPermissions)
  ) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

PortofLoadingEdit.page = "Port of Loading";
/////// MASTER – Port of Loading
export const PreRecepitCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "PreRecepitCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Pre Recepit
    </Button>
  );
});

PreRecepitCreate.page = "Pre Recepit";

/////// MASTER – PortofLoading
export const PreRecepitEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "PreRecepitEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

PreRecepitEdit.page = "Pre Recepit";

/////// MASTER – Product
export const ProductCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "ProductCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Product
    </Button>
  );
});

ProductCreate.page = "Product";

/////// MASTER – Product
export const ProductEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "ProductEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

ProductEdit.page = "Product";
/////// MASTER – Scheme
export const SchemeCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "SchemeCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Scheme
    </Button>
  );
});

SchemeCreate.page = "Scheme";

/////// MASTER – Scheme
export const SchemeEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "SchemeEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

SchemeEdit.page = "Scheme";
/////// MASTER – Shipper
export const ShipperCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "ShipperCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Shipper
    </Button>
  );
});

ShipperCreate.page = "Shipper";

/////// MASTER – Shipper
export const ShipperEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "ShipperEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

ShipperEdit.page = "Shipper";
/////// MASTER – Vessel
export const VesselCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "VesselCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Vessel
    </Button>
  );
});

VesselCreate.page = "Vessel";

/////// MASTER – Vessel
export const VesselEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "VesselEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

VesselEdit.page = "Vessel";
/////// MASTER – State
export const StateCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "StateCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      State
    </Button>
  );
});

StateCreate.page = "State";

/////// MASTER – State
export const StateEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "StateEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

StateEdit.page = "State";
/////// MASTER – Branch
export const BranchCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "BranchCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Branch
    </Button>
  );
});

BranchCreate.page = "Branch";

/////// MASTER – Branch Edit
export const BranchEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "BranchEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

BranchEdit.page = "Branch";
/////// MASTER – Item
export const ItemCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "ItemCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Item
    </Button>
  );
});

ItemCreate.page = "Item";

/////// MASTER – Item Edit
export const ItemEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "ItemEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

ItemEdit.page = "Item";
/////// MASTER – PrecarriageCreate
export const PrecarriageCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (
    !checkPermission(String(userId), "PrecarriageCreate", buttonPermissions)
  ) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Pre Carriage
    </Button>
  );
});

PrecarriageCreate.page = "Pre Carriage";

/////// MASTER – Item Edit
export const PrecarriageEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "PrecarriageEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

PrecarriageEdit.page = "Pre Carriage";
/////// MASTER – Vendor
export const VendorCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "VendorCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Vendor
    </Button>
  );
});

VendorCreate.page = "Vendor";

/////// MASTER – Vendor
export const VendorEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "VendorEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

VendorEdit.page = "Vendor";
/////// MASTER – PurchaseCreate
export const PurchaseCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "PurchaseCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Purchase
    </Button>
  );
});

PurchaseCreate.page = "Purchase";

/////// MASTER – Vendor
export const PurchaseEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "PurchaseEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

PurchaseEdit.page = "Purchase";
/////// MASTER – ContractCreate
export const ContractCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "ContractCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Contract
    </Button>
  );
});

ContractCreate.page = "Contract";

/////// MASTER – Contract
export const ContractEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "ContractEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

ContractEdit.page = "Contract";
/////// MASTER – CostSheetView
export const CostSheetView = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "CostSheetView", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Receipt className="h-4 w-4 text-black" />
    </Button>
  );
});

CostSheetView.page = "Contract";
/////// MASTER – ContractExport
export const ContractExport = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "ContractExport", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
      title="Contact View"
    >
      <Printer className="h-4 w-4 text-black" />
    </Button>
  );
});

ContractExport.page = "Contract";
/////// MASTER – InvoiceCreate
export const InvoiceCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "InvoiceCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Invoice
    </Button>
  );
});

InvoiceCreate.page = "Invoice";

/////// MASTER – Invoice
export const InvoiceEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "InvoiceEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
      title="Edit Invoice"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

InvoiceEdit.page = "Invoice";
/////// MASTER – Invoice
export const InvoiceDocument = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "InvoiceDocument", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
      title="Update Document"
    >
      <FilePlus2 className="h-4 w-4 text-black" />
    </Button>
  );
});

InvoiceDocument.page = "Invoice";
/////// MASTER – InvoicePackingCreate
export const InvoicePackingCreate = forwardRef(
  ({ onClick, className }, ref) => {
    const userId = useSelector((state) => state.auth.user?.id);
    const buttonPermissions = useSelector(
      (state) => state.permissions.buttonPermissions
    );

    if (
      !checkPermission(
        String(userId),
        "InvoicePackingCreate",
        buttonPermissions
      )
    ) {
      return null;
    }

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={className}
        onClick={onClick}
        title="Create Invoice Packing "
      >
        <SquarePlus className="h-4 w-4" />
      </Button>
    );
  }
);
InvoicePackingCreate.page = "Invoice";

/////// MASTER – InvoicePackingEdit
export const InvoicePackingEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (
    !checkPermission(String(userId), "InvoicePackingEdit", buttonPermissions)
  ) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
      title="Edit Invoice Packing "
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

InvoicePackingEdit.page = "Invoice";
/////// MASTER – InvoiceExport
export const InvoiceExport = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "InvoiceExport", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
      title="Invoice View"
    >
      <Printer className="h-4 w-4 text-black" />
    </Button>
  );
});

InvoiceExport.page = "Invoice";
/////// MASTER – InvoicePacking
export const InvoicePacking = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "InvoicePacking", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
      title="Packing Invoice"
    >
      <Eye className="h-4 w-4 text-black" />
    </Button>
  );
});

InvoicePacking.page = "Invoice";
/////// MASTER – CartonBox
export const CartonBoxCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "CartonBoxCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      CartonBox
    </Button>
  );
});

CartonBoxCreate.page = "CartonBox";

/////// MASTER – CartonBoxEdit
export const CartonBoxEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "CartonBoxEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

CartonBoxEdit.page = "CartonBox";
/////// MASTER – ProductDescription
export const ProductDescriptionCreate = forwardRef(
  ({ onClick, className }, ref) => {
    const userId = useSelector((state) => state.auth.user?.id);
    const buttonPermissions = useSelector(
      (state) => state.permissions.buttonPermissions
    );

    if (
      !checkPermission(
        String(userId),
        "ProductDescriptionCreate",
        buttonPermissions
      )
    ) {
      return null;
    }

    return (
      <Button
        ref={ref}
        variant="default"
        className={className}
        onClick={onClick}
      >
        <SquarePlus className="h-4 w-4 mr-2" />
        Product Description
      </Button>
    );
  }
);

ProductDescriptionCreate.page = "Product Description";

/////// MASTER – ProductDescriptionEdit
export const ProductDescriptionEdit = forwardRef(
  ({ onClick, className }, ref) => {
    const userId = useSelector((state) => state.auth.user?.id);
    const buttonPermissions = useSelector(
      (state) => state.permissions.buttonPermissions
    );

    if (
      !checkPermission(
        String(userId),
        "ProductDescriptionEdit",
        buttonPermissions
      )
    ) {
      return null;
    }

    return (
      <Button
        ref={ref}
        onClick={onClick}
        className={className}
        variant="ghost"
        size="icon"
      >
        <Edit className="h-4 w-4 text-black" />
      </Button>
    );
  }
);

ProductDescriptionEdit.page = "Product Description";
/////// MASTER –Payment
export const PaymentCreate = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "PaymentCreate", buttonPermissions)) {
    return null;
  }

  return (
    <Button ref={ref} variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4 mr-2" />
      Payment
    </Button>
  );
});

PaymentCreate.page = "Payment List";

/////// MASTER – PaymentEdit
export const PaymentEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "PaymentEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

PaymentEdit.page = "Payment List";
/////// MASTER – DutyDrawbackEdit
export const DutyDrawbackEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.user?.id);
  const buttonPermissions = useSelector(
    (state) => state.permissions.buttonPermissions
  );

  if (!checkPermission(String(userId), "DutyDrawbackEdit", buttonPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

DutyDrawbackEdit.page = "Duty Drawback";
export default {
  BuyerCreate,
  EditBuyer,
  BagTypeCreate,
  BagTypeEdit,
  BankCreate,
  BankEdit,
  ContainerSizeCreate,
  ContainerSizeEdit,
  CountryCreate,
  CountryEdit,
  GRCodeCreate,
  GRCodeEdit,
  MarkingCreate,
  MarkingEdit,
  OrderTypeCreate,
  OrderTypeEdit,
  PaymentTermCreate,
  PaymentTermEdit,
  PortofLoadingCreate,
  PortofLoadingEdit,
  PreRecepitCreate,
  PreRecepitEdit,
  ProductCreate,
  ProductEdit,
  SchemeCreate,
  SchemeEdit,
  ShipperCreate,
  ShipperEdit,
  VesselCreate,
  VesselEdit,
  StateCreate,
  StateEdit,
  BranchCreate,
  BranchEdit,
  ItemCreate,
  ItemEdit,
  PrecarriageCreate,
  PrecarriageEdit,
  VendorCreate,
  VendorEdit,
  PurchaseCreate,
  PurchaseEdit,
  ContractCreate,
  ContractEdit,
  CostSheetView,
  ContractExport,
  InvoiceCreate,
  InvoiceEdit,
  InvoiceDocument,
  InvoicePackingCreate,
  InvoicePackingEdit,
  InvoiceExport,
  InvoicePacking,
  CartonBoxCreate,
  CartonBoxEdit,
  ProductDescriptionCreate,
  ProductDescriptionEdit,
  PaymentCreate,
  PaymentEdit,
  DutyDrawbackEdit,
};
