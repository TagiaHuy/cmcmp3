import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Avatar, Tooltip, IconButton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import { useAuth } from "../../context/AuthContext";

// Style tròn 36x36
const circleBtnSx = (t) => {
  const isDark = t.palette.mode === "dark";
  return {
    width: 36,
    height: 36,
    borderRadius: "50%",
    p: 0,
    bgcolor: isDark ? alpha(t.palette.common.white, 0.06) : alpha(t.palette.common.black, 0.06),
    color: isDark ? alpha(t.palette.common.white, 0.92) : t.palette.grey[800],
    boxShadow: isDark
      ? "inset 0 0 0 1px rgba(255,255,255,0.06)"
      : "inset 0 0 0 1px rgba(0,0,0,0.06)",
    "&:hover": {
      bgcolor: isDark ? alpha(t.palette.common.white, 0.10) : alpha(t.palette.common.black, 0.10),
    },
    "& .MuiSvgIcon-root": { fontSize: 20 },
    transition: "background-color .15s ease, box-shadow .15s ease",
  };
};

export default function UserAvatarMenu() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  if (loading) return null;

  const open = Boolean(anchorEl);
  const handleOpen  = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Tài khoản">
        <IconButton onClick={handleOpen} sx={(t) => circleBtnSx(t)}>
          {user?.avatarUrl ? (
            <Avatar
              src={user.avatarUrl}
              alt={user?.displayName || user?.email || "Account"}
              sx={{ width: 28, height: 28 }}
            />
          ) : (
            <AccountCircleRoundedIcon />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { minWidth: 220, borderRadius: 2, mt: 1 } }}
      >
        {isAuthenticated
          ? [
              <MenuItem
                key="profile"
                component={RouterLink}
                to="/profile"
                onClick={handleClose}
              >
                <ListItemIcon><PersonRoundedIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Hồ sơ cá nhân" secondary={user?.email} />
              </MenuItem>,
              <MenuItem
                key="logout"
                onClick={() => {
                  handleClose();
                  logout();
                }}
              >
                <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="login"
                component={RouterLink}
                to="/login"
                onClick={handleClose}
              >
                <ListItemIcon><LoginRoundedIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Đăng nhập" />
              </MenuItem>,
              <MenuItem
                key="register"
                component={RouterLink}
                to="/register"
                onClick={handleClose}
              >
                <ListItemIcon><HowToRegRoundedIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Đăng ký" />
              </MenuItem>,
            ]}
      </Menu>
    </>
  );
}
