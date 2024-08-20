import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex h-screen">
            {/* Left Navigation Panel */}
            <nav className="w-1/4 bg-white p-4">
                <ul className="space-y-4 mt-12">
                    <li>
                        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
                    </li>
                    <li>
                        <Link to="/tag-list" className="text-blue-600 hover:underline">Tags</Link>
                    </li>
                    <li>
                        <Link to="/settings" className="text-blue-600 hover:underline">Settings</Link>
                    </li>
                </ul>
            </nav>

            {/* Right Content Panel */}
            <main className="w-3/4 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
