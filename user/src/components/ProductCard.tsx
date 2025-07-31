type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  shopId: string;
};

const ProductCard = ({ id, name, image, price }: Product) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-card border">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">Rs. {price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
