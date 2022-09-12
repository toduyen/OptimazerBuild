// Authentication layout components
import BasicLayout from "layouts/base/authentication/components/BasicLayout";

// Images
// @ts-ignore
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <BasicLayout>
      <div className="not-found">
        <img
          src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
          alt="not-found"
        />
        <Link to="/" className="link-home">
          Go Home
        </Link>
      </div>
    </BasicLayout>
  );
}

export default NotFound;
