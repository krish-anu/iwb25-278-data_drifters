import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Package,
  DollarSign,
  Eye,
  ShoppingCart
} from "lucide-react";

interface Product {
  id: string;
  productName: string;
  description: string;
  price: string;
  category: string;
  store: string;
  stockQuantity: string;
  status: string;
  imageUrl: string;
}

// const initialProducts: Product[] = [
//   {
//     id: 1,
//     name: "Premium Cotton Shirt",
//     description: "High-quality cotton shirt available in multiple colors and sizes. Made from 100% organic cotton for maximum comfort.",
//     price: 49.99,
//     category: "Fashion",
//     store: "Fashion Hub",
//     stockQuantity: 50,
//     status: "active",
//     image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop"
//   },
//   {
//     id: 2,
//     name: "Wireless Bluetooth Earbuds",
//     description: "Latest technology wireless earbuds with noise cancellation and 24-hour battery life. Crystal clear sound quality.",
//     price: 99.99,
//     category: "Electronics",
//     store: "Tech Gadgets",
//     stockQuantity: 25,
//     status: "active",
//     image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop"
//   },
//   {
//     id: 3,
//     name: "Bestseller Novel Collection",
//     description: "Collection of top 10 bestselling novels of the year including fiction, mystery, and romance genres.",
//     price: 29.99,
//     category: "Books",
//     store: "Book Nook",
//     stockQuantity: 0,
//     status: "out_of_stockQuantity",
//     image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop"
//   },
//   {
//     id: 4,
//     name: "Specialty Coffee Blend",
//     description: "Artisan roasted coffee beans from premium farms. Rich flavor profile with notes of chocolate and caramel.",
//     price: 19.99,
//     category: "Food & Beverage",
//     store: "Coffee Corner",
//     stockQuantity: 100,
//     status: "active",
//     image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop"
//   },
//   {
//     id: 5,
//     name: "Professional Running Shoes",
//     description: "Lightweight running shoes for professional athletes. Advanced cushioning technology and breathable materials.",
//     price: 149.99,
//     category: "Sports",
//     store: "Sports Zone",
//     stockQuantity: 15,
//     status: "active",
//     image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
//   },
//   {
//     id: 6,
//     name: "Smart Watch Pro",
//     description: "Advanced fitness tracking, heart rate monitoring, and smartphone integration in a sleek design.",
//     price: 299.99,
//     category: "Electronics",
//     store: "Tech Gadgets",
//     stockQuantity: 8,
//     status: "active",
//     image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
//   }
// ];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStore, setSelectedStore] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [shopName, setShopName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Fashion", "Electronics", "Books", "Food & Beverage", "Sports"];
  const stores = [shopName];
  const statuses = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Out_of_stockQuantity", label: "Out of Stock" }
  ];



  // const filteredProducts = products.filter(product => {
  //   const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        product.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        product.category.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
  //   const matchesStore = selectedStore === "all" || product.store === selectedStore;
  //   return matchesSearch && matchesCategory && matchesStore;
  // });

  const shopId = "M1-S1"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:9090/${shopId}/products`);
        setProducts(res.data.products);
        setShopName(res.data.shopName);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId]);

  if (loading) return <p>Loading products…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

const handleAddProduct = () => {
  // Filter products belonging to the same shop
  const shopProducts = products.filter(
    (p) => p.store === formData.store
  );

  // Get the last product number (P number)
  let newProductNumber = 1; // default for first product in the shop

  if (shopProducts.length > 0) {
    const lastIds = shopProducts.map((p) => {
      // Extract number after "P"
      const match = p.id.match(/P(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });

    newProductNumber = Math.max(...lastIds) + 1;
  }

  // Create new product ID
  const newProductId = `S1-P${newProductNumber}`;

  const newProduct: Product = {
    id: newProductId,
    productName: formData.productName || "",
    description: formData.description || "",
    price: formData.price || "0",
    category: formData.category || "",
    store: formData.store || "",
    stockQuantity: formData.stockQuantity || "0",
    status: formData.status || "Active",
    imageUrl:
      formData.imageUrl ||
      "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop",
  };

  setProducts([...products, newProduct]);
  setFormData({});
  setIsAddDialogOpen(false);
};

  const handleEditProduct = () => {
    if (!editingProduct) return;
    
    const updatedProduct: Product = {
      ...editingProduct,
      productName: formData.productName || editingProduct.productName,
      description: formData.description || editingProduct.description,
      price: formData.price !== undefined ? formData.price : editingProduct.price,
      category: formData.category || editingProduct.category,
      store: formData.store || editingProduct.store,
      stockQuantity: formData.stockQuantity !== undefined ? formData.stockQuantity : editingProduct.stockQuantity,
      status: formData.status || editingProduct.status,
      image: formData.imageUrl || editingProduct.imageUrl,
    };
    
    setProducts(products.map(product => product.id === editingProduct.id ? updatedProduct : product));
    setFormData({});
    setEditingProduct(null);
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "0ut of stockQuantity":
        return <Badge variant="destructive">Out of stockQuantity</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const totalValue = products.reduce((total, p) => total + (parseFloat(p.price) * parseInt(p.stockQuantity)), 0);
  const activeProducts = products.filter(p => p.status === "Active").length;
  const outOfstockQuantityProducts = products.filter(p => p.status === "Out_of_stockQuantity").length;
  // const lowstockQuantityProducts = products.filter(p => p.stockQuantity <= 10 && p.stockQuantity > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage all products across your mall stores.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your mall inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={formData.productName || ""}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
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
                <Label htmlFor="image">Product Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({ ...formData, imageUrl: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="store">Store</Label>
                  <Select value={formData.store || ""} onValueChange={(value) => setFormData({ ...formData, store: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store} value={store}>{store}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stockQuantity">Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity || ""}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status || "Active"} onValueChange={(value) => setFormData({ ...formData, status: value as Product["status"] })}>
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

              <DialogFooter>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information and details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={formData.productName || ""}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
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
              <Label htmlFor="edit-image">Product Image</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setFormData({ ...formData, imageUrl: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="edit-store">Store</Label>
                <Select value={formData.store || ""} onValueChange={(value) => setFormData({ ...formData, store: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store} value={store}>{store}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-stockQuantity">stockQuantity Quantity</Label>
                <Input
                  id="edit-stockQuantity"
                  type="number"
                  value={formData.stockQuantity || ""}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status || ""} onValueChange={(value) => setFormData({ ...formData, status: value as Product["status"] })}>
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

            <DialogFooter>
              <Button onClick={handleEditProduct}>Update Product</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.productName}"? This action cannot be undone.
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
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of stockQuantity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfstockQuantityProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Product Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, stores, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-48">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store} value={store}>{store}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <img 
                src={product.imageUrl} 
                alt={product.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop";
                }}
              />
              <div className="absolute top-2 right-2">
                {getStatusBadge(product.status)}
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.productName}</CardTitle>
                  <CardDescription>{product.category} • {shopName}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {product.description.length > 80 
                  ? `${product.description.substring(0, 80)}...` 
                  : product.description}
              </p>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-bold text-lg text-green-600">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stock</p>
                    <p className={`font-medium ${parseInt(product.stockQuantity) <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stockQuantity} units
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-medium text-lg">${(parseFloat(product.price) * parseInt(product.stockQuantity)).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openDeleteDialog(product)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.productName}</DialogTitle>
            <DialogDescription>Complete product information and details</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Product Information</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Category:</span> {selectedProduct.category}</p>
                    <p><span className="text-muted-foreground">Store:</span> {selectedProduct.store}</p>
                    <p><span className="text-muted-foreground">Price:</span> ${selectedProduct.price}</p>
                    <p><span className="text-muted-foreground">Status:</span> {getStatusBadge(selectedProduct.status)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Inventory Details</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="text-muted-foreground">stockQuantity:</span> {selectedProduct.stockQuantity} units</p>
                    <p><span className="text-muted-foreground">Total Value:</span> ${(selectedProduct.price * selectedProduct.stockQuantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="mt-2 text-sm text-muted-foreground">{selectedProduct.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">stockQuantity Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedProduct.stockQuantity}</div>
                    <p className="text-xs text-muted-foreground">
                      {selectedProduct.stockQuantity <= 10 ? "Low stockQuantity" : "Good stockQuantity"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(selectedProduct.price * selectedProduct.stockQuantity).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total inventory value</p>
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

export default Products;