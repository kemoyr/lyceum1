import type { Route } from "./+types/home";
import NavBar from "../navBar/navBar";
// import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="">
      <NavBar />
    </div>
  )
}
