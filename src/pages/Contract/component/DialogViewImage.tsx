import { Dialog, DialogActions, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DialogViewImage = ({ imagePreviewOpen, setImagePreviewOpen, imagePreviewUrl }: any) => {
    return (
        <Dialog
            open={imagePreviewOpen}
            onClose={() => setImagePreviewOpen(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: "rgba(174, 174, 174, 0.11)",
                    boxShadow: "none",
                },
            }}
        >
            <DialogActions sx={{ p: 1, position: "absolute", right: 0, zIndex: 1 }}>
                <IconButton
                    onClick={() => setImagePreviewOpen(false)}
                    sx={{
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogActions>
            <DialogContent
                sx={{
                    p: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "80vh",
                }}
            >
                <img
                    src={imagePreviewUrl || ''}
                    alt="Preview"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "90vh",
                        objectFit: "contain",
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default DialogViewImage;