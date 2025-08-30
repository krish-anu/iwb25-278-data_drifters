import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Plus,
  Edit,
  Eye,
  Users,
  Trash2,
  Search
} from "lucide-react";

interface StoreData {
  id: number;
  name: string;
  category: string;
  floor: string;
  location: string;
  description: string;
  phone: string;
  email: string;
  hours: string;
  status: "open" | "closed" | "coming_soon";
  manager: string;
  employees: number;
  monthlyRevenue: number;
  image: string;
}

const initialStores: StoreData[] = [
  {
    id: 1,
    name: "Fashion Hub",
    category: "Fashion",
    floor: "Ground Floor",
    location: "Section A",
    description: "Premium clothing store featuring latest fashion trends and designer collections.",
    phone: "+1 (555) 123-4567",
    email: "contact@fashionhub.com",
    hours: "10:00 AM - 10:00 PM",
    status: "open",
    manager: "Sarah Johnson",
    employees: 8,
    monthlyRevenue: 62500,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Tech Gadgets",
    category: "Electronics",
    floor: "First Floor",
    location: "Section B",
    description: "Latest technology, gadgets, and electronic accessories for modern lifestyle.",
    phone: "+1 (555) 234-5678",
    email: "info@techgadgets.com",
    hours: "9:00 AM - 9:00 PM",
    status: "open",
    manager: "Mike Chen",
    employees: 6,
    monthlyRevenue: 98000,
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Book Nook",
    category: "Books",
    floor: "Second Floor",
    location: "Section C",
    description: "Cozy bookstore with wide selection of books, magazines, and reading accessories.",
    phone: "+1 (555) 345-6789",
    email: "hello@booknook.com",
    hours: "8:00 AM - 8:00 PM",
    status: "open",
    manager: "Emily Davis",
    employees: 4,
    monthlyRevenue: 22500,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Coffee Corner",
    category: "Food & Beverage",
    floor: "Ground Floor",
    location: "Section D",
    description: "Artisan coffee shop serving premium coffee, pastries, and light meals.",
    phone: "+1 (555) 456-7890",
    email: "orders@coffeecorner.com",
    hours: "6:00 AM - 11:00 PM",
    status: "open",
    manager: "David Wilson",
    employees: 12,
    monthlyRevenue: 84000,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Sports Zone",
    category: "Sports",
    floor: "First Floor",
    location: "Section E",
    description: "Complete sports equipment and athletic wear for all your fitness needs.",
    phone: "+1 (555) 567-8901",
    email: "support@sportszone.com",
    hours: "9:00 AM - 9:00 PM",
    status: "coming_soon",
    manager: "Lisa Martinez",
    employees: 5,
    monthlyRevenue: 67500,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
  }
];

const SuperAdminStores = () => {
  const [stores, setStores] = useState<StoreData[]>(initialStores);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreData | null>(null);
  const [storeToDelete, setStoreToDelete] = useState<StoreData | null>(null);
  const [formData, setFormData] = useState<Partial<StoreData>>({});

  const categories = ["Fashion", "Electronics", "Books", "Food & Beverage", "Sports", "Services", "Entertainment"];
  const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];
  const locations = ["Section A", "Section B", "Section C", "Section D", "Section E", "Section F"];
  const statuses = [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "coming_soon", label: "Coming Soon" }
  ];

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.floor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: StoreData["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-500">Open</Badge>;
      case "closed":
        return <Badge variant="destructive">Closed</Badge>;
      case "coming_soon":
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAddStore = () => {
    const newStore: StoreData = {
      id: Math.max(...stores.map(s => s.id)) + 1,
      name: formData.name || "",
      category: formData.category || "",
      floor: formData.floor || "",
      location: formData.location || "",
      description: formData.description || "",
      phone: formData.phone || "",
      email: formData.email || "",
      hours: formData.hours || "",
      status: formData.status || "open",
      manager: formData.manager || "",
      employees: formData.employees || 0,
      monthlyRevenue: formData.monthlyRevenue || 0,
      image: formData.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
    };
    
    setStores([...stores, newStore]);
    setFormData({});
    setIsAddDialogOpen(false);
  };

  const handleEditStore = () => {
    if (!editingStore) return;
    
    const updatedStore: StoreData = {
      ...editingStore,
      name: formData.name || editingStore.name,
      category: formData.category || editingStore.category,
      floor: formData.floor || editingStore.floor,
      location: formData.location || editingStore.location,
      description: formData.description || editingStore.description,
      phone: formData.phone || editingStore.phone,
      email: formData.email || editingStore.email,
      hours: formData.hours || editingStore.hours,
      status: formData.status || editingStore.status,
      manager: formData.manager || editingStore.manager,
      employees: formData.employees !== undefined ? formData.employees : editingStore.employees,
      monthlyRevenue: formData.monthlyRevenue !== undefined ? formData.monthlyRevenue : editingStore.monthlyRevenue,
      image: formData.image || editingStore.image,
    };
    
    setStores(stores.map(store => store.id === editingStore.id ? updatedStore : store));
    setFormData({});
    setEditingStore(null);
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (store: StoreData) => {
    setEditingStore(store);
    setFormData(store);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (store: StoreData) => {
    setStoreToDelete(store);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (storeToDelete) {
      setStores(stores.filter(s => s.id !== storeToDelete.id));
      setStoreToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setStoreToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const totalRevenue = stores.reduce((sum, store) => sum + store.monthlyRevenue, 0);
  const totalEmployees = stores.reduce((sum, store) => sum + store.employees, 0);
  const openStores = stores.filter(store => store.status === "open").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
          <p className="text-muted-foreground">
            Manage all stores and their details within your mall.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({})}>
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>
                Add a new store to your mall directory.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category || ""} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Select value={formData.floor || ""} onValueChange={(value) => setFormData({ ...formData, floor: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      {floors.map((floor) => (
                        <SelectItem key={floor} value={floor}>{floor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select value={formData.location || ""} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Store Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({ ...formData, image: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {formData.image && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Input
                    id="hours"
                    value={formData.hours || ""}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="e.g., 9:00 AM - 9:00 PM"
                  />
                </div>
                <div>
                  <Label htmlFor="manager">Manager</Label>
                  <Input
                    id="manager"
                    value={formData.manager || ""}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status || "open"} onValueChange={(value) => setFormData({ ...formData, status: value as StoreData["status"] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={formData.employees || ""}
                    onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyRevenue">Monthly Revenue ($)</Label>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    value={formData.monthlyRevenue || ""}
                    onChange={(e) => setFormData({ ...formData, monthlyRevenue: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleAddStore}>Add Store</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>
              Update store details and information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Store Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category || ""} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-floor">Floor</Label>
                <Select value={formData.floor || ""} onValueChange={(value) => setFormData({ ...formData, floor: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {floors.map((floor) => (
                      <SelectItem key={floor} value={floor}>{floor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Select value={formData.location || ""} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-image">Store Image</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setFormData({ ...formData, image: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-hours">Operating Hours</Label>
                <Input
                  id="edit-hours"
                  value={formData.hours || ""}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  placeholder="e.g., 9:00 AM - 9:00 PM"
                />
              </div>
              <div>
                <Label htmlFor="edit-manager">Manager</Label>
                <Input
                  id="edit-manager"
                  value={formData.manager || ""}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status || ""} onValueChange={(value) => setFormData({ ...formData, status: value as StoreData["status"] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-employees">Number of Employees</Label>
                <Input
                  id="edit-employees"
                  type="number"
                  value={formData.employees || ""}
                  onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-monthlyRevenue">Monthly Revenue ($)</Label>
                <Input
                  id="edit-monthlyRevenue"
                  type="number"
                  value={formData.monthlyRevenue || ""}
                  onChange={(e) => setFormData({ ...formData, monthlyRevenue: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleEditStore}>Update Store</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{storeToDelete?.name}"? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Stores</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openStores}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stores, categories, managers, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stores Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <img 
                src={store.image} 
                alt={store.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop";
                }}
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                  <CardDescription>{store.category}</CardDescription>
                </div>
                {getStatusBadge(store.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {store.description.length > 80 
                  ? `${store.description.substring(0, 80)}...` 
                  : store.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {store.floor}, {store.location}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {store.hours}
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  {store.phone}
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  {store.email}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Manager</p>
                    <p className="font-medium">{store.manager}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employees</p>
                    <p className="font-medium">{store.employees}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Monthly Revenue</p>
                    <p className="font-medium text-lg">${store.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditDialog(store)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedStore(store)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openDeleteDialog(store)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Store Details Dialog */}
      <Dialog open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedStore?.name}</DialogTitle>
            <DialogDescription>Complete store information and analytics</DialogDescription>
          </DialogHeader>
          {selectedStore && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Store Information</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Category:</span> {selectedStore.category}</p>
                    <p><span className="text-muted-foreground">Location:</span> {selectedStore.floor}, {selectedStore.location}</p>
                    <p><span className="text-muted-foreground">Manager:</span> {selectedStore.manager}</p>
                    <p><span className="text-muted-foreground">Status:</span> {getStatusBadge(selectedStore.status)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Contact Details</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Phone:</span> {selectedStore.phone}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedStore.email}</p>
                    <p><span className="text-muted-foreground">Hours:</span> {selectedStore.hours}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="mt-2 text-sm text-muted-foreground">{selectedStore.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Staff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedStore.employees}</div>
                    <p className="text-xs text-muted-foreground">Total employees</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${selectedStore.monthlyRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminStores;