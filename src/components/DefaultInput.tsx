import "./DefaultInput.scss";

interface DefaultInputProps {
  placeholder: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function DefaultInput({
  placeholder,
  value,
  type,
  className,
  onChange,
}: DefaultInputProps) {
  return (
    <input
      type={type}
      className={className? "default-input " + className : "default-input"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
