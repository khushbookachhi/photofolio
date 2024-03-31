
// Importing the logo image from the static directory
import logo from '../../src/static/art-gallery.png';

// Defining a functional component called Navbar
export default function Navbar() {
  return (
    // Navbar container 
    <nav className="navbar bg-danger-subtle p-0">
      <div className="container-fluid">
        <a className="navbar-brand mx-3 h1 fs-3" href="/">
          {/* Image logo*/}
          <img src={logo} alt="PhotoFolio" width="50" height="50" />
        
          &nbsp;PhotoFolio
        </a>
      </div>
    </nav>
  );
}
