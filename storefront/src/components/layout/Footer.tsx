import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-lg font-bold text-slate-900">AtlasCommerce</span>
            <p className="text-sm text-gray-500 mt-1">Modern mikroservis e-ticaret platformu</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/products" className="hover:text-slate-900">
              Ürünler
            </Link>
            <Link to="/orders" className="hover:text-slate-900">
              Siparişlerim
            </Link>
            <Link to="/profile" className="hover:text-slate-900">
              Profil
            </Link>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} AtlasCommerce</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
