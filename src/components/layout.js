import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-row">
      <Navbar />
      <main className="flex flex-1 mx-10 my-8">{children}</main>
    </div>
  );
}
