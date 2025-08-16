import * as React from "react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import { grey, green } from "@mui/material/colors";

export default function DropdownButton({
  isLoggedIn = false,
  onLoginClick,
  onLogoutClick,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);
  const Icon = isLoggedIn ? InsertEmoticonIcon : MoodBadIcon;

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
        <Avatar
          sx={{ bgcolor: isLoggedIn ? green[500] : grey[500] }}
          variant="rounded"
        >
          <Icon />
        </Avatar>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={close} onClick={close}>
        {!isLoggedIn ? (
          <MenuItem onClick={onLoginClick}>
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            Войти
          </MenuItem>
        ) : (
          <MenuItem onClick={onLogoutClick}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Выйти
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
