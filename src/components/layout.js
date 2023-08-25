import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <div className="flex flex-row">
      <Navbar />
      <main className="flex flex-1 px-10 py-8 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
