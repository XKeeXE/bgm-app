interface SeparatorProps {
  className?: string;
  orientation: "horizontal" | "vertical";
}

const Separator = ({ className = "", orientation }: SeparatorProps) => {
  return (
    <div
      className={`bg-gray-200 dark:bg-[#333333] self-center ${className} ${
        orientation === "vertical" ? "h-px w-[90%] my-1" : "w-px h-6 mx-1"
      }`}
    />
  );
};

export default Separator;
