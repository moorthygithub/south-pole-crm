// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const SelectField = ({
//   label,
//   value,
//   onChange,
//   options,
//   optionKey,
//   optionLabel,
//   error,
//   required,
//   disabled,
//   className,
// }) => (
//   <div>
//     <Label>
//       {label} {required ? "*" : ""}
//     </Label>
//     <Select
//       value={value}
//       onValueChange={onChange}
//       disabled={disabled} // ✅ IMPORTANT
//     >
//       <SelectTrigger
//         className={`
//           ${className || ""}
//           ${disabled ? "bg-muted cursor-not-allowed" : ""}
//         `}
//       >
//         <SelectValue placeholder={`Select ${label ? label : "Value"}`} />
//       </SelectTrigger>
//       <SelectContent>
//         {options?.map((o) => (
//           <SelectItem key={o[optionKey]} value={String(o[optionKey])}>
//             {o[optionLabel]}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//     {error && <p className="text-xs text-red-500">{error}</p>}
//   </div>
// );

// export default SelectField;
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  optionKey = "value",
  optionLabel = "label",
  error,
  required,
  disabled,
  className,
}) => {
  // ✅ ALWAYS convert value to string (shadcn requirement)
  const stringValue =
    value !== undefined && value !== null && value !== ""
      ? String(value)
      : undefined;

  return (
    <div className="space-y-1">
      {label && (
        <Label>
          {label} {required && <span>*</span>}
        </Label>
      )}

      <Select
        value={stringValue}
        onValueChange={onChange} // returns string
        disabled={disabled}
      >
        <SelectTrigger
          className={`${className || ""} ${
            disabled ? "bg-muted cursor-not-allowed" : ""
          }`}
        >
          <SelectValue placeholder={`Select ${label ?? "Value"}`} />
        </SelectTrigger>

        <SelectContent>
          {options.map((o) => (
            <SelectItem
              key={String(o[optionKey])}
              value={String(o[optionKey])} // ✅ STRING
            >
              {o[optionLabel]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
