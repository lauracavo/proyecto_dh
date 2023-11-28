import { Link } from 'react-router-dom';
import logo from '../assets/images/luminis.png'

function Sidebar() {

    const linkColor = {
        color: "white",
        textDecoration: "none"
    }

    return (
        <>
            {/* Sidebar */}
            <ul
                className="navbar-nav bg-gradient-secondary sidebar sidebar-dark accordion"
                id="accordionSidebar"
            >
                {/* Sidebar - Brand */}
                {/* <a
                        className="sidebar-brand d-flex align-items-center justify-content-center"
                        href="/"
                    > </a>*/}
                <Link to='/'>
                    <div className="sidebar-brand-icon">
                        <img
                            className="w-100"
                            src={logo}
                            alt="LUMINIS"
                        />
                    </div>
                </Link>


                {/* Divider */}
                <hr className="sidebar-divider my-0" />
                {/* Nav Item - Dashboard */}
                <li className="nav-item active">
                    {/* <a className="nav-link" href="/">
                        <i className="fas fa-fw fa-tachometer-alt" />
                        <span>Dashboard - DH movies</span>
                    </a> */}
                    <Link to='/'style={linkColor}>
                        <i className="fas fa-fw fa-tachometer-alt"/>
                        <span >LUMINIS</span>
                    </Link>
                </li>
                {/* Divider */}
                <hr className="sidebar-divider" />
                {/* Heading */}
                <div className="sidebar-heading">Actions</div>
                {/* Nav Item - Pages */}
                <li className="nav-item">
                    <Link to='/pages' style={linkColor}>
                        <i className="fas fa-fw fa-folder"/>
                        <span >Pages</span>
                    </Link>
                    {/* <a className="nav-link collapsed" href="/pages">
                        <i className="fas fa-fw fa-folder" />
                        <span>Pages</span>
                    </a> */}
                </li>
                {/* Nav Item - Charts */}
                <li className="nav-item">
                    {/* <a className="nav-link" href="/charts">
                        <i className="fas fa-fw fa-chart-area" />
                        <span>Charts</span>
                    </a> */}
                    <Link to='/charts/23'style={linkColor}>
                        <i className="fas fa-fw fa-chart-area"/>
                        <span>Charts</span>
                    </Link>
                </li>
                {/* Nav Item - Tables */}
                <li className="nav-item">
                    {/* <a className="nav-link" href="/tables">
                        <i className="fas fa-fw fa-table" />
                        <span>Tables</span>
                    </a> */}
                    <Link to='tables'style={linkColor}>
                        <i className="fas fa-fw fa-table"/>
                        <span>Tables</span>
                    </Link>
                </li>
                {/* Divider */}
                <hr className="sidebar-divider d-none d-md-block" />
            </ul>
            {/* End of Sidebar */}
        </>
    )
}

export default Sidebar;