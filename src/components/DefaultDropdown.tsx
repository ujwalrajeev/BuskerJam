import "./DefaultDropdown.scss";

interface DefaultDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function DefaultDropdown({
  options,
  value,
  onChange,
}: DefaultDropdownProps) {
  return (
    <select
      className="default-dropdown"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
