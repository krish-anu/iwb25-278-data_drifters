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
        // Use the admin endpoint to get products directly
        const res = await axios.get(`http://localhost:9090/admin/${shopId}/products`);
        const responseData = res.data;

        // Handle different response structures
        if (Array.isArray(responseData)) {
          setProducts(responseData);
        } else if (responseData.products && Array.isArray(responseData.products)) {
          setProducts(responseData.products);
        } else {
          console.warn("Unexpected response structure:", responseData);
          setProducts([]);
        }

        // For shop name, we might need to fetch it separately or use a default
        setShopName("Mall Store"); // Default shop name
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

const handleAddProduct = async () => {
  try {
    // Step 1: Get shopId (like "M1-S1")
    const shopId = "M1-S1"; // Use the hardcoded shopId from the component

    // Step 2: Fetch existing products for this shop
    const res = await fetch(`http://localhost:9090/admin/${shopId}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const responseData = await res.json();

    // Handle different response structures
    let existingProducts: { id: string }[] = [];
    if (Array.isArray(responseData)) {
      existingProducts = responseData;
    } else if (responseData.products && Array.isArray(responseData.products)) {
      existingProducts = responseData.products;
    } else {
      console.warn("Unexpected response structure:", responseData);
      existingProducts = [];
    }

    // Step 3: Find the max product number (Pn)
    let maxNum = 0;
    if (Array.isArray(existingProducts) && existingProducts.length > 0) {
      existingProducts.forEach(p => {
        if (p && p.id) {
          const match = p.id.match(/P(\d+)/); // extract number after P
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      });
    }

    // Step 4: Create new ID
    const newProductId = `S1-P${maxNum + 1}`;

    // Step 5: Build product payload matching backend Product model
    const newProduct = {
      id: newProductId,
      productName: formData.productName,
      description: formData.description,
      price: parseFloat(formData.price || "0"),
      category: formData.category,
      store: shopId,
      stockQuantity: parseInt(formData.stockQuantity || "0", 10),
      status: formData.status || "Active",
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop"
    };

    // Step 6: Send to backend
    const response = await fetch(
      `http://localhost:9090/shops/${shopId}/products`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add product");
    }
    
    const result = await response.json();
    console.log("Product added successfully:", result);

    // Step 7: Refresh the products list
    const updatedRes = await fetch(`http://localhost:9090/admin/${shopId}/products`);
    if (updatedRes.ok) {
      const updatedData = await updatedRes.json();

      // Handle different response structures
      if (Array.isArray(updatedData)) {
        setProducts(updatedData);
      } else if (updatedData.products && Array.isArray(updatedData.products)) {
        setProducts(updatedData.products);
      } else {
        console.warn("Unexpected response structure for refresh:", updatedData);
      }
    }
    
    setFormData({});
    setIsAddDialogOpen(false);
    alert("Product added successfully!");
  } catch (error) {
    console.error("Error adding product:", error);
    alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong while adding the product.'}`);
  }
};

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      const shopId = "M1-S1"; // Use the same shopId as in add

      // Build updated product payload matching backend Product model
      const updatedProduct = {
        id: editingProduct.id,
        productName: formData.productName || editingProduct.productName,
        description: formData.description || editingProduct.description,
        price: parseFloat(formData.price || editingProduct.price.toString()),
        category: formData.category || editingProduct.category,
        store: shopId,
        stockQuantity: parseInt(formData.stockQuantity || editingProduct.stockQuantity.toString(), 10),
        status: formData.status || editingProduct.status,
        imageUrl: formData.imageUrl || editingProduct.imageUrl
      };

      // Send to backend
      const response = await fetch(
        `http://localhost:9090/shops/${shopId}/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const result = await response.json();
      console.log("Product updated successfully:", result);

      // Refresh the products list
      const updatedRes = await fetch(`http://localhost:9090/admin/${shopId}/products`);
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();

        // Handle different response structures
        if (Array.isArray(updatedData)) {
          setProducts(updatedData);
        } else if (updatedData.products && Array.isArray(updatedData.products)) {
          setProducts(updatedData.products);
        } else {
          console.warn("Unexpected response structure for refresh:", updatedData);
        }
      }

      setFormData({});
      setEditingProduct(null);
      setIsEditDialogOpen(false);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong while updating the product.'}`);
    }
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

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const shopId = "M1-S1"; // Use the same shopId as in add/edit

      // Call the backend delete API
      const response = await fetch(
        `http://localhost:9090/shops/${shopId}/products/${productToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      const result = await response.json();
      console.log("Product deleted successfully:", result);

      // Refresh the products list
      const updatedRes = await fetch(`http://localhost:9090/admin/${shopId}/products`);
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();

        // Handle different response structures
        if (Array.isArray(updatedData)) {
          setProducts(updatedData);
        } else if (updatedData.products && Array.isArray(updatedData.products)) {
          setProducts(updatedData.products);
        } else {
          console.warn("Unexpected response structure for refresh:", updatedData);
        }
      }

      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong while deleting the product.'}`);
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
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
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
                    <p><span className="text-muted-foreground">Store:</span> {shopName}</p>
                    <p><span className="text-muted-foreground">Price:</span> ${selectedProduct.price}</p>
                    <p><span className="text-muted-foreground">Status:</span> {getStatusBadge(selectedProduct.status)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Inventory Details</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Quantity:</span> {selectedProduct.stockQuantity} units</p>
                    <p><span className="text-muted-foreground">Total Value:</span> ${(parseFloat(selectedProduct.price) * parseInt(selectedProduct.stockQuantity)).toLocaleString()}</p>
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
                    <CardTitle className="text-sm">Quantity Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedProduct.stockQuantity}</div>
                    <p className="text-xs text-muted-foreground">
                      {parseInt(selectedProduct.stockQuantity) <= 10 ? "Low Quantity" : "Good Quantity"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(parseFloat(selectedProduct.price) * parseInt(selectedProduct.stockQuantity)).toLocaleString()}</div>
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