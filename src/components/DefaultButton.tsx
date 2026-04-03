import "./DefaultButton.scss";

interface DefaultButtonProps {
  text: string;
  onClick: () => void;
}

export default function DefaultButton({ text, onClick }: DefaultButtonProps) {
  return (
    <button className="default-button" onClick={onClick}>
      {text}
    </button>
  );
}
