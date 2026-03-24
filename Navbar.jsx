function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">FitNexa</div>
      <ul className="flex gap-6 text-sm">
        <li><a href="#features" className="hover:text-pink-400">Features</a></li>
        <li><a href="#pricing" className="hover:text-pink-400">Pricing</a></li>
        <li><a href="#contact" className="hover:text-pink-400">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
