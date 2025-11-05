import HoverDropdown from "../chat/components/HoverDropdown";

export default function HoverDropdownSection() {
  return (
    <div className="h-64 w-full">
      <HoverDropdown triggerContent={<div>Hover Me</div>}>
        <a href="">link</a>
        <div>Option 1</div>
        <div>Option 2</div>
        <div>Option 3</div>
      </HoverDropdown>
    </div>
  );
}
