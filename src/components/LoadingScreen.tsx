import { Box, CircularProgress, Modal } from "@mui/material";

const modalStyle = {
  position: "absolute",
  display: "flex",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  bgcolor: "transparent",
  pt: 2,
  px: 4,
  pb: 3,
};
const LoadingScreen: React.FC<{ open: boolean }> = ({ open }) => {
  return (
    <Modal open={open} disableEscapeKeyDown>
      <Box sx={{ ...modalStyle }}>
        <CircularProgress />
      </Box>
    </Modal>
  );
};

export default LoadingScreen;
