import { cn } from "@/lib/utils";


// we need to define an object that contains all the svg icons as react components, and then we can create a function that takes in the name of the icon and returns the corresponding component with the appropriate props 

type BrandAppleIconProps = {
  className?: string;
  size?: number;
  state?: "default" | "hover" | "active";
  color?: "default" | "primary" | "secondary";
};

const iconLibrary = {
  "users": {
    default: "currentColor",
    primary: "#4F46E5",
    secondary: "#6B7280",



  },
}



export function IconLibrary() {


}