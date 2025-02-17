import { Box, Link } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Header() {
  const { user } = useUser();

  return (
    <Box
      sx={{
        display: {
          xs: "none",
          sm: "flex",
        },
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Link href="/" color="inherit" underline="hover" fontWeight={600}>
        TrackHub
      </Link>
      {user ? (
        <Link href="/api/auth/logout" color="inherit" underline="hover">
          Logout
        </Link>
      ) : (
        <Link href="/api/auth/login" color="inherit">
          Login
        </Link>
      )}
    </Box>
  );
}
