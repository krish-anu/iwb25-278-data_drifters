export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  shopId: string;
};

type Props = Product & {
  onClick?: () => void;
};

const ProductCard = ({ id, name, image, price, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="rounded-xl overflow-hidden shadow-card border cursor-pointer hover:shadow-lg transition"
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">Rs. {price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
