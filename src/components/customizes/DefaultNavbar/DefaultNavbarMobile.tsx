// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Menu from "@mui/material/Menu";

// Material Dashboard 2 React components
import MDBox from "components/bases/MDBox";

// Material Dashboard 2 React example components
import DefaultNavbarLink from "components/customizes/DefaultNavbar/DefaultNavbarLink";

function DefaultNavbarMobile({ open, close }: any) {
  const { width } = open && open.getBoundingClientRect();

  return (
    <Menu
      // @ts-ignore
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      anchorEl={open}
      open={Boolean(open)}
      onClose={close}
      MenuListProps={{ style: { width: `calc(${width}px - 4rem)` } }}
    >
      <MDBox px={0.5}>
        <DefaultNavbarLink icon="donut_large" name="dashboard" route="/dashboard" light />
        <DefaultNavbarLink icon="person" name="profile" route="/profile" light />
        <DefaultNavbarLink
          icon="account_circle"
          name="sign up"
          route="/authentication/sign-up"
          light
        />
        <DefaultNavbarLink icon="key" name="sign in" route="/authentication/sign-in" light />
      </MDBox>
    </Menu>
  );
}

// Typechecking props for the DefaultNavbarMenu
DefaultNavbarMobile.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object]).isRequired,
};

export default DefaultNavbarMobile;
