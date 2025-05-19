import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Button, 
  TextField, 
  CircularProgress, 
  Avatar, 
  Box,
  IconButton,
  Typography,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  Paper
} from "@mui/material";
import { PhotoCamera, Delete, Edit, Save, Close } from "@mui/icons-material";
import axios from "axios";

const ProfileModal = ({ open, onClose, profileData, setProfileData }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Default avatar URL from the employee model
  const defaultAvatar = "https://png.pngtree.com/png-clipart/20221228/original/pngtree-girl-profile-picture-avatar-for-character-design-at-social-media-platforms-png-image_8817785.png";

  useEffect(() => {
    if (!open) {
      setEditMode(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } else if (profileData) {
      setUpdatedProfile(profileData);
      setAvatarPreview(null);
    }
  }, [open, profileData]);

  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setEditMode(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    onClose();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setSnackbar({
          open: true,
          message: "Image too large! Maximum size is 5MB.",
          severity: "error"
        });
        return;
      }

      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    // Set avatar to null to indicate removal
    setAvatarFile(null);
    setAvatarPreview(null);
    // Set the avatar in updatedProfile to the default image URL
    setUpdatedProfile({
      ...updatedProfile,
      avatar: defaultAvatar
    });
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return null;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      };

      const response = await axios.post(
        "https://employee.ekaant.co/api/employee/upload-avatar",
        formData,
        config
      );

      if (response.data?.url) {
        console.log("Upload successful:", response.data);
        return response.data.url;
      } else {
        throw new Error('No URL in response');
      }
    } catch (error) {
      console.error("Upload error:", error.response || error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || "Upload failed",
        severity: "error"
      });
      return null;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // First upload avatar if exists, to get the URL
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await handleUploadAvatar();
        console.log("Got avatar URL:", avatarUrl);
      }

      const token = localStorage.getItem("token");
      const updateData = {
        username: updatedProfile.username,
        email: updatedProfile.email, 
        phoneNumber: updatedProfile.phoneNumber,
        role: updatedProfile.role,
        employeeId: updatedProfile.employeeId, 
        department: updatedProfile.department,
      };

      // Add avatar to update data in two cases:
      // 1. If we have a new uploaded avatar URL
      if (avatarUrl) {
        updateData.avatar = avatarUrl;
      } 
      // 2. If the profile avatar was explicitly changed to default
      else if (updatedProfile.avatar === defaultAvatar) {
        updateData.avatar = defaultAvatar;
      }

      console.log("Sending update with data:", updateData);

      const response = await axios.put(
        `https://employee.ekaant.co/api/employee/update/${profileData._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success"
        });

        setProfileData(response.data);
        setUpdatedProfile(response.data);
        setEditMode(false);

        // Store updated profile data in localStorage for ProfileCard component
        localStorage.setItem("userProfileData", JSON.stringify(response.data));
        console.log("Saved profile data:", response.data);

        // Update the profile image in localStorage
        if (avatarUrl) {
          localStorage.setItem("userProfileImage", avatarUrl);
        } else if (updatedProfile.avatar === defaultAvatar) {
          localStorage.setItem("userProfileImage", defaultAvatar);
        }

        // Dispatch an event to notify ProfileCard about profile data changes
        window.dispatchEvent(new Event('profileDataChanged'));
      } else {
        setSnackbar({
          open: true,
          message: "Profile update failed!",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile: " + (error.response?.data?.message || error.message),
        severity: "error"
      });
    } finally {
      setLoading(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}>
          <Typography variant="h6" component="div">
            {editMode ? "Edit Profile" : "Profile Information"}
          </Typography>
          <IconButton color="inherit" onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {!profileData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: 4 }}>
              <CircularProgress size={60} thickness={4} />
              <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading profile data...</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Paper 
                  elevation={3} 
                  sx={{
                    position: 'relative',
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    bgcolor: 'background.default'
                  }}
                >
                  <Avatar 
                    src={avatarPreview || updatedProfile.avatar} 
                    sx={{ width: 140, height: 140 }}
                    alt={updatedProfile.username || "User"}
                  />

                  {editMode && (
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      display: 'flex', 
                      justifyContent: 'center',
                      p: 0.5,
                      bgcolor: 'rgba(0,0,0,0.5)'
                    }}>
                      <Tooltip title="Change photo">
                        <IconButton 
                          color="primary" 
                          component="label" 
                          size="small"
                          sx={{ color: 'white', mr: 1 }}
                        >
                          <PhotoCamera />
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Remove photo">
                        <IconButton 
                          onClick={handleRemovePhoto} 
                          color="error" 
                          size="small"
                          sx={{ color: 'white' }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Paper>
              </Box>

              <Typography 
                variant="h5" 
                align="center" 
                gutterBottom 
                sx={{ fontWeight: 'bold', mb: 2 }}
              >
                {updatedProfile.username || "User"}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField 
                  label="Username" 
                  name="username" 
                  value={updatedProfile.username || ""} 
                  fullWidth 
                  disabled={!editMode} 
                  onChange={handleChange} 
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />

                <TextField 
                  label="Email" 
                  name="email" 
                  value={updatedProfile.email || ""} 
                  fullWidth 
                  disabled 
                  variant="filled"
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField 
                  label="Phone Number" 
                  name="phoneNumber" 
                  value={updatedProfile.phoneNumber || ""} 
                  fullWidth 
                  disabled={!editMode} 
                  onChange={handleChange} 
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />

                <TextField 
                  label="Role" 
                  name="role" 
                  value={updatedProfile.role || ""} 
                  fullWidth 
                  disabled={!editMode} 
                  onChange={handleChange} 
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />

                <TextField 
                  label="Employee ID" 
                  name="employeeId" 
                  value={updatedProfile.employeeId || ""} 
                  fullWidth 
                  disabled={!editMode} 
                  onChange={handleChange} 
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />

                <TextField 
                  label="Department" 
                  name="department" 
                  value={updatedProfile.department || ""} 
                  fullWidth 
                  disabled={!editMode} 
                  onChange={handleChange} 
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: 'background.paper' }}>
          {!editMode ? (
            <Button 
              onClick={() => setEditMode(true)} 
              variant="contained" 
              color="primary"
              startIcon={<Edit />}
              sx={{ px: 3 }}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => setEditMode(false)} 
                color="inherit"
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                variant="contained" 
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

ProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profileData: PropTypes.object,
  setProfileData: PropTypes.func.isRequired,
};

export default ProfileModal;