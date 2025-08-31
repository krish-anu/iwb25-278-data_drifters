import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Database, 
  Calendar,
  Eye,
  EyeOff,
  Save,
  Upload,
  Download,
  Trash2,
  Settings,
  Users,
  Building
} from "lucide-react";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:9090/admin/profile", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (res.data.status === "success") {
          setUserName(res.data.name);
          setUserRole(res.data.role);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);
  
  const [adminProfile, setAdminProfile] = useState({
    id: 1,
    firstName: "John",
    lastName: "Anderson",
    email: "john.anderson@mall.com",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    department: "Management",
    joinDate: "2023-01-15",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    address: "123 Mall Street, City, State 12345",
    bio: "Experienced mall administrator with over 10 years of retail management experience."
  });

  const [systemSettings, setSystemSettings] = useState({
    siteName: "Mall Management System",
    siteDescription: "Comprehensive mall management and administration platform",
    language: "en",
    timezone: "America/New_York",
    currency: "USD",
    theme: "light",
    maintenanceMode: false,
    maxUploadSize: "10MB",
    sessionTimeout: 30
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newStoreAlerts: true,
    lowStockAlerts: true,
    revenueReports: true,
    systemUpdates: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isDeleteDataDialogOpen, setIsDeleteDataDialogOpen] = useState(false);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdminProfile({
          ...adminProfile,
          avatar: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileUpdate = () => {
    alert("Profile updated successfully!");
  };

  const handlePasswordChange = async () => {
    try {
      const res = await fetch("http://localhost:9090/admin/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Clear the form fields
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });

        // Show success toast
        toast({
          title: "Password Changed Successfully",
          description: "Your password has been updated. Please use your new password for future logins.",
        });

        // Optional: Redirect to login page after a short delay
        // Uncomment the lines below if you want to force re-login after password change
        /*
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }, 2000);
        */

      } else {
        toast({
          title: "Password Change Failed",
          description: data.message || "Failed to change password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Unable to connect to the server. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };


  const handleSystemSettingsUpdate = () => {
    alert("System settings updated successfully!");
  };

  const handleNotificationUpdate = () => {
    alert("Notification settings updated successfully!");
  };

  const handleDataBackup = () => {
    alert("Data backup initiated successfully!");
    setIsBackupDialogOpen(false);
  };

  const handleDataDelete = () => {
    alert("Selected data has been deleted!");
    setIsDeleteDataDialogOpen(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    // { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Settings }
    // { id: "security", label: "Security", icon: Shield },
    // { id: "data", label: "Data Management", icon: Database }
  ];

  // const languages = [
  //   { value: "en", label: "English" },
  //   { value: "es", label: "Spanish" },
  //   { value: "fr", label: "French" },
  //   { value: "de", label: "German" },
  //   { value: "zh", label: "Chinese" }
  // ];

  // const timezones = [
  //   { value: "America/New_York", label: "Eastern Time (ET)" },
  //   { value: "America/Chicago", label: "Central Time (CT)" },
  //   { value: "America/Denver", label: "Mountain Time (MT)" },
  //   { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  //   { value: "UTC", label: "UTC" }
  // ];

  // const currencies = [
  //   { value: "USD", label: "US Dollar ($)" },
  //   { value: "EUR", label: "Euro (€)" },
  //   { value: "GBP", label: "British Pound (£)" },
  //   { value: "JPY", label: "Japanese Yen (¥)" },
  //   { value: "CAD", label: "Canadian Dollar (C$)" }
  // ];

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, system preferences, and application settings.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Name</CardTitle>
            {/* <Building className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userName}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRole}</div>
            <Badge className="bg-green-500 mt-2">Limited Access</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Current active sessions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">08:30 AM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Navigation Tabs */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Settings Menu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="md:col-span-9 space-y-6">
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={adminProfile.avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button size="sm" onClick={handleChangeAvatarClick}>
                      <Upload className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={adminProfile.firstName}
                      onChange={(e) => setAdminProfile({...adminProfile, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={adminProfile.lastName}
                      onChange={(e) => setAdminProfile({...adminProfile, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={adminProfile.phone}
                      onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={adminProfile.address}
                    onChange={(e) => setAdminProfile({...adminProfile, address: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={adminProfile.bio}
                    onChange={(e) => setAdminProfile({...adminProfile, bio: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleProfileUpdate}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button onClick={handlePasswordChange}>
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you want to receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Communication Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.smsNotifications}
                        onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleNotificationUpdate}>
                  <Bell className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* System Tab */}
          {activeTab === "system" && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>
                
                <Button onClick={handleSystemSettingsUpdate}>
                  <Settings className="mr-2 h-4 w-4" />
                  Save System Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and access controls.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Security Report
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Management Tab */}
          {activeTab === "data" && (
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data, backups, and system maintenance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Data Backup</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Create System Backup</p>
                      <p className="text-sm text-muted-foreground">Download a complete backup of all system data</p>
                    </div>
                    <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Create Backup
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create System Backup</DialogTitle>
                          <DialogDescription>
                            This will create a complete backup of all system data.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleDataBackup}>
                            <Download className="mr-2 h-4 w-4" />
                            Create Backup
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-red-600">Danger Zone</h4>
                  <div className="border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-red-600">Delete All Data</p>
                        <p className="text-sm text-muted-foreground">Permanently delete all system data</p>
                      </div>
                      <Dialog open={isDeleteDataDialogOpen} onOpenChange={setIsDeleteDataDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete All
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete All Data</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete all system data? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDataDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDataDelete}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete All Data
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;